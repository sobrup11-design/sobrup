import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdminEmail } from "@/lib/supabase/admin";
import { approveSubmission, rejectSubmission } from "@/lib/actions/admin-submissions";
import { Check, X } from "lucide-react";

export const metadata = {
  title: "Admin — New Facility Submissions",
};

export default async function AdminSubmissionsPage() {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-ink/60">
          Admin tools aren't connected to a database yet — add Supabase keys
          to .env.local to enable this.
        </p>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in?next=/admin/submissions");
  if (!isAdminEmail(user.email)) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-ink/60">You don't have access to this page.</p>
      </div>
    );
  }

  const admin = createAdminClient();
  const { data: submissions } = admin
    ? await admin
        .from("facility_submissions")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true })
    : { data: [] };

  return (
    <div className="container-page py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine-600 mb-2">
        Admin
      </p>
      <h1 className="font-display text-3xl font-medium text-ink mb-8">
        New facility submissions
      </h1>

      {!submissions || submissions.length === 0 ? (
        <p className="text-ink/60">No pending submissions right now.</p>
      ) : (
        <ul className="space-y-4">
          {submissions.map((s: any) => (
            <li key={s.id} className="rounded-2xl border border-line bg-white p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-semibold text-ink">{s.facility_name}</p>
                  <p className="text-sm text-ink/60">
                    {s.address}, {s.city_name}, CA {s.zip} · {s.phone}
                  </p>
                  {s.website && (
                    <a href={s.website} target="_blank" rel="noopener noreferrer" className="text-sm text-pine-600 hover:underline">
                      {s.website}
                    </a>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <form action={approveSubmission.bind(null, s.id)}>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-lg bg-pine-600 px-3 py-2 text-xs font-semibold text-white hover:bg-pine-700"
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      Approve &amp; publish
                    </button>
                  </form>
                  <form action={rejectSubmission.bind(null, s.id)}>
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

              {s.description && <p className="text-sm text-ink/70 mb-3">{s.description}</p>}

              <div className="flex flex-wrap gap-1.5 mb-3">
                {(s.treatment_types ?? []).map((t: string) => (
                  <span key={t} className="rounded-full bg-pine-50 px-2.5 py-1 text-xs font-medium text-pine-700">
                    {t}
                  </span>
                ))}
              </div>

              <div className="rounded-xl bg-mist p-4 text-xs text-ink/70 font-mono whitespace-pre-wrap">
                {`Submitted by: ${s.submitter_name} (${s.submitter_role})\nEmail: ${s.submitter_email}\nPhone: ${s.submitter_phone}`}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
