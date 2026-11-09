import { AlertCircle, ExternalLink } from 'lucide-react';
import { getSupabaseConfigError, isSupabaseConfigured } from '../lib/supabase';

export function SupabaseConfigBanner() {
  if (isSupabaseConfigured()) return null;

  const errorMsg = getSupabaseConfigError();

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 px-4 py-3 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Supabase konfigurációs értesítés:</strong> {errorMsg}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs shrink-0 font-medium">
          <span className="text-amber-800">
            Kérjük, add meg a <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-950 font-mono">VITE_SUPABASE_PUBLISHABLE_KEY</code> változót.
          </span>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-800 hover:text-blue-900 underline"
          >
            <span>Supabase Dashboard</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
