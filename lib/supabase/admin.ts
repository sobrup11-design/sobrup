import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// SERVER-ONLY. Bypasses RLS — never import this in a client component or
// expose the service role key to the browser. Used for admin actions like
// approving a claim (which needs to update a facility the approving admin
// doesn't "own").
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Simple allowlist-based admin check for Phase 1 — no separate roles table yet.
export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}
