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
    question: "How do you charge — per lead, or a flat fee?",
    answer:
      "A flat annual fee, not per lead or per click. You're paying for a better listing, not for individual inquiries, and the price doesn't change based on how much traffic you get.",
  },
  {
    question: "How will I pay once billing is live?",
    answer:
      "We're setting up card payments now. Until that's live, choosing a plan when you claim your listing just flags your interest — we'll follow up by email to complete billing.",
  },
  {
    question: "What can I edit once I'm approved?",
    answer:
      "Phone number, website, address, description, cover photo, treatment types offered, and insurance accepted, all from your own dashboard — no need to email us for routine updates.",
  },
  {
    question: "Who do I contact with questions?",
    answer:
      "Reach out through our contact page and a real person on our team will get back to you — we don't route provider questions through an automated system.",
  },
];
