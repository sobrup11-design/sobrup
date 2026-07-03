import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { THERAPIST_PLAN } from "@/lib/pricing";
import { THERAPIST_FAQS } from "@/lib/faq";
import FaqSection from "@/components/FaqSection";
import PricingComparisonTable, { ComparisonRow } from "@/components/PricingComparisonTable";

export const metadata = {
  title: "For Therapists",
  description: "List your therapy practice on Sobrup and get found by people searching for care in California.",
};

const ROWS: ComparisonRow[] = [
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

export default function ForTherapistsPage() {
  return (
    <div className="container-page py-16">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine-600 mb-2">
          For therapists
        </p>
        <h1 className="font-display text-4xl font-medium text-ink leading-tight">
          Get found by people looking for a therapist
        </h1>
        <p className="mt-4 text-ink/70">
          List your practice for free — your name, license type, phone, and
          city are visible right away. Upgrade to Premium to unlock the rest
          of your profile.
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-pine-500 bg-pine-900 p-6 max-w-3xl">
        <div className="flex-1">
          <p className="font-display text-2xl font-medium text-canvas">
            {THERAPIST_PLAN.name} — ${THERAPIST_PLAN.price}
            <span className="text-base font-normal text-pine-100/70">/year</span>
          </p>
          <p className="mt-1 text-sm text-pine-100/70">{THERAPIST_PLAN.tagline}</p>
        </div>
        <div className="flex gap-3 shrink-0">
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

      <div className="mt-10 max-w-3xl">
        <PricingComparisonTable rows={ROWS} premiumLabel="Premium" />
      </div>

      <p className="mt-8 text-sm text-ink/50 max-w-2xl">
        Online payment isn't connected yet — listing your practice is free
        and instant today. We'll follow up by email to complete your
        Premium upgrade once billing is live.
      </p>

      <p className="mt-4 text-sm text-ink/60 max-w-2xl">
        Run a facility instead of an individual practice?{" "}
        <Link href="/for-providers" className="font-semibold text-pine-600 hover:text-pine-700">
          See facility pricing →
        </Link>
      </p>

      <FaqSection items={THERAPIST_FAQS} />
    </div>
  );
}
