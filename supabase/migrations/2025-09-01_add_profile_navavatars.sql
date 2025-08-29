-- profiles table and navatar catalog
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_id text,
  avatar_url text,
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "profiles: update own"
  on profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles: read public"
  on profiles for select
  to anon, authenticated
  using (true);

create table if not exists navatar_catalog (
  id text primary key,
  name text not null,
  tier text not null,
  svg text not null
);
