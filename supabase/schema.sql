-- NightReset database schema
-- Run this once against your Supabase project (SQL Editor or `supabase db push`).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- sessions — one row per Night Reset generated for a user
-- ---------------------------------------------------------------------------
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  concern text not null,
  content jsonb,
  status text not null default 'generating' check (status in ('generating', 'ready', 'completed', 'failed')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists sessions_user_id_idx on public.sessions (user_id, created_at desc);

alter table public.sessions enable row level security;

-- Reads and deletes go through the user's own session (dashboard history).
-- Inserts/updates are performed server-side with the service role key inside
-- /api/reset, so there are intentionally no insert/update policies here.
create policy "sessions: select own" on public.sessions
  for select using (auth.uid() = user_id);

create policy "sessions: delete own" on public.sessions
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- free_usage — tracks the single free reset each user gets
-- ---------------------------------------------------------------------------
create table if not exists public.free_usage (
  user_id uuid primary key references auth.users (id) on delete cascade,
  sessions_used integer not null default 0
);

alter table public.free_usage enable row level security;

-- Read-only from the client. Writes happen only via the service role
-- (server-side) so a user can never grant themselves extra free sessions.
create policy "free_usage: select own" on public.free_usage
  for select using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- payments — one row per Razorpay order
-- ---------------------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  razorpay_order_id text not null unique,
  razorpay_payment_id text unique,
  status text not null default 'created' check (status in ('created', 'paid', 'failed')),
  amount integer not null,
  created_at timestamptz not null default now()
);

create index if not exists payments_user_id_idx on public.payments (user_id, created_at desc);

alter table public.payments enable row level security;

-- Read-only from the client. All writes happen via the service role after
-- server-side Razorpay signature verification.
create policy "payments: select own" on public.payments
  for select using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- entitlements — one row per activated 7-day pass
-- ---------------------------------------------------------------------------
create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  active boolean not null default true,
  activated_at timestamptz not null default now(),
  expires_at timestamptz not null,
  payment_id uuid unique references public.payments (id) on delete set null
);

create index if not exists entitlements_user_id_idx on public.entitlements (user_id, expires_at desc);

alter table public.entitlements enable row level security;

-- Read-only from the client. All writes happen via the service role, and the
-- unique constraint on payment_id prevents a duplicate entitlement being
-- minted for the same payment even under a retried webhook.
create policy "entitlements: select own" on public.entitlements
  for select using (auth.uid() = user_id);
