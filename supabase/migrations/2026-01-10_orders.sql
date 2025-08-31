create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  user_id uuid not null,
  email text,
  amount_total integer not null,
  currency text not null,
  status text not null,
  line_items jsonb not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_created_idx on public.orders (created_at desc);

-- RLS
alter table public.orders enable row level security;

-- Policy: users can read their own orders
create policy "Users can read own orders"
on public.orders for select
to authenticated
using (auth.uid() = user_id);

-- (No insert/update/delete from client; webhook uses Service Role)
