-- Create navatars bucket and storage policies

-- 1) Bucket (idempotent)
insert into storage.buckets (id, name, public)
select 'navatars','navatars', true
where not exists (select 1 from storage.buckets where id = 'navatars');

-- 3) Read: allow anyone to read files in the 'navatars' bucket (needed for public images)
create policy "navatars_read_public"
on storage.objects
for select
to public
using (bucket_id = 'navatars');

-- 4) Insert: allow signed-in users to upload to 'navatars'
create policy "navatars_insert_auth"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'navatars');

-- 5) Update: allow owners to overwrite their own files
create policy "navatars_update_owner"
on storage.objects
for update
to authenticated
using (bucket_id = 'navatars' and owner = auth.uid())
with check (bucket_id = 'navatars' and owner = auth.uid());

-- 6) Delete: allow owners to delete their own files
create policy "navatars_delete_owner"
on storage.objects
for delete
to authenticated
using (bucket_id = 'navatars' and owner = auth.uid());
