-- Enable RLS where needed
ALTER TABLE public.quizzes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_modules  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_logs         ENABLE ROW LEVEL SECURITY;

-- OPTIONAL: If these tables already had RLS enabled, the ALTER is a no-op.

-- READ-ONLY catalog access for site visitors.
-- If you want only published rows exposed, set :USE_PUBLISHED_ONLY := true below.
-- For now default to TRUE to be safe.
DO $$
DECLARE use_published_only boolean := true;
BEGIN
  IF use_published_only THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='learning_modules' AND column_name='is_published'
    ) THEN
      RAISE NOTICE 'public.learning_modules is missing is_published; exposing all rows';
      use_published_only := false;
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='quizzes' AND column_name='is_published'
    ) THEN
      RAISE NOTICE 'public.quizzes is missing is_published; exposing all rows';
      use_published_only := false;
    END IF;
  END IF;

  -- learning_modules: SELECT for anon + authenticated
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='learning_modules' AND policyname='read_learning_modules'
  ) THEN
    EXECUTE format($f$
      CREATE POLICY read_learning_modules
      ON public.learning_modules
      FOR SELECT
      TO anon, authenticated
      USING (%s);
    $f$, CASE WHEN use_published_only THEN 'COALESCE(is_published, true)' ELSE 'true' END);
  END IF;

  -- quizzes: SELECT for anon + authenticated
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='quizzes' AND policyname='read_quizzes'
  ) THEN
    EXECUTE format($f$
      CREATE POLICY read_quizzes
      ON public.quizzes
      FOR SELECT
      TO anon, authenticated
      USING (%s);
    $f$, CASE WHEN use_published_only THEN 'COALESCE(is_published, true)' ELSE 'true' END);
  END IF;

END $$;

-- test_logs: NO public reads; allow INSERT only by service_role (Netlify functions).
DO $$
BEGIN
  -- Remove any accidental SELECT policies
  DELETE FROM pg_policies
  WHERE schemaname='public' AND tablename='test_logs' AND cmd='SELECT';

  -- Insert policy (service_role only)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='test_logs' AND policyname='sr_insert_test_logs'
  ) THEN
    CREATE POLICY sr_insert_test_logs
    ON public.test_logs
    FOR INSERT
    TO service_role
    WITH CHECK (true);
  END IF;
END $$;

-- Pin function search paths (update these function names if your warning lists differ)
DO $$
BEGIN
  BEGIN
    EXECUTE 'ALTER FUNCTION public.update_updated_at() SET search_path = public, extensions';
  EXCEPTION WHEN undefined_function THEN
    RAISE NOTICE 'Skipped: public.update_updated_at() not found';
  END;

  BEGIN
    EXECUTE 'ALTER FUNCTION public.handle_new_user() SET search_path = public, extensions';
  EXCEPTION WHEN undefined_function THEN
    RAISE NOTICE 'Skipped: public.handle_new_user() not found';
  END;
END $$;
