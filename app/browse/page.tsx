import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";
import FacilityCard from "@/components/FacilityCard";
import { getAllFacilities } from "@/lib/data/facilities";

export const metadata = {
  title: "Browse California Treatment Facilities",
  description:
    "Search and filter addiction, mental health, and behavioral health treatment facilities across California.",
};

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; featured?: string; type?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.toLowerCase().trim() ?? "";
  const type = params.type?.trim() ?? "";
  const featuredOnly = params.featured === "true";
  const hasSearch = Boolean(q || type || featuredOnly);

  if (!hasSearch) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-md text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pine-50 text-pine-600 mb-4">
            <Search className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="font-display text-2xl font-medium text-ink mb-2">
            Search to see treatment facilities
          </h1>
          <p className="text-ink/60 mb-6">
            Try a facility name, city, ZIP code, or treatment type.
          </p>
          <form action="/browse" className="flex gap-2">
            <input
              type="text"
              name="q"
              placeholder="Facility name, city, or ZIP code"
              className="flex-1 rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:border-pine-400"
            />
            <button
              type="submit"
              className="rounded-xl bg-pine-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pine-700"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    );
  }

  const facilities = await getAllFacilities();

  const results = facilities
    .filter((f) => {
      if (featuredOnly && !f.featured) return false;
      if (type && !f.treatmentTypes.some((t) => t.toLowerCase() === type.toLowerCase())) return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.city.toLowerCase().includes(q) ||
        f.zip.includes(q) ||
        f.treatmentTypes.some((t) => t.toLowerCase().includes(q))
      );
    })
    // Premium listings get priority placement — everything else stays in
    // whatever order it came in otherwise.
    .sort((a, b) => Number(b.isPremium) - Number(a.isPremium));

  const heading = type
    ? type
    : q
      ? `Results for "${params.q}"`
      : "Featured facilities";

  return (
    <div className="container-page py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine-600 mb-2">
        California
      </p>
      <h1 className="font-display text-3xl font-medium text-ink mb-2">
        {heading}
      </h1>
      <p className="text-ink/60 mb-8">
        {results.length} {results.length === 1 ? "facility" : "facilities"} found
      </p>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-line bg-mist p-10 text-center">
          <p className="text-ink/70 mb-4">
            No facilities match that search yet. Try a different city, ZIP
            code, or treatment type.
          </p>
          <Link
            href="/add-facility"
            className="inline-flex items-center gap-2 rounded-xl bg-pine-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pine-700"
          >
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            Don't see it? Add your facility
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((f) => (
              <FacilityCard key={f.slug} facility={f} />
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-ink/50">
            Don't see your facility?
            <Link href="/add-facility" className="font-semibold text-pine-600 hover:text-pine-700">
              Add it here
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
