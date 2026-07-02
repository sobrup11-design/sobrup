import Link from "next/link";
import FacilityCard from "./FacilityCard";
import { Facility } from "@/lib/types";

export default function FeaturedFacilities({ facilities }: { facilities: Facility[] }) {
  if (facilities.length === 0) return null;

  return (
    <section className="bg-mist py-16">
      <div className="container-page">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine-600 mb-2">
              Featured
            </p>
            <h2 className="font-display text-3xl font-medium text-ink">
              Highly rated California providers
            </h2>
          </div>
          <Link
            href="/browse"
            className="hidden sm:inline text-sm font-semibold text-pine-600 hover:text-pine-700"
          >
            View all listings →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => (
            <FacilityCard key={f.slug} facility={f} />
          ))}
        </div>
      </div>
    </section>
  );
}
