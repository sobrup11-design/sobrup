-- Therapist directory — additive migration, run AFTER schema.sql and seed.sql.
-- Deliberately a separate table from facilities: a therapist listing has a
-- different shape (license type, specialties, telehealth vs in-person,
-- accepting new clients) than a facility listing, and mixing them into one
-- table would make both worse. Reuses states/cities/insurance_types from
-- the existing schema.

create table if not exists specialties (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

insert into specialties (name, slug) values
  ('Anxiety', 'anxiety'),
  ('Depression', 'depression'),
  ('Trauma & PTSD', 'trauma-ptsd'),
  ('Addiction', 'addiction'),
  ('Couples Therapy', 'couples-therapy'),
  ('Family Therapy', 'family-therapy'),
  ('Grief & Loss', 'grief-loss'),
  ('Teens & Adolescents', 'teens-adolescents'),
  ('LGBTQ+', 'lgbtq'),
  ('Eating Disorders', 'eating-disorders'),
  ('OCD', 'ocd'),
  ('Bipolar Disorder', 'bipolar-disorder')
on conflict (slug) do nothing;

create table if not exists therapists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id), -- set once claimed
  name text not null,
  slug text not null,
  city_id uuid references cities(id), -- nullable: telehealth-only therapists may not need a public address
  address text,
  zip text,
  phone text,
  email text,
  website text,
  bio text,
  license_type text, -- e.g. 'LMFT', 'LCSW', 'PhD', 'PsyD'
  license_number text,
  photo_url text,
  in_person boolean not null default true,
  telehealth boolean not null default false,
  accepting_new_clients boolean not null default true,
  verified boolean not null default false,
  featured boolean not null default false,
  claimed boolean not null default false,
  is_premium boolean not null default false,
  premium_expires_at timestamptz,
  source text not null default 'self_submitted', -- therapists are self-listed, not bulk-imported
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_id, slug)
);

create table if not exists therapist_specialties (
  therapist_id uuid references therapists(id) on delete cascade,
  specialty_id uuid references specialties(id) on delete cascade,
  primary key (therapist_id, specialty_id)
);

create table if not exists therapist_insurance_types (
  therapist_id uuid references therapists(id) on delete cascade,
  insurance_type_id uuid references insurance_types(id) on delete cascade,
  primary key (therapist_id, insurance_type_id)
);

create table if not exists therapist_claims (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid not null references therapists(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  verification_notes text,
  created_at timestamptz not null default now()
);

-- "List your practice" — since therapists have no bulk public-data source
-- (unlike facilities/SAMHSA), this submission flow IS the primary way
-- therapist listings get created, not a fallback.
create table if not exists therapist_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  therapist_name text not null,
  city_name text,
  address text,
  zip text,
  phone text not null,
  email text not null,
  website text,
  bio text,
  license_type text not null,
  license_number text,
  in_person boolean not null default true,
  telehealth boolean not null default false,
  specialties text[] not null default '{}',
  insurance_types text[] not null default '{}',
  submitter_name text not null,
  submitter_email text not null,
  submitter_phone text not null,
  created_therapist_id uuid references therapists(id),
  created_at timestamptz not null default now()
);

create table if not exists therapist_subscriptions (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid not null references therapists(id) on delete cascade,
  plan text not null default 'premium', -- $25/year tier, lib/pricing.ts
  payment_provider text not null default 'stripe',
  stripe_customer_id text,
  stripe_subscription_id text,
  paypal_subscription_id text,
  status text not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_therapists_city on therapists(city_id);
create index if not exists idx_therapists_featured on therapists(featured) where featured = true;

-- RLS — same pattern as facilities.
alter table therapists enable row level security;

create policy "Public can read therapists"
  on therapists for select
  using (true);

create policy "Owners can update their claimed therapist listing"
  on therapists for update
  using (auth.uid() = owner_id);

alter table therapist_specialties enable row level security;
alter table therapist_insurance_types enable row level security;

create policy "Public can read therapist specialties"
  on therapist_specialties for select
  using (true);

create policy "Owners can manage their therapist specialties"
  on therapist_specialties for all
  using (
    exists (
      select 1 from therapists
      where therapists.id = therapist_specialties.therapist_id
      and therapists.owner_id = auth.uid()
    )
  );

create policy "Public can read therapist insurance types"
  on therapist_insurance_types for select
  using (true);

create policy "Owners can manage their therapist insurance types"
  on therapist_insurance_types for all
  using (
    exists (
      select 1 from therapists
      where therapists.id = therapist_insurance_types.therapist_id
      and therapists.owner_id = auth.uid()
    )
  );

alter table therapist_claims enable row level security;

create policy "Users can submit their own therapist claim"
  on therapist_claims for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own therapist claims"
  on therapist_claims for select
  using (auth.uid() = user_id);

alter table therapist_submissions enable row level security;

create policy "Users can submit a new therapist listing"
  on therapist_submissions for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own therapist submissions"
  on therapist_submissions for select
  using (auth.uid() = user_id);

-- Admin approve/reject for both therapist_claims and therapist_submissions
-- happens via the service role key and bypasses RLS, same as facilities.
