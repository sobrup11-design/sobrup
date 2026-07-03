// Sends a quick email to the admin(s) when something needs review — a new
// claim or a new listing submission. Uses Resend (resend.com) since it's
// the simplest transactional email API to wire into a Next.js app.
//
// If RESEND_API_KEY isn't set yet, this silently does nothing rather than
// breaking the actual claim/submission flow — the admin queues in the app
// are still the source of truth either way, this is just a heads-up.

export async function sendAdminNotification(subject: string, body: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (!apiKey || adminEmails.length === 0) return;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Resend lets you send from onboarding@resend.dev with no setup,
        // for testing. Once you verify your own domain in Resend, switch
        // this to something like notifications@sobrup.com.
        from: process.env.NOTIFICATIONS_FROM_EMAIL || "Sobrup <onboarding@resend.dev>",
        to: adminEmails,
        subject,
        text: body,
      }),
    });
  } catch {
    // Never let a failed notification email block the actual submission.
  }
}
