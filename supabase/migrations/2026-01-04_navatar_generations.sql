-- A) log table
create table if not exists public.navatar_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt text not null,
  source_image_url text,
  mask_image_url text,
  result_image_url text,
  model text not null default 'gpt-image-1',
  status text not null default 'queued',
  error text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- B) row-level security
alter table public.navatar_generations enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public'
      and tablename='navatar_generations'
      and policyname='cg_select_own_generations'
  ) then
    create policy cg_select_own_generations
      on public.navatar_generations for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public'
      and tablename='navatar_generations'
      and policyname='cg_insert_own_generations'
  ) then
    create policy cg_insert_own_generations
      on public.navatar_generations for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public'
      and tablename='navatar_generations'
      and policyname='cg_update_own_generations'
  ) then
    create policy cg_update_own_generations
      on public.navatar_generations for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

-- C) fast lookup by user
create index if not exists navgen_user_created_idx
  on public.navatar_generations (user_id, created_at desc);
