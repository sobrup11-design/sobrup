import Link from "next/link";
import { notFound } from "next/navigation";
import { getTherapistBySlugAny } from "@/lib/data/therapists";
import { createClient } from "@/lib/supabase/server";
import ClaimTherapistForm from "@/components/ClaimTherapistForm";
import { ShieldCheck, PlusCircle } from "lucide-react";

export const metadata = {
  title: "Claim Your Therapist Listing",
};

export default async function ClaimTherapistPage({
  searchParams,
}: {
  searchParams: Promise<{ therapist?: string }>;
}) {
  const { therapist: therapistSlug } = await searchParams;

  if (!therapistSlug) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-md text-center">
          <h1 className="font-display text-2xl font-medium text-ink mb-3">
            Which listing would you like to claim?
          </h1>
          <p className="text-ink/60 mb-6">
            Search for your name and click "Claim This Listing" — or, if
            you're not listed yet, add your practice.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/find-a-therapist"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-pine-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pine-700"
            >
              Search listings
            </Link>
            <Link
              href="/list-your-practice"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-ink hover:bg-mist"
            >
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              List your practice
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const therapist = await getTherapistBySlugAny(therapistSlug);
  if (!therapist) notFound();

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
        <h1 className="font-display text-2xl font-medium text-ink mb-6">{therapist.name}</h1>

        {therapist.claimed ? (
          <div className="rounded-2xl border border-line bg-mist p-6">
            <p className="text-sm text-ink/70">
              This listing has already been claimed. If you believe that's a
              mistake, please <Link href="/contact" className="text-pine-600 font-semibold">contact us</Link>.
            </p>
          </div>
        ) : user ? (
          <ClaimTherapistForm therapistSlug={therapist.slug} therapistName={therapist.name} />
        ) : (
          <div className="rounded-2xl border border-line bg-mist p-6">
            <p className="text-sm text-ink/70 mb-4">Sign in first so we know who's submitting this claim.</p>
            <Link
              href={`/sign-in?next=${encodeURIComponent(`/claim-therapist?therapist=${therapist.slug}`)}`}
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
