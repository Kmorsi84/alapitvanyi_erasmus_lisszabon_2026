import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Award, Printer, RotateCcw, CheckCircle2, AlertCircle, Sparkles, Star } from 'lucide-react';
import { Badge } from '../types/game';

interface SummaryCertificateProps {
  studentName: string;
  totalScore: number;
  missionScores: {
    m1: number;
    m2: number;
    m3: number;
    m4: number;
    m5: number;
  };
  badges: Badge[];
  mistakes: { mission: number; topic: string; note: string }[];
  onRestart: () => void;
}

export function SummaryCertificate({
  studentName,
  totalScore,
  missionScores,
  badges,
  mistakes,
  onRestart,
}: SummaryCertificateProps) {
  const calculatedTotal =
    missionScores.m1 +
    missionScores.m2 +
    missionScores.m3 +
    missionScores.m4 +
    missionScores.m5;
  const scoreToDisplay = Math.max(totalScore, calculatedTotal);
  const percentage = Math.round((scoreToDisplay / 150) * 100);
  const certificateRef = useRef<HTMLDivElement>(null);

  // Trigger celebration confetti
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1e40af', '#f59e0b', '#10b981', '#3b82f6'],
    });
  }, []);

  // Determine feedback tier
  let feedbackTitle = '';
  let feedbackQuote = '';
  let achievementLevel = '';

  if (percentage >= 90) {
    feedbackTitle = 'Tier 1: Master Ambassador';
    feedbackQuote =
      'Outstanding! You are ready to welcome international guests in Lisbon.';
    achievementLevel = 'Distinction · Gastronomy Ambassador';
  } else if (percentage >= 75) {
    feedbackTitle = 'Tier 2: Hospitality Professional';
    feedbackQuote =
      'Great work! You know Portuguese food and use professional hospitality English well.';
    achievementLevel = 'Merit · Certified Portuguese Waiter';
  } else if (percentage >= 50) {
    feedbackTitle = 'Tier 3: Promising Apprentice';
    feedbackQuote =
      'Good progress! Review a few dishes and practise your restaurant expressions.';
    achievementLevel = 'Pass · Restaurant Service Trainee';
  } else {
    feedbackTitle = 'Tier 4: Culinary Explorer';
    feedbackQuote =
      'Keep practising! Explore the vocabulary cards again and improve your hospitality English.';
    achievementLevel = 'Participant · Culinary Foundations';
  }

  // Calculate strongest skill area
  const skillRatios = [
    { name: 'Culinary Vocabulary & Verbs', ratio: missionScores.m1 / 20 },
    { name: 'Market Ingredients & Recipe Composition', ratio: missionScores.m2 / 30 },
    { name: 'Menu Reading & Allergen Safety', ratio: missionScores.m3 / 30 },
    { name: 'Customer Service & Complaint Resolution', ratio: missionScores.m4 / 50 },
    { name: 'Visual Identification & Waiter Speaking', ratio: missionScores.m5 / 20 },
  ];

  skillRatios.sort((a, b) => b.ratio - a.ratio);
  const strongestSkill = skillRatios[0].name;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Results Banner (Hidden in Print) */}
      <div className="no-print bg-white rounded-2xl border border-blue-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Adventure Successfully Completed!
          </div>
          <h1 className="font-serif-lisbon font-bold text-3xl sm:text-4xl text-blue-950">
            Training Summary & Performance
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Review your vocational scores across Lisbon restaurant operations, customer service, and food safety.
          </p>
        </div>

        {/* Big Score Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-center space-y-1">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">
              Total Score
            </span>
            <div className="font-serif-lisbon font-bold text-3xl text-blue-950">
              {scoreToDisplay} <span className="text-base text-slate-500 font-normal">/ 150</span>
            </div>
            <span className="text-xs font-semibold text-blue-700">Points Earned</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-center space-y-1">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
              Percentage
            </span>
            <div className="font-serif-lisbon font-bold text-3xl text-amber-900">
              {percentage}%
            </div>
            <span className="text-xs font-semibold text-amber-700">{feedbackTitle}</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center space-y-1">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
              Strongest Competence
            </span>
            <div className="font-serif-lisbon font-bold text-sm text-emerald-950 line-clamp-2 pt-1">
              {strongestSkill}
            </div>
            <span className="text-xs font-semibold text-emerald-700">Highest Performance</span>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-center space-y-1">
            <span className="text-xs font-bold text-purple-900 uppercase tracking-wide">
              Badges Unlocked
            </span>
            <div className="font-serif-lisbon font-bold text-3xl text-purple-950">
              5 / 5
            </div>
            <span className="text-xs font-semibold text-purple-700">All Missions Done</span>
          </div>
        </div>

        {/* Manager's Official Feedback Tier Box */}
        <div className="p-5 rounded-xl border border-blue-300 bg-gradient-to-r from-blue-900 to-blue-950 text-white flex flex-col sm:flex-row items-center gap-5">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 shadow-md bg-amber-100">
            <img
              src="/assets/aistudio/manager_bernardo_26cd4c18.png"
              alt="Manager Bernardo"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-serif-lisbon font-bold text-base text-amber-300">
                Manager Bernardo's Evaluation:
              </span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-sm">CEFR B1 Level</span>
            </div>
            <p className="text-base sm:text-lg italic font-serif-lisbon text-white leading-relaxed">
              “{feedbackQuote}”
            </p>
          </div>
        </div>

        {/* Missions Score Breakdown Strip */}
        <div className="space-y-3">
          <h2 className="font-serif-lisbon font-bold text-blue-950 text-base">
            Mission-by-Mission Breakdown:
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-center space-y-0.5">
              <span className="text-slate-500 font-medium">M1: Vocabulary</span>
              <div className="font-bold text-sm text-slate-900">{missionScores.m1} / 20 pts</div>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-center space-y-0.5">
              <span className="text-slate-500 font-medium">M2: Market</span>
              <div className="font-bold text-sm text-slate-900">{missionScores.m2} / 30 pts</div>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-center space-y-0.5">
              <span className="text-slate-500 font-medium">M3: Menu</span>
              <div className="font-bold text-sm text-slate-900">{missionScores.m3} / 30 pts</div>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-center space-y-0.5">
              <span className="text-slate-500 font-medium">M4: Service</span>
              <div className="font-bold text-sm text-slate-900">{missionScores.m4} / 50 pts</div>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-center space-y-0.5">
              <span className="text-slate-500 font-medium">M5: Final</span>
              <div className="font-bold text-sm text-slate-900">{missionScores.m5} / 20 pts</div>
            </div>
          </div>
        </div>

        {/* Personalized Recommendations for Improvement */}
        {mistakes.length > 0 && (
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              Key Areas for Further Practice:
            </div>
            <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
              {mistakes.slice(0, 3).map((m, idx) => (
                <li key={idx}>
                  <strong className="text-amber-950">{m.topic}:</strong> {m.note}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Controls: Print Certificate & Restart Adventure */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            onClick={onRestart}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:text-blue-900 hover:bg-slate-100 font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Adventure</span>
          </button>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-serif-lisbon font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Print Official Certificate</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          OFFICIAL PRINTABLE / VIEWABLE CERTIFICATE OF ACHIEVEMENT
          ========================================================================= */}
      <div
        ref={certificateRef}
        className="certificate-container bg-white rounded-2xl sm:rounded-3xl border-4 sm:border-8 border-double border-blue-900 p-4 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden"
      >
        {/* Azulejo Corner Ornaments */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 w-8 h-8 sm:w-12 sm:h-12 border-t-2 sm:border-t-4 border-l-2 sm:border-l-4 border-amber-500 opacity-60" />
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-12 sm:h-12 border-t-2 sm:border-t-4 border-r-2 sm:border-r-4 border-amber-500 opacity-60" />
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-8 h-8 sm:w-12 sm:h-12 border-b-2 sm:border-b-4 border-l-2 sm:border-l-4 border-amber-500 opacity-60" />
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-8 h-8 sm:w-12 sm:h-12 border-b-2 sm:border-b-4 border-r-2 sm:border-r-4 border-amber-500 opacity-60" />

        <div className="text-center space-y-4 sm:space-y-6 max-w-3xl mx-auto">
          {/* Certificate Header Branding */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-amber-800 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500 shrink-0" />
              <span className="truncate">Erasmus+ Vocational Hospitality & Culinary Arts</span>
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500 shrink-0" />
            </div>

            <h2 className="font-serif-lisbon font-bold text-2xl sm:text-4xl md:text-5xl text-blue-950 tracking-tight">
              Certificate of Achievement
            </h2>
            <p className="font-serif-lisbon text-xs sm:text-base md:text-lg text-amber-800 font-semibold tracking-wide uppercase">
              Portuguese Gastronomy Ambassador
            </p>
          </div>

          {/* Certificate Body Text */}
          <div className="space-y-2 sm:space-y-3 py-1 sm:py-2">
            <p className="text-slate-600 text-xs sm:text-sm italic">
              This official certificate is proudly awarded to:
            </p>

            <div className="text-2xl sm:text-4xl md:text-5xl font-serif-lisbon font-bold text-blue-900 py-1 border-b-2 border-amber-400 inline-block px-4 sm:px-8 max-w-full truncate">
              {studentName}
            </div>

            <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto pt-1 sm:pt-2">
              for successfully completing the 15-minute vocational simulation in Lisbon, Portugal, demonstrating CEFR B1 professional English proficiency in Portuguese gastronomy, ingredients, customer service, and allergen safety.
            </p>
          </div>

          {/* Achievement Level & Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 border-y border-blue-100 bg-blue-50/50 rounded-xl px-3 sm:px-6">
            <div className="space-y-0.5">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                Score Attained
              </span>
              <p className="font-serif-lisbon font-bold text-lg sm:text-xl text-blue-950">
                {scoreToDisplay} / 150 pts ({percentage}%)
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                Evaluation Level
              </span>
              <p className="font-serif-lisbon font-bold text-xs sm:text-sm text-amber-800 pt-0.5 sm:pt-1">
                {achievementLevel}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                Date of Award
              </span>
              <p className="font-serif-lisbon font-bold text-xs sm:text-sm text-blue-950 pt-0.5 sm:pt-1">
                {currentDate}
              </p>
            </div>
          </div>

          {/* 5 Earned Badges Row */}
          <div className="pt-1 sm:pt-2 space-y-1.5 sm:space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Verified Badges Earned:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3">
              {[
                { name: 'Portuguese Food Explorer', icon: '🧭' },
                { name: 'Market Master', icon: '🧺' },
                { name: 'Menu Expert', icon: '📜' },
                { name: 'Excellent Waiter', icon: '🍽️' },
                { name: 'Gastronomy Ambassador', icon: '🏆' },
              ].map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-md bg-white border border-blue-200 text-[10px] sm:text-xs font-semibold text-blue-950 shadow-2xs"
                >
                  <span>{b.icon}</span>
                  <span className="truncate max-w-[140px] sm:max-w-none">{b.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Signatures Row */}
          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 border-t border-slate-200">
            <div className="text-center sm:text-left space-y-1">
              <div className="font-serif-lisbon font-bold text-sm text-slate-800 italic border-b border-slate-300 pb-1 w-44 sm:w-48 mx-auto sm:mx-0">
                Bernardo de Silva
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                Restaurant Director · Lisbon, Portugal
              </p>
            </div>

            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-amber-500/80 bg-amber-50 flex items-center justify-center text-amber-700 text-[10px] sm:text-xs font-serif font-bold text-center leading-tight shadow-xs">
              OFFICIAL
              <br />
              SEAL
            </div>

            <div className="text-center sm:text-right space-y-1">
              <div className="font-serif-lisbon font-bold text-sm text-slate-800 italic border-b border-slate-300 pb-1 w-44 sm:w-48 mx-auto sm:ml-auto">
                Erasmus+ Hospitality
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                Vocational Education & Training
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
