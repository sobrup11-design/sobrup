import { createClient } from "@/lib/supabase/server";
import {
  facilities as mockFacilities,
  citySummaries as mockCitySummaries,
  getFacility as getMockFacility,
  getFacilityBySlug as getMockFacilityBySlug,
} from "@/lib/mock-data";
import { Facility, InsuranceType, TreatmentType } from "@/lib/types";
import type { CitySummary } from "@/lib/mock-data";

// This is the single place that decides "real data or mock data" for every
// public-facing page (homepage, browse, facility profile). Pages should
// import from here, never from lib/mock-data directly, so the whole site
// upgrades to real data the moment Supabase is connected.
//
// Note: this fetches cities/states/treatment types/insurance types as
// separate queries and joins them in JS, rather than using Supabase's
// nested-embed select syntax. The embed syntax was silently returning
// empty city/state data in production — safer to do the join explicitly.

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80";

interface Lookups {
  citiesById: Map<string, { name: string; slug: string; stateId: string }>;
  statesById: Map<string, { name: string; slug: string }>;
  treatmentTypesById: Map<string, string>;
  insuranceTypesById: Map<string, string>;
  facilityTreatmentTypeIds: Map<string, string[]>; // facility_id -> treatment_type_id[]
  facilityInsuranceTypeIds: Map<string, string[]>; // facility_id -> insurance_type_id[]
}

async function loadLookups(supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>): Promise<Lookups> {
  const [
    { data: cities },
    { data: states },
    { data: treatmentTypes },
    { data: insuranceTypes },
    { data: ftt },
    { data: fit },
  ] = await Promise.all([
    supabase.from("cities").select("id, name, slug, state_id"),
    supabase.from("states").select("id, name, slug"),
    supabase.from("treatment_types").select("id, name"),
    supabase.from("insurance_types").select("id, name"),
    supabase.from("facility_treatment_types").select("facility_id, treatment_type_id"),
    supabase.from("facility_insurance_types").select("facility_id, insurance_type_id"),
  ]);

  const citiesById = new Map((cities ?? []).map((c: any) => [c.id, { name: c.name, slug: c.slug, stateId: c.state_id }]));
  const statesById = new Map((states ?? []).map((s: any) => [s.id, { name: s.name, slug: s.slug }]));
  const treatmentTypesById = new Map((treatmentTypes ?? []).map((t: any) => [t.id, t.name]));
  const insuranceTypesById = new Map((insuranceTypes ?? []).map((i: any) => [i.id, i.name]));

  const facilityTreatmentTypeIds = new Map<string, string[]>();
  for (const row of ftt ?? []) {
    const list = facilityTreatmentTypeIds.get(row.facility_id) ?? [];
    list.push(row.treatment_type_id);
    facilityTreatmentTypeIds.set(row.facility_id, list);
  }

  const facilityInsuranceTypeIds = new Map<string, string[]>();
  for (const row of fit ?? []) {
    const list = facilityInsuranceTypeIds.get(row.facility_id) ?? [];
    list.push(row.insurance_type_id);
    facilityInsuranceTypeIds.set(row.facility_id, list);
  }

  return { citiesById, statesById, treatmentTypesById, insuranceTypesById, facilityTreatmentTypeIds, facilityInsuranceTypeIds };
}

function mapRow(row: any, lookups: Lookups): Facility {
  const city = lookups.citiesById.get(row.city_id);
  const state = city ? lookups.statesById.get(city.stateId) : undefined;

  const treatmentTypes = (lookups.facilityTreatmentTypeIds.get(row.id) ?? [])
    .map((id) => lookups.treatmentTypesById.get(id))
    .filter(Boolean) as TreatmentType[];

  const insuranceAccepted = (lookups.facilityInsuranceTypeIds.get(row.id) ?? [])
    .map((id) => lookups.insuranceTypesById.get(id))
    .filter(Boolean) as InsuranceType[];

  return {
    slug: row.slug,
    name: row.name,
    state: state?.name ?? "",
    stateSlug: state?.slug ?? "",
    city: city?.name ?? "",
    citySlug: city?.slug ?? "",
    address: row.address,
    zip: row.zip,
    phone: row.phone ?? "",
    website: row.website ?? undefined,
    description: row.description ?? "",
    treatmentTypes,
    insuranceAccepted,
    verified: row.verified,
    featured: row.featured,
    claimed: row.claimed,
    imageUrl: row.image_url ?? FALLBACK_IMAGE,
    logoUrl: row.logo_url ?? undefined,
  };
}

