import { useState } from 'react';
import {
  X,
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertTriangle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { loginTeacher } from '../lib/erasmusService';
import { isSupabaseConfigured } from '../lib/supabase';

interface TeacherLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export function TeacherLoginModal({ isOpen, onClose, onLoginSuccess }: TeacherLoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isSupabaseConfigured()) {
      setErrorMessage(
        'A Supabase nincs konfigurálva. Kérjük, állítsd be a VITE_SUPABASE_PUBLISHABLE_KEY kulcsot!'
      );
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage('Kérjük, add meg a tanári email címedet és jelszavadat!');
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginTeacher(email.trim(), password);

      if (!result.success || !result.isTeacher) {
        setErrorMessage(
          result.error ||
            'Sikertelen bejelentkezés. Ellenőrizd a megadott adatokat, illetve hogy a fiókod szerepel-e a public.erasmus_teachers táblában!'
        );
      } else {
        onLoginSuccess();
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ismeretlen hiba történt.';
      setErrorMessage(`Hiba: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-blue-200 overflow-hidden">
        {/* Azulejo Stripe */}
        <div className="h-2.5 w-full bg-gradient-to-r from-blue-900 via-amber-400 to-blue-900" />

        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-900 text-amber-300 flex items-center justify-center shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif-lisbon font-bold text-lg text-blue-950">
                  Tanári Eredménykövető
                </h2>
                <p className="text-xs text-slate-500">
                  Supabase Auth tanári fiók azonosítás
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Bezárás"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Hiba történt</p>
                <p className="text-red-800">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Teacher Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label
                htmlFor="teacher-email"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wide"
              >
                Tanári Email Cím
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="teacher-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tanar@iskola.hu"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="teacher-password"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wide"
              >
                Jelszó
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="teacher-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  className="w-full pl-9 pr-10 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Jelszó elrejtése' : 'Jelszó mutatása'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 border border-blue-200 p-2.5 text-blue-950 text-[11px] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                Valódi Supabase Auth hitelesítés. Nincs a böngészőbe égetett jelszó.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Mégse
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                    <span>Belépés...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5 text-amber-300" />
                    <span>Tanári Belépés</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
