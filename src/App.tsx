import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Mission1Vocabulary } from './components/Mission1Vocabulary';
import { Mission2Market } from './components/Mission2Market';
import { Mission3Menu } from './components/Mission3Menu';
import { Mission4Service } from './components/Mission4Service';
import { Mission5Final } from './components/Mission5Final';
import { SummaryCertificate } from './components/SummaryCertificate';
import { MissionId, Badge } from './types/game';

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

export default function App() {
  // Load saved session or default state
  const [studentName, setStudentName] = useState<string>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.studentName || 'András';
      }
    } catch (e) {
      // ignore
    }
    return 'András';
  });

  const [currentMission, setCurrentMission] = useState<MissionId>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.currentMission ?? 0;
      }
    } catch (e) {
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
    } catch (e) {
      // ignore
    }
    return 900; // 15 minutes
  });

  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [mistakes, setMistakes] = useState<{ mission: number; topic: string; note: string }[]>([]);
  const [badgeToast, setBadgeToast] = useState<Badge | null>(null);

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
    } catch (e) {
      // ignore
    }
  }, [studentName, currentMission, missionScores, timeRemainingSeconds]);

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

  const awardBadge = (missionNum: number) => {
    const targetBadge = badges.find((b) => b.missionNumber === missionNum);
    if (targetBadge && !targetBadge.earned) {
      setBadges((prev) =>
        prev.map((b) => (b.missionNumber === missionNum ? { ...b, earned: true } : b))
      );
      setBadgeToast(targetBadge);
      setTimeout(() => setBadgeToast(null), 4000);
    }
  };

  const handleStartGame = (name: string) => {
    setStudentName(name);
    setCurrentMission(1);
    setIsTimerRunning(true);
  };

  const handleCompleteMission1 = (score: number) => {
    setMissionScores((prev) => ({ ...prev, m1: score }));
    awardBadge(1);
    setCurrentMission(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteMission2 = (score: number) => {
    setMissionScores((prev) => ({ ...prev, m2: score }));
    awardBadge(2);
    setCurrentMission(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteMission3 = (score: number) => {
    setMissionScores((prev) => ({ ...prev, m3: score }));
    awardBadge(3);
    setCurrentMission(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteMission4 = (score: number) => {
    setMissionScores((prev) => ({ ...prev, m4: score }));
    awardBadge(4);
    setCurrentMission(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteMission5 = (score: number) => {
    setMissionScores((prev) => ({ ...prev, m5: score }));
    awardBadge(5);
    setIsTimerRunning(false);
    setCurrentMission(6); // Go to Summary & Certificate
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRecordMistake = (topic: string, note: string) => {
    setMistakes((prev) => [...prev, { mission: currentMission, topic, note }]);
  };

  const handleRestart = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {
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
      {/* Top Header Navbar */}
      <Navbar
        currentMission={currentMission}
        totalScore={totalScore}
        timeRemainingSeconds={timeRemainingSeconds}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        studentName={studentName}
        onRestart={handleRestart}
      />

      {/* Badge Award Toast Notification */}
      {badgeToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-950 to-blue-900 text-white p-4 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center gap-3.5 animate-bounce max-w-sm">
          <div className="text-3xl">{badgeToast.icon}</div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
              Badge Unlocked!
            </span>
            <p className="font-serif-lisbon font-bold text-sm text-white">
              {badgeToast.title}
            </p>
            <p className="text-[11px] text-blue-200 line-clamp-1">
              {badgeToast.description}
            </p>
          </div>
        </div>
      )}

      {/* Main Mission Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
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
            totalScore={totalScore}
            missionScores={missionScores}
            badges={badges}
            mistakes={mistakes}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Subtle Lisbon Gastronomy Footer */}
      <footer className="no-print mt-auto border-t border-slate-200/80 bg-white/70 py-4 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Portuguese Food Quest · Designed for Hungarian vocational students in hospitality, culinary arts & tourism (CEFR B1).
          </p>
          <p className="text-slate-400">
            Lisbon Restaurant Adventure · Educational Simulation
          </p>
        </div>
      </footer>
    </div>
  );
}
