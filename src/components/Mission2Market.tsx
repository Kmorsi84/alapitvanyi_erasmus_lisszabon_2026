import { useState, useMemo } from 'react';
import { ShoppingBasket, Check, AlertTriangle, ArrowRight, Sparkles, ChefHat, Trash2 } from 'lucide-react';
import { MARKET_INGREDIENTS, RECIPE_CHALLENGES } from '../data/market';
import { FoodImage } from './FoodImage';
import { ManagerDialogue } from './ManagerDialogue';

interface Mission2Props {
  onComplete: (score: number) => void;
  onRecordMistake: (topic: string, note: string) => void;
}

export function Mission2Market({ onComplete, onRecordMistake }: Mission2Props) {
  // Randomly select 3 recipe challenges from bank
  const selectedChallenges = useMemo(() => {
    const shuffled = [...RECIPE_CHALLENGES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, []);

  const [challengeIndex, setChallengeIndex] = useState(0);
  const [basket, setBasket] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);
  const [earnedScores, setEarnedScores] = useState<number[]>([0, 0, 0]);

  const currentChallenge = selectedChallenges[challengeIndex];
  const requiredCount = currentChallenge.requiredIngredientIds.length;

  const handleToggleIngredient = (ingredientId: string) => {
    if (completedChallenges.includes(challengeIndex)) return;

    if (basket.includes(ingredientId)) {
      setBasket((prev) => prev.filter((id) => id !== ingredientId));
      setFeedback(null);
    } else {
      if (basket.length >= requiredCount + 2) {
        setFeedback({
          type: 'info',
          message: `Your basket is quite full! You only need ${requiredCount} core ingredients for ${currentChallenge.dishName}.`,
        });
        return;
      }
      setBasket((prev) => [...prev, ingredientId]);
      setFeedback(null);
    }
  };

  const handleCheckBasket = () => {
    const required = currentChallenge.requiredIngredientIds;
    const isExactMatch =
      required.length === basket.length &&
      required.every((id) => basket.includes(id));

    const correctInBasket = basket.filter((id) => required.includes(id));
    const incorrectInBasket = basket.filter((id) => !required.includes(id));

    if (isExactMatch) {
      // 10 points for perfect recipe basket
      const newScores = [...earnedScores];
      newScores[challengeIndex] = 10;
      setEarnedScores(newScores);
      setCompletedChallenges((prev) => [...prev, challengeIndex]);

      setFeedback({
        type: 'success',
        message: `Parabéns! You selected all ${required.length} correct ingredients for ${currentChallenge.dishName}! Chef Marco is thrilled.`,
      });
    } else {
      // Analyze mistakes
      let note = '';
      if (incorrectInBasket.length > 0) {
        const wrongId = incorrectInBasket[0];
        const explanation =
          currentChallenge.feedbackNotes[wrongId] ||
          'That ingredient does not belong in this classic recipe.';
        note = explanation;
        onRecordMistake(currentChallenge.dishName, explanation);
      } else if (correctInBasket.length < required.length) {
        const missingCount = required.length - correctInBasket.length;
        note = `You are still missing ${missingCount} key ingredient(s) for ${currentChallenge.dishName}. Look at the market stalls again!`;
      }

      // Partial points: 2 points per correct item minus 1 per wrong item, minimum 2
      const partialScore = Math.max(
        2,
        Math.min(8, correctInBasket.length * 2.5 - incorrectInBasket.length * 2)
      );
      const newScores = [...earnedScores];
      newScores[challengeIndex] = Math.round(partialScore);
      setEarnedScores(newScores);

      setFeedback({
        type: 'error',
        message: note,
      });
    }
  };

  const handleNextChallenge = () => {
    if (challengeIndex < 2) {
      setChallengeIndex((prev) => prev + 1);
      setBasket([]);
      setFeedback(null);
    } else {
      // Finish Mission 2
      const finalScore = earnedScores.reduce((a, b) => a + b, 0);
      onComplete(finalScore);
    }
  };

  const handleClearBasket = () => {
    setBasket([]);
    setFeedback(null);
  };

  const totalMissionScore = earnedScores.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      {/* Manager Guidance */}
      <ManagerDialogue
        message={`Welcome to Mercado da Ribeira! Chef Marco needs authentic ingredients for today's menu. Recipe ${challengeIndex + 1} of 3: "${currentChallenge.dishName}". Click the market stalls to place the exact ${requiredCount} ingredients into your shopping basket!`}
        subtext="Tip: Look carefully at the stall names and descriptions. Each correct recipe challenge earns 10 points (30 points total)."
      />

      {/* Chef's Order Ticket & Shopping Basket Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chef's Request Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-blue-200 p-5 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-emerald-400 shadow-md overflow-hidden shrink-0 bg-emerald-100">
                <img
                  src="/assets/aistudio/chef_marco_portrait.jpg"
                  alt="Chef Marco"
                  className="w-full h-full object-cover object-top"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] shadow">
                  👨‍🍳
                </span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-700 font-bold block">
                  Chef Marco's Kitchen Request · Recipe {challengeIndex + 1}/3
                </span>
                <h2 className="font-serif-lisbon font-bold text-blue-950 text-xl">
                  {currentChallenge.dishName}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-md">
                Need: {requiredCount} ingredients
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-md">
                In Basket: {basket.length}
              </span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-lg text-emerald-950 text-sm italic">
            "{currentChallenge.chefQuote}"
          </div>

          {/* Feedback message banner */}
          {feedback && (
            <div
              className={`p-3 rounded-lg text-sm flex items-start gap-2.5 ${
                feedback.type === 'success'
                  ? 'bg-emerald-100/90 text-emerald-900 border border-emerald-300'
                  : feedback.type === 'error'
                  ? 'bg-red-50 text-red-900 border border-red-200'
                  : 'bg-blue-50 text-blue-900 border border-blue-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <Check className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium">{feedback.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Current Shopping Basket */}
        <div className="bg-amber-50/60 rounded-xl border border-amber-200/90 p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200">
              <div className="flex items-center gap-2 text-amber-900 font-serif-lisbon font-bold text-sm">
                <ShoppingBasket className="w-5 h-5 text-amber-700" />
                <span>Shopping Basket</span>
              </div>
              {basket.length > 0 && !completedChallenges.includes(challengeIndex) && (
                <button
                  onClick={handleClearBasket}
                  className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                  title="Empty basket"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>

            {basket.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-6 text-center">
                Your basket is empty. Click ingredients from the market stalls below to add them.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {basket.map((id) => {
                  const ing = MARKET_INGREDIENTS.find((i) => i.id === id);
                  if (!ing) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between p-2 rounded-md bg-white border border-amber-200 text-xs shadow-2xs"
                    >
                      <span className="font-semibold text-slate-800">{ing.name}</span>
                      <span className="text-[11px] text-amber-800 italic">
                        {ing.portugueseName}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-amber-200/80 space-y-2">
            {!completedChallenges.includes(challengeIndex) ? (
              <button
                onClick={handleCheckBasket}
                disabled={basket.length === 0}
                className={`w-full py-2.5 rounded-lg font-serif-lisbon font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${
                  basket.length === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-98'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Submit Ingredients to Chef</span>
              </button>
            ) : (
              <button
                onClick={handleNextChallenge}
                className="w-full py-2.5 rounded-lg font-serif-lisbon font-bold text-sm bg-blue-900 hover:bg-blue-800 text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>
                  {challengeIndex < 2 ? 'Next Market Challenge' : 'Complete Market Mission'}
                </span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Market Stalls Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-serif-lisbon font-bold text-blue-950 text-base">
            Mercado da Ribeira Market Stalls
          </h2>
          <span className="text-xs text-slate-500">
            Click an ingredient to add or remove it from your basket
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {MARKET_INGREDIENTS.map((item) => {
            const inBasket = basket.includes(item.id);
            const isCompletedCurrent = completedChallenges.includes(challengeIndex);
            const isCorrectAnswer =
              isCompletedCurrent && currentChallenge.requiredIngredientIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => handleToggleIngredient(item.id)}
                className={`group relative rounded-xl border p-2 flex flex-col justify-between cursor-pointer transition-all select-none ${
                  inBasket
                    ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-400/50 shadow-md scale-102'
                    : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-sm'
                } ${isCorrectAnswer ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400' : ''}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggleIngredient(item.id);
                  }
                }}
              >
                <div className="relative h-24 w-full rounded-lg overflow-hidden mb-2 bg-slate-100 isolate clip-fix">
                  <FoodImage
                    src={item.imageUrl}
                    alt={item.name}
                    category={item.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {inBasket && (
                    <div className="absolute top-1.5 right-1.5 bg-amber-500 text-blue-950 rounded-full p-1 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="space-y-0.5 text-center">
                  <h3 className="font-serif-lisbon font-bold text-xs text-slate-900 group-hover:text-blue-900 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-amber-800 italic line-clamp-1">
                    {item.portugueseName}
                  </p>
                  <span className="inline-block text-[10px] text-slate-400 capitalize">
                    {item.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary Strip */}
      <div className="p-4 bg-white rounded-xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="font-serif-lisbon font-bold text-sm text-blue-950">
            Market Progress: {completedChallenges.length}/3 Challenges Completed · Score: {totalMissionScore}/30 pts
          </span>
        </div>

        {completedChallenges.length === 3 && (
          <button
            onClick={() => onComplete(totalMissionScore)}
            className="px-6 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-serif-lisbon font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Proceed to Mission 3: Restaurant Menu</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        )}
      </div>

      {/* Sticky Mobile/Tablet Basket Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-blue-200 p-3 shadow-2xl flex items-center justify-between gap-3 safe-area-bottom">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 shrink-0">
            <ShoppingBasket className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-blue-950 truncate">
              {currentChallenge.dishName}
            </p>
            <p className="text-[10px] text-amber-800 font-semibold">
              Basket: {basket.length}/{requiredCount} items
            </p>
          </div>
        </div>

        <div className="shrink-0">
          {!completedChallenges.includes(challengeIndex) ? (
            <button
              onClick={handleCheckBasket}
              disabled={basket.length === 0}
              className={`px-4 py-2 rounded-lg font-serif-lisbon font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                basket.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Submit ({basket.length})</span>
            </button>
          ) : (
            <button
              onClick={handleNextChallenge}
              className="px-4 py-2 rounded-lg font-serif-lisbon font-bold text-xs bg-blue-900 hover:bg-blue-800 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>{challengeIndex < 2 ? 'Next Challenge' : 'Complete Mission'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
