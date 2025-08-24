-- Schema & column safety
create schema if not exists natur;

create table if not exists natur.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  updated_at timestamp with time zone default now()
);

-- keep updated_at fresh
create or replace function natur.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists natur_profiles_touch on natur.profiles;
create trigger natur_profiles_touch
before update on natur.profiles
for each row execute function natur.touch_updated_at();

-- RLS
alter table natur.profiles enable row level security;

drop policy if exists "profiles read own" on natur.profiles;
create policy "profiles read own"
on natur.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles upsert own" on natur.profiles;
create policy "profiles upsert own"
on natur.profiles for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles update own" on natur.profiles;
create policy "profiles update own"
on natur.profiles for update
to authenticated
using (auth.uid() = id);

-- STORAGE: ensure bucket exists
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Storage policies (public read; user-only write)
drop policy if exists "avatars public read" on storage.objects;
create policy "avatars public read"
on storage.objects for select
to public
using (bucket_id = 'avatars');

drop policy if exists "avatars owner write" on storage.objects;
create policy "avatars owner write"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "avatars owner update" on storage.objects;
create policy "avatars owner update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

