create table if not exists nv_zones (
  id text primary key,               -- slug
  title text not null,
  blurb text not null
);

create table if not exists nv_products (
  id text primary key,
  name text not null,
  price numeric not null,
  emoji text,
  desc text
);

create table if not exists nv_stories (
  id text primary key,
  title text not null,
  body text not null
);

create table if not exists nv_orders (
  id uuid primary key default gen_random_uuid(),
  email text,
  total numeric not null,
  items jsonb not null,
  created_at timestamptz default now()
);
