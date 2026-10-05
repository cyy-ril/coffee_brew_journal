-- For upgrading the initial Coffee Brew Journal database (this was made before the cupping
-- profile and bean details existed). 
-- A brand-new database does not need this, because the file of supabase/schema.sql already has all of these columns.

alter table beans
  add column if not exists roaster_name text,
  add column if not exists origin text,
  add column if not exists roast_date date;

update beans set roaster_name = roaster where roaster_name is null;

alter table logs
  add column if not exists acidity smallint default 3,
  add column if not exists sweetness smallint default 3,
  add column if not exists body smallint default 3,
  add column if not exists balance smallint default 3,
  add column if not exists aftertaste smallint default 3,
  add column if not exists flavor_tags jsonb default '[]'::jsonb;
