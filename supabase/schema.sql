-- ---------- Extensions ----------
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

-- ---------- Helpers ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;$$;

-- ---------- Profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname='profiles_select_all') then
    create policy "profiles_select_all"
    on public.profiles for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname='profiles_insert_self') then
    create policy "profiles_insert_self"
    on public.profiles for insert to authenticated with check (id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where policyname='profiles_update_self') then
    create policy "profiles_update_self"
    on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
  end if;
end $$;

-- ---------- Storage: avatars ----------
select case
  when exists (select 1 from storage.buckets where id='avatars') then null
  else storage.create_bucket('avatars', public := true)
end;
alter table storage.objects enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname='avatars_public_read') then
    create policy "avatars_public_read"
    on storage.objects for select to anon, authenticated using (bucket_id = 'avatars');
  end if;
  if not exists (select 1 from pg_policies where policyname='avatars_user_insert_prefix') then
    create policy "avatars_user_insert_prefix"
    on storage.objects for insert to authenticated
    with check ( bucket_id='avatars' and position(auth.uid()::text || '/' in name) = 1 );
  end if;
  if not exists (select 1 from pg_policies where policyname='avatars_user_update_prefix') then
    create policy "avatars_user_update_prefix"
    on storage.objects for update to authenticated
    using ( bucket_id='avatars' and position(auth.uid()::text || '/' in name) = 1 )
    with check ( bucket_id='avatars' and position(auth.uid()::text || '/' in name) = 1 );
  end if;
end $$;

-- ---------- NaturBank ----------
create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  symbol text not null default 'NATUR',
  balance numeric(20,6) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, symbol)
);
drop trigger if exists trg_wallets_updated_at on public.wallets;
create trigger trg_wallets_updated_at before update on public.wallets
for each row execute function public.set_updated_at();

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.wallets(id) on delete cascade,
  kind text not null check (kind in ('earn','spend','airdrop','adjust')),
  amount numeric(20,6) not null,
  meta jsonb,
  created_at timestamptz not null default now()
);

alter table public.wallets enable row level security;
alter table public.transactions enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname='wallets_owner_select') then
    create policy "wallets_owner_select" on public.wallets
    for select to authenticated using (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where policyname='wallets_owner_write') then
    create policy "wallets_owner_write" on public.wallets
    for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where policyname='txns_owner_select') then
    create policy "txns_owner_select" on public.transactions
    for select to authenticated
    using (exists(select 1 from public.wallets w where w.id = wallet_id and w.user_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where policyname='txns_owner_write') then
    create policy "txns_owner_write" on public.transactions
    for all to authenticated
    using (exists(select 1 from public.wallets w where w.id = wallet_id and w.user_id = auth.uid()))
    with check (exists(select 1 from public.wallets w where w.id = wallet_id and w.user_id = auth.uid()));
  end if;
end $$;

create or replace view public.v_my_wallet as
select id, symbol, balance, created_at, updated_at
from public.wallets where user_id = auth.uid();

-- ---------- Wallet RPC ----------
create or replace function public.earn_spend_natur(
  p_kind text,
  p_amount numeric,
  p_meta jsonb default '{}'::jsonb
) returns void
language plpgsql
security definer
as $$
declare
  w_id uuid;
begin
  -- Validate
  if p_amount <= 0 then
    raise exception 'Amount must be > 0';
  end if;
  if p_kind not in ('earn','spend') then
    raise exception 'Kind must be earn or spend';
  end if;

  -- Ensure wallet exists
  insert into public.wallets(user_id, symbol)
  values (auth.uid(), 'NATUR')
  on conflict (user_id, symbol) do nothing;

  select id into w_id from public.wallets where user_id = auth.uid() and symbol='NATUR';

  if p_kind = 'earn' then
    update public.wallets set balance = balance + p_amount, updated_at=now()
    where id=w_id;
    insert into public.transactions(wallet_id, kind, amount, meta) values (w_id, 'earn', p_amount, p_meta);
  elsif p_kind = 'spend' then
    update public.wallets set balance = balance - p_amount, updated_at=now()
    where id=w_id and balance >= p_amount;
    if not found then
      raise exception 'Insufficient balance';
    end if;
    insert into public.transactions(wallet_id, kind, amount, meta) values (w_id, 'spend', p_amount, p_meta);
  end if;
end;$$;

grant execute on function public.earn_spend_natur to authenticated;

-- ---------- XP & Badges ----------
create table if not exists public.xp_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null,
  delta integer not null,
  meta jsonb,
  created_at timestamptz not null default now()
);
alter table public.xp_ledger enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname='xp_self') then
    create policy "xp_self" on public.xp_ledger
    for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
end $$;

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  icon_url text,
  created_at timestamptz not null default now()
);
create table if not exists public.user_badges (
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key(user_id, badge_id)
);
alter table public.user_badges enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname='user_badges_self') then
    create policy "user_badges_self" on public.user_badges
    for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
end $$;

-- ---------- Passports ----------
create table if not exists public.stamps (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  icon_url text,
  created_at timestamptz not null default now()
);
create table if not exists public.user_stamps (
  user_id uuid not null references auth.users(id) on delete cascade,
  stamp_id uuid not null references public.stamps(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key(user_id, stamp_id)
);
alter table public.user_stamps enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname='user_stamps_self') then
    create policy "user_stamps_self" on public.user_stamps
    for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
end $$;

-- ---------- Languages ----------
create table if not exists public.languages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  native_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_lang_updated_at on public.languages;
create trigger trg_lang_updated_at before update on public.languages
for each row execute function public.set_updated_at();

create table if not exists public.language_lessons (
  id uuid primary key default gen_random_uuid(),
  language_id uuid not null references public.languages(id) on delete cascade,
  key text not null,
  title text not null,
  created_at timestamptz not null default now()
);
create table if not exists public.language_lesson_items (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.language_lessons(id) on delete cascade,
  label text,
  value text,
  romanized text,
  meta jsonb,
  position int not null default 0
);

alter table public.languages enable row level security;
alter table public.language_lessons enable row level security;
alter table public.language_lesson_items enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname='lang_public_read') then
    create policy "lang_public_read" on public.languages for select to anon, authenticated using (true);
    create policy "lesson_public_read" on public.language_lessons for select to anon, authenticated using (true);
    create policy "lesson_items_public_read" on public.language_lesson_items for select to anon, authenticated using (true);
  end if;
end $$;

insert into public.languages (slug, name, native_name) values
  ('thailandia', 'Thailandia (Thai)', 'ไทย'),
  ('chinadia', 'Chinadia (Mandarin)', '中文'),
  ('indillandia', 'Indillandia (Hindi)', 'हिन्दी'),
  ('brazilandia', 'Brazilandia (Portuguese)', 'Português'),
  ('australandia', 'Australandia (English)', 'English'),
  ('amerilandia', 'Amerilandia (English)', 'English')
on conflict (slug) do update set name=excluded.name, native_name=excluded.native_name;

