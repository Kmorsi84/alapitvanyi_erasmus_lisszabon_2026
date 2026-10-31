import { useState, useId } from 'react';
import { ChefHat, Compass, Sparkles, UtensilsCrossed, ShieldCheck, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: (name: string) => void;
  defaultName?: string;
}

export function WelcomeScreen({ onStart, defaultName = '' }: WelcomeScreenProps) {
  const [name, setName] = useState(defaultName || 'András');
  const nameInputId = useId();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-60px)] flex flex-col items-center justify-center py-10 px-4 sm:px-6">
      {/* Background Azulejo & Lisbon Vista Theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-blue-900 to-slate-900 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15 -z-10" />

      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-200/60 overflow-hidden my-auto">
        {/* Decorative Azulejo Tile Header Stripe */}
        <div className="h-3 w-full bg-gradient-to-r from-blue-800 via-sky-500 via-amber-400 to-blue-800" />

        <div className="p-6 sm:p-10 space-y-8">
          {/* Hero Branding */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Erasmus+ Hospitality & Culinary Arts Training · Lisbon, Portugal
            </div>

            <h1 className="font-serif-lisbon font-bold text-2xl sm:text-4xl lg:text-5xl text-blue-950 tracking-tight text-balance">
              Portuguese Food Quest
            </h1>
            <p className="font-serif-lisbon text-base sm:text-lg lg:text-xl text-amber-800 font-medium">
              Lisbon Restaurant Adventure · CEFR B1 Vocational English
            </p>
            <p className="text-slate-600 max-w-2xl mx-auto text-xs sm:text-sm lg:text-base leading-relaxed">
              Step into our restaurant overlooking the Tagus River. Complete 5 interactive hospitality missions, master authentic Portuguese gastronomy, learn vital allergen safety, and earn your official Gastronomy Ambassador Certificate!
            </p>
          </div>

          {/* Restaurant Manager Welcome Message */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5 sm:gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-600 shrink-0 shadow-sm bg-amber-100">
              <img
                src="/assets/aistudio/manager_bernardo_26cd4c18.png"
                alt="Manager Bernardo"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2">
                <span className="font-serif-lisbon font-bold text-blue-950 text-base">
                  Manager Bernardo
                </span>
                <span className="text-xs text-amber-800 font-medium">
                  Restaurante Miradouro do Tejo · Alfama, Lisboa
                </span>
              </div>
              <p className="text-slate-800 text-xs sm:text-sm italic leading-relaxed">
                “Bem-vindo a Lisboa! Today is your first day at our Portuguese restaurant. Are you ready to discover Portuguese cuisine, navigate Lisbon fresh markets, and serve our international guests with professional English hospitality?”
              </p>
            </div>
          </div>

          {/* 5 Missions Roadmap Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/80 space-y-1">
              <div className="flex items-center gap-2 text-blue-800 text-xs font-bold uppercase tracking-wider">
                <Compass className="w-4 h-4 text-blue-600" />
                Mission 1
              </div>
              <h2 className="font-serif-lisbon font-bold text-sm text-slate-900">Food Vocabulary</h2>
              <p className="text-xs text-slate-500">12 authentic dishes, audio pronunciation & cooking verbs.</p>
              <div className="text-[11px] font-semibold text-amber-700">20 points</div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/80 space-y-1">
              <div className="flex items-center gap-2 text-blue-800 text-xs font-bold uppercase tracking-wider">
                <ChefHat className="w-4 h-4 text-emerald-600" />
                Mission 2
              </div>
              <h2 className="font-serif-lisbon font-bold text-sm text-slate-900">Market Challenge</h2>
              <p className="text-xs text-slate-500">Shop fresh ingredients at Mercado da Ribeira stalls.</p>
              <div className="text-[11px] font-semibold text-amber-700">30 points</div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/80 space-y-1">
              <div className="flex items-center gap-2 text-blue-800 text-xs font-bold uppercase tracking-wider">
                <UtensilsCrossed className="w-4 h-4 text-amber-600" />
                Mission 3
              </div>
              <h2 className="font-serif-lisbon font-bold text-sm text-slate-900">Restaurant Menu</h2>
              <p className="text-xs text-slate-500">Plausible EUR menu, dietary requests & allergen safety.</p>
              <div className="text-[11px] font-semibold text-amber-700">30 points</div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/80 space-y-1">
              <div className="flex items-center gap-2 text-blue-800 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                Mission 4
              </div>
              <h2 className="font-serif-lisbon font-bold text-sm text-slate-900">Customer Service</h2>
              <p className="text-xs text-slate-500">Role-play guest situations, resolve complaints politely.</p>
              <div className="text-[11px] font-semibold text-amber-700">50 points</div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/80 space-y-1">
              <div className="flex items-center gap-2 text-blue-800 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-orange-600" />
                Mission 5
              </div>
              <h2 className="font-serif-lisbon font-bold text-sm text-slate-900">Food Expert</h2>
              <p className="text-xs text-slate-500">Visual matching game & waiter speaking recommendation.</p>
              <div className="text-[11px] font-semibold text-amber-700">20 points</div>
            </div>
          </div>

          {/* Student Name Registration & Start */}
          <form
            onSubmit={handleFormSubmit}
            className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="w-full sm:w-auto flex-1 max-w-md">
              <label htmlFor={nameInputId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Trainee First Name (for Official Certificate)
              </label>
              <input
                id={nameInputId}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your first name (e.g., András, Dóra, Bence)"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 font-medium placeholder:text-slate-400 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-serif-lisbon font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
            >
              <span>Begin Lisbon Adventure</span>
              <ArrowRight className="w-5 h-5 text-amber-300" />
            </button>
          </form>

          {/* Educational Target Audience Note */}
          <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-100">
            <span>⏱️ 15-Minute Session</span>
            <span>🇪🇺 CEFR B1 English</span>
            <span>🏆 150 Points Total</span>
            <span>📜 Printable Certificate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
