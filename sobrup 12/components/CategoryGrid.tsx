import Link from "next/link";
import {
  Pill,
  Wine,
  Waves,
  Brain,
  Home,
  Clock,
  Layers,
  Users,
  Shield,
  Gem,
} from "lucide-react";

const categories = [
  { name: "Drug Rehab", slug: "drug-rehab", icon: Pill },
  { name: "Alcohol Rehab", slug: "alcohol-rehab", icon: Wine },
  { name: "Detox Centers", slug: "detox", icon: Waves },
  { name: "Mental Health", slug: "mental-health", icon: Brain },
  { name: "Residential Treatment", slug: "residential-treatment", icon: Home },
  { name: "Outpatient Programs", slug: "outpatient", icon: Clock },
  { name: "Dual Diagnosis", slug: "dual-diagnosis", icon: Layers },
  { name: "Teen Treatment", slug: "teen-treatment", icon: Users },
  { name: "Veterans Programs", slug: "veterans-programs", icon: Shield },
  { name: "Luxury Rehab", slug: "luxury-rehab", icon: Gem },
];

export default function CategoryGrid() {
  return (
    <section className="container-page py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine-600 mb-2">
            Browse
          </p>
          <h2 className="font-display text-3xl font-medium text-ink">
            Find care by treatment type
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map(({ name, slug, icon: Icon }) => (
          <Link
            key={slug}
            href={`/browse/${slug}`}
            className="group flex flex-col items-start gap-3 rounded-2xl border border-line bg-white p-5 transition-all hover:border-pine-300 hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine-50 text-pine-600 group-hover:bg-pine-100">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold text-ink">{name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
