-- AlpineFlow Database Schema
-- Run this in Supabase SQL Editor

-- Hotel staff table (managed via Supabase Auth)
-- Staff users are created in Supabase Auth dashboard
-- with user_metadata: { role: 'staff', hotel_id: 'xyz' }

-- Guest stays table
create table if not exists public.stays (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,           -- e.g. ALPIN-2847
  hotel_id text not null,              -- matches hotel identifier
  room_number text not null,
  guest_name text not null,
  check_in date not null,
  check_out date not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.stays enable row level security;

-- Allow anyone to look up a stay by code (guest login)
create policy "Allow guest code lookup"
  on public.stays
  for select
  using (true);

-- Only service role can insert/update/delete stays
-- (Hotel staff creates stays via admin panel)

-- Index for fast code lookup
create index stays_code_idx on public.stays (code);
create index stays_hotel_id_idx on public.stays (hotel_id);

-- Sample data for testing
insert into public.stays (code, hotel_id, room_number, guest_name, check_in, check_out)
values
  ('ALPIN-2847', 'hotel-demo', '204', 'Alicia Frommann', '2026-05-07', '2026-05-12'),
  ('ALPIN-1234', 'hotel-demo', '101', 'Test Guest', '2026-05-01', '2026-05-15')
on conflict (code) do nothing;
