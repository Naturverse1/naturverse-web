alter table if exists avatars
  add column if not exists user_id uuid references auth.users(id),
  add column if not exists name text,
  add column if not exists category text,
  add column if not exists image_url text,
  add column if not exists method text check (method in ('upload','ai','canon')) default 'upload',
  add column if not exists traits jsonb default '{}'::jsonb,
  add column if not exists is_primary boolean default false,
  add column if not exists created_at timestamptz default now();

alter table if exists users
  add column if not exists primary_avatar_id uuid references avatars(id),
  add column if not exists avatar_url text;

create policy if not exists "avatars owner r"
  on avatars for select using (auth.uid() = user_id);
create policy if not exists "avatars owner w"
  on avatars for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
