"use server";

import { createClient } from "@/lib/supabase/server";
import { sendAdminNotification } from "@/lib/email";

export interface SubmitFacilityResult {
  ok: boolean;
  message: string;
}

export async function submitFacility(formData: FormData): Promise<SubmitFacilityResult> {
  const supabase = await createClient();
  if (!supabase) {
    return {
      ok: false,
      message: "Not connected to a database yet — add Supabase keys to .env.local to enable submissions.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "Please sign in before adding a facility." };
  }

  const facilityName = String(formData.get("facilityName") ?? "").trim();
  const cityName = String(formData.get("cityName") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const zip = String(formData.get("zip") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const treatmentTypes = formData.getAll("treatmentTypes").map(String);
  const insuranceTypes = formData.getAll("insuranceTypes").map(String);

  const submitterName = String(formData.get("submitterName") ?? "").trim();
  const submitterRole = String(formData.get("submitterRole") ?? "").trim();
  const submitterEmail = String(formData.get("submitterEmail") ?? "").trim();
  const submitterPhone = String(formData.get("submitterPhone") ?? "").trim();

  if (!facilityName || !cityName || !address || !zip || !phone) {
    return { ok: false, message: "Please fill in the facility's name, city, address, ZIP, and phone." };
  }
  if (!submitterName || !submitterRole || !submitterEmail || !submitterPhone) {
    return { ok: false, message: "Please fill in your name, role, email, and phone so we can verify you." };
  }

  const { error } = await supabase.from("facility_submissions").insert({
    user_id: user.id,
    status: "pending",
    facility_name: facilityName,
    city_name: cityName,
    address,
    zip,
    phone,
    website: website || null,
    description: description || null,
    treatment_types: treatmentTypes,
    insurance_types: insuranceTypes,
    submitter_name: submitterName,
    submitter_role: submitterRole,
    submitter_email: submitterEmail,
    submitter_phone: submitterPhone,
  });

  if (error) {
    return { ok: false, message: "Something went wrong submitting this. Please try again." };
  }

  await sendAdminNotification(
    `New facility submission: ${facilityName}`,
    `${submitterName} (${submitterRole}) submitted a new facility: "${facilityName}" in ${cityName}.\n\nContact: ${submitterEmail} / ${submitterPhone}\n\nReview it at /admin/submissions`
  );

  return {
    ok: true,
    message: "Thanks — we review new listings by hand, typically within 2 business days. Once approved, it'll go live and you'll own the listing automatically.",
  };
}
