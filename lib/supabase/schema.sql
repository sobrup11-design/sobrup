-- Sobrup.com initial schema
-- Run this in the Supabase SQL editor once a project is created.
-- Normalized enough to support search/filter at scale without
-- over-engineering for Phase 1.

create table if not exists states (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table if not exists cities (
  id uuid primary key default gen_random_uuid(),
  state_id uuid not null references states(id) on delete cascade,
  name text not null,
  slug text not null,
  unique (state_id, slug)
);

create table if not exists treatment_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table if not exists insurance_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table if not exists facilities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id), -- set once claimed
  name text not null,
  slug text not null,
  city_id uuid not null references cities(id),
  address text not null,
  zip text not null,
  phone text,
  website text,
  description text,
  image_url text,
  logo_url text,
  lat double precision,
  lng double precision,
  verified boolean not null default false,
  featured boolean not null default false,
  claimed boolean not null default false,
  is_premium boolean not null default false,
  premium_tier text, -- 'premium' | null (matches lib/pricing.ts PlanId)
  premium_expires_at timestamptz,
  source text not null default 'seed', -- 'seed' (e.g. SAMHSA import) | 'claimed' | 'admin'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_id, slug)
);

create table if not exists facility_treatment_types (
  facility_id uuid references facilities(id) on delete cascade,
  treatment_type_id uuid references treatment_types(id) on delete cascade,
  primary key (facility_id, treatment_type_id)
);

create table if not exists facility_insurance_types (
  facility_id uuid references facilities(id) on delete cascade,
  insurance_type_id uuid references insurance_types(id) on delete cascade,
  primary key (facility_id, insurance_type_id)
);

create table if not exists facility_claims (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references facilities(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending', -- pending | approved | rejected
  verification_notes text,
  created_at timestamptz not null default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references facilities(id) on delete cascade,
  plan text not null default 'premium', -- single tier for now (lib/pricing.ts)
  payment_provider text not null default 'stripe', -- 'stripe' | 'paypal'
  stripe_customer_id text,
  stripe_subscription_id text,
  paypal_subscription_id text,
  status text not null default 'inactive', -- active | past_due | canceled | inactive
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_facilities_city on facilities(city_id);
create index if not exists idx_facilities_featured on facilities(featured) where featured = true;
create index if not exists idx_cities_state on cities(state_id);

-- Row Level Security: public read on listing data, owner-only writes.
alter table facilities enable row level security;

create policy "Public can read facilities"
  on facilities for select
  using (true);

create policy "Owners can update their claimed facility"
  on facilities for update
  using (auth.uid() = owner_id);

alter table facility_claims enable row level security;

create policy "Users can submit their own claim"
  on facility_claims for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own claims"
  on facility_claims for select
  using (auth.uid() = user_id);

-- Admin approve/reject happens via the service role key (lib/supabase/admin.ts),
-- which bypasses RLS entirely — no admin-specific policy needed here.

alter table facility_treatment_types enable row level security;
alter table facility_insurance_types enable row level security;

create policy "Public can read facility treatment types"
  on facility_treatment_types for select
  using (true);

create policy "Owners can manage their facility treatment types"
  on facility_treatment_types for all
  using (
    exists (
      select 1 from facilities
      where facilities.id = facility_treatment_types.facility_id
      and facilities.owner_id = auth.uid()
    )
  );

create policy "Public can read facility insurance types"
  on facility_insurance_types for select
  using (true);

create policy "Owners can manage their facility insurance types"
  on facility_insurance_types for all
  using (
    exists (
      select 1 from facilities
      where facilities.id = facility_insurance_types.facility_id
      and facilities.owner_id = auth.uid()
    )
  );
