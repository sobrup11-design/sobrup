"use server";

import { createClient } from "@/lib/supabase/server";
import { sendAdminNotification } from "@/lib/email";

export interface SubmitClaimResult {
  ok: boolean;
  message: string;
}

export async function submitTherapistClaim(formData: FormData): Promise<SubmitClaimResult> {
  const therapistSlug = String(formData.get("therapistSlug") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const licenseNumber = String(formData.get("licenseNumber") ?? "").trim();
  const workEmail = String(formData.get("workEmail") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!fullName || !workEmail || !phone) {
    return { ok: false, message: "Please fill in your name, email, and phone." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { ok: false, message: "Claims aren't connected to a database yet." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "Please sign in before submitting a claim." };
  }

  const { data: therapist, error: therapistError } = await supabase
    .from("therapists")
    .select("id, name")
    .eq("slug", therapistSlug)
    .single();

  if (therapistError || !therapist) {
    return { ok: false, message: "We couldn't find that listing. Please try again." };
  }

  const verificationNotes = [
    `Name: ${fullName}`,
    licenseNumber ? `License number: ${licenseNumber}` : null,
    `Work email: ${workEmail}`,
    `Phone: ${phone}`,
    notes ? `Notes: ${notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const { error: insertError } = await supabase.from("therapist_claims").insert({
    therapist_id: therapist.id,
    user_id: user.id,
    status: "pending",
    verification_notes: verificationNotes,
  });

  if (insertError) {
    return { ok: false, message: "Something went wrong submitting your claim. Please try again." };
  }

  await sendAdminNotification(
    `New therapist claim: ${therapist.name}`,
    `${fullName} submitted a claim for "${therapist.name}".\n\nContact: ${workEmail} / ${phone}\n\nReview it at /admin/therapist-claims`
  );

  return {
    ok: true,
    message: "Claim submitted — we review claims by hand and typically respond within 2 business days.",
  };
}
