import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Supabase integration
// Only public publishable / anon keys are safe for the client-side bundle.
// NEVER include service_role or secret keys in client-side code!
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xgdogmcqktqcqgqrxpxt.supabase.co';
const rawSupabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const SUPABASE_URL = typeof rawSupabaseUrl === 'string' ? rawSupabaseUrl.trim() : '';
export const SUPABASE_KEY = typeof rawSupabaseKey === 'string' ? rawSupabaseKey.trim() : '';

// Validation helper
export function isSupabaseConfigured(): boolean {
  if (!SUPABASE_URL || !SUPABASE_KEY) return false;
  // Ignore placeholder values
  if (
    SUPABASE_KEY === 'your-supabase-publishable-key-here' ||
    SUPABASE_KEY === 'MY_SUPABASE_KEY' ||
    SUPABASE_KEY.length < 15
  ) {
    return false;
  }
  return true;
}

export function getSupabaseConfigError(): string | null {
  if (!SUPABASE_URL) {
    return 'A Supabase URL (VITE_SUPABASE_URL) hiányzik a környezeti változókból.';
  }
  if (!SUPABASE_KEY || SUPABASE_KEY === 'your-supabase-publishable-key-here' || SUPABASE_KEY.length < 15) {
    return 'A Supabase nyilvános anonim kulcs (VITE_SUPABASE_PUBLISHABLE_KEY) nincs beállítva vagy érvénytelen. Kérjük, add meg a Supabase Dashboard -> Project Settings -> API felületen található anon public kulcsot!';
  }
  return null;
}

// Database schema interfaces based on existing Supabase objects:
// public.erasmus_students (id, full_name, class_name, profession, current_user_id)
// public.erasmus_missions (mission_id, title, maximum_points)
// public.erasmus_results (student_id, mission_id, points, completed, updated_at)
// public.erasmus_teachers (user_id)
export interface ErasmusStudent {
  id: string;
  full_name: string;
  class_name: string | null;
  profession: string | null;
  current_user_id: string | null;
}

export interface ErasmusMission {
  mission_id: number;
  title: string;
  maximum_points: number;
}

export interface ErasmusResult {
  student_id: string;
  mission_id: number;
  points: number;
  completed: boolean;
  updated_at?: string;
}

export interface ErasmusTeacher {
  user_id: string;
  email?: string;
}

// Global Supabase client instance (initialized if configured, otherwise null or placeholder)
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;
