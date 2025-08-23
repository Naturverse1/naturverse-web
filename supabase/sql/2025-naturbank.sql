create table if not exists public.natur_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  address text not null,
  label text,
  created_at timestamp with time zone default now()
);

create table if not exists public.natur_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  wallet_address text not null,
  kind text not null check (kind in ('earn','spend','grant')),
  amount numeric not null check (amount > 0),
  note text,
  created_at timestamp with time zone default now()
);

alter table public.natur_wallets enable row level security;
alter table public.natur_transactions enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='natur_wallets' and policyname='own-wallet') then
    create policy "own-wallet" on public.natur_wallets
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='natur_transactions' and policyname='own-txns') then
    create policy "own-txns" on public.natur_transactions
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

create index if not exists natur_txns_user_idx on public.natur_transactions(user_id, created_at desc);
