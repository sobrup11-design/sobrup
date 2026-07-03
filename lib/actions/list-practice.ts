"use server";

import { createClient } from "@/lib/supabase/server";
import { sendAdminNotification } from "@/lib/email";

export interface SubmitResult {
  ok: boolean;
  message: string;
}

export async function submitTherapistListing(formData: FormData): Promise<SubmitResult> {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false, message: "Not connected to a database yet — add Supabase keys to .env.local." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "Please sign in before listing your practice." };
  }

  const therapistName = String(formData.get("therapistName") ?? "").trim();
  const cityName = String(formData.get("cityName") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const zip = String(formData.get("zip") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const licenseType = String(formData.get("licenseType") ?? "").trim();
  const licenseNumber = String(formData.get("licenseNumber") ?? "").trim();
  const inPerson = formData.get("inPerson") === "on";
  const telehealth = formData.get("telehealth") === "on";
  const specialties = formData.getAll("specialties").map(String);
  const insuranceTypes = formData.getAll("insuranceTypes").map(String);

  const submitterName = String(formData.get("submitterName") ?? "").trim();
  const submitterEmail = String(formData.get("submitterEmail") ?? "").trim();
  const submitterPhone = String(formData.get("submitterPhone") ?? "").trim();

  if (!therapistName || !phone || !email || !licenseType) {
    return { ok: false, message: "Please fill in your name, phone, email, and license type." };
  }
  if (!inPerson && !telehealth) {
    return { ok: false, message: "Please select at least one: in-person or telehealth." };
  }
  if (inPerson && !cityName) {
    return { ok: false, message: "Please add a city for in-person sessions." };
  }
  if (!submitterName || !submitterEmail || !submitterPhone) {
    return { ok: false, message: "Please fill in your contact info so we can verify you." };
  }

  const { error } = await supabase.from("therapist_submissions").insert({
    user_id: user.id,
    status: "pending",
    therapist_name: therapistName,
    city_name: cityName || null,
    address: address || null,
    zip: zip || null,
    phone,
    email,
    website: website || null,
    bio: bio || null,
    license_type: licenseType,
    license_number: licenseNumber || null,
    in_person: inPerson,
    telehealth,
    specialties,
    insurance_types: insuranceTypes,
    submitter_name: submitterName,
    submitter_email: submitterEmail,
    submitter_phone: submitterPhone,
  });

  if (error) {
    return { ok: false, message: "Something went wrong submitting this. Please try again." };
  }

  await sendAdminNotification(
    `New therapist listing: ${therapistName}`,
    `${submitterName} submitted a new therapist listing: "${therapistName}" (${licenseType}).\n\nContact: ${submitterEmail} / ${submitterPhone}\n\nReview it at /admin/therapist-submissions`
  );

  return {
    ok: true,
    message: "Thanks — we review every new listing by hand, typically within 2 business days. Once approved, you'll own the listing automatically.",
  };
}
