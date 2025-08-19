create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  wallet_address text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists tips (
  id bigserial primary key,
  title text,
  body text,
  created_at timestamptz default now()
);

create table if not exists playlists (
  id bigserial primary key,
  name text,
  description text,
  cover_url text,
  stream_url text,
  created_at timestamptz default now()
);

create table if not exists wellness_tips (
  id bigserial primary key,
  text text not null,
  created_at timestamptz default now()
);

create table if not exists feedback (
  id bigserial primary key,
  user_id uuid references auth.users(id),
  message text not null,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table tips enable row level security;
alter table playlists enable row level security;
alter table wellness_tips enable row level security;
alter table feedback enable row level security;

create policy "public read" on tips for select using (true);
create policy "public read" on playlists for select using (true);
create policy "public read" on wellness_tips for select using (true);

create policy "self read"  on profiles for select using (auth.uid() = id);
create policy "self write" on profiles for update using (auth.uid() = id);

create policy "insert own" on feedback for insert with check (auth.uid() = user_id);
