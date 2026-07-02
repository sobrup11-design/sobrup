import Link from "next/link";
import { notFound } from "next/navigation";
import { getFacilityBySlugAny } from "@/lib/data/facilities";
import { createClient } from "@/lib/supabase/server";
import ClaimForm from "@/components/ClaimForm";
import { ShieldCheck, PlusCircle } from "lucide-react";

export const metadata = {
  title: "Claim Your Listing",
};

export default async function ClaimPage({
  searchParams,
}: {
  searchParams: Promise<{ facility?: string; plan?: string }>;
}) {
  const { facility: facilitySlug, plan } = await searchParams;

  if (!facilitySlug) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-md text-center">
          <h1 className="font-display text-2xl font-medium text-ink mb-3">
            Which listing would you like to claim?
          </h1>
          <p className="text-ink/60 mb-6">
            Search for your facility and click "Claim This Listing" on its
            profile page — or, if it's not listed yet, add it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/browse"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-pine-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pine-700"
            >
              Search listings
            </Link>
            <Link
              href="/add-facility"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-ink hover:bg-mist"
            >
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              Add your facility
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const facility = await getFacilityBySlugAny(facilitySlug);
  if (!facility) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-md">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine-50 text-pine-600 mb-4">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine-600 mb-2">
          Claim listing
        </p>
        <h1 className="font-display text-2xl font-medium text-ink mb-6">
          {facility.name}
        </h1>

        {facility.claimed ? (
          <div className="rounded-2xl border border-line bg-mist p-6">
            <p className="text-sm text-ink/70">
              This listing has already been claimed. If you believe that's a
              mistake, please <Link href="/contact" className="text-pine-600 font-semibold">contact us</Link>.
            </p>
          </div>
        ) : user ? (
          <ClaimForm facilitySlug={facility.slug} facilityName={facility.name} planId={plan} />
        ) : (
          <div className="rounded-2xl border border-line bg-mist p-6">
            <p className="text-sm text-ink/70 mb-4">
              Sign in first so we know who's submitting this claim.
            </p>
            <Link
              href={`/sign-in?next=${encodeURIComponent(`/claim?facility=${facility.slug}`)}`}
              className="inline-flex w-full items-center justify-center rounded-xl bg-pine-600 px-4 py-3 text-sm font-semibold text-white hover:bg-pine-700"
            >
              Sign in to continue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
