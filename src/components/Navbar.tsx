import {
  Clock,
  Volume2,
  VolumeX,
  Award,
  RotateCcw,
  LogOut,
  GraduationCap,
  Cloud,
  Loader2,
} from 'lucide-react';
import { MissionId } from '../types/game';

interface NavbarProps {
  currentMission: MissionId;
  totalScore: number;
  timeRemainingSeconds: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  studentName: string;
  studentDetails?: {
    className?: string | null;
    profession?: string | null;
  } | null;
  isLoggedIn?: boolean;
  isTeacher?: boolean;
  isSaving?: boolean;
  onRestart: () => void;
  onLogout?: () => void;
  onOpenTeacherLogin?: () => void;
  onToggleTeacherView?: () => void;
}

export function Navbar({
  currentMission,
  totalScore,
  timeRemainingSeconds,
  soundEnabled,
  onToggleSound,
  studentName,
  studentDetails,
  isLoggedIn = false,
  isTeacher = false,
  isSaving = false,
  onRestart,
  onLogout,
  onOpenTeacherLogin,
  onToggleTeacherView,
}: NavbarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMissionName = () => {
    switch (currentMission) {
      case 1:
        return 'Mission 1: Discover Portuguese Cuisine';
      case 2:
        return 'Mission 2: The Market Challenge';
      case 3:
        return 'Mission 3: The Restaurant Menu';
      case 4:
        return 'Mission 4: Serve the Customers';
      case 5:
        return 'Mission 5: Final Food Expert Challenge';
      case 6:
        return 'Final Evaluation & Certificate';
      default:
        return 'Welcome to Lisbon';
    }
  };

  const progressPercent = currentMission === 0 ? 0 : Math.min(100, (currentMission / 5) * 100);

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-900/15 shadow-sm">
      {/* Azulejo top micro-stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-900 via-blue-600 via-amber-400 to-emerald-700" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand & Trainee Info */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-900 text-amber-300 flex items-center justify-center font-serif-lisbon font-bold text-sm sm:text-lg shadow-inner border border-blue-800 shrink-0">
              PFQ
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="font-serif-lisbon font-bold text-blue-950 text-xs sm:text-base leading-tight tracking-tight truncate">
                  Portuguese Food Quest
                </h1>
                {isLoggedIn && (
                  <span
                    className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200"
                    title={isSaving ? 'Supabase mentés folyamatban...' : 'Supabase-hez csatlakoztatva'}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-2.5 h-2.5 animate-spin text-amber-600" />
                        <span>Mentés...</span>
                      </>
                    ) : (
                      <>
                        <Cloud className="w-2.5 h-2.5 text-emerald-600" />
                        <span>Supabase</span>
                      </>
                    )}
                  </span>
                )}
              </div>

              <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                <span className="hidden sm:inline">Lisbon Restaurant Adventure · </span>
                {studentName ? (
                  <span>
                    Tanuló: <strong className="text-blue-900">{studentName}</strong>
                    {studentDetails?.className && (
                      <span className="text-slate-400"> ({studentDetails.className}</span>
                    )}
                    {studentDetails?.profession && (
                      <span className="text-slate-400"> · {studentDetails.profession})</span>
                    )}
                  </span>
                ) : (
                  <span>Lisbon Training</span>
                )}
              </p>
            </div>
          </div>

          {/* Current Mission tracker (Tablet & Desktop) */}
          <div className="hidden md:flex flex-col items-center px-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              Current Stage
            </span>
            <span className="text-xs sm:text-sm font-semibold text-blue-950 whitespace-nowrap">
              {getMissionName()}
            </span>
          </div>

          {/* Gamification Stats: Timer, Score, Sound, Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Timer */}
            <div
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs sm:text-sm font-semibold ${
                timeRemainingSeconds < 120
                  ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
                  : 'bg-blue-50 text-blue-900 border border-blue-200'
              }`}
              title="15-minute shift timer"
            >
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="font-mono tabular-nums">{formatTime(timeRemainingSeconds)}</span>
            </div>

            {/* Score */}
            <div
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs sm:text-sm font-semibold bg-amber-50 text-amber-900 border border-amber-200"
              title="Total score earned out of 150 points"
            >
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
              <span>
                <strong className="font-mono tabular-nums text-amber-800">{totalScore}</strong>
                <span className="text-[10px] sm:text-xs text-amber-700/75">/150</span>
              </span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-1.5 sm:p-2 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer active:scale-95"
              title={soundEnabled ? 'Hang engedélyezve' : 'Hang némítva'}
              aria-label={soundEnabled ? 'Hang némítása' : 'Hang bekapcsolása'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-blue-800" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Coordinator & Teacher button */}
            {isTeacher ? (
              <button
                onClick={onToggleTeacherView}
                className="px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                title="Koordinátori & Tanári Központ megnyitása"
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-800" />
                <span className="hidden sm:inline">Koordinátori Központ</span>
              </button>
            ) : onOpenTeacherLogin ? (
              <button
                onClick={onOpenTeacherLogin}
                className="p-1.5 sm:px-2 sm:py-1 text-xs font-medium text-blue-950 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                title="Koordinátori & Tanári belépés"
              >
                <GraduationCap className="w-3.5 h-3.5 text-blue-800" />
                <span className="hidden lg:inline">Koordinátor</span>
              </button>
            ) : null}

            {/* Restart button */}
            {currentMission > 0 && (
              <button
                onClick={onRestart}
                className="p-1.5 sm:px-2 sm:py-1 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                title="Újrakezdés az elejétől"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Újra</span>
              </button>
            )}

            {/* Logout button */}
            {isLoggedIn && onLogout && (
              <button
                onClick={onLogout}
                className="p-1.5 sm:px-2 sm:py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                title="Kijelentkezés a fiókból"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kilépés</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile current stage label */}
        {currentMission > 0 && currentMission <= 5 && (
          <div className="flex md:hidden items-center justify-between text-[11px] text-blue-900 font-medium pt-1 px-0.5">
            <span>Stage {currentMission}/5</span>
            <span className="font-semibold">{getMissionName().replace(/Mission \d+: /, '')}</span>
          </div>
        )}

        {/* Global Progress Bar */}
        {currentMission > 0 && currentMission <= 5 && (
          <div className="mt-1.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-700 to-amber-500 h-full transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        )}
      </div>
    </header>
  );
}
