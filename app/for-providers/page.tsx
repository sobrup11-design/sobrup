import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { PREMIUM_PLAN } from "@/lib/pricing";
import { PROVIDER_FAQS } from "@/lib/faq";
import FaqSection from "@/components/FaqSection";
import PricingComparisonTable, { ComparisonRow } from "@/components/PricingComparisonTable";

export const metadata = {
  title: "Pricing for Treatment Providers",
  description:
    "One straightforward price to get verified, featured, and found by more people searching for treatment in California.",
};

const ROWS: ComparisonRow[] = [
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

export default function ForProvidersPage() {
  return (
    <div className="container-page py-16">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine-600 mb-2">
          For providers
        </p>
        <h1 className="font-display text-4xl font-medium text-ink leading-tight">
          Get your facility found by people who need it
        </h1>
        <p className="mt-4 text-ink/70">
          Every facility gets a free listing automatically, with your name,
          address, and phone visible right away. Claim it to keep it
          accurate, or upgrade to Premium to unlock the rest of your profile.
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-pine-500 bg-pine-900 p-6 max-w-3xl">
        <div className="flex-1">
          <p className="font-display text-2xl font-medium text-canvas">
            {PREMIUM_PLAN.name} — ${PREMIUM_PLAN.price}
            <span className="text-base font-normal text-pine-100/70">/year</span>
          </p>
          <p className="mt-1 text-sm text-pine-100/70">{PREMIUM_PLAN.tagline}</p>
        </div>
        <div className="flex gap-3 shrink-0">
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

      <div className="mt-10 max-w-3xl">
        <PricingComparisonTable rows={ROWS} premiumLabel="Premium" />
      </div>

      <p className="mt-8 text-sm text-ink/50 max-w-2xl">
        Online payment isn't connected yet — claiming your free listing is
        instant today. We'll follow up by email to complete your Premium
        upgrade once billing is live.
      </p>

      <p className="mt-4 text-sm text-ink/60 max-w-2xl">
        Are you an individual therapist rather than a facility?{" "}
        <Link href="/for-therapists" className="font-semibold text-pine-600 hover:text-pine-700">
          See therapist pricing →
        </Link>
      </p>

      <FaqSection items={PROVIDER_FAQS} />
    </div>
  );
}
