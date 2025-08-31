create table if not exists public.gift_cards (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  balance_cents integer not null check (balance_cents >= 0),
  created_at timestamptz not null default now(),
  purchaser_email text,
  recipient_email text
);
create index if not exists gift_cards_code_idx on public.gift_cards(code);
alter table public.gift_cards enable row level security;
create policy "read gift cards" on public.gift_cards for select to anon, authenticated using (true);
