export type PlanId = "premium";

export interface Plan {
  id: PlanId;
  name: string;
  price: number; // USD/year
  tagline: string;
  features: string[];
}

export const PREMIUM_PLAN: Plan = {
  id: "premium",
  name: "Premium",
  price: 95,
  tagline: "Unlock your full profile and show up first in search.",
  features: [
    "Verified badge",
    "Featured placement across the site",
    "Priority placement in search results",
    "Website link shown",
    "Full description shown",
    "Cover photo shown",
    "Treatment types & insurance shown on profile",
    "Unlimited profile edits",
  ],
};

export const FREE_PLAN_FEATURES = [
  "Facility name",
  "Address",
  "Phone number",
];

export const THERAPIST_PLAN: Plan = {
  id: "premium",
  name: "Premium",
  price: 29.95,
  tagline: "Unlock your full profile and show up first in search.",
  features: [
    "Verified badge",
    "Featured placement in search",
    "Website link shown",
    "Bio shown",
    "Photo shown",
    "Specialties & insurance shown on profile",
    "Unlimited profile edits",
  ],
};

export const THERAPIST_FREE_FEATURES = [
  "Name & license type",
  "Phone number",
  "City (if in-person)",
];
