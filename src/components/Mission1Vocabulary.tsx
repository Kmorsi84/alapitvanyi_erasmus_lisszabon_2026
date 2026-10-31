import { useState } from 'react';
import { Volume2, RotateCw, CheckCircle2, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { DISHES } from '../data/dishes';
import { FoodImage } from './FoodImage';
import { ManagerDialogue } from './ManagerDialogue';
import { speakPortuguese, speakEnglish } from '../utils/speech';

interface Mission1Props {
  onComplete: (score: number) => void;
  soundEnabled: boolean;
}

export function Mission1Vocabulary({ onComplete, soundEnabled }: Mission1Props) {
  // Set of explored dish card IDs
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [exploredCards, setExploredCards] = useState<Set<string>>(new Set());

  // Quick Check state
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const toggleFlip = (dishId: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [dishId]: !prev[dishId],
    }));

    if (!exploredCards.has(dishId)) {
      setExploredCards((prev) => new Set([...prev, dishId]));
    }
  };

  const handlePlayPronunciation = (
    e: React.MouseEvent,
    portugueseName: string,
    englishSentence: string
  ) => {
    e.stopPropagation();
    if (!soundEnabled) return;
    speakPortuguese(portugueseName).then(() => {
      setTimeout(() => {
        speakEnglish(englishSentence);
      }, 500);
    });
  };

  // Quick check questions
  const q1Correct = q1Answer === 'bacalhau-a-bras';
  const q2Correct = q2Answer === 'caldo-verde';

  const cardExploreScore = Math.min(12, exploredCards.size);
  const quizScore = (q1Correct ? 4 : 0) + (q2Correct ? 4 : 0);
  const totalMissionScore = cardExploreScore + quizScore; // max 20

  const handleFinishMission = () => {
    setIsCompleted(true);
    onComplete(totalMissionScore);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Manager Guidance */}
      <ManagerDialogue
        message="Bem-vindo! As a waiter in Lisbon, you must know our dishes inside out. Click on each card to flip it, discover its cooking verbs and ingredients, and listen to authentic pronunciation. Explore all 12 dishes and answer the quick check to earn 20 points!"
        subtext="Tip: Click the speaker icon on any card to hear both the Portuguese dish name and the B1 English hospitality sentence."
      />

      {/* Explorer Progress Strip */}
      <div className="bg-white rounded-xl border border-blue-200/80 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center font-serif-lisbon font-bold text-blue-900">
            {exploredCards.size}/12
          </div>
          <div>
            <h2 className="font-serif-lisbon font-bold text-blue-950 text-sm">
              Dishes Explored
            </h2>
            <p className="text-xs text-slate-500">
              Flip all 12 cards to master your culinary English vocabulary.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
            Card Discovery: {cardExploreScore} / 12 pts
          </span>
          <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
            Quick Check: {quizScore} / 8 pts
          </span>
        </div>
      </div>

      {/* 12 Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {DISHES.map((dish) => {
          const isFlipped = !!flippedCards[dish.id];
          const hasBeenExplored = exploredCards.has(dish.id);

          return (
            <div
              key={dish.id}
              onClick={() => toggleFlip(dish.id)}
              className="group cursor-pointer perspective-1000 select-none"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleFlip(dish.id);
                }
              }}
              aria-label={`Vocabulary card for ${dish.portugueseName}`}
            >
              <div
                className={`relative w-full h-[385px] sm:h-[400px] rounded-xl transition-all duration-500 transform-style-3d shadow-sm hover:shadow-md border ${
                  hasBeenExplored ? 'border-blue-300' : 'border-slate-200'
                } bg-white flex flex-col`}
              >
                {!isFlipped ? (
                  /* FRONT OF CARD */
                  <div className="flex flex-col h-full overflow-hidden rounded-xl">
                    {/* Realistic Food Photography */}
                    <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100 isolate clip-fix">
                      <FoodImage
                        src={dish.imageUrl}
                        alt={dish.portugueseName}
                        category={dish.category}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                        <button
                          onClick={(e) =>
                            handlePlayPronunciation(e, dish.portugueseName, dish.exampleSentence)
                          }
                          className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white text-blue-900 shadow-sm border border-blue-200 flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                          title="Listen to Portuguese pronunciation & English sentence"
                          aria-label={`Play audio pronunciation for ${dish.portugueseName}`}
                        >
                          <Volume2 className="w-4 h-4 text-blue-700" />
                        </button>
                        {hasBeenExplored && (
                          <span className="p-1 rounded-full bg-emerald-100 text-emerald-800 shadow-xs">
                            <CheckCircle2 className="w-4 h-4" />
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[11px] font-medium text-white capitalize">
                        {dish.category}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="font-serif-lisbon font-bold text-blue-950 text-base group-hover:text-blue-800 transition-colors">
                          {dish.portugueseName}
                        </h3>
                        <p className="text-xs font-semibold text-amber-800 line-clamp-1">
                          {dish.englishName}
                        </p>
                        <p className="text-xs text-slate-600 line-clamp-2 pt-1 leading-relaxed">
                          {dish.shortDescription}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-700 font-medium">
                        <span className="flex items-center gap-1">
                          <RotateCw className="w-3.5 h-3.5" />
                          Click to flip & learn
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Ingredients & verbs
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* BACK OF CARD */
                  <div className="flex flex-col h-full p-4 overflow-y-auto bg-gradient-to-b from-blue-50/70 to-white rounded-xl">
                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-blue-200">
                      <div>
                        <h3 className="font-serif-lisbon font-bold text-blue-950 text-sm">
                          {dish.portugueseName}
                        </h3>
                        <p className="text-xs text-amber-800 font-medium">
                          {dish.englishName}
                        </p>
                      </div>
                      <button
                        onClick={(e) =>
                          handlePlayPronunciation(e, dish.portugueseName, dish.exampleSentence)
                        }
                        className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-900 transition-colors shrink-0"
                        title="Listen to audio"
                        aria-label={`Play audio pronunciation for ${dish.portugueseName}`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3 py-2 text-xs flex-1">
                      {/* Main Ingredients */}
                      <div>
                        <span className="font-semibold text-slate-900 block mb-0.5">
                          Key Ingredients:
                        </span>
                        <p className="text-slate-600 leading-snug">
                          {dish.mainIngredients.join(', ')}
                        </p>
                      </div>

                      {/* Cooking Verbs & Hospitality Expressions */}
                      <div>
                        <span className="font-semibold text-slate-900 block mb-0.5">
                          Hospitality Expressions:
                        </span>
                        <p className="text-blue-900 italic font-medium leading-snug">
                          {dish.hospitalityExpression}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dish.cookingVerbs.map((verb) => (
                            <span
                              key={verb}
                              className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-sm text-[10px] font-medium"
                            >
                              {verb}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Example Sentence */}
                      <div className="p-2 bg-amber-50/80 border border-amber-200/80 rounded-md">
                        <span className="font-semibold text-amber-900 block text-[11px] mb-0.5">
                          B1 Example Sentence:
                        </span>
                        <p className="text-slate-700 italic text-[11px] leading-relaxed">
                          "{dish.exampleSentence}"
                        </p>
                      </div>

                      {/* Fun Cultural Fact */}
                      <p className="text-[11px] text-slate-500 leading-snug border-t border-slate-100 pt-1">
                        <strong className="text-slate-700">Lisbon Story:</strong> {dish.funFact}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-blue-100 flex items-center justify-between text-xs text-blue-700">
                      <span className="flex items-center gap-1">
                        <RotateCw className="w-3.5 h-3.5" />
                        Click to see photo
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700">
                        Explored ✓
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Vocabulary Knowledge Check */}
      <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-blue-950">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="font-serif-lisbon font-bold text-lg">
            Quick Vocabulary Check (8 points)
          </h2>
        </div>
        <p className="text-sm text-slate-600">
          Test what you learned from the flashcards before heading to the market!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question 1 */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-3">
            <p className="font-semibold text-slate-900 text-sm">
              1. Which traditional dish is made with shredded salted cod, crispy matchstick potatoes, onions, and scrambled eggs?
            </p>
            <div className="space-y-2">
              {[
                { id: 'caldo-verde', label: 'Caldo Verde' },
                { id: 'bacalhau-a-bras', label: 'Bacalhau à Brás' },
                { id: 'pastel-de-nata', label: 'Pastel de Nata' },
                { id: 'francesinha', label: 'Francesinha' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setQ1Answer(opt.id)}
                  className={`w-full text-left px-3.5 py-2 rounded-lg text-sm transition-all border ${
                    q1Answer === opt.id
                      ? opt.id === 'bacalhau-a-bras'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-xs'
                        : 'bg-red-50 border-red-500 text-red-950 font-semibold shadow-xs'
                      : 'bg-white border-slate-200 hover:border-blue-400 text-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {q1Answer && (
              <p
                className={`text-xs p-2 rounded-md ${
                  q1Correct ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
                }`}
              >
                {q1Correct
                  ? 'Correct! Bacalhau à Brás was invented in Lisbon with shredded cod and straw potatoes.'
                  : 'Incorrect. Remember: Bacalhau means cod, and Brás uses straw potatoes and scrambled eggs!'}
              </p>
            )}
          </div>

          {/* Question 2 */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-3">
            <p className="font-semibold text-slate-900 text-sm">
              2. Which soup is made from pureed potatoes, thinly shredded dark kale, and smoked chouriço sausage?
            </p>
            <div className="space-y-2">
              {[
                { id: 'caldo-verde', label: 'Caldo Verde' },
                { id: 'arroz-de-marisco', label: 'Arroz de Marisco' },
                { id: 'polvo-a-lagareiro', label: 'Polvo à Lagareiro' },
                { id: 'bifana', label: 'Bifana' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setQ2Answer(opt.id)}
                  className={`w-full text-left px-3.5 py-2 rounded-lg text-sm transition-all border ${
                    q2Answer === opt.id
                      ? opt.id === 'caldo-verde'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-xs'
                        : 'bg-red-50 border-red-500 text-red-950 font-semibold shadow-xs'
                      : 'bg-white border-slate-200 hover:border-blue-400 text-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {q2Answer && (
              <p
                className={`text-xs p-2 rounded-md ${
                  q2Correct ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
                }`}
              >
                {q2Correct
                  ? 'Correct! Caldo Verde means "Green Soup", celebrated with kale and potato broth.'
                  : 'Incorrect. Caldo Verde is the famous green kale and potato soup.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Completion & Next Mission Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-blue-900 to-blue-950 text-white shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="font-serif-lisbon font-bold text-lg flex items-center gap-2 justify-center sm:justify-start">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Mission 1 Score: {totalMissionScore} / 20 points
          </h2>
          <p className="text-xs text-blue-200">
            {exploredCards.size >= 8
              ? 'Great exploration! You know Portuguese gastronomy fundamentals.'
              : 'You can explore more cards or proceed directly to the market.'}
          </p>
        </div>

        <button
          onClick={handleFinishMission}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-blue-950 font-serif-lisbon font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <span>Proceed to Mission 2: The Market</span>
          <ArrowRight className="w-4 h-4 text-blue-950" />
        </button>
      </div>
    </div>
  );
}
