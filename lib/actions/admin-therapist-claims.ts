"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdminEmail } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminEmail(user?.email)) {
    throw new Error("Not authorized.");
  }
}

export async function approveTherapistClaim(claimId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("Admin client is not configured.");

  const { data: claim, error: claimError } = await admin
    .from("therapist_claims")
    .select("therapist_id, user_id")
    .eq("id", claimId)
    .single();

  if (claimError || !claim) throw new Error("Claim not found.");

  await admin.from("therapist_claims").update({ status: "approved" }).eq("id", claimId);
  await admin
    .from("therapists")
    .update({ claimed: true, owner_id: claim.user_id })
    .eq("id", claim.therapist_id);

  revalidatePath("/admin/therapist-claims");
}

export async function rejectTherapistClaim(claimId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("Admin client is not configured.");

  const { error } = await admin.from("therapist_claims").update({ status: "rejected" }).eq("id", claimId);
  if (error) throw new Error("Failed to update claim.");
  revalidatePath("/admin/therapist-claims");
}
