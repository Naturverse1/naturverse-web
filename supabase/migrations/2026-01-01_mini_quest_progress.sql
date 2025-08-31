create table if not exists quest_progress (
  user_id uuid references auth.users not null,
  quest_slug text not null,
  best_score int default 0,
  completed boolean default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, quest_slug)
);

alter table quest_progress enable row level security;
create policy "read_own" on quest_progress for select using (auth.uid() = user_id);
create policy "upsert_own" on quest_progress for insert with check (auth.uid() = user_id);
create policy "update_own" on quest_progress for update using (auth.uid() = user_id);

create view quest_leaderboard_public as
select quest_slug, best_score, user_id, rank() over (partition by quest_slug order by best_score desc) as rank
from quest_progress
where completed = true;
