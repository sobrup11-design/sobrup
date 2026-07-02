"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitFacility } from "@/lib/actions/add-facility";
import { TREATMENT_TYPES, INSURANCE_TYPES } from "@/lib/types";

export default function AddFacilityForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await submitFacility(formData);
      setResult(res);
    });
  }

  if (result?.ok) {
    return (
      <div className="rounded-2xl border border-line bg-pine-50 p-6 flex gap-3">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-pine-600 mt-0.5" aria-hidden="true" />
        <div>
          <p className="font-semibold text-ink">Submitted for review</p>
          <p className="mt-1 text-sm text-ink/70">{result.message}</p>
        </div>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-8">
      <section className="space-y-4">
        <h2 className="font-display text-lg font-medium text-ink">Facility details</h2>
        <Field id="facilityName" label="Facility name" required />
        <Field id="cityName" label="City" required placeholder="e.g. Long Beach" />
        <Field id="address" label="Street address" required />
        <Field id="zip" label="ZIP code" required />
        <Field id="phone" label="Phone number" type="tel" required />
        <Field id="website" label="Website (optional)" type="url" />
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-ink mb-1.5">
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:border-pine-400"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium text-ink">Treatment types</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TREATMENT_TYPES.map((t) => (
            <label key={t} className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink/80">
              <input type="checkbox" name="treatmentTypes" value={t} className="h-4 w-4 rounded border-line text-pine-600 focus:ring-pine-400" />
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
              <input type="checkbox" name="insuranceTypes" value={i} className="h-4 w-4 rounded border-line text-pine-600 focus:ring-pine-400" />
              {i}
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-medium text-ink">Your info</h2>
        <p className="text-sm text-ink/60">
          We review every new listing by hand before it goes live. You'll own this listing once approved.
        </p>
        <Field id="submitterName" label="Your full name" required />
        <Field id="submitterRole" label="Your role at this facility" required placeholder="e.g. Admissions Director" />
        <Field id="submitterEmail" label="Work email" type="email" required />
        <Field id="submitterPhone" label="Your phone number" type="tel" required />
      </section>

      {result && !result.ok && <p className="text-sm text-red-600">{result.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-pine-600 px-6 py-3 text-sm font-semibold text-white hover:bg-pine-700 transition-colors disabled:opacity-60"
      >
        {isPending ? "Submitting…" : "Submit for review"}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  required,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1.5">
        {label} {required && <span className="text-pine-600">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:border-pine-400"
      />
    </div>
  );
}
