-- Rename old column if it exists
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'products'
      and column_name  = 'title'
  ) then
    alter table public.products rename column title to name;
  end if;
end $$;

-- Ensure NOT NULL for name (matches prior constraint on title)
alter table public.products
  alter column name set not null;
