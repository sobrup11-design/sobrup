import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
import { PREMIUM_PLAN, FREE_PLAN_FEATURES } from "@/lib/pricing";
import { PROVIDER_FAQS } from "@/lib/faq";
import FaqSection from "@/components/FaqSection";

export const metadata = {
  title: "Pricing for Treatment Providers",
  description:
    "One straightforward price to get verified, featured, and found by more people searching for treatment in California.",
};

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
          Every facility gets a free listing automatically. Claim yours to
          keep it accurate, or upgrade to one straightforward Premium plan.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 max-w-3xl">
        {/* Free tier */}
        <div className="flex flex-col rounded-2xl border border-line bg-white p-8">
          <h2 className="font-display text-xl font-medium text-ink">Free</h2>
          <p className="mt-1 text-sm text-ink/60">Included automatically, no account required.</p>
          <p className="mt-6 font-display text-3xl font-medium text-ink">$0</p>
          <ul className="mt-6 space-y-3 flex-1">
            {FREE_PLAN_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-ink/70">
                <Check className="h-4 w-4 shrink-0 text-pine-500 mt-0.5" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/claim"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 text-sm font-semibold text-ink hover:bg-mist transition-colors"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Claim your listing
          </Link>
        </div>

        {/* Premium tier */}
        <div className="flex flex-col rounded-2xl border border-pine-500 bg-pine-900 p-8 text-canvas shadow-xl">
          <h2 className="font-display text-xl font-medium text-canvas">
            {PREMIUM_PLAN.name}
          </h2>
          <p className="mt-1 text-sm text-pine-100/70">{PREMIUM_PLAN.tagline}</p>
          <p className="mt-6 font-display text-3xl font-medium text-canvas">
            ${PREMIUM_PLAN.price}
            <span className="text-base font-normal text-pine-100/70">/year</span>
          </p>
          <ul className="mt-6 space-y-3 flex-1">
            {PREMIUM_PLAN.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-pine-50">
                <Check className="h-4 w-4 shrink-0 text-gold-300 mt-0.5" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href={`/claim?plan=${PREMIUM_PLAN.id}`}
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-gold-500 px-4 py-3 text-sm font-semibold text-white hover:bg-gold-600 transition-colors"
          >
            Get started — ${PREMIUM_PLAN.price}/year
          </Link>
        </div>
      </div>

      <p className="mt-8 text-sm text-ink/50 max-w-2xl">
        Online payment isn't connected yet — claiming your listing is free
        and instant today. We'll follow up by email to complete your upgrade
        once billing is live.
      </p>

      <FaqSection items={PROVIDER_FAQS} />
    </div>
  );
}
