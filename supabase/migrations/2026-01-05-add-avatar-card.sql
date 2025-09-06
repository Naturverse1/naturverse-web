-- one-time, idempotent
alter table avatars
add column if not exists card jsonb;
