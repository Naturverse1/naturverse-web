-- Character cards for a user's selected Navatar
create table if not exists public.character_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  navatar_id uuid not null references public.avatars(id) on delete cascade,
  name text,
  species text,
  kingdom text,
  backstory text,
  powers text[],        -- comma list stored as array
  traits text[],        -- comma list stored as array
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, navatar_id)
);

alter table public.character_cards enable row level security;

-- owner can read/write their own cards
create policy "card_select_own"
on public.character_cards for select
using (auth.uid() = user_id);

create policy "card_insert_own"
on public.character_cards for insert
with check (auth.uid() = user_id);

create policy "card_update_own"
on public.character_cards for update
using (auth.uid() = user_id);

create policy "card_delete_own"
on public.character_cards for delete
using (auth.uid() = user_id);

-- trigger to keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now(); 
  return new;
end$$;

drop trigger if exists trg_touch_character_cards on public.character_cards;
create trigger trg_touch_character_cards
before update on public.character_cards
for each row execute function public.touch_updated_at();
