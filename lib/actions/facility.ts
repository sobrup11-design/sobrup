"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface UpdateFacilityResult {
  ok: boolean;
  message: string;
}

export async function updateFacility(formData: FormData): Promise<UpdateFacilityResult> {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false, message: "Not connected to a database yet — add Supabase keys to .env.local." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "Please sign in." };
  }

  const facilityId = String(formData.get("facilityId") ?? "");
  const slug = String(formData.get("facilitySlug") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const zip = String(formData.get("zip") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const treatmentTypes = formData.getAll("treatmentTypes").map(String);
  const insuranceTypes = formData.getAll("insuranceTypes").map(String);

  if (!facilityId) {
    return { ok: false, message: "Missing listing reference." };
  }

  // RLS ("Owners can update their claimed facility") enforces that this
  // only succeeds if facilities.owner_id = the signed-in user's id.
  const { error: updateError } = await supabase
    .from("facilities")
    .update({
      description,
      phone,
      website: website || null,
      address,
      zip,
      image_url: imageUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", facilityId);

  if (updateError) {
    return { ok: false, message: "Couldn't save changes — you may not own this listing." };
  }

  const { data: ttRows } = await supabase
    .from("treatment_types")
    .select("id, name")
    .in("name", treatmentTypes.length ? treatmentTypes : ["__none__"]);

  const { data: itRows } = await supabase
    .from("insurance_types")
    .select("id, name")
    .in("name", insuranceTypes.length ? insuranceTypes : ["__none__"]);

  await supabase.from("facility_treatment_types").delete().eq("facility_id", facilityId);
  if (ttRows && ttRows.length > 0) {
    await supabase
      .from("facility_treatment_types")
      .insert(ttRows.map((t) => ({ facility_id: facilityId, treatment_type_id: t.id })));
  }

  await supabase.from("facility_insurance_types").delete().eq("facility_id", facilityId);
  if (itRows && itRows.length > 0) {
    await supabase
      .from("facility_insurance_types")
      .insert(itRows.map((i) => ({ facility_id: facilityId, insurance_type_id: i.id })));
  }

  revalidatePath(`/dashboard/facility/${slug}`);
  revalidatePath("/", "layout"); // keep it simple in Phase 1 — bust the cache broadly

  return { ok: true, message: "Listing updated." };
}
