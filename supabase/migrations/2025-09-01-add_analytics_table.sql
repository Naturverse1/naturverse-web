create table if not exists analytics (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  from_page text,
  to_page text,
  text text,
  created_at timestamp default now()
);
