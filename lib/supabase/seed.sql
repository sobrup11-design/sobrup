-- Run this AFTER schema.sql. Seeds California + the 8 sample facilities
-- so the claim → approve → edit loop is testable against real data,
-- matching what's currently in lib/mock-data.ts.

insert into states (name, slug) values ('California', 'california')
  on conflict (slug) do nothing;

insert into cities (state_id, name, slug)
select s.id, c.name, c.slug from states s,
  (values
    ('Los Angeles', 'los-angeles'),
    ('San Diego', 'san-diego'),
    ('San Francisco', 'san-francisco'),
    ('Sacramento', 'sacramento'),
    ('San Jose', 'san-jose'),
    ('Palm Springs', 'palm-springs'),
    ('Oakland', 'oakland'),
    ('Fresno', 'fresno')
  ) as c(name, slug)
where s.slug = 'california'
on conflict (state_id, slug) do nothing;

insert into treatment_types (name, slug) values
  ('Drug Rehab', 'drug-rehab'),
  ('Alcohol Rehab', 'alcohol-rehab'),
  ('Detox', 'detox'),
  ('Mental Health', 'mental-health'),
  ('Residential Treatment', 'residential-treatment'),
  ('Outpatient', 'outpatient'),
  ('Dual Diagnosis', 'dual-diagnosis'),
  ('Teen Treatment', 'teen-treatment'),
  ('Veterans Programs', 'veterans-programs'),
  ('Luxury Rehab', 'luxury-rehab'),
  ('Sober Living', 'sober-living')
on conflict (slug) do nothing;

insert into insurance_types (name, slug) values
  ('Medicaid', 'medicaid'),
  ('Medicare', 'medicare'),
  ('Private Insurance', 'private-insurance'),
  ('Self-Pay', 'self-pay'),
  ('Sliding Scale', 'sliding-scale')
on conflict (slug) do nothing;

-- Facilities (mirrors lib/mock-data.ts)
insert into facilities (name, slug, city_id, address, zip, phone, website, description, image_url, verified, featured, claimed, source)
select 'Harbor View Recovery Center', 'harbor-view-recovery-center', c.id, '4200 Ocean Terrace Blvd', '90045', '(310) 555-0142', 'https://example.com',
  'Harbor View offers medically supervised detox and residential care in a quiet coastal setting, with individualized treatment plans for substance use and co-occurring mental health conditions.',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80', true, true, false, 'seed'
from cities c where c.slug = 'los-angeles'
on conflict (city_id, slug) do nothing;

insert into facilities (name, slug, city_id, address, zip, phone, website, description, image_url, verified, featured, claimed, source)
select 'Clearwater Outpatient Services', 'clearwater-outpatient-services', c.id, '118 Bay Vista Ave', '92101', '(619) 555-0198', null,
  'A flexible outpatient program offering evening and weekend sessions for individuals balancing recovery with work and family commitments.',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80', false, false, false, 'seed'
from cities c where c.slug = 'san-diego'
on conflict (city_id, slug) do nothing;

insert into facilities (name, slug, city_id, address, zip, phone, website, description, image_url, verified, featured, claimed, source)
select 'Golden Gate Mental Wellness', 'golden-gate-mental-wellness', c.id, '560 Presidio View St', '94129', '(415) 555-0187', 'https://example.com',
  'Outpatient mental health clinic offering individual therapy, psychiatric care, and group programs for anxiety, depression, and trauma.',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80', true, true, false, 'seed'
from cities c where c.slug = 'san-francisco'
on conflict (city_id, slug) do nothing;

insert into facilities (name, slug, city_id, address, zip, phone, website, description, image_url, verified, featured, claimed, source)
select 'Riverpark Teen Treatment Center', 'riverpark-teen-treatment-center', c.id, '902 Willow Creek Rd', '95814', '(916) 555-0176', 'https://example.com',
  'Specializes in adolescent substance use and mental health treatment, combining clinical care with family therapy and academic support.',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80', true, true, false, 'seed'
from cities c where c.slug = 'sacramento'
on conflict (city_id, slug) do nothing;

insert into facilities (name, slug, city_id, address, zip, phone, website, description, image_url, verified, featured, claimed, source)
select 'Liberty Veterans Recovery Program', 'liberty-veterans-recovery-program', c.id, '77 Fieldstone Dr', '95110', '(408) 555-0133', null,
  'A residential program built specifically for veterans, offering trauma-informed care, peer support groups, and coordination with VA benefits.',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80', true, false, false, 'seed'
from cities c where c.slug = 'san-jose'
on conflict (city_id, slug) do nothing;

