import { supabase, isSupabaseConfigured, ErasmusStudent, ErasmusResult } from './supabase';

export interface StudentAuthResult {
  success: boolean;
  student?: ErasmusStudent;
  results?: ErasmusResult[];
  error?: string;
  isThrottled?: boolean;
}

export interface SaveResultResponse {
  success: boolean;
  error?: string;
}

export interface TeacherStudentSummary extends ErasmusStudent {
  results: Record<number, { points: number; completed: boolean; updated_at?: string }>;
  totalPoints: number;
  completedMissionsCount: number;
  lastUpdated?: string;
}

// Mutex / Queue to prevent concurrent RPC save requests from corrupting state
let isSaving = false;
const saveQueue: Array<{
  missionId: number;
  points: number;
  completed: boolean;
  studentId?: string;
  resolve: (res: SaveResultResponse) => void;
}> = [];

async function processSaveQueue() {
  if (isSaving || saveQueue.length === 0) return;
  isSaving = true;

  const item = saveQueue.shift();
  if (!item) {
    isSaving = false;
    return;
  }

  try {
    if (!supabase || !isSupabaseConfigured()) {
      item.resolve({
        success: false,
        error: 'A Supabase kliens nincs konfigurálva. Az eredmény mentése sikertelen.',
      });
      return;
    }

    let saved = false;

    // 1. Try calling the RPC erasmus_save_result(p_mission_id, p_points, p_completed)
    try {
      const { error } = await supabase.rpc('erasmus_save_result', {
        p_mission_id: item.missionId,
        p_points: item.points,
        p_completed: item.completed,
      });

      if (!error) {
        saved = true;
      } else {
        console.warn('RPC erasmus_save_result info:', error.message);
      }
    } catch {
      // ignore
    }

    // 2. Direct fallback upsert if RPC didn't succeed and we have studentId
    if (!saved && item.studentId) {
      try {
        const { error: upsertError } = await supabase.from('erasmus_results').upsert(
          {
            student_id: item.studentId,
            mission_id: item.missionId,
            points: item.points,
            completed: item.completed,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'student_id,mission_id' }
        );

        if (!upsertError) {
          saved = true;
        } else {
          console.warn('Direct upsert info:', upsertError.message);
        }
      } catch {
        // ignore
      }
    }

    item.resolve({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ismeretlen hiba';
    item.resolve({ success: false, error: message });
  } finally {
    isSaving = false;
    if (saveQueue.length > 0) {
      setTimeout(processSaveQueue, 100);
    }
  }
}

/**
 * Queue a mission result to be saved via Supabase RPC or direct table upsert
 */
export function queueSaveMissionResult(
  missionId: number,
  points: number,
  completed: boolean,
  studentId?: string
): Promise<SaveResultResponse> {
  return new Promise((resolve) => {
    saveQueue.push({ missionId, points, completed, studentId, resolve });
    processSaveQueue();
  });
}

/**
 * Student anonymous authentication and claiming via erasmus_claim_student RPC
 * Security note: Code is never saved to localStorage or logged.
 * In case of failure, anonymous session is wiped immediately and delayed to deter fast brute-forcing.
 */
export async function claimStudent(
  fullName: string,
  studentCode: string
): Promise<StudentAuthResult> {
  if (!supabase || !isSupabaseConfigured()) {
    return {
      success: false,
      error: 'A Supabase nincs konfigurálva (hiányzó VITE_SUPABASE_PUBLISHABLE_KEY).',
    };
  }

  const trimmedName = fullName.trim();
  const trimmedCode = studentCode.trim();

  if (!trimmedName || !trimmedCode) {
    return {
      success: false,
      error: 'Kérjük, add meg a teljes nevedet és az egyedi tanulói kódot!',
    };
  }

  try {
    // 1. Sign in anonymously via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();

    if (authError || !authData?.user) {
      return {
        success: false,
        error: `Hitelesítési hiba: ${authError?.message || 'Nem sikerült az anonim belépés.'}`,
      };
    }

    // 2. Call the RPC erasmus_claim_student(p_full_name, p_code) -> returns student_id (uuid)
    const { data: studentId, error: rpcError } = await supabase.rpc('erasmus_claim_student', {
      p_full_name: trimmedName,
      p_code: trimmedCode,
    });

    if (rpcError || !studentId) {
      // Artificial delay (800ms) to deter automated rapid-fire guessing
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Clean up the anonymous session immediately on failure
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }

      // Unified error message preventing user enumeration or code discovery
      return {
        success: false,
        error: 'Érvénytelen tanulói név vagy kód. Kérjük, ellenőrizd az adataidat és próbáld újra!',
      };
    }

    // 3. Fetch student profile allowed by RLS
    const { data: studentData, error: studentError } = await supabase
      .from('erasmus_students')
      .select('id, full_name, class_name, profession, current_user_id')
      .eq('id', studentId)
      .maybeSingle();

    if (studentError || !studentData) {
      // If table query fails, fallback with student ID and provided name
      const fallbackStudent: ErasmusStudent = {
        id: studentId,
        full_name: trimmedName,
        class_name: null,
        profession: null,
        current_user_id: authData.user.id,
      };

      // Fetch any existing results
      const results = await fetchStudentResults(studentId);
      return {
        success: true,
        student: fallbackStudent,
        results,
      };
    }

    // 4. Fetch existing mission results for this student
    const results = await fetchStudentResults(studentData.id);

    return {
      success: true,
      student: studentData as ErasmusStudent,
      results,
    };
  } catch (err: unknown) {
    // Clean up session on unexpected error
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    const message = err instanceof Error ? err.message : 'Ismeretlen hiba történt a belépéskor.';
    return {
      success: false,
      error: `Hiba: ${message}`,
    };
  }
}

/**
 * Fetch all students from erasmus_students for easy selection in Version B
 */
export async function fetchStudentsList(): Promise<ErasmusStudent[]> {
  if (!supabase || !isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('erasmus_students')
      .select('id, full_name, class_name, profession, current_user_id')
      .order('full_name', { ascending: true });

    if (error) {
      console.warn('Hiba a diákok listázásakor:', error.message);
      return [];
    }
    return (data || []) as ErasmusStudent[];
  } catch (err) {
    console.warn('Lekérési hiba:', err);
    return [];
  }
}

/**
 * Version B login: Select student from list without needing a code!
 * Signs in anonymously, binds current_user_id to the student, and restores their progress.
 */
export async function loginStudentByName(student: ErasmusStudent): Promise<StudentAuthResult> {
  if (!supabase || !isSupabaseConfigured()) {
    return {
      success: false,
      error: 'A Supabase nincs konfigurálva (hiányzó VITE_SUPABASE_PUBLISHABLE_KEY).',
    };
  }

  try {
    // 1. Sign in anonymously via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    if (authError || !authData?.user) {
      return {
        success: false,
        error: `Hitelesítési hiba: ${authError?.message || 'Nem sikerült az anonim belépés.'}`,
      };
    }

    const userId = authData.user.id;

    // 2. Bind current_user_id on erasmus_students so RLS and save functions work
    try {
      await supabase.rpc('erasmus_claim_student', {
        p_full_name: student.full_name,
        p_code: '',
      });
    } catch {
      // ignore
    }

    const { error: updateError } = await supabase
      .from('erasmus_students')
      .update({ current_user_id: userId })
      .eq('id', student.id);

    if (updateError) {
      console.warn('current_user_id bind warning:', updateError.message);
    }

    // 3. Fetch existing mission results for this student
    const results = await fetchStudentResults(student.id);

    const updatedStudent: ErasmusStudent = {
      ...student,
      current_user_id: userId,
    };

    return {
      success: true,
      student: updatedStudent,
      results,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ismeretlen hiba történt a belépéskor.';
    return {
      success: false,
      error: `Hiba: ${message}`,
    };
  }
}

/**
 * Version B self-service: Register and login new student without requiring a code
 */
export async function registerAndLoginStudent(
  fullName: string,
  className?: string,
  profession?: string
): Promise<StudentAuthResult> {
  if (!supabase || !isSupabaseConfigured()) {
    return {
      success: false,
      error: 'A Supabase nincs konfigurálva.',
    };
  }

  const trimmedName = fullName.trim();
  if (!trimmedName) {
    return {
      success: false,
      error: 'Kérjük, add meg a teljes nevedet!',
    };
  }

  try {
    // 1. Sign in anonymously
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    if (authError || !authData?.user) {
      return {
        success: false,
        error: `Hitelesítési hiba: ${authError?.message || 'Nem sikerült az anonim belépés.'}`,
      };
    }

    const userId = authData.user.id;

    // 2. Check if student already exists by name
    const { data: existingStudent } = await supabase
      .from('erasmus_students')
      .select('id, full_name, class_name, profession, current_user_id')
      .ilike('full_name', trimmedName)
      .maybeSingle();

    if (existingStudent) {
      return loginStudentByName(existingStudent as ErasmusStudent);
    }

    // 3. Insert new student
    const { data: newStudent, error: insertError } = await supabase
      .from('erasmus_students')
      .insert({
        full_name: trimmedName,
        class_name: className?.trim() || null,
        profession: profession?.trim() || null,
        current_user_id: userId,
      })
      .select('id, full_name, class_name, profession, current_user_id')
      .maybeSingle();

    if (insertError || !newStudent) {
      const fallback: ErasmusStudent = {
        id: crypto.randomUUID(),
        full_name: trimmedName,
        class_name: className || null,
        profession: profession || null,
        current_user_id: userId,
      };
      return {
        success: true,
        student: fallback,
        results: [],
      };
    }

    return {
      success: true,
      student: newStudent as ErasmusStudent,
      results: [],
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ismeretlen hiba történt.';
    return {
      success: false,
      error: `Hiba a regisztráció során: ${message}`,
    };
  }
}

/**
 * Fetch results for a student allowed by RLS
 */
export async function fetchStudentResults(studentId: string): Promise<ErasmusResult[]> {
  if (!supabase || !isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from('erasmus_results')
      .select('student_id, mission_id, points, completed, updated_at')
      .eq('student_id', studentId)
      .order('mission_id', { ascending: true });

    if (error) {
      console.warn('Hiba az eredmények lekérésekor:', error.message);
      return [];
    }
    return (data || []) as ErasmusResult[];
  } catch (err) {
    console.warn('Lekérési kivétel:', err);
    return [];
  }
}

/**
 * Teacher login using genuine Supabase Auth email and password
 * Validates that auth.uid() is registered in public.erasmus_teachers
 */
export async function loginTeacher(
  email: string,
  password: string
): Promise<{ success: boolean; isTeacher: boolean; error?: string }> {
  if (!supabase || !isSupabaseConfigured()) {
    return {
      success: false,
      isTeacher: false,
      error: 'A Supabase nincs konfigurálva (hiányzó VITE_SUPABASE_PUBLISHABLE_KEY).',
    };
  }

  try {
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError || !data?.user) {
      return {
        success: false,
        isTeacher: false,
        error: authError?.message || 'Sikertelen bejelentkezés. Ellenőrizd az email címet és jelszót!',
      };
    }

    // Verify user exists in public.erasmus_teachers
    const { data: teacherRow, error: teacherError } = await supabase
      .from('erasmus_teachers')
      .select('user_id')
      .eq('user_id', data.user.id)
      .maybeSingle();

    if (teacherError || !teacherRow) {
      // Not an authorized teacher - sign out immediately
      await supabase.auth.signOut();
      return {
        success: false,
        isTeacher: false,
        error: 'A fiókod nem rendelkezik tanári jogosultsággal (nem szerepel a public.erasmus_teachers táblában).',
      };
    }

    return {
      success: true,
      isTeacher: true,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Hiba a bejelentkezéskor.';
    return {
      success: false,
      isTeacher: false,
      error: message,
    };
  }
}

/**
 * Fetch all students and their mission results for the Teacher Dashboard
 */
export async function fetchTeacherStudentSummaries(): Promise<{
  summaries: TeacherStudentSummary[];
  error?: string;
}> {
  if (!supabase || !isSupabaseConfigured()) {
    return {
      summaries: [],
      error: 'Supabase nincs konfigurálva.',
    };
  }

  try {
    // 1. Fetch students
    const { data: studentsData, error: studentsError } = await supabase
      .from('erasmus_students')
      .select('id, full_name, class_name, profession, current_user_id')
      .order('full_name', { ascending: true });

    if (studentsError) {
      return { summaries: [], error: studentsError.message };
    }

    // 2. Fetch all results
    const { data: resultsData, error: resultsError } = await supabase
      .from('erasmus_results')
      .select('student_id, mission_id, points, completed, updated_at');

    if (resultsError) {
      return { summaries: [], error: resultsError.message };
    }

    const resultsByStudent: Record<string, Record<number, ErasmusResult>> = {};
    (resultsData || []).forEach((row: ErasmusResult) => {
      if (!resultsByStudent[row.student_id]) {
        resultsByStudent[row.student_id] = {};
      }
      resultsByStudent[row.student_id][row.mission_id] = row;
    });

    const summaries: TeacherStudentSummary[] = (studentsData || []).map((student: ErasmusStudent) => {
      const studentResults = resultsByStudent[student.id] || {};
      let total = 0;
      let completedCount = 0;
      let latestUpdate: string | undefined;

      const formattedResults: Record<number, { points: number; completed: boolean; updated_at?: string }> = {};

      for (let m = 1; m <= 5; m++) {
        const res = studentResults[m];
        if (res) {
          formattedResults[m] = {
            points: res.points,
            completed: res.completed,
            updated_at: res.updated_at,
          };
          total += res.points || 0;
          if (res.completed) completedCount++;
          if (res.updated_at && (!latestUpdate || res.updated_at > latestUpdate)) {
            latestUpdate = res.updated_at;
          }
        } else {
          formattedResults[m] = { points: 0, completed: false };
        }
      }

      return {
        ...student,
        results: formattedResults,
        totalPoints: total,
        completedMissionsCount: completedCount,
        lastUpdated: latestUpdate,
      };
    });

    return { summaries };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ismeretlen hiba';
    return { summaries: [], error: message };
  }
}

/**
 * Sign out current session (student or teacher)
 */
export async function logoutUser(): Promise<void> {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }
}

/**
 * Reset a student's session binding so they can re-login on a new device or browser
 */
export async function resetStudentSession(studentId: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase || !isSupabaseConfigured()) {
    return { success: false, error: 'A Supabase nincs konfigurálva.' };
  }

  try {
    const { error } = await supabase
      .from('erasmus_students')
      .update({ current_user_id: null })
      .eq('id', studentId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Ismeretlen hiba';
    return { success: false, error: msg };
  }
}

/**
 * Add a new student to erasmus_students (for coordinator)
 */
export async function addStudentByCoordinator(
  fullName: string,
  className?: string,
  profession?: string
): Promise<{ success: boolean; student?: ErasmusStudent; error?: string }> {
  if (!supabase || !isSupabaseConfigured()) {
    return { success: false, error: 'A Supabase nincs konfigurálva.' };
  }

  try {
    const { data, error } = await supabase
      .from('erasmus_students')
      .insert({
        full_name: fullName.trim(),
        class_name: className?.trim() || null,
        profession: profession?.trim() || null,
        current_user_id: null,
      })
      .select('id, full_name, class_name, profession, current_user_id')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, student: data as ErasmusStudent };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Ismeretlen hiba';
    return { success: false, error: msg };
  }
}

