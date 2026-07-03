"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitTherapistListing } from "@/lib/actions/list-practice";
import { SPECIALTIES, INSURANCE_TYPES } from "@/lib/types";

export default function ListPracticeForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await submitTherapistListing(formData);
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
        <h2 className="font-display text-lg font-medium text-ink">Practice details</h2>
        <Field id="therapistName" label="Your name (as it should appear)" required placeholder="e.g. Dr. Jane Smith, LMFT" />
        <Field id="licenseType" label="License type" required placeholder="e.g. LMFT, LCSW, PsyD, PhD" />
        <Field id="licenseNumber" label="License number (optional)" />
        <Field id="phone" label="Phone number" type="tel" required />
        <Field id="email" label="Email" type="email" required />
        <Field id="website" label="Website (optional)" type="url" />
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-ink mb-1.5">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:border-pine-400"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium text-ink">Session format</h2>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink/80">
            <input type="checkbox" name="inPerson" className="h-4 w-4 rounded border-line text-pine-600 focus:ring-pine-400" defaultChecked />
            In-person
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink/80">
            <input type="checkbox" name="telehealth" className="h-4 w-4 rounded border-line text-pine-600 focus:ring-pine-400" />
            Telehealth
          </label>
        </div>
        <p className="text-xs text-ink/50">If you offer in-person sessions, add your city below.</p>
        <Field id="cityName" label="City" placeholder="e.g. Los Angeles" />
        <Field id="address" label="Street address (optional)" />
        <Field id="zip" label="ZIP code (optional)" />
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium text-ink">Specialties</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SPECIALTIES.map((s) => (
            <label key={s} className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink/80">
              <input type="checkbox" name="specialties" value={s} className="h-4 w-4 rounded border-line text-pine-600 focus:ring-pine-400" />
              {s}
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
        <h2 className="font-display text-lg font-medium text-ink">Verify it's you</h2>
        <p className="text-sm text-ink/60">
          We review every new listing by hand before it goes live.
        </p>
        <Field id="submitterName" label="Your full name" required />
        <Field id="submitterEmail" label="Email" type="email" required />
        <Field id="submitterPhone" label="Phone number" type="tel" required />
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
