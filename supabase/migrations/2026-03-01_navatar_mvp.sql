-- Navatar MVP enhancements
-- Avatars enhancements
alter table if exists avatars
add column if not exists traits jsonb,
add column if not exists method text check (method in ('upload','ai','canon')) default 'upload',
add column if not exists is_primary boolean default false,
add column if not exists chain_status text check (chain_status in ('none','queued','minted','failed')) default 'none';

-- Optional: remember user’s primary avatar id
alter table if exists users
add column if not exists primary_avatar_id uuid references avatars(id);

-- RLS note: ensure policies restrict rows to auth.uid().
