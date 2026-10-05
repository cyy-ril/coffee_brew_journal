-- Run this in your Supabase project's SQL editor (Database -> SQL Editor).
-- It creates the two tables the app needs, and Row Level Security (RLS)
-- policies that make sure a signed-in user can only ever see, add, edit, or
-- delete their OWN rows, never anyone else's. Safe to re-run: tables use
-- "if not exists" and policies are only created if they don't already exist.
--
-- Note: if you already have the older tables, "create table if not exists"
-- skips them. Add the new columns with the migration file first.

create table if not exists public.beans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null,
  roaster_name text,
  origin text,
  roast text,
  roast_date date,
  created_at timestamptz not null default now()
);

alter table public.beans enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'beans'
      and policyname = 'Users can view their own beans'
  ) then
    create policy "Users can view their own beans"
      on public.beans for select to authenticated
      using ((select auth.uid()) = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'beans'
      and policyname = 'Users can add their own beans'
  ) then
    create policy "Users can add their own beans"
      on public.beans for insert to authenticated
      with check ((select auth.uid()) = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'beans'
      and policyname = 'Users can update own beans'
  ) then
    create policy "Users can update own beans"
      on public.beans for update to authenticated
      using ((select auth.uid()) = user_id)
      with check ((select auth.uid()) = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'beans'
      and policyname = 'Users can delete their own beans'
  ) then
    create policy "Users can delete their own beans"
      on public.beans for delete to authenticated
      using ((select auth.uid()) = user_id);
  end if;
end
$$;

create table if not exists public.logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  bean_name text not null,
  date text not null,
  dose text,
  yield_g text,
  grind text,
  temp text,
  time text,
  ratio text,
  rating integer,
  roast text,
  notes text,
  acidity smallint default 3,
  sweetness smallint default 3,
  body smallint default 3,
  balance smallint default 3,
  flavor_tags jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.logs enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'logs'
      and policyname = 'Users can view their own logs'
  ) then
    create policy "Users can view their own logs"
      on public.logs for select to authenticated
      using ((select auth.uid()) = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'logs'
      and policyname = 'Users can add their own logs'
  ) then
    create policy "Users can add their own logs"
      on public.logs for insert to authenticated
      with check ((select auth.uid()) = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'logs'
      and policyname = 'Users can update own logs'
  ) then
    create policy "Users can update own logs"
      on public.logs for update to authenticated
      using ((select auth.uid()) = user_id)
      with check ((select auth.uid()) = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'logs'
      and policyname = 'Users can delete their own logs'
  ) then
    create policy "Users can delete their own logs"
      on public.logs for delete to authenticated
      using ((select auth.uid()) = user_id);
  end if;
end
$$;
