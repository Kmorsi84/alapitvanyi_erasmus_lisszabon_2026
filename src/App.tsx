import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { StudentLogin } from './components/StudentLogin';
import { TeacherLoginModal } from './components/TeacherLoginModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { SupabaseConfigBanner } from './components/SupabaseConfigBanner';
import { Mission1Vocabulary } from './components/Mission1Vocabulary';
import { Mission2Market } from './components/Mission2Market';
import { Mission3Menu } from './components/Mission3Menu';
import { Mission4Service } from './components/Mission4Service';
import { Mission5Final } from './components/Mission5Final';
import { SummaryCertificate } from './components/SummaryCertificate';
import { MissionId, Badge } from './types/game';
import { supabase, isSupabaseConfigured, ErasmusStudent, ErasmusResult } from './lib/supabase';
import { queueSaveMissionResult, logoutUser, fetchStudentResults } from './lib/erasmusService';
import { AlertCircle, X } from 'lucide-react';

const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-1',
    title: 'Portuguese Food Explorer',
    description: 'Explored 12 iconic Portuguese dishes and hospitality expressions.',
    missionNumber: 1,
    earned: false,
    icon: '🧭',
  },
  {
    id: 'badge-2',
    title: 'Market Master',
    description: 'Procured authentic ingredients at Mercado da Ribeira stalls.',
    missionNumber: 2,
    earned: false,
    icon: '🧺',
  },
  {
    id: 'badge-3',
    title: 'Menu Expert',
    description: 'Mastered Portuguese menu reading and strict kitchen allergen safety.',
    missionNumber: 3,
    earned: false,
    icon: '📜',
  },
  {
    id: 'badge-4',
    title: 'Excellent Waiter',
    description: 'Handled customer orders, requests, and complaints with B1 professional grace.',
    missionNumber: 4,
    earned: false,
    icon: '🍽️',
  },
  {
    id: 'badge-5',
    title: 'Gastronomy Ambassador',
    description: 'Completed the visual matching test and spoken recommendation.',
    missionNumber: 5,
    earned: false,
    icon: '🏆',
  },
];

const SESSION_KEY = 'pfq_game_state_v1';
const STUDENT_SESSION_KEY = 'pfq_student_info_v1';