const FACILITY_COLUMNS =
  "id, slug, name, address, zip, phone, website, description, image_url, logo_url, verified, featured, claimed, owner_id, city_id";

export async function getAllFacilities(): Promise<Facility[]> {
  const supabase = await createClient();
  if (!supabase) return mockFacilities;

  const [{ data, error }, lookups] = await Promise.all([
    supabase.from("facilities").select(FACILITY_COLUMNS),
    loadLookups(supabase),
  ]);

  if (error || !data) return mockFacilities;

  return data.map((row) => mapRow(row, lookups));
}

export async function getFeaturedFacilities(): Promise<Facility[]> {
  const all = await getAllFacilities();
  return all.filter((f) => f.featured);
}

export async function getFacilityByPath(
  stateSlug: string,
  citySlug: string,
  slug: string
): Promise<Facility | undefined> {
  const supabase = await createClient();
  if (!supabase) return getMockFacility(stateSlug, citySlug, slug);

  const [{ data, error }, lookups] = await Promise.all([
    supabase.from("facilities").select(FACILITY_COLUMNS).eq("slug", slug).single(),
    loadLookups(supabase),
  ]);

  if (error || !data) return undefined;
  return mapRow(data, lookups);
}

// Used by /claim, which only has the slug (not the full state/city path).
export async function getFacilityBySlugAny(
  slug: string
): Promise<Facility | undefined> {
  const supabase = await createClient();
  if (!supabase) return getMockFacilityBySlug(slug);

  const [{ data, error }, lookups] = await Promise.all([
    supabase.from("facilities").select(FACILITY_COLUMNS).eq("slug", slug).single(),
    loadLookups(supabase),
  ]);

  if (error || !data) return undefined;
  return mapRow(data, lookups);
}

export async function getCitySummaries(): Promise<CitySummary[]> {
  const supabase = await createClient();
  if (!supabase) return mockCitySummaries;

  const all = await getAllFacilities();
  const map = new Map<string, CitySummary>();
  for (const f of all) {
    if (!f.citySlug) continue;
    const key = `${f.stateSlug}/${f.citySlug}`;
    const existing = map.get(key);
    map.set(key, {
      name: f.city,
      slug: f.citySlug,
      stateSlug: f.stateSlug,
      facilityCount: (existing?.facilityCount ?? 0) + 1,
    });
  }
  return Array.from(map.values());
}

// For generateStaticParams — falls back to mock slugs at build time if
// Supabase env vars aren't set. Uses a plain client (no cookies) since
// this runs outside a request.
export async function getAllFacilityPaths() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return mockFacilities.map((f) => ({
      state: f.stateSlug,
      city: f.citySlug,
      facility: f.slug,
    }));
  }

  const { createClient: createPlainClient } = await import("@supabase/supabase-js");
  const supabase = createPlainClient(url, anonKey);

  const [{ data: facilities }, { data: cities }, { data: states }] = await Promise.all([
    supabase.from("facilities").select("slug, city_id"),
    supabase.from("cities").select("id, slug, state_id"),
    supabase.from("states").select("id, slug"),
  ]);

  if (!facilities) return [];

  const citiesById = new Map((cities ?? []).map((c: any) => [c.id, c]));
  const statesById = new Map((states ?? []).map((s: any) => [s.id, s]));

  return facilities.map((f: any) => {
    const city = citiesById.get(f.city_id);
    const state = city ? statesById.get(city.state_id) : undefined;
    return {
      state: state?.slug ?? "",
      city: city?.slug ?? "",
      facility: f.slug,
    };
  }).filter((p) => p.state && p.city);
}
