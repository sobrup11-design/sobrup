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

export async function markTherapistPremium(therapistId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("Admin client is not configured.");

  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  const { error } = await admin
    .from("therapists")
    .update({
      is_premium: true,
      verified: true,
      featured: true,
      premium_expires_at: oneYearFromNow.toISOString(),
    })
    .eq("id", therapistId);

  if (error) throw new Error("Failed to mark therapist as Premium.");

  revalidatePath("/admin/therapists");
  revalidatePath("/", "layout");
}

export async function removeTherapistPremium(therapistId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("Admin client is not configured.");

  const { error } = await admin
    .from("therapists")
    .update({
      is_premium: false,
      verified: false,
      featured: false,
      premium_expires_at: null,
    })
    .eq("id", therapistId);

  if (error) throw new Error("Failed to remove Premium status.");

  revalidatePath("/admin/therapists");
  revalidatePath("/", "layout");
}