export default function App() {
  // Current authenticated student (loaded from Supabase or cached in session)
  const [currentStudent, setCurrentStudent] = useState<ErasmusStudent | null>(() => {
    try {
      const saved = sessionStorage.getItem(STUDENT_SESSION_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const [studentName, setStudentName] = useState<string>(() => {
    try {
      const savedStudent = sessionStorage.getItem(STUDENT_SESSION_KEY);
      if (savedStudent) {
        const parsed = JSON.parse(savedStudent);
        if (parsed.full_name) return parsed.full_name;
      }
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.studentName || '';
      }
    } catch {
      // ignore
    }
    return '';
  });

  // Auth & View state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!sessionStorage.getItem(STUDENT_SESSION_KEY);
  });
  const [isTeacher, setIsTeacher] = useState<boolean>(false);
  const [isTeacherViewActive, setIsTeacherViewActive] = useState<boolean>(false);
  const [isTeacherLoginOpen, setIsTeacherLoginOpen] = useState<boolean>(false);

  // Cloud Sync state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveErrorNotice, setSaveErrorNotice] = useState<string | null>(null);

  // Mission progression
  const [currentMission, setCurrentMission] = useState<MissionId>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.currentMission ?? 0;
      }
    } catch {
      // ignore
    }
    return 0;
  });

  const [missionScores, setMissionScores] = useState({
    m1: 0,
    m2: 0,
    m3: 0,
    m4: 0,
    m5: 0,
  });

  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.timeRemainingSeconds ?? 900;
      }
    } catch {
      // ignore
    }
    return 900; // 15 minutes
  });

  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [mistakes, setMistakes] = useState<{ mission: number; topic: string; note: string }[]>([]);
  const [badgeToast, setBadgeToast] = useState<Badge | null>(null);

  // Check Supabase session on startup
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured()) return;

    let isMounted = true;

    async function checkAuthSession() {
      try {
        const { data } = await supabase!.auth.getSession();
        if (!data.session?.user) return;

        const userId = data.session.user.id;

        // Check if user is in public.erasmus_teachers
        const { data: teacherRow } = await supabase!
          .from('erasmus_teachers')
          .select('user_id')
          .eq('user_id', userId)
          .maybeSingle();

        if (teacherRow && isMounted) {
          setIsTeacher(true);
          return;
        }

        // Check if user is associated with an erasmus_student
        const { data: studentRow } = await supabase!
          .from('erasmus_students')
          .select('id, full_name, class_name, profession, current_user_id')
          .eq('current_user_id', userId)
          .maybeSingle();

        if (studentRow && isMounted) {
          setCurrentStudent(studentRow as ErasmusStudent);
          setStudentName(studentRow.full_name);
          setIsLoggedIn(true);

          // Restore results
          const results = await fetchStudentResults(studentRow.id);
          restoreStudentProgress(results);
        }
      } catch (err) {
        console.warn('Hiba az automatikus munkamenet-ellenőrzéskor:', err);
      }
    }

    checkAuthSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save session state to prevent loss on reload
  useEffect(() => {
    try {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          studentName,
          currentMission,
          missionScores,
          timeRemainingSeconds,
        })
      );
      if (currentStudent) {
        sessionStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(currentStudent));
      }
    } catch {
      // ignore
    }
  }, [studentName, currentMission, missionScores, timeRemainingSeconds, currentStudent]);

  // 15-Minute Countdown Timer
  useEffect(() => {
    if (!isTimerRunning) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerRunning(false);
          // If time expires, move to summary
          setCurrentMission(6);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const awardBadge = useCallback((missionNum: number) => {
    setBadges((prev) => {
      const target = prev.find((b) => b.missionNumber === missionNum);
      if (target && !target.earned) {
        setBadgeToast(target);
        setTimeout(() => setBadgeToast(null), 4000);
        return prev.map((b) => (b.missionNumber === missionNum ? { ...b, earned: true } : b));
      }
      return prev;
    });
  }, []);

  // Restore points and badges from fetched Supabase results
  const restoreStudentProgress = useCallback((results: ErasmusResult[]) => {
    if (!results || results.length === 0) return;

    const restoredScores = { m1: 0, m2: 0, m3: 0, m4: 0, m5: 0 };
    let completedCount = 0;

    results.forEach((r) => {
      if (r.mission_id === 1) restoredScores.m1 = r.points || 0;
      if (r.mission_id === 2) restoredScores.m2 = r.points || 0;
      if (r.mission_id === 3) restoredScores.m3 = r.points || 0;
      if (r.mission_id === 4) restoredScores.m4 = r.points || 0;
      if (r.mission_id === 5) restoredScores.m5 = r.points || 0;

      if (r.completed) {
        completedCount++;
      }
    });

    setMissionScores(restoredScores);

    // Restore badges
    setBadges((prev) =>
      prev.map((b) => {
        const item = results.find((r) => r.mission_id === b.missionNumber);
        return item?.completed ? { ...b, earned: true } : b;
      })
    );

    // If student previously completed all 5 missions, allow certificate review
    if (completedCount === 5) {
      setCurrentMission(6);
    }
  }, []);

  // Handle student login from StudentLogin component
  const handleStudentLoginSuccess = (student: ErasmusStudent, results: ErasmusResult[]) => {
    setCurrentStudent(student);
    setStudentName(student.full_name);
    setIsLoggedIn(true);
    restoreStudentProgress(results);
    setCurrentMission(0); // Show WelcomeScreen with trainee context
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Continue as local guest (if offline or testing)
  const handleContinueAsGuest = (guestName: string) => {
    setStudentName(guestName);
    setIsLoggedIn(true);
    setCurrentMission(0);
  };

  // Teacher authenticated successfully
  const handleTeacherLoginSuccess = () => {
    setIsTeacher(true);
    setIsTeacherViewActive(true);
  };

  // Logout student or teacher
  const handleLogout = async () => {
    try {
      await logoutUser();
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(STUDENT_SESSION_KEY);
    } catch {
      // ignore
    }
    setCurrentStudent(null);
    setStudentName('');
    setIsLoggedIn(false);
    setIsTeacher(false);
    setIsTeacherViewActive(false);
    setCurrentMission(0);
    setMissionScores({ m1: 0, m2: 0, m3: 0, m4: 0, m5: 0 });
    setTimeRemainingSeconds(900);
    setIsTimerRunning(false);
    setBadges(INITIAL_BADGES);
    setMistakes([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartGame = (name: string) => {
    setStudentName(name);
    setCurrentMission(1);
    setIsTimerRunning(true);
  };

  // Save mission result helper using queue to prevent concurrency race conditions
  const saveAndSyncMission = async (
    missionId: number,
    score: number,
    maxPoints: number,
    nextMission: MissionId
  ) => {
    const cappedScore = Math.min(maxPoints, Math.max(0, score));

    // Update local state immediately
    const key = `m${missionId}` as keyof typeof missionScores;
    setMissionScores((prev) => ({ ...prev, [key]: cappedScore }));
    awardBadge(missionId);

    if (nextMission === 6) {
      setIsTimerRunning(false);
    }
    setCurrentMission(nextMission);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // If logged in to Supabase, sync persistently via RPC erasmus_save_result
    if (isLoggedIn && currentStudent && isSupabaseConfigured()) {
      setIsSaving(true);
      try {
        const res = await queueSaveMissionResult(missionId, cappedScore, true);
        if (!res.success) {
          setSaveErrorNotice(
            `Figyelem: A(z) ${missionId}. küldetés pontszáma helyileg rögzítve lett, de a Supabase felhőbe mentés meghiúsult: ${res.error}`
          );
        } else {
          setSaveErrorNotice(null);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Hálózati hiba';
        setSaveErrorNotice(`Mentési hiba: ${msg}`);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCompleteMission1 = (score: number) => {
    // Mission 1: 20 points max
    saveAndSyncMission(1, score, 20, 2);
  };

  const handleCompleteMission2 = (score: number) => {
    // Mission 2: 30 points max
    saveAndSyncMission(2, score, 30, 3);
  };

  const handleCompleteMission3 = (score: number) => {
    // Mission 3: 30 points max
    saveAndSyncMission(3, score, 30, 4);
  };

  const handleCompleteMission4 = (score: number) => {
    // Mission 4: 50 points max
    saveAndSyncMission(4, score, 50, 5);
  };

  const handleCompleteMission5 = (score: number) => {
    // Mission 5: 20 points max
    saveAndSyncMission(5, score, 20, 6);
  };

  const handleRecordMistake = (topic: string, note: string) => {
    setMistakes((prev) => [...prev, { mission: currentMission, topic, note }]);
  };

  const handleRestart = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    setCurrentMission(0);
    setMissionScores({ m1: 0, m2: 0, m3: 0, m4: 0, m5: 0 });
    setTimeRemainingSeconds(900);
    setIsTimerRunning(false);
    setBadges(INITIAL_BADGES);
    setMistakes([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalScore =
    missionScores.m1 +
    missionScores.m2 +
    missionScores.m3 +
    missionScores.m4 +
    missionScores.m5;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased selection:bg-amber-200 selection:text-blue-950">
      {/* Supabase Configuration Warning Banner if keys are not set */}
      <SupabaseConfigBanner />

      {/* Top Header Navbar */}
      <Navbar
        currentMission={currentMission}
        totalScore={totalScore}
        timeRemainingSeconds={timeRemainingSeconds}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        studentName={studentName}
        studentDetails={
          currentStudent
            ? {
                className: currentStudent.class_name,
                profession: currentStudent.profession,
              }
            : null
        }
        isLoggedIn={isLoggedIn}
        isTeacher={isTeacher}
        isSaving={isSaving}
        onRestart={handleRestart}
        onLogout={handleLogout}
        onOpenTeacherLogin={() => setIsTeacherLoginOpen(true)}
        onToggleTeacherView={() => setIsTeacherViewActive((prev) => !prev)}
      />

      {/* Save Error Alert Banner */}
      {saveErrorNotice && (
        <div
          role="alert"
          className="bg-amber-500/15 border-b border-amber-500/30 text-amber-950 px-4 py-2 text-xs flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{saveErrorNotice}</span>
          </div>
          <button
            onClick={() => setSaveErrorNotice(null)}
            className="p-1 hover:bg-amber-500/20 rounded cursor-pointer"
            title="Értesítés bezárása"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Badge Award Toast Notification */}
      {badgeToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-950 to-blue-900 text-white p-4 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center gap-3.5 animate-bounce max-w-sm">
          <div className="text-3xl">{badgeToast.icon}</div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
              Badge Unlocked!
            </span>
            <p className="font-serif-lisbon font-bold text-sm text-white">{badgeToast.title}</p>
            <p className="text-[11px] text-blue-200 line-clamp-1">{badgeToast.description}</p>
          </div>
        </div>
      )}

      {/* Teacher Login Modal */}
      <TeacherLoginModal
        isOpen={isTeacherLoginOpen}
        onClose={() => setIsTeacherLoginOpen(false)}
        onLoginSuccess={handleTeacherLoginSuccess}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* If Teacher Dashboard is active */}
        {isTeacher && isTeacherViewActive ? (
          <TeacherDashboard
            onLogout={handleLogout}
            onReturnToGame={() => setIsTeacherViewActive(false)}
          />
        ) : !isLoggedIn ? (
          /* Student Login Screen */
          <StudentLogin
            onLoginSuccess={handleStudentLoginSuccess}
            onOpenTeacherLogin={() => setIsTeacherLoginOpen(true)}
            onContinueAsGuest={handleContinueAsGuest}
          />
        ) : (
          /* Authenticated Student Game Flow (Missions 0..6) */
          <>
            {currentMission === 0 && (
              <WelcomeScreen onStart={handleStartGame} defaultName={studentName} />
            )}

            {currentMission === 1 && (
              <Mission1Vocabulary
                onComplete={handleCompleteMission1}
                soundEnabled={soundEnabled}
              />
            )}

            {currentMission === 2 && (
              <Mission2Market
                onComplete={handleCompleteMission2}
                onRecordMistake={handleRecordMistake}
              />
            )}

            {currentMission === 3 && (
              <Mission3Menu
                onComplete={handleCompleteMission3}
                onRecordMistake={handleRecordMistake}
              />
            )}

            {currentMission === 4 && (
              <Mission4Service
                onComplete={handleCompleteMission4}
                onRecordMistake={handleRecordMistake}
              />
            )}

            {currentMission === 5 && (
              <Mission5Final
                onComplete={handleCompleteMission5}
                soundEnabled={soundEnabled}
              />
            )}

            {currentMission === 6 && (
              <SummaryCertificate
                studentName={studentName}
                studentDetails={
                  currentStudent
                    ? {
                        className: currentStudent.class_name,
                        profession: currentStudent.profession,
                      }
                    : null
                }
                totalScore={totalScore}
                missionScores={missionScores}
                badges={badges}
                mistakes={mistakes}
                onRestart={handleRestart}
              />
            )}
          </>
        )}
      </main>

      {/* Subtle Lisbon Gastronomy Footer */}
      <footer className="no-print mt-auto border-t border-slate-200/80 bg-white/70 py-4 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Portuguese Food Quest · Designed for Hungarian vocational students in hospitality,
            culinary arts & tourism (CEFR B1).
          </p>
          <p className="text-slate-400">Lisbon Restaurant Adventure · Educational Simulation</p>
        </div>
      </footer>
    </div>
  );
}
