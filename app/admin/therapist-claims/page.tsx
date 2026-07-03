import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdminEmail } from "@/lib/supabase/admin";
import { approveTherapistClaim, rejectTherapistClaim } from "@/lib/actions/admin-therapist-claims";
import { Check, X } from "lucide-react";

export const metadata = { title: "Admin — Therapist Claims" };

export default async function AdminTherapistClaimsPage() {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-ink/60">Admin tools aren't connected to a database yet.</p>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in?next=/admin/therapist-claims");
  if (!isAdminEmail(user.email)) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-ink/60">You don't have access to this page.</p>
      </div>
    );
  }

  const admin = createAdminClient();
  const { data: claims } = admin
    ? await admin
        .from("therapist_claims")
        .select("id, status, verification_notes, created_at, therapists(name, slug)")
        .eq("status", "pending")
        .order("created_at", { ascending: true })
    : { data: [] };

  return (
    <div className="container-page py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine-600 mb-2">Admin</p>
      <h1 className="font-display text-3xl font-medium text-ink mb-8">Pending therapist claims</h1>

      {!claims || claims.length === 0 ? (
        <p className="text-ink/60">No pending claims right now.</p>
      ) : (
        <ul className="space-y-4">
          {claims.map((claim: any) => (
            <li key={claim.id} className="rounded-2xl border border-line bg-white p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-ink">{claim.therapists?.name ?? "Unknown"}</p>
                  <p className="text-xs text-ink/50">
                    Submitted {new Date(claim.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <form action={approveTherapistClaim.bind(null, claim.id)}>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-lg bg-pine-600 px-3 py-2 text-xs font-semibold text-white hover:bg-pine-700"
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      Approve
                    </button>
                  </form>
                  <form action={rejectTherapistClaim.bind(null, claim.id)}>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-semibold text-ink/70 hover:bg-mist"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                      Reject
                    </button>
                  </form>
                </div>
              </div>
              <pre className="whitespace-pre-wrap rounded-xl bg-mist p-4 text-xs text-ink/70 font-mono">
                {claim.verification_notes}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
