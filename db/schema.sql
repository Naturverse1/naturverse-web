-- users are anonymous for now; device_id identifies a browser
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  device_id text unique,
  created_at timestamp default now()
);

create table if not exists user_tokens (
  id bigint generated always as identity primary key,
  device_id text not null,
  balance int not null default 0,
  updated_at timestamp default now()
);

create table if not exists content (
  id uuid primary key default gen_random_uuid(),
  type text not null,            -- story | quiz | observation | tip | music | wellness | world ...
  title text not null,
  slug text unique,
  body text,
  meta jsonb default '{}'::jsonb,
  created_at timestamp default now()
);

create table if not exists quizzes (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references content(id) on delete cascade,
  questions jsonb not null
);

create table if not exists progress (
  id bigint generated always as identity primary key,
  device_id text not null,
  content_id uuid references content(id) on delete cascade,
  score int default 0,
  completed_at timestamp
);

create table if not exists wishlists (
  id bigint generated always as identity primary key,
  device_id text not null,
  thing_type text not null,      -- product | content
  thing_id text not null,        -- sku or content.slug
  created_at timestamp default now(),
  unique(device_id, thing_type, thing_id)
);
