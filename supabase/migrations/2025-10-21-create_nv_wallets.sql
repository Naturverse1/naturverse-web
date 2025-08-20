create table if not exists nv_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  natur_balance numeric default 0,
  created_at timestamptz default now()
);
