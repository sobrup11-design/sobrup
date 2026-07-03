import Link from "next/link";
import { getCitySummaries } from "@/lib/data/facilities";

export const metadata = {
  title: "Browse by City",
  description: "Browse addiction and mental health treatment facilities by California city.",
};

export default async function CitiesPage() {
  const cities = await getCitySummaries();
  const totalFacilities = cities.reduce((sum, c) => sum + c.facilityCount, 0);

  return (
    <div className="container-page py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine-600 mb-2">
        Browse by city
      </p>
      <h1 className="font-display text-3xl font-medium text-ink mb-2">
        California cities
      </h1>
      <p className="text-ink/60 mb-8">
        {totalFacilities} facilities across {cities.length} cities.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {cities
          .sort((a, b) => b.facilityCount - a.facilityCount)
          .map((city) => (
            <Link
              key={city.slug}
              href="/browse"
              className="flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium text-ink hover:border-pine-300 hover:bg-pine-50 transition-colors"
            >
              <span>{city.name}</span>
              <span className="text-ink/40">{city.facilityCount}</span>
            </Link>
          ))}
      </div>
    </div>
  );
}
