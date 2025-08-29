-- Navatar listings
create table if not exists public.navatar_listings (
  id uuid primary key default gen_random_uuid(),
  navatar_id text not null references public.navatars(id) on delete cascade,
  seller_user_id uuid not null references auth.users(id) on delete cascade,
  currency text not null check (currency in ('usd','natur')),
  price_cents integer,
  price_natur numeric,
  fee_bps integer not null default 1000,
  royalty_bps integer not null default 500,
  status text not null check (status in ('active','sold','cancelled')) default 'active',
  created_at timestamptz default now(),
  sold_at timestamptz
);

alter table public.navatar_listings enable row level security;
create policy "read active listings"
  on public.navatar_listings for select
  to anon, authenticated
  using (status = 'active');
create policy "seller manage own listings"
  on public.navatar_listings for update using (auth.uid() = seller_user_id) with check (auth.uid() = seller_user_id);
create policy "seller insert listing"
  on public.navatar_listings for insert with check (auth.uid() = seller_user_id);

-- Sales ledger
create table if not exists public.navatar_sales (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.navatar_listings(id) on delete cascade,
  buyer_user_id uuid,
  method text not null check (method in ('stripe','natur')),
  gross_amount numeric not null,
  fee_amount numeric not null,
  royalty_amount numeric not null,
  seller_proceeds numeric not null,
  tx_hashes text[] default '{}',
  created_at timestamptz default now()
);

alter table public.navatar_sales enable row level security;
create policy "read sales public"
  on public.navatar_sales for select using (true);
