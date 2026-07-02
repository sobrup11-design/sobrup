"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdminEmail } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slugify";

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

export async function approveSubmission(submissionId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("Admin client is not configured.");

  const { data: submission, error: fetchError } = await admin
    .from("facility_submissions")
    .select("*")
    .eq("id", submissionId)
    .single();

  if (fetchError || !submission) throw new Error("Submission not found.");

  // California only in Phase 1 — find or create the city under California.
  const { data: state, error: stateError } = await admin
    .from("states")
    .select("id")
    .eq("slug", "california")
    .single();

  if (stateError || !state) throw new Error("California state row is missing — run seed.sql first.");

  const citySlug = slugify(submission.city_name);

  const { data: existingCity } = await admin
    .from("cities")
    .select("id")
    .eq("state_id", state.id)
    .eq("slug", citySlug)
    .maybeSingle();

  let cityId = existingCity?.id as string | undefined;

  if (!cityId) {
    const { data: newCity, error: cityInsertError } = await admin
      .from("cities")
      .insert({ state_id: state.id, name: submission.city_name, slug: citySlug })
      .select("id")
      .single();

    if (cityInsertError || !newCity) throw new Error("Failed to create city.");
    cityId = newCity.id;
  }

  const facilitySlug = slugify(submission.facility_name);

  const { data: facility, error: facilityInsertError } = await admin
    .from("facilities")
    .insert({
      owner_id: submission.user_id,
      name: submission.facility_name,
      slug: facilitySlug,
      city_id: cityId,
      address: submission.address,
      zip: submission.zip,
      phone: submission.phone,
      website: submission.website,
      description: submission.description,
      verified: false,
      featured: false,
      claimed: true, // the submitter owns it immediately — they added it themselves
      source: "self_submitted",
    })
    .select("id")
    .single();

  if (facilityInsertError || !facility) throw new Error("Failed to create facility.");

  const treatmentTypes: string[] = submission.treatment_types ?? [];
  const insuranceTypes: string[] = submission.insurance_types ?? [];

  if (treatmentTypes.length > 0) {
    const { data: ttRows } = await admin.from("treatment_types").select("id, name").in("name", treatmentTypes);
    if (ttRows && ttRows.length > 0) {
      await admin
        .from("facility_treatment_types")
        .insert(ttRows.map((t) => ({ facility_id: facility.id, treatment_type_id: t.id })));
    }
  }

  if (insuranceTypes.length > 0) {
    const { data: itRows } = await admin.from("insurance_types").select("id, name").in("name", insuranceTypes);
    if (itRows && itRows.length > 0) {
      await admin
        .from("facility_insurance_types")
        .insert(itRows.map((i) => ({ facility_id: facility.id, insurance_type_id: i.id })));
    }
  }

  await admin
    .from("facility_submissions")
    .update({ status: "approved", created_facility_id: facility.id })
    .eq("id", submissionId);

  revalidatePath("/admin/submissions");
  revalidatePath("/", "layout");
}

export async function rejectSubmission(submissionId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("Admin client is not configured.");

  const { error } = await admin
    .from("facility_submissions")
    .update({ status: "rejected" })
    .eq("id", submissionId);

  if (error) throw new Error("Failed to update submission.");

  revalidatePath("/admin/submissions");
}
