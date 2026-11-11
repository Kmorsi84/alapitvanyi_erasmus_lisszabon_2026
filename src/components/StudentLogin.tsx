import { useState, useEffect } from 'react';
import {
  Sparkles,
  User,
  LogIn,
  AlertTriangle,
  GraduationCap,
  Loader2,
  Compass,
  UserPlus,
  Users,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import {
  fetchStudentsList,
  loginStudentByName,
  registerAndLoginStudent,
} from '../lib/erasmusService';
import { isSupabaseConfigured, ErasmusStudent, ErasmusResult } from '../lib/supabase';

interface StudentLoginProps {
  onLoginSuccess: (student: ErasmusStudent, results: ErasmusResult[]) => void;
  onOpenTeacherLogin: () => void;
  onContinueAsGuest?: (guestName: string) => void;
}

export function StudentLogin({
  onLoginSuccess,
  onOpenTeacherLogin,
  onContinueAsGuest,
}: StudentLoginProps) {
  const [students, setStudents] = useState<ErasmusStudent[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  // Mode: 'pick' (select from roster) or 'new' (enter name)
  const [mode, setMode] = useState<'pick' | 'new'>('pick');

  // New student form
  const [newFullName, setNewFullName] = useState('');
  const [newClass, setNewClass] = useState('');
  const [newProfession, setNewProfession] = useState('Szakács');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isConfigured = isSupabaseConfigured();

  // Load existing student roster
  useEffect(() => {
    let isMounted = true;
    async function loadRoster() {
      if (!isConfigured) {
        setIsLoadingStudents(false);
        setMode('new');
        return;
      }

      setIsLoadingStudents(true);
      try {
        const list = await fetchStudentsList();
        if (isMounted) {
          setStudents(list);
          if (list.length > 0) {
            setSelectedStudentId(list[0].id);
            setMode('pick');
          } else {
            setMode('new');
          }
        }
      } catch {
        if (isMounted) setMode('new');
      } finally {
        if (isMounted) setIsLoadingStudents(false);
      }
    }

    loadRoster();
    return () => {
      isMounted = false;
    };
  }, [isConfigured]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isConfigured) {
      // Fallback guest mode if Supabase is not configured yet
      const fallbackName =
        mode === 'pick'
          ? students.find((s) => s.id === selectedStudentId)?.full_name || 'Tanuló'
          : newFullName.trim() || 'Tanuló';
      onContinueAsGuest?.(fallbackName);
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'pick') {
        const student = students.find((s) => s.id === selectedStudentId);
        if (!student) {
          setErrorMessage('Kérjük, válaszd ki a neved a listából!');
          setIsLoading(false);
          return;
        }

        const result = await loginStudentByName(student);
        if (!result.success || !result.student) {
          setErrorMessage(result.error || 'Nem sikerült a belépés. Próbáld újra!');
        } else {
          onLoginSuccess(result.student, result.results || []);
        }
      } else {
        // Mode 'new'
        const trimmed = newFullName.trim();
        if (!trimmed) {
          setErrorMessage('Kérjük, add meg a teljes nevedet!');
          setIsLoading(false);
          return;
        }

        const result = await registerAndLoginStudent(trimmed, newClass, newProfession);
        if (!result.success || !result.student) {
          setErrorMessage(result.error || 'Hiba történt a regisztráció során.');
        } else {
          onLoginSuccess(result.student, result.results || []);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ismeretlen hiba történt.';
      setErrorMessage(`Hiba: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col items-center justify-center py-8 px-4 sm:px-6">
      {/* Background Azulejo & Lisbon Theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-blue-900 to-slate-900 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15 -z-10" />

      <div className="w-full max-w-xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-200/70 overflow-hidden my-auto">
        {/* Portuguese Ceramic / Azulejo Stripe */}
        <div className="h-3 w-full bg-gradient-to-r from-blue-900 via-sky-500 via-amber-400 to-emerald-600" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Erasmus+ Lisszabon · Tanulói Belépés (Kód Nélkül)
            </div>

            <h1 className="font-serif-lisbon font-bold text-2xl sm:text-3xl text-blue-950 tracking-tight">
              Portuguese Food Quest
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Válaszd ki a nevedet a mobilitási névsorból a pontjaid és jelvényeid automatikus felhőbe mentéséhez!
            </p>
          </div>

          {/* Mode Switcher Tabs (ha vannak diákok az adatbázisban) */}
          {students.length > 0 && (
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('pick')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  mode === 'pick'
                    ? 'bg-white text-blue-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-4 h-4 text-blue-800" />
                <span>Névsorból választok ({students.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('new')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  mode === 'new'
                    ? 'bg-white text-blue-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="w-4 h-4 text-emerald-700" />
                <span>Új tanulóként lépek be</span>
              </button>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm flex items-start gap-2.5"
            >
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Hiba történt</p>
                <p className="mt-0.5 text-red-800">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Student Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'pick' && students.length > 0 ? (
              /* PICK FROM ROSTER */
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="student-select"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wide"
                  >
                    Válaszd ki a neved a névsorból:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4 text-blue-800" />
                    </div>
                    <select
                      id="student-select"
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      disabled={isLoading || isLoadingStudents}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900 font-semibold bg-white text-sm cursor-pointer shadow-2xs"
                    >
                      {students.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.full_name} {st.class_name ? `(${st.class_name}` : ''}
                          {st.profession ? ` · ${st.profession})` : st.class_name ? ')' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selected Student Highlight Card */}
                {selectedStudent && (
                  <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-blue-950 block">
                          {selectedStudent.full_name}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          {[selectedStudent.class_name, selectedStudent.profession]
                            .filter(Boolean)
                            .join(' · ') || 'Mobilitási résztvevő'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-200">
                      Kész a belépésre
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* ENTER NEW STUDENT */
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label
                    htmlFor="student-new-name"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wide"
                  >
                    Tanuló teljes neve *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="student-new-name"
                      type="text"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      placeholder="pl. Kiss Dóra vagy Tóth Bence"
                      required
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium placeholder:text-slate-400 bg-white text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label
                      htmlFor="student-new-class"
                      className="block text-xs font-bold text-slate-700 uppercase tracking-wide"
                    >
                      Osztály (opcionális)
                    </label>
                    <input
                      id="student-new-class"
                      type="text"
                      value={newClass}
                      onChange={(e) => setNewClass(e.target.value)}
                      placeholder="pl. 11.A vagy 12.B"
                      disabled={isLoading}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900 text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="student-new-prof"
                      className="block text-xs font-bold text-slate-700 uppercase tracking-wide"
                    >
                      Szakma
                    </label>
                    <div className="relative">
                      <select
                        id="student-new-prof"
                        value={newProfession}
                        onChange={(e) => setNewProfession(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm bg-white cursor-pointer"
                      >
                        <option value="Szakács">Szakács</option>
                        <option value="Cukrász">Cukrász</option>
                        <option value="Vendégtéri szakember (Pincér)">Vendégtéri szakember (Pincér)</option>
                        <option value="Turisztikai technikus">Turisztikai technikus</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Big Action Button */}
            <button
              type="submit"
              disabled={isLoading || (mode === 'pick' && students.length === 0 && isLoadingStudents)}
              className={`w-full py-3.5 px-4 rounded-xl font-serif-lisbon font-bold text-sm sm:text-base text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                isLoading
                  ? 'bg-blue-800/80 cursor-wait'
                  : 'bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 hover:from-blue-800 hover:to-blue-700'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Azonosítás és küldetések betöltése...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-amber-300" />
                  <span>Belépés a Lisszaboni Kalandba</span>
                </>
              )}
            </button>
          </form>

          {/* Simple Info note */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/90 p-3 text-slate-600 text-xs flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              A belépéshez nincs szükség külön jelszóra vagy kódra. A pontjaid automatikusan a nevedhez mentődnek.
            </span>
          </div>

          {/* Teacher Login Link & Guest Mode */}
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <button
              type="button"
              onClick={onOpenTeacherLogin}
              className="inline-flex items-center gap-1.5 text-blue-900 hover:text-blue-700 font-semibold cursor-pointer underline decoration-blue-300 hover:decoration-blue-700 transition-colors"
            >
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span>Koordinátori & Tanári Belépés</span>
            </button>

            {onContinueAsGuest && (
              <button
                type="button"
                onClick={() =>
                  onContinueAsGuest(
                    mode === 'pick'
                      ? selectedStudent?.full_name || 'Vendég Tanuló'
                      : newFullName.trim() || 'Vendég Tanuló'
                  )
                }
                className="text-slate-500 hover:text-slate-800 cursor-pointer flex items-center gap-1"
                title="Játék indítása vendégként, felhő mentés nélkül"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Folytatás helyi vendégként</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
