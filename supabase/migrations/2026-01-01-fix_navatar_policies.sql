-- Enable RLS
alter table navatars enable row level security;
alter table navatar_cards enable row level security;

-- Drop and recreate navatars policy
drop policy if exists "navatars_own" on navatars;
create policy "navatars_own"
on navatars
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Drop and recreate navatar_cards policy
drop policy if exists "navatar_cards_own" on navatar_cards;
create policy "navatar_cards_own"
on navatar_cards
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
