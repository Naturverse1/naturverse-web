-- Storage bucket policies for avatar images stored under avatars/navatars/<uid>/...

-- Ensure bucket exists
insert into storage.buckets (id, name, public)
values ('avatars','avatars', true)
on conflict (id) do nothing;

-- Remove any existing policies with the same names
DO $$
BEGIN
  DELETE FROM storage.policies
  WHERE name in (
    'storage_upload_navats',
    'storage_read_navats',
    'storage_modify_own_navats',
    'storage_delete_own_navats'
  );
EXCEPTION WHEN OTHERS THEN NULL;
END$$;

-- Allow authenticated users to upload into avatars/navatars/<their-uid>/...
create policy "storage_upload_navats"
on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = 'navatars'
    and auth.uid() = uuid((storage.foldername(name))[2])
  );

-- Read: let everyone read images (flip to authenticated if needed)
create policy "storage_read_navats"
on storage.objects for select
  to anon
  using (bucket_id = 'avatars');

-- Update own files
create policy "storage_modify_own_navats"
on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid() = uuid((storage.foldername(name))[2])
  )
  with check (
    bucket_id = 'avatars'
    and auth.uid() = uuid((storage.foldername(name))[2])
  );

-- Delete own files
create policy "storage_delete_own_navats"
on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and auth.uid() = uuid((storage.foldername(name))[2])
  );
