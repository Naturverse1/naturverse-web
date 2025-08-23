-- Minimal seed data
INSERT INTO natur.badges (id, name, description, icon) VALUES
  ('explorer_01','Explorer','Created a Navatar','🧭')
ON CONFLICT (id) DO NOTHING;

INSERT INTO natur.products (slug, name, description, price_cents, active) VALUES
  ('tee-classic','Classic Tee','Naturverse logo tee', 2400, true),
  ('sticker-pack','Sticker Pack','14 kingdoms stickers', 900, true)
ON CONFLICT (slug) DO NOTHING;
