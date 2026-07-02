import { createBrowserClient } from "@supabase/ssr";

// Used in "use client" components (sign-in form, claim form, etc).
// Returns null if env vars aren't set yet, so the UI can show a clear
// "not connected" message instead of crashing.
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  return createBrowserClient(url, anonKey);
}
