-- progress
create table if not exists public.user_quest_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  quest_id text not null,
  started_at timestamptz,
  completed_at timestamptz,
  last_action_at timestamptz not null default now(),
  unique (user_id, quest_id)
);
create index if not exists uqp_user_idx on public.user_quest_progress (user_id);
alter table public.user_quest_progress enable row level security;
do $$ begin
  create policy "owner read own progress" on public.user_quest_progress
  for select to authenticated using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- streaks
create table if not exists public.user_streaks (
  user_id uuid primary key,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_completed_date date
);
alter table public.user_streaks enable row level security;
do $$ begin
  create policy "owner read own streak" on public.user_streaks
  for select to authenticated using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- badges
create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  badge_code text not null,
  earned_at timestamptz not null default now(),
  unique (user_id, badge_code)
);
create index if not exists ub_user_idx on public.user_badges (user_id);
alter table public.user_badges enable row level security;
do $$ begin
  create policy "owner read own badges" on public.user_badges
  for select to authenticated using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
