-- ===========
-- Naturverse MVP Schema + RLS (idempotent)
-- Run in Supabase SQL editor as role: postgres
-- ===========

-- Extensions (idempotent)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Schema
CREATE SCHEMA IF NOT EXISTS natur;

-- ---------- Helpers ----------
-- updated_at trigger
CREATE OR REPLACE FUNCTION natur.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ---------- PROFILES ----------
-- One row per auth user (id mirrors auth.users.id)
DROP TABLE IF EXISTS natur.profiles CASCADE;
CREATE TABLE natur.profiles (
  id          uuid PRIMARY KEY,              -- auth.uid()
  email       text UNIQUE,
  display_name text,
  avatar_url  text,
  kid_safe    boolean DEFAULT true,
  theme       text DEFAULT 'system',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_profiles_updated
BEFORE UPDATE ON natur.profiles
FOR EACH ROW EXECUTE FUNCTION natur.set_updated_at();

-- Enable RLS
ALTER TABLE natur.profiles ENABLE ROW LEVEL SECURITY;

-- (Re)create policies
DROP POLICY IF EXISTS "Profiles: read self"   ON natur.profiles;
DROP POLICY IF EXISTS "Profiles: upsert self" ON natur.profiles;
DROP POLICY IF EXISTS "Profiles: update self" ON natur.profiles;

CREATE POLICY "Profiles: read self"
  ON natur.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Profiles: upsert self"
  ON natur.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles: update self"
  ON natur.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

GRANT USAGE ON SCHEMA natur TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON natur.profiles TO authenticated;
REVOKE ALL ON natur.profiles FROM anon;

-- ---------- NAVATARS (character cards) ----------
DROP TABLE IF EXISTS natur.navatars CASCADE;
CREATE TABLE natur.navatars (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES natur.profiles(id) ON DELETE CASCADE,
  name        text,
  base_type   text NOT NULL,        -- 'Animal' | 'Fruit' | 'Insect' | 'Spirit'
  backstory   text,
  image_url   text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_navatars_user ON natur.navatars(user_id);
CREATE TRIGGER trg_navatars_updated
BEFORE UPDATE ON natur.navatars
FOR EACH ROW EXECUTE FUNCTION natur.set_updated_at();

ALTER TABLE natur.navatars ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Navatars: owner read"   ON natur.navatars;
DROP POLICY IF EXISTS "Navatars: owner write"  ON natur.navatars;

CREATE POLICY "Navatars: owner read"
  ON natur.navatars FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Navatars: owner write"
  ON natur.navatars FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

GRANT SELECT, INSERT, UPDATE, DELETE ON natur.navatars TO authenticated;

-- ---------- PASSPORT: Stamps ----------
DROP TABLE IF EXISTS natur.passport_stamps CASCADE;
CREATE TABLE natur.passport_stamps (
  id          bigserial PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES natur.profiles(id) ON DELETE CASCADE,
  kingdom     text NOT NULL,        -- e.g., 'Thailandia'
  stamped_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, kingdom)
);
CREATE INDEX IF NOT EXISTS idx_stamps_user ON natur.passport_stamps(user_id);

ALTER TABLE natur.passport_stamps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Stamps: owner read" ON natur.passport_stamps;
DROP POLICY IF EXISTS "Stamps: owner write" ON natur.passport_stamps;

CREATE POLICY "Stamps: owner read"
  ON natur.passport_stamps FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Stamps: owner write"
  ON natur.passport_stamps FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

GRANT SELECT, INSERT, UPDATE, DELETE ON natur.passport_stamps TO authenticated;

-- ---------- Badges (catalog + user_badges) ----------
DROP TABLE IF EXISTS natur.badges CASCADE;
CREATE TABLE natur.badges (
  id          text PRIMARY KEY,     -- e.g., 'explorer_01'
  name        text NOT NULL,
  description text,
  icon        text,                 -- emoji or URL
  active      boolean DEFAULT true
);

DROP TABLE IF EXISTS natur.user_badges CASCADE;
CREATE TABLE natur.user_badges (
  user_id     uuid NOT NULL REFERENCES natur.profiles(id) ON DELETE CASCADE,
  badge_id    text NOT NULL REFERENCES natur.badges(id),
  awarded_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, badge_id)
);

ALTER TABLE natur.badges DISABLE ROW LEVEL SECURITY; -- public read via anon
GRANT SELECT ON natur.badges TO anon, authenticated;