insert into facilities (name, slug, city_id, address, zip, phone, website, description, image_url, verified, featured, claimed, source)
select 'Sunridge Luxury Wellness', 'sunridge-luxury-wellness', c.id, '3300 Desert Bloom Way', '92262', '(760) 555-0111', 'https://example.com',
  'An upscale residential facility offering private suites, holistic therapies, and a low client-to-staff ratio for individualized recovery care.',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80', true, true, false, 'seed'
from cities c where c.slug = 'palm-springs'
on conflict (city_id, slug) do nothing;

insert into facilities (name, slug, city_id, address, zip, phone, website, description, image_url, verified, featured, claimed, source)
select 'Riverbend Detox Clinic', 'riverbend-detox-clinic', c.id, '56 Mill Run Ct', '94612', '(510) 555-0154', null,
  '24/7 medically monitored detox with direct transition support into residential or outpatient programs.',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80', false, false, false, 'seed'
from cities c where c.slug = 'oakland'
on conflict (city_id, slug) do nothing;

insert into facilities (name, slug, city_id, address, zip, phone, website, description, image_url, verified, featured, claimed, source)
select 'Central Valley Recovery Center', 'central-valley-recovery-center', c.id, '214 Orchard Grove Ln', '93721', '(559) 555-0122', null,
  'Residential and outpatient treatment for substance use disorders, with Spanish-language services and sliding-scale fees.',
  'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=1200&q=80', false, false, false, 'seed'
from cities c where c.slug = 'fresno'
on conflict (city_id, slug) do nothing;

-- Junction rows: treatment types per facility
insert into facility_treatment_types (facility_id, treatment_type_id)
select f.id, tt.id from facilities f, treatment_types tt
where (f.slug, tt.slug) in (
  ('harbor-view-recovery-center', 'detox'),
  ('harbor-view-recovery-center', 'residential-treatment'),
  ('harbor-view-recovery-center', 'dual-diagnosis'),
  ('clearwater-outpatient-services', 'outpatient'),
  ('clearwater-outpatient-services', 'alcohol-rehab'),
  ('clearwater-outpatient-services', 'drug-rehab'),
  ('golden-gate-mental-wellness', 'mental-health'),
  ('golden-gate-mental-wellness', 'outpatient'),
  ('golden-gate-mental-wellness', 'dual-diagnosis'),
  ('riverpark-teen-treatment-center', 'teen-treatment'),
  ('riverpark-teen-treatment-center', 'mental-health'),
  ('riverpark-teen-treatment-center', 'residential-treatment'),
  ('liberty-veterans-recovery-program', 'veterans-programs'),
  ('liberty-veterans-recovery-program', 'dual-diagnosis'),
  ('liberty-veterans-recovery-program', 'residential-treatment'),
  ('sunridge-luxury-wellness', 'luxury-rehab'),
  ('sunridge-luxury-wellness', 'residential-treatment'),
  ('sunridge-luxury-wellness', 'dual-diagnosis'),
  ('riverbend-detox-clinic', 'detox'),
  ('riverbend-detox-clinic', 'drug-rehab'),
  ('riverbend-detox-clinic', 'alcohol-rehab'),
  ('central-valley-recovery-center', 'residential-treatment'),
  ('central-valley-recovery-center', 'outpatient'),
  ('central-valley-recovery-center', 'drug-rehab')
)
on conflict do nothing;

-- Junction rows: insurance types per facility
insert into facility_insurance_types (facility_id, insurance_type_id)
select f.id, it.id from facilities f, insurance_types it
where (f.slug, it.slug) in (
  ('harbor-view-recovery-center', 'private-insurance'),
  ('harbor-view-recovery-center', 'medicare'),
  ('harbor-view-recovery-center', 'self-pay'),
  ('clearwater-outpatient-services', 'medicaid'),
  ('clearwater-outpatient-services', 'private-insurance'),
  ('golden-gate-mental-wellness', 'private-insurance'),
  ('golden-gate-mental-wellness', 'medicaid'),
  ('golden-gate-mental-wellness', 'medicare'),
  ('riverpark-teen-treatment-center', 'private-insurance'),
  ('riverpark-teen-treatment-center', 'self-pay'),
  ('liberty-veterans-recovery-program', 'medicaid'),
  ('liberty-veterans-recovery-program', 'medicare'),
  ('liberty-veterans-recovery-program', 'private-insurance'),
  ('sunridge-luxury-wellness', 'private-insurance'),
  ('sunridge-luxury-wellness', 'self-pay'),
  ('riverbend-detox-clinic', 'medicaid'),
  ('riverbend-detox-clinic', 'medicare'),
  ('central-valley-recovery-center', 'medicaid'),
  ('central-valley-recovery-center', 'sliding-scale')
)
on conflict do nothing;
