import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AddFacilityForm from "@/components/AddFacilityForm";
import { PlusCircle } from "lucide-react";

export const metadata = {
  title: "Add Your Facility",
  description: "Don't see your facility on Sobrup? Add it and it'll be reviewed and listed within 2 business days.",
};

export default async function AddFacilityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine-50 text-pine-600 mb-4">
          <PlusCircle className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine-600 mb-2">
          Add a facility
        </p>
        <h1 className="font-display text-3xl font-medium text-ink mb-2">
          Don't see your facility listed?
        </h1>
        <p className="text-ink/70 mb-8">
          Add it here. We review every new listing by hand — once approved,
          it goes live and you own it automatically, no separate claim needed.
        </p>

        {user ? (
          <AddFacilityForm />
        ) : (
          <div className="rounded-2xl border border-line bg-mist p-6">
            <p className="text-sm text-ink/70 mb-4">
              Sign in first so we know who's submitting this.
            </p>
            <Link
              href={`/sign-in?next=${encodeURIComponent("/add-facility")}`}
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
