import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdminEmail } from "@/lib/supabase/admin";
import { markTherapistPremium, removeTherapistPremium } from "@/lib/actions/admin-therapist-premium";
import { Star, StarOff } from "lucide-react";

export const metadata = { title: "Admin — Therapists" };

export default async function AdminTherapistsPage() {
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

  if (!user) redirect("/sign-in?next=/admin/therapists");
  if (!isAdminEmail(user.email)) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-ink/60">You don't have access to this page.</p>
      </div>
    );
  }

  const admin = createAdminClient();
  const { data: therapists } = admin
    ? await admin
        .from("therapists")
        .select("id, name, phone, is_premium, verified, premium_expires_at")
        .eq("claimed", true)
        .order("name", { ascending: true })
    : { data: [] };

  return (
    <div className="container-page py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine-600 mb-2">Admin</p>
      <h1 className="font-display text-3xl font-medium text-ink mb-2">Claimed therapists</h1>
      <p className="text-ink/60 mb-8">
        Mark a therapist Premium once they've paid.
      </p>

      {!therapists || therapists.length === 0 ? (
        <p className="text-ink/60">No claimed therapist listings yet.</p>
      ) : (
        <ul className="space-y-3">
          {therapists.map((t: any) => (
            <li
              key={t.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-line bg-white p-5"
            >
              <div>
                <p className="font-semibold text-ink">{t.name}</p>
                <p className="text-sm text-ink/50">
                  {t.phone}
                  {t.is_premium && t.premium_expires_at && (
                    <> · Premium until {new Date(t.premium_expires_at).toLocaleDateString()}</>
                  )}
                </p>
              </div>

              {t.is_premium ? (
                <form action={removeTherapistPremium.bind(null, t.id)}>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-semibold text-ink/70 hover:bg-mist"
                  >
                    <StarOff className="h-3.5 w-3.5" aria-hidden="true" />
                    Remove Premium
                  </button>
                </form>
              ) : (
                <form action={markTherapistPremium.bind(null, t.id)}>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-lg bg-gold-500 px-3 py-2 text-xs font-semibold text-white hover:bg-gold-600"
                  >
                    <Star className="h-3.5 w-3.5" aria-hidden="true" />
                    Mark as Premium
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
