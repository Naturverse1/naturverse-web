insert into public.products (slug, name, price_cents, image_url, description, available)
values
  ('turian-plush', 'Turian Plush', 2400, '/images/merch/turian-plush.jpg', 'Soft plushy buddy.', true),
  ('navatar-tee', 'Navatar Tee', 1800, '/images/merch/navatar-tee.jpg', 'Classic tee with Navatar print.', true),
  ('sticker-pack', 'Sticker Pack', 600, '/images/merch/sticker-pack.jpg', 'Assorted Naturverse stickers.', true)
on conflict (slug) do update
set name        = excluded.name,
    price_cents = excluded.price_cents,
    image_url   = excluded.image_url,
    description = excluded.description,
    available   = excluded.available;
