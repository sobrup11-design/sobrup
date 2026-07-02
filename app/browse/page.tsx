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

  const facilities = await getAllFacilities();

  const results = facilities.filter((f) => {
    if (featuredOnly && !f.featured) return false;
    if (type && !f.treatmentTypes.some((t) => t.toLowerCase() === type.toLowerCase())) return false;
    if (!q) return true;
    return (
      f.name.toLowerCase().includes(q) ||
      f.city.toLowerCase().includes(q) ||
      f.zip.includes(q) ||
      f.treatmentTypes.some((t) => t.toLowerCase().includes(q))
    );
  });

  const heading = type
    ? type
    : q
      ? `Results for "${params.q}"`
      : "All treatment facilities";

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
          <p className="text-ink/70">
            No facilities match that search yet. Try a different city, ZIP
            code, or treatment type.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((f) => (
            <FacilityCard key={f.slug} facility={f} />
          ))}
        </div>
      )}
    </div>
  );
}
