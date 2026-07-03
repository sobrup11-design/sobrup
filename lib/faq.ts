export interface FaqItem {
  question: string;
  answer: string;
}

export const PROVIDER_FAQS: FaqItem[] = [
  {
    question: "Why should I claim my listing?",
    answer:
      "Every facility gets a free listing automatically, built from public information. Claiming it lets you fix anything that's wrong, add your own description, and get a verified badge — unclaimed listings can't be edited by anyone but our team.",
  },
  {
    question: "How long does review take?",
    answer:
      "We review every claim by hand rather than approving automatically, so we can confirm you're actually affiliated with the facility. Most claims are reviewed within 2 business days.",
  },
  {
    question: "What information do I need to submit a claim?",
    answer:
      "Your name, your role at the facility, a work email, and a phone number. That's enough for our team to verify you before approving the claim.",
  },
  {
    question: "What happens if I never claim my listing?",
    answer:
      "It stays live with the basic public information — name, address, phone, treatment types — but no one can update it, and it won't show a verified badge or appear in featured placements.",
  },
  {
    question: "Can I upgrade later, or is claiming and upgrading separate?",
    answer:
      "Separate. Claiming your listing is free and instant approval-pending — you can do that today. Choosing Premium just flags your interest for now; we'll follow up by email once billing is live.",
  },
  {
    question: "Does Premium actually get more visibility?",
    answer:
      "Yes — featured placement on the homepage and priority position in search results within your city and treatment category. Free listings still appear, just in normal relevance order.",
  },
  {
    question: "What does Premium actually pay for?",
    answer:
      "A complete, visible profile — your website, description, photo, and treatment/insurance details shown publicly, plus a verified badge and priority placement in search. It's a flat yearly fee for a better listing, not a pay-per-inquiry service.",
  },
  {
    question: "How will I pay once billing is live?",
    answer:
      "We're setting up card payments now. Until that's live, choosing a plan when you claim your listing just flags your interest — we'll follow up by email to complete billing.",
  },
  {
    question: "What can I edit once I'm approved?",
    answer:
      "Phone number and address on any plan. Website, description, cover photo, treatment types, and insurance accepted are saved and used for search on the free plan too, but only shown on your public profile once you upgrade to Premium.",
  },
  {
    question: "Who do I contact with questions?",
    answer:
      "Reach out through our contact page and a real person on our team will get back to you — we don't route provider questions through an automated system.",
  },
];

export const THERAPIST_FAQS: FaqItem[] = [
  {
    question: "How is this different from listing a facility?",
    answer:
      "Facilities are pulled in from public licensing data and can be claimed. Therapist listings work the other way — there's no bulk public list of private practices, so you list your own practice directly, and we verify it by hand.",
  },
  {
    question: "How long does review take?",
    answer:
      "Most new listings and claims are reviewed within 2 business days. We check every submission by hand before it goes live.",
  },
  {
    question: "Do I need to be licensed to list here?",
    answer:
      "Yes — we ask for your license type (and optionally your license number) as part of listing, since that's core to what makes this directory trustworthy for people searching.",
  },
  {
    question: "Can I list as telehealth-only, with no public address?",
    answer:
      "Yes. Select telehealth during listing and you can skip the city/address fields entirely — your listing will show up in specialty and name searches without a location.",
  },
  {
    question: "What does Premium actually pay for?",
    answer:
      "A complete, visible profile — your bio, photo, website, specialties, and insurance shown publicly, plus a verified badge and featured placement in search. A flat $25/year, not a pay-per-inquiry service.",
  },
  {
    question: "What can I edit once I'm approved?",
    answer:
      "Your bio, specialties, session format, insurance accepted, and contact info, all from your own dashboard.",
  },
];
