-- RLS policies for public.avatars table and storage bucket

-- Enable row level security on avatars table
alter table public.avatars enable row level security;

-- Select own rows
create policy "avatars_select_own"
  on public.avatars for select
  to authenticated
  using (user_id = auth.uid());

-- Insert own rows
create policy "avatars_insert_own"
  on public.avatars for insert
  to authenticated
  with check (user_id = auth.uid());

-- Update own rows
create policy "avatars_update_own"
  on public.avatars for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Storage policies for avatars bucket
create policy "storage_upload_navats"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = 'navatars'
    and auth.uid() = uuid((storage.foldername(name))[2])
  );

create policy "storage_read_navats"
  on storage.objects for select
  to anon
  using (bucket_id = 'avatars');

create policy "storage_modify_own_navats"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and auth.uid() = uuid((storage.foldername(name))[2])
  )
  with check (
    bucket_id = 'avatars'
    and auth.uid() = uuid((storage.foldername(name))[2])
  );

create policy "storage_delete_own_navats"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and auth.uid() = uuid((storage.foldername(name))[2])
  );
