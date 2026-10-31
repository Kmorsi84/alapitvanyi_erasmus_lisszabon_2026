import { MessageSquare, Sparkles } from 'lucide-react';

interface ManagerDialogueProps {
  message: string;
  subtext?: string;
  managerName?: string;
  role?: string;
  isCompliment?: boolean;
}

export function ManagerDialogue({
  message,
  subtext,
  managerName = 'Manager Bernardo',
  role = 'Restaurant Director · Restaurante Miradouro do Tejo',
  isCompliment = false,
}: ManagerDialogueProps) {
  return (
    <aside aria-label="Restaurant Manager Guidance" className="relative mb-6 rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-50/90 via-sky-50/50 to-amber-50/60 p-4 shadow-sm transition-all">
      <div className="flex items-start gap-3.5">
        {/* Manager Avatar */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-900 shadow-sm bg-blue-100 flex items-center justify-center">
            <img
              src="/assets/aistudio/manager_bernardo_26cd4c18.png"
              alt="Manager Bernardo"
              className="w-full h-full object-cover object-top"
            />
          </div>
          {isCompliment && (
            <div className="absolute -top-1 -right-1 bg-amber-400 text-blue-950 rounded-full p-0.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Speech Bubble Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
            <span className="font-serif-lisbon font-bold text-blue-950 text-sm">
              {managerName}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {role}
            </span>
          </div>

          <div className="relative bg-white/90 rounded-lg p-3 border border-blue-100 text-slate-800 text-sm leading-relaxed shadow-xs">
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-slate-900">{message}</p>
                {subtext && <p className="text-xs text-slate-600">{subtext}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
