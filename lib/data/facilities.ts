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

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80";

function mapRow(row: any): Facility {
  return {
    slug: row.slug,
    name: row.name,
    state: row.cities?.states?.name ?? "",
    stateSlug: row.cities?.states?.slug ?? "",
    city: row.cities?.name ?? "",
    citySlug: row.cities?.slug ?? "",
    address: row.address,
    zip: row.zip,
    phone: row.phone ?? "",
    website: row.website ?? undefined,
    description: row.description ?? "",
    treatmentTypes: (row.facility_treatment_types ?? []).map(
      (t: any) => t.treatment_types?.name
    ).filter(Boolean) as TreatmentType[],
    insuranceAccepted: (row.facility_insurance_types ?? []).map(
      (i: any) => i.insurance_types?.name
    ).filter(Boolean) as InsuranceType[],
    verified: row.verified,
    featured: row.featured,
    claimed: row.claimed,
    imageUrl: row.image_url ?? FALLBACK_IMAGE,
    logoUrl: row.logo_url ?? undefined,
  };
}

const FACILITY_SELECT = `
  id, slug, name, address, zip, phone, website, description,
  image_url, logo_url, verified, featured, claimed, owner_id,
  cities ( name, slug, states ( name, slug ) ),
  facility_treatment_types ( treatment_types ( name ) ),
  facility_insurance_types ( insurance_types ( name ) )
`;

export async function getAllFacilities(): Promise<Facility[]> {
  const supabase = await createClient();
  if (!supabase) return mockFacilities;

  const { data, error } = await supabase.from("facilities").select(FACILITY_SELECT);
  if (error || !data) return mockFacilities;

  return data.map(mapRow);
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

  const { data, error } = await supabase
    .from("facilities")
    .select(FACILITY_SELECT)
    .eq("slug", slug)
    .single();

  if (error || !data) return undefined;
  return mapRow(data);
}

// Used by /claim, which only has the slug (not the full state/city path).
export async function getFacilityBySlugAny(
  slug: string
): Promise<Facility | undefined> {
  const supabase = await createClient();
  if (!supabase) return getMockFacilityBySlug(slug);

  const { data, error } = await supabase
    .from("facilities")
    .select(FACILITY_SELECT)
    .eq("slug", slug)
    .single();

  if (error || !data) return undefined;
  return mapRow(data);
}

export async function getCitySummaries(): Promise<CitySummary[]> {
  const supabase = await createClient();
  if (!supabase) return mockCitySummaries;

  const all = await getAllFacilities();
  const map = new Map<string, CitySummary>();
  for (const f of all) {
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
// Supabase env vars aren't set (e.g. in this preview environment).
// Uses a plain client (no cookies) since this runs outside a request.
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

  const { data } = await supabase
    .from("facilities")
    .select("slug, cities ( slug, states ( slug ) )");

  if (!data) return [];

  return data.map((row: any) => ({
    state: row.cities?.states?.slug ?? "",
    city: row.cities?.slug ?? "",
    facility: row.slug,
  }));
}
