export type TreatmentType =
  | "Drug Rehab"
  | "Alcohol Rehab"
  | "Detox"
  | "Mental Health"
  | "Residential Treatment"
  | "Outpatient"
  | "Dual Diagnosis"
  | "Teen Treatment"
  | "Veterans Programs"
  | "Luxury Rehab"
  | "Sober Living";

export const TREATMENT_TYPES: TreatmentType[] = [
  "Drug Rehab",
  "Alcohol Rehab",
  "Detox",
  "Mental Health",
  "Residential Treatment",
  "Outpatient",
  "Dual Diagnosis",
  "Teen Treatment",
  "Veterans Programs",
  "Luxury Rehab",
  "Sober Living",
];

export type InsuranceType =
  | "Medicaid"
  | "Medicare"
  | "Private Insurance"
  | "Self-Pay"
  | "Sliding Scale";

export const INSURANCE_TYPES: InsuranceType[] = [
  "Medicaid",
  "Medicare",
  "Private Insurance",
  "Self-Pay",
  "Sliding Scale",
];

export interface Facility {
  slug: string;
  name: string;
  state: string; // full name, e.g. "California"
  stateSlug: string; // "california"
  city: string;
  citySlug: string; // "los-angeles"
  address: string;
  zip: string;
  phone: string;
  website?: string;
  description: string;
  treatmentTypes: TreatmentType[];
  insuranceAccepted: InsuranceType[];
  verified: boolean;
  featured: boolean;
  claimed: boolean;
  isPremium: boolean;
  imageUrl: string;
  logoUrl?: string;
  lat?: number;
  lng?: number;
}

export interface StateSummary {
  name: string;
  slug: string;
  facilityCount: number;
}

export type Specialty =
  | "Anxiety"
  | "Depression"
  | "Trauma & PTSD"
  | "Addiction"
  | "Couples Therapy"
  | "Family Therapy"
  | "Grief & Loss"
  | "Teens & Adolescents"
  | "LGBTQ+"
  | "Eating Disorders"
  | "OCD"
  | "Bipolar Disorder";

export const SPECIALTIES: Specialty[] = [
  "Anxiety",
  "Depression",
  "Trauma & PTSD",
  "Addiction",
  "Couples Therapy",
  "Family Therapy",
  "Grief & Loss",
  "Teens & Adolescents",
  "LGBTQ+",
  "Eating Disorders",
  "OCD",
  "Bipolar Disorder",
];

export interface Therapist {
  slug: string;
  name: string;
  state: string;
  stateSlug: string;
  city: string;
  citySlug: string;
  address?: string;
  zip?: string;
  phone: string;
  email: string;
  website?: string;
  bio: string;
  licenseType: string;
  licenseNumber?: string;
  photoUrl?: string;
  inPerson: boolean;
  telehealth: boolean;
  acceptingNewClients: boolean;
  specialties: Specialty[];
  insuranceAccepted: InsuranceType[];
  verified: boolean;
  featured: boolean;
  claimed: boolean;
  isPremium: boolean;
}
