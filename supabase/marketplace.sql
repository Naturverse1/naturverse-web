create table if not exists token_balances (
  id uuid primary key default gen_random_uuid(),
  device_id text unique not null,
  balance integer not null default 1000,
  updated_at timestamptz default now()
);

create table if not exists wishlists (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  product_id text not null,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  total_tokens integer not null,
  name text, email text, phone text,
  address1 text, address2 text, city text, region text, postal text, country text,
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id text not null,
  title text,
  qty integer not null,
  price_tokens integer not null
);