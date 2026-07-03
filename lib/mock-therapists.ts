import { Therapist } from "./types";

export const therapists: Therapist[] = [
  {
    slug: "dr-maria-chen",
    name: "Dr. Maria Chen, PsyD",
    state: "California",
    stateSlug: "california",
    city: "Los Angeles",
    citySlug: "los-angeles",
    address: "1200 Wilshire Blvd, Suite 400",
    zip: "90017",
    phone: "(213) 555-0142",
    email: "contact@example.com",
    website: "https://example.com",
    bio: "Dr. Chen specializes in anxiety, trauma, and cognitive behavioral therapy for adults, with over 12 years of clinical experience.",
    licenseType: "PsyD",
    inPerson: true,
    telehealth: true,
    acceptingNewClients: true,
    specialties: ["Anxiety", "Trauma & PTSD", "Depression"],
    insuranceAccepted: ["Private Insurance", "Self-Pay"],
    verified: true,
    featured: true,
    claimed: true,
    isPremium: true,
  },
  {
    slug: "james-rivera-lmft",
    name: "James Rivera, LMFT",
    state: "California",
    stateSlug: "california",
    city: "San Diego",
    citySlug: "san-diego",
    phone: "(619) 555-0198",
    email: "contact@example.com",
    bio: "James works with couples and families navigating conflict, communication challenges, and major life transitions. Telehealth only.",
    licenseType: "LMFT",
    inPerson: false,
    telehealth: true,
    acceptingNewClients: true,
    specialties: ["Couples Therapy", "Family Therapy"],
    insuranceAccepted: ["Medicaid", "Sliding Scale"],
    verified: false,
    featured: false,
    claimed: false,
    isPremium: false,
  },
];

export function getTherapistBySlug(slug: string) {
  return therapists.find((t) => t.slug === slug);
}

export function getTherapistByPath(stateSlug: string, citySlug: string, slug: string) {
  return therapists.find((t) => t.stateSlug === stateSlug && t.citySlug === citySlug && t.slug === slug);
}
