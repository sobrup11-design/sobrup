import Link from "next/link";
import type { CitySummary } from "@/lib/mock-data";

export default function CityGrid({ cities }: { cities: CitySummary[] }) {
  return (
    <section className="container-page py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine-600 mb-2">
        California
      </p>
      <h2 className="font-display text-3xl font-medium text-ink mb-8">
        Browse by city
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {cities.map((city) => (
          <Link
            key={city.slug}
            href={`/${city.stateSlug}/${city.slug}`}
            className="flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium text-ink hover:border-pine-300 hover:bg-pine-50 transition-colors"
          >
            <span>{city.name}</span>
            <span className="text-ink/40">{city.facilityCount}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
