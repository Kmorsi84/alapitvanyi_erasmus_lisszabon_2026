-- ============================================================================
-- SUPABASE SCHEMA FELÜLVIZSGÁLAT ÉS RLS HÁTTÉRANYAG (FELÜLVIZSGÁLATRA)
-- ============================================================================
-- Figyelem: A kliensoldali kód NEM módosítja automatikusan az adatbázist!
-- Ez a fájl tájékoztató célt szolgál az adminisztrátor / tanár számára,
-- ha ellenőrizni vagy felülvizsgálni szeretné a Supabase beállításokat.
-- ============================================================================

-- 1. Meglévő táblák struktúrája (ellenőrzésre):
-- public.erasmus_students (
--   id uuid primary key default gen_random_uuid(),
--   full_name text not null,
--   class_name text,
--   profession text,
--   current_user_id uuid references auth.users(id)
-- );

-- public.erasmus_missions (
--   mission_id integer primary key,
--   title text not null,
--   maximum_points integer not null
-- );

-- public.erasmus_results (
--   student_id uuid references public.erasmus_students(id) on delete cascade,
--   mission_id integer references public.erasmus_missions(mission_id),
--   points integer not null default 0,
--   completed boolean not null default false,
--   updated_at timestamp with time zone default now(),
--   primary key (student_id, mission_id)
-- );

-- public.erasmus_teachers (
--   user_id uuid primary key references auth.users(id) on delete cascade
-- );

-- 2. Elvárt RPC függvények szignatúrái:
-- RPC: erasmus_claim_student(p_full_name text, p_code text) -> uuid
-- RPC: erasmus_save_result(p_mission_id integer, p_points integer, p_completed boolean) -> void

-- 3. Javasolt Row Level Security (RLS) szabályok áttekintése:
-- A tanulók csak a saját tanulói rekordjukat (erasmus_students ahol current_user_id = auth.uid())
-- és saját eredményeiket (erasmus_results ahol student_id az ő id-juk) láthatják.
-- A tanárok (auth.uid() in public.erasmus_teachers) valamennyi tanulót és eredményt láthatják.
