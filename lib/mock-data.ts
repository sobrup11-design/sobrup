import { Facility, StateSummary } from "./types";

// Phase 1 scope: California only. The schema/components are state-agnostic,
// so adding other states later is just a matter of adding more rows here
// (or in Supabase) — no code changes required.

export const facilities: Facility[] = [
  {
    slug: "harbor-view-recovery-center",
    name: "Harbor View Recovery Center",
    state: "California",
    stateSlug: "california",
    city: "Los Angeles",
    citySlug: "los-angeles",
    address: "4200 Ocean Terrace Blvd",
    zip: "90045",
    phone: "(310) 555-0142",
    website: "https://example.com",
    description:
      "Harbor View offers medically supervised detox and residential care in a quiet coastal setting, with individualized treatment plans for substance use and co-occurring mental health conditions.",
    treatmentTypes: ["Detox", "Residential Treatment", "Dual Diagnosis"],
    insuranceAccepted: ["Private Insurance", "Medicare", "Self-Pay"],
    verified: true,
    featured: true,
    claimed: true,
    imageUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80",
  },
  {
    slug: "clearwater-outpatient-services",
    name: "Clearwater Outpatient Services",
    state: "California",
    stateSlug: "california",
    city: "San Diego",
    citySlug: "san-diego",
    address: "118 Bay Vista Ave",
    zip: "92101",
    phone: "(619) 555-0198",
    description:
      "A flexible outpatient program offering evening and weekend sessions for individuals balancing recovery with work and family commitments.",
    treatmentTypes: ["Outpatient", "Alcohol Rehab", "Drug Rehab"],
    insuranceAccepted: ["Medicaid", "Private Insurance"],
    verified: false,
    featured: false,
    claimed: false,
    imageUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
  },
  {
    slug: "golden-gate-mental-wellness",
    name: "Golden Gate Mental Wellness",
    state: "California",
    stateSlug: "california",
    city: "San Francisco",
    citySlug: "san-francisco",
    address: "560 Presidio View St",
    zip: "94129",
    phone: "(415) 555-0187",
    website: "https://example.com",
    description:
      "Outpatient mental health clinic offering individual therapy, psychiatric care, and group programs for anxiety, depression, and trauma.",
    treatmentTypes: ["Mental Health", "Outpatient", "Dual Diagnosis"],
    insuranceAccepted: ["Private Insurance", "Medicaid", "Medicare"],
    verified: true,
    featured: true,
    claimed: true,
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80",
  },
  {
    slug: "riverpark-teen-treatment-center",
    name: "Riverpark Teen Treatment Center",
    state: "California",
    stateSlug: "california",
    city: "Sacramento",
    citySlug: "sacramento",
    address: "902 Willow Creek Rd",
    zip: "95814",
    phone: "(916) 555-0176",
    website: "https://example.com",
    description:
      "Specializes in adolescent substance use and mental health treatment, combining clinical care with family therapy and academic support.",
    treatmentTypes: ["Teen Treatment", "Mental Health", "Residential Treatment"],
    insuranceAccepted: ["Private Insurance", "Self-Pay"],
    verified: true,
    featured: true,
    claimed: true,
    imageUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80",
  },
  {
    slug: "liberty-veterans-recovery-program",
    name: "Liberty Veterans Recovery Program",
    state: "California",
    stateSlug: "california",
    city: "San Jose",
    citySlug: "san-jose",
    address: "77 Fieldstone Dr",
    zip: "95110",
    phone: "(408) 555-0133",
    description:
      "A residential program built specifically for veterans, offering trauma-informed care, peer support groups, and coordination with VA benefits.",
    treatmentTypes: ["Veterans Programs", "Dual Diagnosis", "Residential Treatment"],
    insuranceAccepted: ["Medicaid", "Medicare", "Private Insurance"],
    verified: true,
    featured: false,
    claimed: true,
    imageUrl:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80",
  },
  {
    slug: "sunridge-luxury-wellness",
    name: "Sunridge Luxury Wellness",
    state: "California",
    stateSlug: "california",
    city: "Palm Springs",
    citySlug: "palm-springs",
    address: "3300 Desert Bloom Way",
    zip: "92262",
    phone: "(760) 555-0111",
    website: "https://example.com",
    description:
      "An upscale residential facility offering private suites, holistic therapies, and a low client-to-staff ratio for individualized recovery care.",
    treatmentTypes: ["Luxury Rehab", "Residential Treatment", "Dual Diagnosis"],
    insuranceAccepted: ["Private Insurance", "Self-Pay"],
    verified: true,
    featured: true,
    claimed: true,
    imageUrl:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80",
  },
  {
    slug: "riverbend-detox-clinic",
    name: "Riverbend Detox Clinic",
    state: "California",
    stateSlug: "california",
    city: "Oakland",
    citySlug: "oakland",
    address: "56 Mill Run Ct",
    zip: "94612",
    phone: "(510) 555-0154",
    description:
      "24/7 medically monitored detox with direct transition support into residential or outpatient programs.",
    treatmentTypes: ["Detox", "Drug Rehab", "Alcohol Rehab"],
    insuranceAccepted: ["Medicaid", "Medicare"],
    verified: false,
    featured: false,
    claimed: false,
    imageUrl:
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80",
  },
  {
    slug: "central-valley-recovery-center",
    name: "Central Valley Recovery Center",
    state: "California",
    stateSlug: "california",
    city: "Fresno",
    citySlug: "fresno",
    address: "214 Orchard Grove Ln",
    zip: "93721",
    phone: "(559) 555-0122",
    description:
      "Residential and outpatient treatment for substance use disorders, with Spanish-language services and sliding-scale fees.",
    treatmentTypes: ["Residential Treatment", "Outpatient", "Drug Rehab"],
    insuranceAccepted: ["Medicaid", "Sliding Scale"],
    verified: false,
    featured: false,
    claimed: false,
    imageUrl:
      "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=1200&q=80",
  },
];

export const stateSummaries: StateSummary[] = Array.from(
  facilities.reduce((map, f) => {
    map.set(f.stateSlug, {
      name: f.state,
      slug: f.stateSlug,
      facilityCount: (map.get(f.stateSlug)?.facilityCount ?? 0) + 1,
    });
    return map;
  }, new Map<string, StateSummary>())
).map(([, v]) => v);

export interface CitySummary {
  name: string;
  slug: string;
  stateSlug: string;
  facilityCount: number;
}

export const citySummaries: CitySummary[] = Array.from(
  facilities.reduce((map, f) => {
    const key = `${f.stateSlug}/${f.citySlug}`;
    map.set(key, {
      name: f.city,
      slug: f.citySlug,
      stateSlug: f.stateSlug,
      facilityCount: (map.get(key)?.facilityCount ?? 0) + 1,
    });
    return map;
  }, new Map<string, CitySummary>())
).map(([, v]) => v);

export function getFacility(stateSlug: string, citySlug: string, slug: string) {
  return facilities.find(
    (f) => f.stateSlug === stateSlug && f.citySlug === citySlug && f.slug === slug
  );
}

export function getFacilityBySlug(slug: string) {
  return facilities.find((f) => f.slug === slug);
}

export function getFeatured() {
  return facilities.filter((f) => f.featured);
}
