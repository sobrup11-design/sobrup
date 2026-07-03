import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";
import TherapistCard from "@/components/TherapistCard";
import { getAllTherapists } from "@/lib/data/therapists";

export const metadata = {
  title: "Find a Therapist",
  description: "Search verified therapists in California by specialty, city, or session format.",
};

export default async function FindTherapistPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; specialty?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.toLowerCase().trim() ?? "";
  const specialty = params.specialty?.trim() ?? "";
  const hasSearch = Boolean(q || specialty);

  if (!hasSearch) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-md text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pine-50 text-pine-600 mb-4">
            <Search className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="font-display text-2xl font-medium text-ink mb-2">
            Search to find a therapist
          </h1>
          <p className="text-ink/60 mb-6">
            Try a name, city, or specialty like "anxiety" or "couples therapy."
          </p>
          <form action="/find-a-therapist" className="flex gap-2 mb-6">
            <input
              type="text"
              name="q"
              placeholder="Name, city, or specialty"
              className="flex-1 rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:border-pine-400"
            />
            <button
              type="submit"
              className="rounded-xl bg-pine-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pine-700"
            >
              Search
            </button>
          </form>
          <Link href="/" className="text-sm font-semibold text-pine-600 hover:text-pine-700">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const therapists = await getAllTherapists();

  const results = therapists
    .filter((t) => {
      if (specialty && !t.specialties.some((s) => s.toLowerCase() === specialty.toLowerCase())) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.specialties.some((s) => s.toLowerCase().includes(q)) ||
        t.licenseType.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => Number(b.isPremium) - Number(a.isPremium));

  const heading = specialty ? specialty : q ? `Results for "${params.q}"` : "Therapists";

  return (
    <div className="container-page py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine-600 mb-2">
        California
      </p>
      <h1 className="font-display text-3xl font-medium text-ink mb-2">{heading}</h1>
      <p className="text-ink/60 mb-8">
        {results.length} {results.length === 1 ? "therapist" : "therapists"} found
      </p>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-line bg-mist p-10 text-center">
          <p className="text-ink/70 mb-4">
            No therapists match that search yet.
          </p>
          <Link
            href="/list-your-practice"
            className="inline-flex items-center gap-2 rounded-xl bg-pine-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pine-700"
          >
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            List your practice
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((t) => (
              <TherapistCard key={t.slug} therapist={t} />
            ))}
          </div>
          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-ink/50">
            Don't see your practice?
            <Link href="/list-your-practice" className="font-semibold text-pine-600 hover:text-pine-700">
              List it here
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
