import { Clock, Volume2, VolumeX, Award, RotateCcw } from 'lucide-react';
import { MissionId } from '../types/game';

interface NavbarProps {
  currentMission: MissionId;
  totalScore: number;
  timeRemainingSeconds: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  studentName: string;
  onRestart: () => void;
}

export function Navbar({
  currentMission,
  totalScore,
  timeRemainingSeconds,
  soundEnabled,
  onToggleSound,
  studentName,
  onRestart,
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
          {/* Brand & Trainee Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-900 text-amber-300 flex items-center justify-center font-serif-lisbon font-bold text-lg shadow-inner border border-blue-800">
              PFQ
            </div>
            <div>
              <h1 className="font-serif-lisbon font-bold text-blue-950 text-base sm:text-lg leading-tight tracking-tight">
                Portuguese Food Quest
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Lisbon Restaurant Adventure
                {studentName && (
                  <span className="hidden sm:inline">
                    {' '}· Trainee: <strong className="text-blue-900">{studentName}</strong>
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Current Mission tracker */}
          <div className="hidden lg:flex flex-col items-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Current Stage
            </span>
            <span className="text-sm font-semibold text-blue-950">
              {getMissionName()}
            </span>
          </div>

          {/* Gamification Stats: Timer, Score, Sound, Restart */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Timer */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-semibold ${
                timeRemainingSeconds < 120
                  ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
                  : 'bg-blue-50 text-blue-900 border border-blue-200'
              }`}
              title="15-minute training shift timer"
            >
              <Clock className="w-4 h-4" />
              <span className="font-mono tabular-nums">{formatTime(timeRemainingSeconds)}</span>
            </div>

            {/* Score */}
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-semibold bg-amber-50 text-amber-900 border border-amber-200"
              title="Total score earned out of 150 points"
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span>
                <strong className="font-mono tabular-nums text-amber-800">{totalScore}</strong>
                <span className="text-xs text-amber-700/75">/150 pts</span>
              </span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-1.5 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-md transition-colors"
              title={soundEnabled ? 'Speech audio enabled' : 'Speech audio muted'}
              aria-label={soundEnabled ? 'Mute speech audio' : 'Enable speech audio'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-blue-800" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Restart button */}
            {currentMission > 0 && (
              <button
                onClick={onRestart}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 rounded-md transition-colors"
                title="Restart adventure from the beginning"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Progress Bar */}
        {currentMission > 0 && currentMission <= 5 && (
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
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
