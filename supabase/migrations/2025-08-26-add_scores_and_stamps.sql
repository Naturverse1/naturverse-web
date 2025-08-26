-- scores: simple per-game table
create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  game text not null,
  user_id uuid,
  value numeric not null,
  created_at timestamptz not null default now()
);

-- rank performance
create index if not exists scores_game_value_idx on public.scores (game, value desc, created_at desc);

-- stamps: one row per (user, world)
create table if not exists public.user_world_stamps (
  user_id uuid not null,
  world text not null,
  count int not null default 0,
  last_granted_at timestamptz not null default now(),
  primary key (user_id, world)
);

-- RLS (read all, write own)
alter table public.scores enable row level security;
alter table public.user_world_stamps enable row level security;

do $$ begin
  create policy scores_read on public.scores for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy scores_write on public.scores
  for insert with check (auth.uid() is null or auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy stamps_read on public.user_world_stamps for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy stamps_write on public.user_world_stamps
  for insert with check (auth.uid() is null or auth.uid() = user_id)
  ;
exception when duplicate_object then null; end $$;

-- upsert helper (optional; can also be done client-side)
create or replace function public.grant_world_stamp(p_user uuid, p_world text, p_inc int default 1)
returns void language plpgsql as $$
begin
  insert into public.user_world_stamps (user_id, world, count)
  values (p_user, p_world, greatest(p_inc,1))
  on conflict (user_id, world)
  do update set
    count = public.user_world_stamps.count + greatest(p_inc,1),
    last_granted_at = now();
end $$;
