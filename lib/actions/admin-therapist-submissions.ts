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

export async function approveTherapistSubmission(submissionId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("Admin client is not configured.");

  const { data: submission, error: fetchError } = await admin
    .from("therapist_submissions")
    .select("*")
    .eq("id", submissionId)
    .single();

  if (fetchError || !submission) throw new Error("Submission not found.");

  let cityId: string | undefined;

  // Only look up/create a city if the therapist offers in-person sessions.
  if (submission.city_name) {
    const { data: state } = await admin.from("states").select("id").eq("slug", "california").single();
    if (!state) throw new Error("California state row is missing — run seed.sql first.");

    const citySlug = slugify(submission.city_name);
    const { data: existingCity } = await admin
      .from("cities")
      .select("id")
      .eq("state_id", state.id)
      .eq("slug", citySlug)
      .maybeSingle();

    if (existingCity) {
      cityId = existingCity.id;
    } else {
      const { data: newCity, error: cityInsertError } = await admin
        .from("cities")
        .insert({ state_id: state.id, name: submission.city_name, slug: citySlug })
        .select("id")
        .single();
      if (cityInsertError || !newCity) throw new Error("Failed to create city.");
      cityId = newCity.id;
    }
  }

  const baseSlug = slugify(submission.therapist_name);
  let therapistSlug = baseSlug;
  let suffix = 1;
  // The DB's unique(city_id, slug) constraint doesn't catch collisions when
  // city_id is null (telehealth-only), so check explicitly here.
  while (true) {
    const { data: existing } = await admin.from("therapists").select("id").eq("slug", therapistSlug).maybeSingle();
    if (!existing) break;
    suffix += 1;
    therapistSlug = `${baseSlug}-${suffix}`;
  }

  const { data: therapist, error: insertError } = await admin
    .from("therapists")
    .insert({
      owner_id: submission.user_id,
      name: submission.therapist_name,
      slug: therapistSlug,
      city_id: cityId ?? null,
      address: submission.address,
      zip: submission.zip,
      phone: submission.phone,
      email: submission.email,
      website: submission.website,
      bio: submission.bio,
      license_type: submission.license_type,
      license_number: submission.license_number,
      in_person: submission.in_person,
      telehealth: submission.telehealth,
      verified: false,
      featured: false,
      claimed: true,
      source: "self_submitted",
    })
    .select("id")
    .single();

  if (insertError || !therapist) throw new Error("Failed to create therapist listing.");

  const specialties: string[] = submission.specialties ?? [];
  const insuranceTypes: string[] = submission.insurance_types ?? [];

  if (specialties.length > 0) {
    const { data: specialtyRows } = await admin.from("specialties").select("id, name").in("name", specialties);
    if (specialtyRows && specialtyRows.length > 0) {
      await admin
        .from("therapist_specialties")
        .insert(specialtyRows.map((s) => ({ therapist_id: therapist.id, specialty_id: s.id })));
    }
  }

  if (insuranceTypes.length > 0) {
    const { data: insuranceRows } = await admin.from("insurance_types").select("id, name").in("name", insuranceTypes);
    if (insuranceRows && insuranceRows.length > 0) {
      await admin
        .from("therapist_insurance_types")
        .insert(insuranceRows.map((i) => ({ therapist_id: therapist.id, insurance_type_id: i.id })));
    }
  }

  await admin
    .from("therapist_submissions")
    .update({ status: "approved", created_therapist_id: therapist.id })
    .eq("id", submissionId);

  revalidatePath("/admin/therapist-submissions");
  revalidatePath("/", "layout");
}

export async function rejectTherapistSubmission(submissionId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("Admin client is not configured.");

  const { error } = await admin
    .from("therapist_submissions")
    .update({ status: "rejected" })
    .eq("id", submissionId);

  if (error) throw new Error("Failed to update submission.");
  revalidatePath("/admin/therapist-submissions");
}
