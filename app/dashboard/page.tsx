import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

export const metadata = {
  title: "Dashboard",
};

const statusMeta = {
  pending: { icon: Clock, label: "Under review", className: "text-gold-600 bg-gold-100" },
  approved: { icon: CheckCircle2, label: "Approved", className: "text-pine-700 bg-pine-100" },
  rejected: { icon: XCircle, label: "Not approved", className: "text-red-700 bg-red-100" },
};

export default async function DashboardPage() {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-ink/60">
          Dashboard isn't connected to a database yet — add Supabase keys to
          .env.local to enable this.
        </p>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in?next=/dashboard");

  const { data: claims } = await supabase
    .from("facility_claims")
    .select("id, status, created_at, facilities(name, slug, city_id)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container-page py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine-600 mb-2">
        Dashboard
      </p>
      <h1 className="font-display text-3xl font-medium text-ink mb-8">
        Your listings
      </h1>

      {!claims || claims.length === 0 ? (
        <div className="rounded-2xl border border-line bg-mist p-8 text-center">
          <p className="text-ink/70 mb-4">
            You haven't claimed a listing yet.
          </p>
          <Link
            href="/browse"
            className="inline-flex rounded-xl bg-pine-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pine-700"
          >
            Find your facility
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {claims.map((claim: any) => {
            const meta = statusMeta[claim.status as keyof typeof statusMeta] ?? statusMeta.pending;
            const Icon = meta.icon;
            return (
              <li
                key={claim.id}
                className="flex items-center justify-between rounded-2xl border border-line bg-white p-5"
              >
                <div>
                  <p className="font-semibold text-ink">
                    {claim.facilities?.name ?? "Facility"}
                  </p>
                  <p className="text-sm text-ink/50">
                    Submitted {new Date(claim.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${meta.className}`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {meta.label}
                  </span>
                  {claim.status === "approved" && claim.facilities?.slug && (
                    <Link
                      href={`/dashboard/facility/${claim.facilities.slug}`}
                      className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-ink/70 hover:bg-mist"
                    >
                      Edit listing
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
