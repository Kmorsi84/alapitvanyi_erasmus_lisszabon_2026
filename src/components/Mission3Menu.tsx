import { useState, useMemo } from 'react';
import { Utensils, AlertCircle, CheckCircle2, ArrowRight, Sparkles, ShieldAlert, BookOpen, Coffee } from 'lucide-react';
import { RESTAURANT_MENU, MENU_QUESTS } from '../data/menu';
import { FoodImage } from './FoodImage';
import { ManagerDialogue } from './ManagerDialogue';

interface Mission3Props {
  onComplete: (score: number) => void;
  onRecordMistake: (topic: string, note: string) => void;
}

export function Mission3Menu({ onComplete, onRecordMistake }: Mission3Props) {
  // Randomise order of quest choices for pedagogical rigor
  const quests = useMemo(() => {
    return MENU_QUESTS.map((quest) => ({
      ...quest,
      shuffledOptions: [...quest.options].sort(() => 0.5 - Math.random()),
    }));
  }, []);

  const [activeTab, setActiveTab] = useState<'all' | 'starter' | 'soup' | 'main' | 'dessert' | 'drink'>('all');
  const [currentQuestIndex, setCurrentQuestIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, { isCorrect: boolean; explanation: string }>>({});
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuest = quests[currentQuestIndex];

  const filteredMenuItems = useMemo(() => {
    if (activeTab === 'all') return RESTAURANT_MENU;
    return RESTAURANT_MENU.filter((item) => item.category === activeTab);
  }, [activeTab]);

  const handleSelectOption = (optionId: string) => {
    if (showExplanation) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || showExplanation) return;

    const chosenOption = currentQuest.shuffledOptions.find((o) => o.id === selectedOptionId);
    if (!chosenOption) return;

    const isCorrect = chosenOption.isCorrect;
    if (isCorrect) {
      setScore((prev) => prev + 5);
    } else {
      onRecordMistake('Restaurant Menu & Allergens', chosenOption.explanation);
    }

    setAnswers((prev) => ({
      ...prev,
      [currentQuest.id]: {
        isCorrect,
        explanation: chosenOption.explanation,
      },
    }));

    setShowExplanation(true);
  };

  const handleNextQuest = () => {
    if (currentQuestIndex < quests.length - 1) {
      setCurrentQuestIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setShowExplanation(false);
    } else {
      onComplete(score);
    }
  };

  const isLastQuest = currentQuestIndex === quests.length - 1;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Manager Guidance */}
      <ManagerDialogue
        message="Now you are on the restaurant floor! International guests need recommendations, wine pairings, and critical allergen advice. Use our restaurant menu below to check ingredients, and always remember: never guess on food allergies—verify with the kitchen!"
        subtext="Professional hospitality phrases: 'May I recommend...?', 'This dish is made with...', 'Let me check with the chef.'"
      />

      {/* Main Split: Guest Request vs Interactive Menu */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customer Quest Box (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-blue-200 p-5 shadow-sm space-y-5 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Customer Inquiry {currentQuestIndex + 1} of {quests.length}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-900 border border-blue-200 rounded-md">
              Score: {score} / 30 pts
            </span>
          </div>

          {/* Guest Dialogue Bubble */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-gradient-to-r from-amber-50/70 to-orange-50/50 border border-amber-200/80">
            <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-amber-300 flex items-center justify-center text-2xl shrink-0">
              {currentQuest.guestAvatar}
            </div>
            <div className="space-y-1">
              <span className="font-serif-lisbon font-bold text-sm text-blue-950 block">
                {currentQuest.guestName}
              </span>
              <p className="text-slate-800 text-sm italic leading-relaxed">
                "{currentQuest.guestQuote}"
              </p>
            </div>
          </div>

          {/* Task Question */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
              {currentQuest.question}
            </label>

            {/* Response Options */}
            <div className="space-y-2.5">
              {currentQuest.shuffledOptions.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let optionStyle =
                  'bg-white border-slate-200 hover:border-blue-400 text-slate-800';

                if (showExplanation) {
                  if (opt.isCorrect) {
                    optionStyle =
                      'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-400';
                  } else if (isSelected && !opt.isCorrect) {
                    optionStyle =
                      'bg-red-50 border-red-500 text-red-950 font-medium ring-1 ring-red-400';
                  } else {
                    optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle =
                    'bg-blue-50 border-blue-600 text-blue-950 font-semibold ring-1 ring-blue-500';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={showExplanation}
                    className={`w-full text-left p-3.5 rounded-lg border text-sm transition-all flex items-start gap-2.5 cursor-pointer leading-snug ${optionStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs shrink-0 mt-0.5">
                      {showExplanation && opt.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : showExplanation && isSelected ? (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      ) : null}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Immediate Feedback Banner */}
          {showExplanation && answers[currentQuest.id] && (
            <div
              className={`p-3.5 rounded-lg text-xs leading-relaxed space-y-1 ${
                answers[currentQuest.id].isCorrect
                  ? 'bg-emerald-100/90 text-emerald-950 border border-emerald-300'
                  : 'bg-red-50 text-red-950 border border-red-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                {answers[currentQuest.id].isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                )}
                <span>
                  {answers[currentQuest.id].isCorrect ? 'Professional Choice!' : 'Important Learning Point:'}
                </span>
              </div>
              <p>{answers[currentQuest.id].explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div>
            {!showExplanation ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOptionId}
                className={`w-full py-2.5 rounded-lg font-serif-lisbon font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${
                  !selectedOptionId
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-900 hover:bg-blue-800 text-white cursor-pointer active:scale-98'
                }`}
              >
                <span>Confirm Response to Guest</span>
              </button>
            ) : (
              <button
                onClick={handleNextQuest}
                className="w-full py-2.5 rounded-lg font-serif-lisbon font-bold text-sm bg-amber-500 hover:bg-amber-400 text-blue-950 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>{isLastQuest ? 'Complete Menu Mission' : 'Next Guest Inquiry'}</span>
                <ArrowRight className="w-4 h-4 text-blue-950" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Restaurant Menu Display (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-blue-200/90 shadow-sm overflow-hidden flex flex-col">
          {/* Menu Header with Azulejo Border Motif */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white border-b border-blue-800">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="space-y-0.5">
                <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-widest block">
                  Restaurante Miradouro do Tejo · Lisboa
                </span>
                <h3 className="font-serif-lisbon font-bold text-xl sm:text-2xl text-white">
                  Menu Gastronómico
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-blue-200 italic block">
                  *Fictional Educational Prices
                </span>
                <span className="text-xs text-amber-300 font-medium">
                  Verified EU Allergens Listed
                </span>
              </div>
            </div>

            {/* Menu Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-4 no-scrollbar">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'starter', label: 'Starters (Petiscos)' },
                { id: 'soup', label: 'Soups (Sopas)' },
                { id: 'main', label: 'Mains (Pratos)' },
                { id: 'dessert', label: 'Desserts (Doces)' },
                { id: 'drink', label: 'Drinks (Bebidas)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-amber-400 text-blue-950 font-bold shadow-xs'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items List */}
          <div className="p-4 sm:p-5 space-y-4 max-h-[640px] overflow-y-auto">
            {filteredMenuItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 hover:bg-white transition-all shadow-2xs"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                  <FoodImage
                    src={item.imageUrl}
                    alt={item.portugueseName}
                    category={item.category}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="font-serif-lisbon font-bold text-sm text-blue-950">
                      {item.portugueseName}
                    </h4>
                    <span className="font-mono font-bold text-sm text-amber-800">
                      €{item.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Allergen & Dietary Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {item.allergens.length > 0 ? (
                      item.allergens.map((alg) => (
                        <span
                          key={alg}
                          className="px-2 py-0.5 rounded-sm bg-red-50 text-red-700 border border-red-200 text-[10px] font-semibold"
                        >
                          ⚠️ {alg}
                        </span>
                      ))
                    ) : (
                      <span className="px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium">
                        ✓ No common allergens
                      </span>
                    )}

                    {item.isVegetarian && (
                      <span className="px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-900 text-[10px] font-semibold">
                        🌱 Vegetarian
                      </span>
                    )}

                    {item.pairingNote && (
                      <span className="text-[10px] text-amber-800 italic block w-full mt-0.5">
                        Note: {item.pairingNote}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
