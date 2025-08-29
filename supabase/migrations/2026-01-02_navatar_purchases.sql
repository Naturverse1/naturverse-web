-- Track premium Navatars purchases
create table if not exists public.navatar_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  navatar_id text not null,
  method text check (method in ('stripe','natur')) not null,
  amount numeric not null,
  created_at timestamp default now()
);
