-- GRIT Training Page — Supabase setup
-- Run this once in Supabase Dashboard -> SQL Editor -> New query

-- 1) Training sections, per athlete (Dynamic Stretch | Warm Up, Core, Main Lift, Acceleration and Speed)
create table if not exists public.grit_training (
  athlete_id text primary key,
  sections jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.grit_training enable row level security;

create policy "allow all for anon"
  on public.grit_training for all
  to anon
  using (true)
  with check (true);

-- 2) Athletes: names + GRIT Session + 4-digit PIN
-- Names + sessions are seeded from Google Calendar in the page.
-- PIN is set by the athlete on first sign-in, or cleared by Coach.
create table if not exists public.grit_athletes (
  id text primary key,
  name text not null default '',
  session text not null default '',
  pin text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.grit_athletes enable row level security;

create policy "allow all for anon"
  on public.grit_athletes for all
  to anon
  using (true)
  with check (true);

-- 3) Realtime so other phones get updates live
alter publication supabase_realtime add table public.grit_training;
alter publication supabase_realtime add table public.grit_athletes;
