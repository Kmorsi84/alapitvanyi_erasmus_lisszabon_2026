import { useState, useMemo } from 'react';
import { Volume2, CheckCircle2, Mic, MicOff, Sparkles, ArrowRight, Eye, RefreshCw, Award } from 'lucide-react';
import { DISHES } from '../data/dishes';
import { FoodImage } from './FoodImage';
import { ManagerDialogue } from './ManagerDialogue';
import { speakEnglish } from '../utils/speech';

interface Mission5Props {
  onComplete: (score: number) => void;
  soundEnabled: boolean;
}

export function Mission5Final({ onComplete, soundEnabled }: Mission5Props) {
  // Select 6 dishes for matching game
  const sixDishes = useMemo(() => {
    const shuffled = [...DISHES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  }, []);

  // Shuffled photos and shuffled names independently
  const photoCards = useMemo(() => {
    return [...sixDishes].sort(() => 0.5 - Math.random());
  }, [sixDishes]);

  const nameCards = useMemo(() => {
    return [...sixDishes].sort(() => 0.5 - Math.random());
  }, [sixDishes]);

  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [selectedNameId, setSelectedNameId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongMatch, setWrongMatch] = useState<boolean>(false);

  // Speaking task state
  const [isRecording, setIsRecording] = useState(false);
  const [speakingSeconds, setSpeakingSeconds] = useState(0);
  const [hasAttemptedSpeaking, setHasAttemptedSpeaking] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [checklist, setChecklist] = useState({
    recommendedMain: false,
    namedIngredients: false,
    recommendedDessert: false,
    clearIntonation: false,
  });

  // Handle matching interaction
  const handleSelectPhoto = (dishId: string) => {
    if (matchedIds.includes(dishId)) return;
    setWrongMatch(false);

    if (selectedNameId) {
      if (selectedNameId === dishId) {
        setMatchedIds((prev) => [...prev, dishId]);
        setSelectedPhotoId(null);
        setSelectedNameId(null);
      } else {
        setWrongMatch(true);
        setTimeout(() => {
          setSelectedPhotoId(null);
          setSelectedNameId(null);
          setWrongMatch(false);
        }, 800);
      }
    } else {
      setSelectedPhotoId(dishId);
    }
  };

  const handleSelectName = (dishId: string) => {
    if (matchedIds.includes(dishId)) return;
    setWrongMatch(false);

    if (selectedPhotoId) {
      if (selectedPhotoId === dishId) {
        setMatchedIds((prev) => [...prev, dishId]);
        setSelectedPhotoId(null);
        setSelectedNameId(null);
      } else {
        setWrongMatch(true);
        setTimeout(() => {
          setSelectedPhotoId(null);
          setSelectedNameId(null);
          setWrongMatch(false);
        }, 800);
      }
    } else {
      setSelectedNameId(dishId);
    }
  };

  // Speaking simulation timer
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setSpeakingSeconds(0);
      const interval = setInterval(() => {
        setSpeakingSeconds((s) => {
          if (s >= 20) {
            clearInterval(interval);
            setIsRecording(false);
            setHasAttemptedSpeaking(true);
            return 20;
          }
          return s + 1;
        });
      }, 1000);
    } else {
      setIsRecording(false);
      setHasAttemptedSpeaking(true);
    }
  };

  const handlePlayModelAudio = () => {
    if (!soundEnabled) return;
    speakEnglish(
      'I recommend Bacalhau à Brás. It is a traditional Portuguese dish made with cod, potatoes and eggs. For dessert, you should try pastel de nata. It is a delicious custard tart.'
    );
  };

  const matchingScore = matchedIds.length * 2; // 6 * 2 = 12 points
  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const speakingScore = (hasAttemptedSpeaking ? 4 : 0) + (showModelAnswer ? 2 : 0) + (checkedCount >= 3 ? 2 : 0); // 8 points
  const totalMissionScore = matchingScore + speakingScore; // 20 points total

  const isMatchingComplete = matchedIds.length === 6;

  return (
    <div className="space-y-6 pb-12">
      {/* Manager Guidance */}
      <ManagerDialogue
        message="Final Mission! Prove you are a true Portuguese Gastronomy Ambassador. First, match the 6 photorealistic dishes with their Portuguese names. Then, practise your spoken recommendation task for international guests!"
        subtext="Matching task: 12 points. Speaking recommendation & self-evaluation: 8 points (20 points total)."
      />

      {/* Part 1: Visual Matching Game */}
      <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="font-serif-lisbon font-bold text-lg text-blue-950">
              Part 1: Visual Dish Matching Game
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-md">
            Matches: {matchedIds.length} / 6 · Score: {matchingScore} / 12 pts
          </span>
        </div>

        <p className="text-sm text-slate-600">
          Touch or click a food photograph, then click its corresponding Portuguese name (or vice versa) to connect them.
        </p>

        {wrongMatch && (
          <div className="p-2.5 rounded-lg bg-red-100 text-red-900 text-xs font-medium text-center animate-shake">
            Not quite a match! Try again.
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:gap-6 items-start">
          {/* Photos Column */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Dish Photograph:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
              {photoCards.map((dish) => {
                const isMatched = matchedIds.includes(dish.id);
                const isSelected = selectedPhotoId === dish.id;

                return (
                  <div
                    key={`photo-${dish.id}`}
                    onClick={() => handleSelectPhoto(dish.id)}
                    className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all h-20 sm:h-28 isolate clip-fix ${
                      isMatched
                        ? 'border-emerald-500 opacity-60 cursor-default ring-2 ring-emerald-300'
                        : isSelected
                        ? 'border-blue-600 ring-4 ring-blue-300 scale-102 shadow-md'
                        : 'border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    <FoodImage
                      src={dish.imageUrl}
                      alt={dish.portugueseName}
                      category={dish.category}
                      className="w-full h-full object-cover"
                    />
                    {isMatched && (
                      <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-md" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Names Column */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Portuguese Name:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              {nameCards.map((dish) => {
                const isMatched = matchedIds.includes(dish.id);
                const isSelected = selectedNameId === dish.id;

                return (
                  <button
                    key={`name-${dish.id}`}
                    onClick={() => handleSelectName(dish.id)}
                    disabled={isMatched}
                    className={`p-2 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 sm:gap-2 h-20 sm:h-auto ${
                      isMatched
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold cursor-default'
                        : isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold ring-2 ring-blue-400'
                        : 'bg-slate-50 border-slate-200 hover:border-blue-400 text-slate-800'
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="font-serif-lisbon font-bold text-xs sm:text-sm block truncate">
                        {dish.portugueseName}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-amber-800 italic block line-clamp-1">
                        {dish.englishName}
                      </span>
                    </div>
                    {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {isMatchingComplete && (
          <div className="p-3 bg-emerald-100 rounded-lg text-emerald-900 text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>Outstanding! You correctly matched all 6 Portuguese dishes (+12 points).</span>
          </div>
        )}
      </div>

      {/* Part 2: Waiter Speaking Task */}
      <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-amber-500" />
            <h2 className="font-serif-lisbon font-bold text-lg text-blue-950">
              Part 2: Waiter Recommendation Speaking Task (8 points)
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-md">
            Speaking Score: {speakingScore} / 8 pts
          </span>
        </div>

        {/* Task Prompt */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block">
            Classroom Speaking Challenge:
          </span>
          <p className="font-serif-lisbon font-bold text-base text-blue-950">
            "You are a waiter in Lisbon. Recommend one traditional Portuguese main course and one dessert to an international guest."
          </p>
          <p className="text-xs text-slate-600">
            Speak out loud using professional B1 English phrases: <em>"I recommend...", "It is made with...", "For dessert, you should try..."</em>.
          </p>
        </div>

        {/* Interactive Speech Practice Controller */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleRecording}
              className={`p-3.5 rounded-full transition-all flex items-center justify-center cursor-pointer shadow-sm ${
                isRecording
                  ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-300'
                  : 'bg-blue-900 hover:bg-blue-800 text-white'
              }`}
              title={isRecording ? 'Stop speaking practice' : 'Start speaking practice'}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <div>
              <span className="font-serif-lisbon font-bold text-sm text-slate-900 block">
                {isRecording ? 'Listening / Practising...' : hasAttemptedSpeaking ? 'Practice Completed!' : 'Start Speaking Practice'}
              </span>
              <span className="text-xs text-slate-500">
                {isRecording
                  ? `Timer: ${speakingSeconds}s (speak your recommendation clearly)`
                  : 'Click the microphone to rehearse your English waiter recommendation.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!showModelAnswer ? (
              <button
                onClick={() => {
                  setHasAttemptedSpeaking(true);
                  setShowModelAnswer(true);
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-blue-950 font-serif-lisbon font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Reveal Model Answer</span>
              </button>
            ) : (
              <button
                onClick={handlePlayModelAudio}
                className="px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-serif-lisbon font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen to Model Audio</span>
              </button>
            )}
          </div>
        </div>

        {/* Model Answer Display (Displayed only after student attempts or reveals) */}
        {showModelAnswer && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/70 border border-amber-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Suggested Model Hospitality Answer:
                </span>
                <span className="text-xs font-medium text-amber-800">CEFR B1 Level</span>
              </div>
              <blockquote className="font-serif-lisbon text-base sm:text-lg text-blue-950 italic font-semibold leading-relaxed">
                “I recommend <strong className="text-blue-900">Bacalhau à Brás</strong>. It is a traditional Portuguese dish made with <strong className="text-amber-900">cod, potatoes and eggs</strong>. For dessert, you should try <strong className="text-blue-900">pastel de nata</strong>. It is a delicious <strong className="text-amber-900">custard tart</strong>.”
              </blockquote>
            </div>

            {/* Student Self-Evaluation Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Self-Evaluation Checklist (tick what you included):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-blue-50/50">
                  <input
                    type="checkbox"
                    checked={checklist.recommendedMain}
                    onChange={(e) =>
                      setChecklist((c) => ({ ...c, recommendedMain: e.target.checked }))
                    }
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                  <span>Used <em>"I recommend..."</em> or <em>"May I suggest..."</em></span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-blue-50/50">
                  <input
                    type="checkbox"
                    checked={checklist.namedIngredients}
                    onChange={(e) =>
                      setChecklist((c) => ({ ...c, namedIngredients: e.target.checked }))
                    }
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                  <span>Explained key ingredients (cod, potatoes, eggs)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-blue-50/50">
                  <input
                    type="checkbox"
                    checked={checklist.recommendedDessert}
                    onChange={(e) =>
                      setChecklist((c) => ({ ...c, recommendedDessert: e.target.checked }))
                    }
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                  <span>Recommended a dessert (e.g. pastel de nata)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-blue-50/50">
                  <input
                    type="checkbox"
                    checked={checklist.clearIntonation}
                    onChange={(e) =>
                      setChecklist((c) => ({ ...c, clearIntonation: e.target.checked }))
                    }
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                  <span>Spoke with friendly, audible English intonation</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Completion Strip */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-950">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Mission 5 Score: {totalMissionScore} / 20 pts</span>
          </div>

          <button
            onClick={() => onComplete(totalMissionScore)}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-blue-950 font-serif-lisbon font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>Finish Adventure & View Certificate</span>
            <ArrowRight className="w-4 h-4 text-blue-950" />
          </button>
        </div>
      </div>
    </div>
  );
}
