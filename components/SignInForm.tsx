"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, CheckCircle2 } from "lucide-react";

export default function SignInForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "not-configured">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();

    if (!supabase) {
      setStatus("not-configured");
      return;
    }

    setStatus("sending");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    setStatus(error ? "error" : "sent");
  }

  return (
    <>
      {status === "sent" ? (
        <div className="rounded-2xl border border-line bg-pine-50 p-6 flex gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-pine-600 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-ink">Check your email</p>
            <p className="mt-1 text-sm text-ink/70">
              We sent a sign-in link to {email}. Open it on this device to continue.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
              Email address
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-3">
              <Mail className="h-4 w-4 text-ink/40" aria-hidden="true" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@facility.org"
                className="w-full bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
              />
            </div>
          </div>

          {status === "error" && (
            <p className="text-sm text-red-600">
              Something went wrong sending your link. Please try again.
            </p>
          )}

          {status === "not-configured" && (
            <p className="text-sm text-ink/60 rounded-xl bg-mist p-3">
              Sign-in isn't connected yet — add your Supabase keys to
              <code className="mx-1 rounded bg-white px-1.5 py-0.5">.env.local</code>
              to enable this.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-xl bg-pine-600 px-4 py-3 text-sm font-semibold text-white hover:bg-pine-700 transition-colors disabled:opacity-60"
          >
            {status === "sending" ? "Sending link…" : "Send magic link"}
          </button>
        </form>
      )}
    </>
  );
}
