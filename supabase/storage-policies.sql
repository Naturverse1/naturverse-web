-- Storage buckets: avatars, navatars (create from Studio if not present)
-- RLS policies so users can read public files and write their own

-- Public read for these buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars','avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('navatars','navatars', true)
ON CONFLICT (id) DO NOTHING;

-- Policies (idempotent)
-- Delete existing with same names if present
DO $$
BEGIN
  DELETE FROM storage.policies WHERE name IN
    ('avatars-public-read','avatars-owner-write','navatars-public-read','navatars-owner-write');
EXCEPTION WHEN OTHERS THEN NULL;
END$$;

-- Public read
INSERT INTO storage.policies (name, bucket_id, definition, action)
VALUES
('avatars-public-read','avatars', '(bucket_id = ''avatars'')', 'SELECT'),
('navatars-public-read','navatars', '(bucket_id = ''navatars'')', 'SELECT');

-- Owner write (folder per user: userId/*)
INSERT INTO storage.policies (name, bucket_id, definition, action)
VALUES
('avatars-owner-write','avatars',
 'auth.role() = ''authenticated'' AND (storage.foldername(name))[1] = auth.uid()::text',
 'INSERT'),
('navatars-owner-write','navatars',
 'auth.role() = ''authenticated'' AND (storage.foldername(name))[1] = auth.uid()::text',
 'INSERT');
