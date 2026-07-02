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

export async function approveClaim(claimId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("Admin client is not configured.");

  const { data: claim, error: claimError } = await admin
    .from("facility_claims")
    .select("facility_id, user_id")
    .eq("id", claimId)
    .single();

  if (claimError || !claim) throw new Error("Claim not found.");

  const { error: updateClaimError } = await admin
    .from("facility_claims")
    .update({ status: "approved" })
    .eq("id", claimId);

  if (updateClaimError) throw new Error("Failed to update claim.");

  const { error: updateFacilityError } = await admin
    .from("facilities")
    .update({ claimed: true, owner_id: claim.user_id })
    .eq("id", claim.facility_id);

  if (updateFacilityError) throw new Error("Failed to update facility.");

  revalidatePath("/admin/claims");
}

export async function rejectClaim(claimId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("Admin client is not configured.");

  const { error } = await admin
    .from("facility_claims")
    .update({ status: "rejected" })
    .eq("id", claimId);

  if (error) throw new Error("Failed to update claim.");

  revalidatePath("/admin/claims");
}
