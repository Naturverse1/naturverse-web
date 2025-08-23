-- wallets
create table if not exists public.natur_wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance integer not null default 0,
  updated_at timestamp with time zone default now()
);

-- ledger
create table if not exists public.natur_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  delta integer not null,
  reason text,
  created_at timestamp with time zone default now()
);
create index if not exists natur_ledger_user_idx on public.natur_ledger(user_id, created_at desc);

-- apply transaction: updates balance and writes ledger
create or replace function public.natur_apply_tx(p_user_id uuid, p_delta integer, p_reason text)
returns void language plpgsql security definer as $$
begin
  insert into public.natur_ledger (user_id, delta, reason) values (p_user_id, p_delta, p_reason);
  insert into public.natur_wallets (user_id, balance)
  values (p_user_id, greatest(0, p_delta)) 
  on conflict (user_id) do update set
    balance = greatest(0, public.natur_wallets.balance + excluded.balance),
    updated_at = now();
  if p_delta <> 0 then
    update public.natur_wallets
      set balance = greatest(0, balance + p_delta), updated_at = now()
      where user_id = p_user_id;
  end if;
end $$;

-- RLS (optional tighten later)
alter table public.natur_wallets enable row level security;
alter table public.natur_ledger  enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'natur_wallets' and policyname = 'own-wallet') then
    create policy "own-wallet" on public.natur_wallets
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'natur_ledger' and policyname = 'own-ledger') then
    create policy "own-ledger" on public.natur_ledger
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;
