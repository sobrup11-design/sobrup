import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditFacilityForm from "@/components/EditFacilityForm";

export const metadata = {
  title: "Edit Your Listing",
};

export default async function EditFacilityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  if (!supabase) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-ink/60">
          Not connected to a database yet — add Supabase keys to .env.local
          to enable this.
        </p>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/sign-in?next=${encodeURIComponent(`/dashboard/facility/${slug}`)}`);

  const { data: facility, error } = await supabase
    .from("facilities")
    .select("id, slug, name, description, phone, website, address, zip, image_url, owner_id, is_premium")
    .eq("slug", slug)
    .single();

  if (error || !facility) notFound();

  if (facility.owner_id !== user.id) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-ink/60">You don't have access to edit this listing.</p>
      </div>
    );
  }

  const [{ data: ttRows }, { data: itRows }] = await Promise.all([
    supabase
      .from("facility_treatment_types")
      .select("treatment_types(name)")
      .eq("facility_id", facility.id),
    supabase
      .from("facility_insurance_types")
      .select("insurance_types(name)")
      .eq("facility_id", facility.id),
  ]);

  const selectedTreatmentTypes = (ttRows ?? [])
    .map((r: any) => r.treatment_types?.name)
    .filter(Boolean);
  const selectedInsuranceTypes = (itRows ?? [])
    .map((r: any) => r.insurance_types?.name)
    .filter(Boolean);

  return (
    <div className="container-page py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine-600 mb-2">
        Edit listing
      </p>
      <h1 className="font-display text-3xl font-medium text-ink mb-8">
        {facility.name}
      </h1>

      <EditFacilityForm
        facilityId={facility.id}
        facilitySlug={facility.slug}
        isPremium={Boolean(facility.is_premium)}
        initial={{
          description: facility.description ?? "",
          phone: facility.phone ?? "",
          website: facility.website ?? "",
          address: facility.address ?? "",
          zip: facility.zip ?? "",
          imageUrl: facility.image_url ?? "",
          treatmentTypes: selectedTreatmentTypes,
          insuranceTypes: selectedInsuranceTypes,
        }}
      />
    </div>
  );
}
