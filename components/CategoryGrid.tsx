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
  { name: "Drug Rehab", type: "Drug Rehab", icon: Pill },
  { name: "Alcohol Rehab", type: "Alcohol Rehab", icon: Wine },
  { name: "Detox Centers", type: "Detox", icon: Waves },
  { name: "Mental Health", type: "Mental Health", icon: Brain },
  { name: "Residential Treatment", type: "Residential Treatment", icon: Home },
  { name: "Outpatient Programs", type: "Outpatient", icon: Clock },
  { name: "Dual Diagnosis", type: "Dual Diagnosis", icon: Layers },
  { name: "Teen Treatment", type: "Teen Treatment", icon: Users },
  { name: "Veterans Programs", type: "Veterans Programs", icon: Shield },
  { name: "Luxury Rehab", type: "Luxury Rehab", icon: Gem },
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
        {categories.map(({ name, type, icon: Icon }) => (
          <Link
            key={type}
            href="/browse"
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
