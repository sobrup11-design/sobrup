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
  tagline: "Everything you need to stand out and stay accurate.",
  features: [
    "Verified badge",
    "Featured placement across the site",
    "Priority search placement",
    "Unlimited profile edits",
    "Up to 30 photos, plus video",
    "Logo upload",
    "Staff profiles",
    "Insurance & amenities details",
    "Lead contact form",
    "Appointment request form",
    "Analytics dashboard",
  ],
};

export const FREE_PLAN_FEATURES = [
  "Facility name, address & phone",
  "Website link",
  "Google map",
  "Basic description",
  "Treatment types & insurance accepted",
];