ALTER TABLE natur.user_badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "UserBadges: owner read"  ON natur.user_badges;
DROP POLICY IF EXISTS "UserBadges: owner write" ON natur.user_badges;

CREATE POLICY "UserBadges: owner read"
  ON natur.user_badges FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "UserBadges: owner write"
  ON natur.user_badges FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

GRANT SELECT, INSERT, DELETE ON natur.user_badges TO authenticated;

-- ---------- XP events + NATUR coin ledger ----------
DROP TABLE IF EXISTS natur.xp_events CASCADE;
CREATE TABLE natur.xp_events (
  id          bigserial PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES natur.profiles(id) ON DELETE CASCADE,
  source      text NOT NULL,      -- 'quiz', 'story', etc.
  amount      int  NOT NULL CHECK (amount <> 0),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_xp_user ON natur.xp_events(user_id);

ALTER TABLE natur.xp_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "XP: owner read"  ON natur.xp_events;
DROP POLICY IF EXISTS "XP: owner write" ON natur.xp_events;

CREATE POLICY "XP: owner read"
  ON natur.xp_events FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "XP: owner write"
  ON natur.xp_events FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

GRANT SELECT, INSERT ON natur.xp_events TO authenticated;

DROP VIEW IF EXISTS natur.user_xp;
CREATE VIEW natur.user_xp AS
SELECT user_id, COALESCE(SUM(amount),0)::int AS xp
FROM natur.xp_events
GROUP BY user_id;

DROP TABLE IF EXISTS natur.natur_ledger CASCADE;
CREATE TABLE natur.natur_ledger (
  id          bigserial PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES natur.profiles(id) ON DELETE CASCADE,
  delta       int NOT NULL,       -- positive earn, negative spend
  reason      text,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ledger_user ON natur.natur_ledger(user_id);

ALTER TABLE natur.natur_ledger ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "NATUR: owner read"  ON natur.natur_ledger;
DROP POLICY IF EXISTS "NATUR: owner write" ON natur.natur_ledger;

CREATE POLICY "NATUR: owner read"
  ON natur.natur_ledger FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "NATUR: owner write"
  ON natur.natur_ledger FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

GRANT SELECT, INSERT ON natur.natur_ledger TO authenticated;

DROP VIEW IF EXISTS natur.natur_balances;
CREATE VIEW natur.natur_balances AS
SELECT user_id, COALESCE(SUM(delta),0)::int AS balance
FROM natur.natur_ledger
GROUP BY user_id;

-- ---------- Marketplace (catalog + wishlists) ----------
DROP TABLE IF EXISTS natur.products CASCADE;
CREATE TABLE natur.products (
  id           bigserial PRIMARY KEY,
  slug         text UNIQUE,
  name         text NOT NULL,
  description  text,
  price_cents  int NOT NULL CHECK (price_cents >= 0),
  active       boolean DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);
-- Public read
ALTER TABLE natur.products DISABLE ROW LEVEL SECURITY;
GRANT SELECT ON natur.products TO anon, authenticated;

DROP TABLE IF EXISTS natur.wishlists CASCADE;
CREATE TABLE natur.wishlists (
  id          bigserial PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES natur.profiles(id) ON DELETE CASCADE,
  product_id  bigint NOT NULL REFERENCES natur.products(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE natur.wishlists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Wishlists: owner read"  ON natur.wishlists;
DROP POLICY IF EXISTS "Wishlists: owner write" ON natur.wishlists;

CREATE POLICY "Wishlists: owner read"
  ON natur.wishlists FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Wishlists: owner write"
  ON natur.wishlists FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

GRANT SELECT, INSERT, DELETE ON natur.wishlists TO authenticated;

-- ---------- Newsletter signups (public form) ----------
DROP TABLE IF EXISTS natur.newsletter_subscribers CASCADE;
CREATE TABLE natur.newsletter_subscribers (
  id         bigserial PRIMARY KEY,
  email      text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE natur.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
-- Allow anyone to insert; only service role can read
DROP POLICY IF EXISTS "Newsletter: public insert" ON natur.newsletter_subscribers;
CREATE POLICY "Newsletter: public insert"
  ON natur.newsletter_subscribers FOR INSERT TO anon, authenticated
  WITH CHECK (true);
REVOKE ALL ON natur.newsletter_subscribers FROM anon, authenticated;

-- ---------- Grants (final touch) ----------
GRANT USAGE ON SCHEMA natur TO anon, authenticated;
