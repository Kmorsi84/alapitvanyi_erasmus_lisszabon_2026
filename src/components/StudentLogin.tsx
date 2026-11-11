import { useState } from 'react';
import {
  Sparkles,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  AlertTriangle,
  GraduationCap,
  ShieldAlert,
  Loader2,
  Compass,
} from 'lucide-react';
import { claimStudent } from '../lib/erasmusService';
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
  const [fullName, setFullName] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isConfigured = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = fullName.trim();
    const trimmedCode = studentCode.trim();

    if (!trimmedName || !trimmedCode) {
      setErrorMessage('Kérjük, töltsd ki a teljes nevedet és az egyedi tanulói kódot is!');
      return;
    }

    if (!isConfigured) {
      setErrorMessage(
        'A Supabase környezeti változók (VITE_SUPABASE_PUBLISHABLE_KEY) nincsenek beállítva. A felhőalapú mentéshez konfiguráció szükséges.'
      );
      return;
    }

    setIsLoading(true);

    try {
      // Security rule: The code is passed only to claimStudent and never written to localStorage/sessionStorage
      const result = await claimStudent(trimmedName, trimmedCode);

      if (!result.success || !result.student) {
        setErrorMessage(
          result.error ||
            'Érvénytelen tanulói név vagy kód. Kérjük, ellenőrizd az adataidat és próbáld újra!'
        );
      } else {
        onLoginSuccess(result.student, result.results || []);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ismeretlen hiba történt.';
      setErrorMessage(`Hiba a bejelentkezés során: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col items-center justify-center py-8 px-4 sm:px-6">
      {/* Background Azulejo & Lisbon Theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-blue-900 to-slate-900 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15 -z-10" />

      <div className="w-full max-w-xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-200/70 overflow-hidden my-auto">
        {/* Portuguese Ceramic / Azulejo Stripe */}
        <div className="h-3 w-full bg-gradient-to-r from-blue-900 via-sky-500 via-amber-400 to-emerald-600" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header & Badges */}
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Erasmus+ Lisszabon · Tanulói Belépés
            </div>

            <h1 className="font-serif-lisbon font-bold text-2xl sm:text-3xl text-blue-950 tracking-tight">
              Portuguese Food Quest
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Lisszaboni éttermi szakmai kaland és gasztronómiai angol (B1) szakképzési kihívás.
              Lépj be az iskoládtól kapott neveddel és egyedi kódoddal a pontjaid mentéséhez!
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm flex items-start gap-2.5 animate-shake"
            >
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Sikertelen azonosítás</p>
                <p className="mt-0.5 text-red-800">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Student Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="student-full-name"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wide"
              >
                Tanuló teljes neve
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="student-full-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="pl. Kovács András"
                  autoComplete="name"
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 font-medium placeholder:text-slate-400 bg-white text-sm"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Pontosan úgy írd be a neved, ahogyan a tanárodtól a felkészítő listán kaptad.
              </p>
            </div>

            {/* Unique Student Code Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="student-code"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wide"
              >
                Egyedi tanulói kód
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="student-code"
                  type={showCode ? 'text' : 'password'}
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  placeholder="pl. LIS2026-X8Y2"
                  autoComplete="off"
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 font-medium placeholder:text-slate-400 bg-white text-sm font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showCode ? 'Kód elrejtése' : 'Kód mutatása'}
                  aria-label={showCode ? 'Kód elrejtése' : 'Kód mutatása'}
                >
                  {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                A kódod nem kerül mentésre a böngésző helyi tárhelyébe (localStorage).
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-serif-lisbon font-bold text-sm sm:text-base text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                isLoading
                  ? 'bg-blue-800/80 cursor-wait'
                  : 'bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600'
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

          {/* Security & Brute-Force Protection Notice */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/90 p-3.5 text-slate-600 text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Biztonsági és védelmi tájékoztató:</span>
            </div>
            <p className="leading-relaxed">
              Az azonosítás során a kliensoldal automatikus késleltetést alkalmaz sikertelen próbálkozásnál,
              és törli az ideiglenes munkamenetet. A valódi, teljes körű brute-force védelemhez szerveroldali
              IP-alapú rate limit (kérésszám-korlátozás) és CAPTCHA ellenőrzés szükséges a Supabase infrastruktúrában.
            </p>
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
                onClick={() => onContinueAsGuest(fullName.trim() || 'Vendég Tanuló')}
                className="text-slate-500 hover:text-slate-800 cursor-pointer flex items-center gap-1"
                title="Játék indítása vendégként, Supabase mentés nélkül"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Folytatás helyi vendég módban</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
