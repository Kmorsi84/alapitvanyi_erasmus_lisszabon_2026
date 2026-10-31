import { useState, useMemo } from 'react';
import { MessageSquare, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Smile, Frown, HelpCircle, Heart } from 'lucide-react';
import { SERVICE_SCENARIOS } from '../data/service';
import { ManagerDialogue } from './ManagerDialogue';

interface Mission4Props {
  onComplete: (score: number) => void;
  onRecordMistake: (topic: string, note: string) => void;
}

export function Mission4Service({ onComplete, onRecordMistake }: Mission4Props) {
  // Select 7 randomized scenarios from bank
  const activeScenarios = useMemo(() => {
    const shuffled = [...SERVICE_SCENARIOS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 7).map((scenario) => ({
      ...scenario,
      shuffledOptions: [...scenario.options].sort(() => 0.5 - Math.random()),
    }));
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [scenarioResults, setScenarioResults] = useState<
    { scenarioId: string; isCorrect: boolean; pointsEarned: number }[]
  >([]);
  const [customerMood, setCustomerMood] = useState<'neutral' | 'happy' | 'unhappy' | 'relieved'>('neutral');

  const currentScenario = activeScenarios[currentIndex];
  const pointsForThisScenario = currentIndex === activeScenarios.length - 1 ? 8 : 7;

  const handleSelectOption = (optionId: string) => {
    if (showFeedback) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmitResponse = () => {
    if (!selectedOptionId || showFeedback) return;

    const chosenOption = currentScenario.shuffledOptions.find((o) => o.id === selectedOptionId);
    if (!chosenOption) return;

    const isCorrect = chosenOption.isCorrect;
    const points = isCorrect ? pointsForThisScenario : 0;

    if (isCorrect) {
      setCustomerMood('happy');
    } else {
      setCustomerMood('unhappy');
      onRecordMistake(`Service: ${currentScenario.situationType}`, chosenOption.explanation);
    }

    setScenarioResults((prev) => [
      ...prev,
      { scenarioId: currentScenario.id, isCorrect, pointsEarned: points },
    ]);

    setShowFeedback(true);
  };

  const handleNextScenario = () => {
    if (currentIndex < activeScenarios.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setShowFeedback(false);
      setCustomerMood('neutral');
    } else {
      const finalTotal = scenarioResults.reduce((sum, r) => sum + r.pointsEarned, 0);
      onComplete(finalTotal);
    }
  };

  const totalScore = scenarioResults.reduce((sum, r) => sum + r.pointsEarned, 0);
  const isLastScenario = currentIndex === activeScenarios.length - 1;

  const chosenOption = currentScenario.shuffledOptions.find((o) => o.id === selectedOptionId);

  return (
    <div className="space-y-6 pb-12">
      {/* Manager Guidance */}
      <ManagerDialogue
        message="Now you are in the dining room with real international guests. Read their speech bubbles carefully, observe their expressions, and choose the most professional CEFR B1 hospitality response. Watch how your reply transforms their dining experience!"
        subtext="Tips: Always listen patiently, apologise politely for mistakes, and offer constructive solutions."
      />

      {/* Role-Play Stage Container */}
      <div className="bg-white rounded-2xl border border-blue-200/90 shadow-md overflow-hidden">
        {/* Restaurant Dining Room Background & Atmosphere Header */}
        <div className="relative bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 p-4 sm:p-6 lg:p-8 text-white flex flex-col justify-between overflow-hidden">
          {/* Subtle Tagus River & Table ambiance backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

          {/* Top Bar: Situation Tracker & Mood Indicator */}
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-2 pb-3 sm:pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-blue-500/20 text-blue-300 text-[11px] sm:text-xs font-semibold uppercase tracking-wider border border-blue-400/30">
                Table Role-Play {currentIndex + 1} of {activeScenarios.length}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-300 capitalize truncate max-w-[150px] sm:max-w-none">
                {currentScenario.situationType.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-md">
                Service: {totalScore} / 50 pts
              </span>
            </div>
          </div>

          {/* Customer at the Table Simulation */}
          <div className="relative z-10 flex items-start gap-3 sm:gap-6 pt-3 sm:pt-4">
            {/* Customer Character Avatar with Reaction Mood */}
            <div className="relative shrink-0 flex flex-col items-center">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 border-2 overflow-hidden relative ${
                  customerMood === 'happy'
                    ? 'bg-emerald-100 border-emerald-400 ring-4 ring-emerald-300/40 scale-105'
                    : customerMood === 'unhappy'
                    ? 'bg-red-100 border-red-400 ring-4 ring-red-300/40'
                    : 'bg-amber-100 border-amber-300'
                }`}
              >
                {currentScenario.avatarUrl ? (
                  <img
                    src={currentScenario.avatarUrl}
                    alt={currentScenario.customerName}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl md:text-4xl">
                    {customerMood === 'happy'
                      ? '😊'
                      : customerMood === 'unhappy'
                      ? '😟'
                      : currentScenario.customerMood === 'unhappy'
                      ? '😠'
                      : '🧑‍💼'}
                  </span>
                )}
              </div>

              {/* Mood reaction badge when photo is displayed */}
              {currentScenario.avatarUrl && (
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-xs">
                  {customerMood === 'happy'
                    ? '😊'
                    : customerMood === 'unhappy'
                    ? '😟'
                    : currentScenario.customerMood === 'unhappy'
                    ? '😠'
                    : '💬'}
                </span>
              )}

              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-200 mt-1 text-center line-clamp-1 max-w-[80px] sm:max-w-[100px]">
                {currentScenario.customerName}
              </span>
            </div>

            {/* Customer Speech Bubble */}
            <div className="flex-1 relative bg-white text-slate-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xl border border-blue-100 space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-blue-900">
                  {currentScenario.customerName}
                </span>
                <span className="italic text-[11px] sm:text-xs">{currentScenario.context}</span>
              </div>
              <p className="text-sm sm:text-base md:text-lg font-serif-lisbon text-blue-950 font-bold leading-relaxed">
                "{currentScenario.customerQuote}"
              </p>
            </div>
          </div>
        </div>

        {/* Waiter Response Selection Deck */}
        <div className="p-6 sm:p-8 space-y-5 bg-slate-50/50">
          <div>
            <h3 className="font-serif-lisbon font-bold text-blue-950 text-base mb-1">
              Choose the Most Professional B1 English Response:
            </h3>
            <p className="text-xs text-slate-500">
              Select the response that demonstrates genuine hospitality, courtesy, and effective problem-solving.
            </p>
          </div>

          {/* 4 Response Alternatives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {currentScenario.shuffledOptions.map((opt, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx];
              const isSelected = selectedOptionId === opt.id;

              let cardStyle =
                'bg-white border-slate-200 hover:border-blue-400 text-slate-800 shadow-2xs';

              if (showFeedback) {
                if (opt.isCorrect) {
                  cardStyle =
                    'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-2 ring-emerald-400 shadow-sm';
                } else if (isSelected && !opt.isCorrect) {
                  cardStyle =
                    'bg-red-50 border-red-500 text-red-950 font-medium ring-2 ring-red-400 shadow-sm';
                } else {
                  cardStyle = 'bg-white border-slate-200 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                cardStyle =
                  'bg-blue-50 border-blue-600 text-blue-950 font-semibold ring-2 ring-blue-500 shadow-sm';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={showFeedback}
                  className={`text-left p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer text-sm leading-relaxed ${cardStyle}`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${
                      isSelected
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="flex-1">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Manager Explanation / Feedback Callout */}
          {showFeedback && chosenOption && (
            <div
              className={`p-4 rounded-xl text-sm leading-relaxed flex items-start gap-3 ${
                chosenOption.isCorrect
                  ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                  : 'bg-amber-100 text-amber-950 border border-amber-300'
              }`}
            >
              {chosenOption.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="font-serif-lisbon font-bold block">
                  {chosenOption.isCorrect
                    ? 'Excellent! A professional waiter apologises politely and offers a solution.'
                    : 'Customer Service Coaching:'}
                </span>
                <p>{chosenOption.explanation}</p>
              </div>
            </div>
          )}

          {/* Bottom Action Button */}
          <div className="pt-2 flex justify-end">
            {!showFeedback ? (
              <button
                onClick={handleSubmitResponse}
                disabled={!selectedOptionId}
                className={`px-8 py-3 rounded-xl font-serif-lisbon font-bold text-sm shadow-md transition-all flex items-center gap-2 ${
                  !selectedOptionId
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-900 hover:bg-blue-800 text-white cursor-pointer active:scale-98'
                }`}
              >
                <span>Say This to Customer</span>
              </button>
            ) : (
              <button
                onClick={handleNextScenario}
                className="px-8 py-3 rounded-xl font-serif-lisbon font-bold text-sm bg-amber-500 hover:bg-amber-400 text-blue-950 shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>
                  {isLastScenario ? 'Complete Service Mission' : 'Serve Next Guest'}
                </span>
                <ArrowRight className="w-4 h-4 text-blue-950" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
