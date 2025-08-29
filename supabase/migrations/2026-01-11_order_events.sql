create table if not exists public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null,
  status text not null check (status in ('placed','packed','shipped','delivered')),
  note text,
  created_at timestamptz not null default now()
);
create index if not exists order_events_order_id_idx on public.order_events(order_id);

alter table public.order_events enable row level security;
create policy "user sees own order events" on public.order_events
for select to authenticated
using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
