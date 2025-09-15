-- 1) Extension (if not already on)
create extension if not exists "uuid-ossp";

-- 2) Wallets
create table if not exists public.wallets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'My Wallet',
  address text,
  balance integer not null default 120,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists wallets_user_unique on public.wallets(user_id);

-- 3) Transactions
create table if not exists public.wallet_txns (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  wallet_id uuid not null references public.wallets(id) on delete cascade,
  type text not null check (type in ('grant','spend')),
  amount integer not null check (amount > 0),
  note text,
  created_at timestamptz not null default now()
);
create index if not exists wallet_txns_user_created_idx on public.wallet_txns(user_id, created_at desc);

-- 4) RLS
alter table public.wallets enable row level security;
alter table public.wallet_txns enable row level security;

create policy "wallets: owner read/write"
on public.wallets
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "txns: owner read"
on public.wallet_txns
for select
using (auth.uid() = user_id);

create policy "txns: owner insert"
on public.wallet_txns
for insert
with check (auth.uid() = user_id);

-- 5) Balance safety via trigger (keeps balance authoritative)
create or replace function public.apply_wallet_txn()
returns trigger as $$
begin
  if (tg_op = 'INSERT') then
    if NEW.type = 'grant' then
      update public.wallets set balance = balance + NEW.amount, updated_at = now()
      where id = NEW.wallet_id and user_id = NEW.user_id;
    elsif NEW.type = 'spend' then
      update public.wallets set balance = balance - NEW.amount, updated_at = now()
      where id = NEW.wallet_id and user_id = NEW.user_id;
    end if;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_apply_wallet_txn on public.wallet_txns;
create trigger trg_apply_wallet_txn
after insert on public.wallet_txns
for each row execute function public.apply_wallet_txn();
