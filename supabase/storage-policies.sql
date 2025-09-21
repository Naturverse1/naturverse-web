-- Ensure the avatars bucket exists (public read is handled via policy)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS if not already enabled
alter table storage.objects enable row level security;

-- Drop old policies so re-running this script is safe
drop policy if exists "public read avatars" on storage.objects;
drop policy if exists "avatars_user_insert" on storage.objects;
drop policy if exists "avatars_owner_update" on storage.objects;
drop policy if exists "avatars_owner_delete" on storage.objects;

-- 1) Public read of files in "avatars"
create policy "public read avatars"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

-- 2) Insert: only logged-in users can upload to "avatars"
create policy "avatars_user_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'avatars');

-- 3) Update: only owner can modify their files in "avatars"
create policy "avatars_owner_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'avatars' and owner = auth.uid())
with check (bucket_id = 'avatars' and owner = auth.uid());

-- 4) Delete: only owner can delete their files in "avatars"
create policy "avatars_owner_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'avatars' and owner = auth.uid());
