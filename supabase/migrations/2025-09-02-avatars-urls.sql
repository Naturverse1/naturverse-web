-- Safe, no-op if columns already exist
alter table public.avatars
  add column if not exists image_url text,
  add column if not exists storage_path text,
  add column if not exists method text check (method in ('canon','upload','ai')) default 'upload';
