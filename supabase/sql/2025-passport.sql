create table if not exists public.passport_stamps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  world text not null,
  title text not null,
  note text,
  created_at timestamp with time zone default now()
);

create table if not exists public.passport_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code text not null,
  label text not null,
  created_at timestamp with time zone default now()
);

alter table public.passport_stamps enable row level security;
alter table public.passport_badges enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='passport_stamps' and policyname='own-stamps') then
    create policy "own-stamps" on public.passport_stamps
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='passport_badges' and policyname='own-badges') then
    create policy "own-badges" on public.passport_badges
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

create index if not exists stamps_user_idx on public.passport_stamps(user_id, created_at desc);
create index if not exists badges_user_idx on public.passport_badges(user_id, created_at desc);

