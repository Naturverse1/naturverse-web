-- supabase/migrations/20250828_quest_progress.sql
create table if not exists public.quest_progress (
  user_id uuid not null,
  quest_slug text not null,
  best_score integer not null default 0,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, quest_slug)
);

-- Optional public leaderboard view (hide user_id)
create or replace view public.quest_leaderboard_public as
  select
    quest_slug,
    best_score,
    row_number() over (partition by quest_slug order by best_score desc) as rank,
    coalesce((auth.jwt() ->> 'user_metadata')::json->>'username', null) as username
  from public.quest_progress;

-- Basic RLS
alter table public.quest_progress enable row level security;
create policy "owner can upsert own" on public.quest_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
