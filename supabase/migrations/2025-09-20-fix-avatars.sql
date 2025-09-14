-- Fix avatars table: ensure uniqueness, RLS, and storage rules

-- 1) Keep newest avatar per user, remove older rows
WITH ranked AS (
  SELECT id, user_id,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC NULLS LAST) AS rn
  FROM public.avatars
)
DELETE FROM public.avatars a
USING ranked r
WHERE a.id = r.id
  AND r.rn > 1;

-- 2) Make user_id required and unique (idempotent)
ALTER TABLE public.avatars
  ALTER COLUMN user_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = 'avatars_user_id_key'
  ) THEN
    CREATE UNIQUE INDEX avatars_user_id_key ON public.avatars(user_id);
  END IF;
END$$;

-- 3) RLS for avatars table (only owner can read/write)
ALTER TABLE public.avatars ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='avatars' AND policyname='Avatars select own') THEN
    CREATE POLICY "Avatars select own" ON public.avatars
      FOR SELECT USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='avatars' AND policyname='Avatars upsert own') THEN
    CREATE POLICY "Avatars upsert own" ON public.avatars
      FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='avatars' AND policyname='Avatars update own') THEN
    CREATE POLICY "Avatars update own" ON public.avatars
      FOR UPDATE USING (user_id = auth.uid());
  END IF;
END$$;

-- 4) Storage/RLS for uploads into bucket `avatars`
-- (objects live under path '<userId>/filename')
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='storage: avatars read own') THEN
    CREATE POLICY "storage: avatars read own"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'avatars' AND (owner = auth.uid() OR (left(name, 36) = auth.uid()::text)));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='storage: avatars insert own') THEN
    CREATE POLICY "storage: avatars insert own"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'avatars' AND left(name, 36) = auth.uid()::text);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='storage: avatars update own') THEN
    CREATE POLICY "storage: avatars update own"
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'avatars' AND left(name, 36) = auth.uid()::text);
  END IF;
END$$;
