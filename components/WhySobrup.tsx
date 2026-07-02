import { ShieldCheck, ListChecks, CreditCard, RefreshCw, Phone, MapIcon } from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Verified providers",
    body: "Claimed listings are reviewed before they display a verified badge.",
  },
  {
    icon: ListChecks,
    title: "Easy comparison",
    body: "Filter by treatment type, insurance, and location to compare options side by side.",
  },
  {
    icon: CreditCard,
    title: "Insurance information",
    body: "See accepted insurance and payment options before you reach out.",
  },
  {
    icon: RefreshCw,
    title: "Updated listings",
    body: "Facility owners can update their own information anytime.",
  },
  {
    icon: Phone,
    title: "Direct contact",
    body: "Reach facilities directly by phone or website — no middleman.",
  },
  {
    icon: MapIcon,
    title: "California coverage",
    body: "Starting with a focused, well-maintained directory across the state.",
  },
];

export default function WhySobrup() {
  return (
    <section className="bg-pine-900 py-16">
      <div className="container-page">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold-300 mb-2">
          Why Sobrup
        </p>
        <h2 className="font-display text-3xl font-medium text-canvas mb-10 max-w-lg">
          Built to help you find care you can trust
        </h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pine-800 text-gold-300">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-canvas mb-1">{title}</h3>
                <p className="text-sm text-pine-100/70">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
