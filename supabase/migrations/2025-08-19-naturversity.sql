-- Student quiz progress
create table if not exists public.student_progress (
  id uuid primary key default gen_random_uuid(),
  student_id text not null,
  quiz_id text not null,
  score int not null check (score >= 0 and score <= 100),
  created_at timestamptz not null default now()
);

-- Parent controls per child
create table if not exists public.parent_controls (
  id uuid primary key default gen_random_uuid(),
  child_id text not null unique,
  content_locked boolean not null default false,
  spending_limit int,
  updated_at timestamptz not null default now()
);

-- Custodial NATUR wallet (centralized balance for now)
create table if not exists public.natur_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique,
  balance numeric not null default 0
);

-- DAO proposals & votes
create table if not exists public.dao_proposals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.dao_votes (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.dao_proposals (id) on delete cascade,
  user_id text not null,
  vote boolean not null,
  unique (proposal_id, user_id)
);

-- Seed one demo proposal if none exists
insert into public.dao_proposals (title, description)
select 'Add Music Zone expansion', 'New instruments, loops, and collabs'
where not exists (select 1 from public.dao_proposals);
