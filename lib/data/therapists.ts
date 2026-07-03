import { createClient } from "@/lib/supabase/server";
import { therapists as mockTherapists, getTherapistByPath as getMockTherapistByPath, getTherapistBySlug as getMockTherapistBySlug } from "@/lib/mock-therapists";
import { Therapist, Specialty, InsuranceType } from "@/lib/types";

// Same explicit-join pattern as lib/data/facilities.ts — fetches cities/
// states/specialties/insurance separately and joins in JS, rather than
// relying on Supabase's nested-embed select syntax.

interface Lookups {
  citiesById: Map<string, { name: string; slug: string; stateId: string }>;
  statesById: Map<string, { name: string; slug: string }>;
  specialtiesById: Map<string, string>;
  insuranceTypesById: Map<string, string>;
  therapistSpecialtyIds: Map<string, string[]>;
  therapistInsuranceIds: Map<string, string[]>;
}

async function loadLookups(supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>): Promise<Lookups> {
  const [
    { data: cities },
    { data: states },
    { data: specialties },
    { data: insuranceTypes },
    { data: ts },
    { data: ti },
  ] = await Promise.all([
    supabase.from("cities").select("id, name, slug, state_id"),
    supabase.from("states").select("id, name, slug"),
    supabase.from("specialties").select("id, name"),
    supabase.from("insurance_types").select("id, name"),
    supabase.from("therapist_specialties").select("therapist_id, specialty_id"),
    supabase.from("therapist_insurance_types").select("therapist_id, insurance_type_id"),
  ]);

  const citiesById = new Map((cities ?? []).map((c: any) => [c.id, { name: c.name, slug: c.slug, stateId: c.state_id }]));
  const statesById = new Map((states ?? []).map((s: any) => [s.id, { name: s.name, slug: s.slug }]));
  const specialtiesById = new Map((specialties ?? []).map((s: any) => [s.id, s.name]));
  const insuranceTypesById = new Map((insuranceTypes ?? []).map((i: any) => [i.id, i.name]));

  const therapistSpecialtyIds = new Map<string, string[]>();
  for (const row of ts ?? []) {
    const list = therapistSpecialtyIds.get(row.therapist_id) ?? [];
    list.push(row.specialty_id);
    therapistSpecialtyIds.set(row.therapist_id, list);
  }

  const therapistInsuranceIds = new Map<string, string[]>();
  for (const row of ti ?? []) {
    const list = therapistInsuranceIds.get(row.therapist_id) ?? [];
    list.push(row.insurance_type_id);
    therapistInsuranceIds.set(row.therapist_id, list);
  }

  return { citiesById, statesById, specialtiesById, insuranceTypesById, therapistSpecialtyIds, therapistInsuranceIds };
}

function mapRow(row: any, lookups: Lookups): Therapist {
  const city = row.city_id ? lookups.citiesById.get(row.city_id) : undefined;
  const state = city ? lookups.statesById.get(city.stateId) : undefined;

  const specialties = (lookups.therapistSpecialtyIds.get(row.id) ?? [])
    .map((id) => lookups.specialtiesById.get(id))
    .filter(Boolean) as Specialty[];

  const insuranceAccepted = (lookups.therapistInsuranceIds.get(row.id) ?? [])
    .map((id) => lookups.insuranceTypesById.get(id))
    .filter(Boolean) as InsuranceType[];

  const isPremium = Boolean(row.is_premium);

  return {
    slug: row.slug,
    name: row.name,
    state: state?.name ?? "",
    stateSlug: state?.slug ?? "",
    city: city?.name ?? "",
    citySlug: city?.slug ?? "",
    address: row.address ?? undefined,
    zip: row.zip ?? undefined,
    phone: row.phone ?? "",
    email: row.email ?? "",
    // Same free-vs-premium split as facilities: name/phone/city are always
    // shown; website, bio, and photo require Premium. Specialties/insurance
    // stay in the data (search depends on it) but display is gated.
    website: isPremium ? (row.website ?? undefined) : undefined,
    bio: isPremium ? (row.bio ?? "") : "",
    licenseType: row.license_type ?? "",
    licenseNumber: row.license_number ?? undefined,
    photoUrl: isPremium ? (row.photo_url ?? undefined) : undefined,
    inPerson: row.in_person,
    telehealth: row.telehealth,
    acceptingNewClients: row.accepting_new_clients,
    specialties,
    insuranceAccepted,
    verified: row.verified,
    featured: row.featured,
    claimed: row.claimed,
    isPremium,
  };
}

const THERAPIST_COLUMNS =
  "id, slug, name, address, zip, phone, email, website, bio, license_type, license_number, photo_url, in_person, telehealth, accepting_new_clients, verified, featured, claimed, owner_id, city_id, is_premium";

export async function getAllTherapists(): Promise<Therapist[]> {
  const supabase = await createClient();
  if (!supabase) return mockTherapists;

  const [{ data, error }, lookups] = await Promise.all([
    supabase.from("therapists").select(THERAPIST_COLUMNS),
    loadLookups(supabase),
  ]);

  if (error || !data) return mockTherapists;
  return data.map((row) => mapRow(row, lookups));
}

export async function getFeaturedTherapists(): Promise<Therapist[]> {
  const all = await getAllTherapists();
  return all.filter((t) => t.featured);
}

export async function getTherapistByPath(
  stateSlug: string,
  citySlug: string,
  slug: string
): Promise<Therapist | undefined> {
  const supabase = await createClient();
  if (!supabase) return getMockTherapistByPath(stateSlug, citySlug, slug);

  const [{ data, error }, lookups] = await Promise.all([
    supabase.from("therapists").select(THERAPIST_COLUMNS).eq("slug", slug).single(),
    loadLookups(supabase),
  ]);

  if (error || !data) return undefined;
  return mapRow(data, lookups);
}

export async function getTherapistBySlugAny(slug: string): Promise<Therapist | undefined> {
  const supabase = await createClient();
  if (!supabase) return getMockTherapistBySlug(slug);

  const [{ data, error }, lookups] = await Promise.all([
    supabase.from("therapists").select(THERAPIST_COLUMNS).eq("slug", slug).single(),
    loadLookups(supabase),
  ]);

  if (error || !data) return undefined;
  return mapRow(data, lookups);
}

export async function getAllTherapistPaths() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return mockTherapists
      .filter((t) => t.stateSlug && t.citySlug)
      .map((t) => ({ state: t.stateSlug, city: t.citySlug, therapist: t.slug }));
  }

  const { createClient: createPlainClient } = await import("@supabase/supabase-js");
  const supabase = createPlainClient(url, anonKey);

  const [{ data: rows }, { data: cities }, { data: states }] = await Promise.all([
    supabase.from("therapists").select("slug, city_id"),
    supabase.from("cities").select("id, slug, state_id"),
    supabase.from("states").select("id, slug"),
  ]);

  if (!rows) return [];

  const citiesById = new Map((cities ?? []).map((c: any) => [c.id, c]));
  const statesById = new Map((states ?? []).map((s: any) => [s.id, s]));

  return rows
    .map((r: any) => {
      const city = r.city_id ? citiesById.get(r.city_id) : undefined;
      const state = city ? statesById.get(city.state_id) : undefined;
      return { state: state?.slug ?? "", city: city?.slug ?? "", therapist: r.slug };
    })
    .filter((p) => p.state && p.city);
}
