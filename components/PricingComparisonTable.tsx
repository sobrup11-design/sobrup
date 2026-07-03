import { Check, X } from "lucide-react";

export interface ComparisonRow {
  feature: string;
  free: boolean;
  premium: boolean;
}

export default function PricingComparisonTable({
  rows,
  premiumLabel,
}: {
  rows: ComparisonRow[];
  premiumLabel: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="grid grid-cols-[1fr_5rem_5rem] sm:grid-cols-[1fr_8rem_8rem] items-center border-b border-line bg-mist px-6 py-4">
        <span className="text-sm font-semibold text-ink">Feature</span>
        <span className="text-center text-sm font-semibold text-ink">Free</span>
        <span className="text-center text-sm font-semibold text-ink">{premiumLabel}</span>
      </div>
      {rows.map((row, i) => (
        <div
          key={row.feature}
          className={`grid grid-cols-[1fr_5rem_5rem] sm:grid-cols-[1fr_8rem_8rem] items-center px-6 py-4 ${
            i !== rows.length - 1 ? "border-b border-line" : ""
          }`}
        >
          <span className="text-sm text-ink/80 pr-4">{row.feature}</span>
          <span className="flex justify-center">
            {row.free ? (
              <Check className="h-5 w-5 text-pine-600" aria-label="Included" />
            ) : (
              <X className="h-5 w-5 text-ink/25" aria-label="Not included" />
            )}
          </span>
          <span className="flex justify-center">
            {row.premium ? (
              <Check className="h-5 w-5 text-pine-600" aria-label="Included" />
            ) : (
              <X className="h-5 w-5 text-ink/25" aria-label="Not included" />
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
