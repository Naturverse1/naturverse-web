create table if not exists user_avatars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  svg text not null,
  traits jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_avatars_user_id on user_avatars(user_id);
