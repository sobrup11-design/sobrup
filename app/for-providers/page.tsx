import Link from "next/link";
import { ShieldCheck, PlusCircle } from "lucide-react";
import { PREMIUM_PLAN, THERAPIST_PLAN } from "@/lib/pricing";
import { PROVIDER_FAQS, THERAPIST_FAQS } from "@/lib/faq";
import FaqSection from "@/components/FaqSection";
import PricingComparisonTable, { ComparisonRow } from "@/components/PricingComparisonTable";

export const metadata = {
  title: "Pricing",
  description:
    "One straightforward price to get verified, featured, and found by more people searching for treatment in California — for facilities and therapists.",
};

const FACILITY_ROWS: ComparisonRow[] = [
  { feature: "Name, address & phone shown", free: true, premium: true },
  { feature: "Claim and manage your listing", free: true, premium: true },
  { feature: "Appears in search & category browsing", free: true, premium: true },
  { feature: "Full description shown on profile", free: false, premium: true },
  { feature: "Cover photo shown", free: false, premium: true },
  { feature: "Website link shown", free: false, premium: true },
  { feature: "Treatment types & insurance shown on profile", free: false, premium: true },
  { feature: "Verified badge", free: false, premium: true },
  { feature: "Featured placement across the site", free: false, premium: true },
  { feature: "Priority placement in search results", free: false, premium: true },
  { feature: "Unlimited profile edits", free: false, premium: true },
];

const THERAPIST_ROWS: ComparisonRow[] = [
  { feature: "Name, license type, phone & city shown", free: true, premium: true },
  { feature: "Claim and manage your listing", free: true, premium: true },
  { feature: "Appears in search & specialty browsing", free: true, premium: true },
  { feature: "Bio shown on profile", free: false, premium: true },
  { feature: "Photo shown", free: false, premium: true },
  { feature: "Website link shown", free: false, premium: true },
  { feature: "Specialties shown on profile", free: false, premium: true },
  { feature: "Insurance accepted shown on profile", free: false, premium: true },
  { feature: "Verified badge", free: false, premium: true },
  { feature: "Featured placement in search", free: false, premium: true },
  { feature: "Unlimited profile edits", free: false, premium: true },
];

export default function PricingPage() {
  return (
    <div className="container-page py-16">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine-600 mb-2">
          Pricing
        </p>
        <h1 className="font-display text-4xl font-medium text-ink leading-tight">
          Get found by people who need you
        </h1>
        <p className="mt-4 text-ink/70">
          Every listing starts free — name, address/phone visible right
          away. Claim it to keep it accurate, or upgrade to Premium to
          unlock the rest of your profile.
        </p>
      </div>

      {/* Side-by-side pricing summary: facility vs. therapist */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-pine-500 bg-pine-900 p-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold-300 mb-2">
              Facilities
            </p>
            <p className="font-display text-2xl font-medium text-canvas">
              {PREMIUM_PLAN.name} — ${PREMIUM_PLAN.price}
              <span className="text-base font-normal text-pine-100/70">/year</span>
            </p>
            <p className="mt-1 text-sm text-pine-100/70">{PREMIUM_PLAN.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/claim"
              className="inline-flex items-center gap-2 rounded-xl border border-pine-400 px-5 py-3 text-sm font-semibold text-canvas hover:bg-pine-800 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Claim free listing
            </Link>
            <Link
              href={`/claim?plan=${PREMIUM_PLAN.id}`}
              className="inline-flex items-center justify-center rounded-xl bg-gold-500 px-5 py-3 text-sm font-semibold text-white hover:bg-gold-600 transition-colors"
            >
              Get Premium
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-pine-500 bg-pine-900 p-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold-300 mb-2">
              Therapists
            </p>
            <p className="font-display text-2xl font-medium text-canvas">
              {THERAPIST_PLAN.name} — ${THERAPIST_PLAN.price}
              <span className="text-base font-normal text-pine-100/70">/year</span>
            </p>
            <p className="mt-1 text-sm text-pine-100/70">{THERAPIST_PLAN.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/list-your-practice"
              className="inline-flex items-center gap-2 rounded-xl border border-pine-400 px-5 py-3 text-sm font-semibold text-canvas hover:bg-pine-800 transition-colors"
            >
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              List for free
            </Link>
            <Link
              href={`/list-your-practice?plan=${THERAPIST_PLAN.id}`}
              className="inline-flex items-center justify-center rounded-xl bg-gold-500 px-5 py-3 text-sm font-semibold text-white hover:bg-gold-600 transition-colors"
            >
              Get Premium
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-ink/50 max-w-2xl">
        Online payment isn't connected yet — claiming or listing is instant
        today. We'll follow up by email to complete your Premium upgrade
        once billing is live.
      </p>

      {/* Facility details */}
      <h2 className="mt-14 font-display text-2xl font-medium text-ink">Facility pricing details</h2>
      <div className="mt-4 max-w-3xl">
        <PricingComparisonTable rows={FACILITY_ROWS} premiumLabel="Premium" />
      </div>

      {/* Therapist details */}
      <h2 className="mt-14 font-display text-2xl font-medium text-ink">Therapist pricing details</h2>
      <div className="mt-4 max-w-3xl">
        <PricingComparisonTable rows={THERAPIST_ROWS} premiumLabel="Premium" />
      </div>

      <div className="mt-14">
        <h2 className="font-display text-2xl font-medium text-ink mb-6">Facility FAQ</h2>
        <FaqSection items={PROVIDER_FAQS} />
      </div>

      <div className="mt-14">
        <h2 className="font-display text-2xl font-medium text-ink mb-6">Therapist FAQ</h2>
        <FaqSection items={THERAPIST_FAQS} />
      </div>
    </div>
  );
}
