-- GRIT Supabase setup - run this in Supabase > SQL Editor > New query
-- Safe to run again: it creates the table if missing and ADDS any missing columns.
-- This fixes: "athletes not synced because grateful field not found"
-- (your old table was created before grateful / remember were added)

create table if not exists public.grit_athletes (
  id text primary key,
  name text default '',
  session text default '',
  pin text default '',
  sport text default '',
  position text default '',
  bold text default '',
  focus text default '',
  metric text default '',
  "metricValue" text default '',
  "favAthlete" text default '',
  "favWhy" text default '',
  grateful text default '',
  motto text default '',
  mindset text default '',
  homework text default '',
  remember text default '',
  photo text default '',
  updated_at timestamptz default now()
);

-- Add any column that an older table is missing:
alter table public.grit_athletes add column if not exists name text default '';
alter table public.grit_athletes add column if not exists session text default '';
alter table public.grit_athletes add column if not exists pin text default '';
alter table public.grit_athletes add column if not exists sport text default '';
alter table public.grit_athletes add column if not exists position text default '';
alter table public.grit_athletes add column if not exists bold text default '';
alter table public.grit_athletes add column if not exists focus text default '';
alter table public.grit_athletes add column if not exists metric text default '';
alter table public.grit_athletes add column if not exists "metricValue" text default '';
alter table public.grit_athletes add column if not exists "favAthlete" text default '';
alter table public.grit_athletes add column if not exists "favWhy" text default '';
alter table public.grit_athletes add column if not exists grateful text default '';
alter table public.grit_athletes add column if not exists motto text default '';
alter table public.grit_athletes add column if not exists mindset text default '';
alter table public.grit_athletes add column if not exists homework text default '';
alter table public.grit_athletes add column if not exists remember text default '';
alter table public.grit_athletes add column if not exists photo text default '';
alter table public.grit_athletes add column if not exists updated_at timestamptz default now();

-- Allow the site (anon key) to read/write - same as the original setup:
alter table public.grit_athletes enable row level security;
drop policy if exists "grit public read" on public.grit_athletes;
drop policy if exists "grit public write" on public.grit_athletes;
create policy "grit public read" on public.grit_athletes for select using (true);
create policy "grit public write" on public.grit_athletes for all using (true) with check (true);
