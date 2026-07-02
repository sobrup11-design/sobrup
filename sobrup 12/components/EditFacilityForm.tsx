"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { updateFacility } from "@/lib/actions/facility";
import { TREATMENT_TYPES, INSURANCE_TYPES } from "@/lib/types";

interface Initial {
  description: string;
  phone: string;
  website: string;
  address: string;
  zip: string;
  imageUrl: string;
  treatmentTypes: string[];
  insuranceTypes: string[];
}

export default function EditFacilityForm({
  facilityId,
  facilitySlug,
  initial,
}: {
  facilityId: string;
  facilitySlug: string;
  initial: Initial;
}) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  function handleSubmit(formData: FormData) {
    formData.set("facilityId", facilityId);
    formData.set("facilitySlug", facilitySlug);
    startTransition(async () => {
      const res = await updateFacility(formData);
      setResult(res);
    });
  }

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-8">
      {result && (
        <div
          className={`flex items-center gap-2 rounded-xl p-4 text-sm ${
            result.ok ? "bg-pine-50 text-pine-700" : "bg-red-50 text-red-700"
          }`}
        >
          {result.ok && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
          {result.message}
        </div>
      )}

      <section className="space-y-4">
        <h2 className="font-display text-lg font-medium text-ink">Basics</h2>

        <Field id="phone" label="Phone number" type="tel" defaultValue={initial.phone} />
        <Field id="website" label="Website" type="url" defaultValue={initial.website} />
        <Field id="address" label="Street address" defaultValue={initial.address} />
        <Field id="zip" label="ZIP code" defaultValue={initial.zip} />
        <Field id="imageUrl" label="Cover image URL" defaultValue={initial.imageUrl} />

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-ink mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={initial.description}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:border-pine-400"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium text-ink">Treatment types</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TREATMENT_TYPES.map((t) => (
            <label key={t} className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink/80">
              <input
                type="checkbox"
                name="treatmentTypes"
                value={t}
                defaultChecked={initial.treatmentTypes.includes(t)}
                className="h-4 w-4 rounded border-line text-pine-600 focus:ring-pine-400"
              />
              {t}
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium text-ink">Insurance accepted</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {INSURANCE_TYPES.map((i) => (
            <label key={i} className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink/80">
              <input
                type="checkbox"
                name="insuranceTypes"
                value={i}
                defaultChecked={initial.insuranceTypes.includes(i)}
                className="h-4 w-4 rounded border-line text-pine-600 focus:ring-pine-400"
              />
              {i}
            </label>
          ))}
        </div>
      </section>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-pine-600 px-6 py-3 text-sm font-semibold text-white hover:bg-pine-700 transition-colors disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  defaultValue,
}: {
  id: string;
  label: string;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1.5">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:border-pine-400"
      />
    </div>
  );
}
