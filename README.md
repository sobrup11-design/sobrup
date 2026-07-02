# Sobrup — California Treatment Directory (Phase 1 slice)

This is the first working slice of the Sobrup PRD: homepage, search/browse,
and SEO-friendly facility profile pages, scoped to **California only** for now.

## What's built

- Homepage, `/browse`, and facility profile pages now read through
  `lib/data/facilities.ts` — real Supabase data if it's connected, mock
  data (`lib/mock-data.ts`) if it isn't. Nothing breaks either way.
- `/[state]/[city]/[facility]` — facility profile page with SEO metadata,
  breadcrumbs, JSON-LD `LocalBusiness` structured data, and a claim-listing CTA
- **Claim-listing flow (manual review, no auto-verification yet):**
  - `/sign-in` — magic-link auth (no password), via Supabase Auth
  - `/auth/callback` — exchanges the magic-link code for a session
  - `/claim?facility=slug` — claim form; requires sign-in; blocks re-claiming
    an already-claimed listing
  - `/dashboard` — shows the signed-in user's claim(s) and status, with an
    "Edit listing" link once approved
  - `/admin/claims` — manual review queue; approve/reject sets
    `facilities.owner_id` and `claimed = true`. Gated by `ADMIN_EMAILS`
- **Edit-listing flow:**
  - `/dashboard/facility/[slug]` — owner-only edit form (phone, website,
    address, ZIP, cover image, description, treatment types, insurance
    accepted). Enforced by Postgres RLS (`owner_id = auth.uid()`), not just
    app-level checks — so this is safe even if the UI is bypassed.
- **Pricing page (`/for-providers`)** — Free / Basic ($49.95) / Pro ($79.95)
  tiers, defined in `lib/pricing.ts` (single source of truth for both the
  page and, later, Stripe/PayPal product setup). No real billing yet — CTAs
  route into the claim form with the chosen plan attached, so it shows up
  in the claim notes an admin reviews by hand.
- Data model (`lib/supabase/schema.sql`) with RLS on every writable table,
  plus `premium_tier` on facilities and `plan`/`payment_provider` on
  subscriptions so Stripe and/or PayPal can slot in later without a schema
  change
- `lib/supabase/seed.sql` — seeds California + the same 8 sample facilities
  as the mock data, so the whole claim → approve → edit loop is testable
  against a real database

## Not built yet (next slices)

- Real Stripe and/or PayPal checkout + webhooks (pricing page UI exists,
  billing itself does not — see `lib/pricing.ts` and `/for-providers`)
- Photo/logo upload via Supabase Storage (edit form currently takes an image
  URL rather than a file upload)
- Blog
- Automated claim verification (email-domain matching, phone verification) —
  intentionally skipped for now in favor of manual review

## A note on legal considerations

This is not legal advice, but worth flagging so you loop in an attorney
before launch:

- Facts (name, address, phone, license number/status if public) aren't
  copyrightable — this is settled U.S. law (*Feist v. Rural Telephone*,
  1991) and is why directories like this are legal to seed with public data.
  Don't copy another site's written descriptions, photos, or reviews.
- Several states have **patient brokering laws** restricting payment tied to
  referring someone into substance-use treatment (Florida's is the most
  prominent, post "Florida shuffle"). Flat annual listing fees (what's built
  here) are generally the safer structure versus per-lead or per-referral
  pricing — but get this confirmed by a healthcare/marketing attorney,
  especially once contact/appointment forms start routing real inquiries.
- Google, Meta, and Bing require **LegitScript certification** before you
  can advertise addiction-treatment content on their platforms — relevant
  once you start marketing the site itself, not for building it.

## Getting started

```bash
npm install
npm run dev
```

Visit http://localhost:3000

The app works out of the box with no environment variables — it reads from
`lib/mock-data.ts`. To connect real data:

1. Create a Supabase project
2. Run `lib/supabase/schema.sql` in the Supabase SQL editor, then
   `lib/supabase/seed.sql` if you want matching sample data to test against
3. Copy `.env.example` to `.env.local` and fill in your Supabase keys
   (including `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_EMAILS` if you want to
   test the `/admin/claims` queue)
4. In Supabase → Authentication → URL Configuration, add
   `http://localhost:3000/auth/callback` (and your production URL later) to
   the allowed redirect URLs — magic links won't work without this
5. Restart `npm run dev` — the homepage, browse, and facility pages will
   automatically start reading from Supabase instead of mock data

## Seeding real California data

For real facility data, California's licensed programs are listed in
[SAMHSA's public treatment locator dataset](https://findtreatment.gov) —
that's a safer, more accurate starting point than scraping other directories.
Before importing at scale, it's worth deciding on a correction/takedown
process for facilities that want their info fixed or removed, since accuracy
matters more for behavioral health listings than most directory categories.

## Design notes

- Palette: deep pine green (trust, growth) + warm gold accent used sparingly
  for CTAs/badges, on a warm paper background — deliberately avoiding the
  generic "medical blue" and generic AI-cream-and-terracotta look
- Type: Fraunces (display/serif, warmth) + Inter (body/UI) + JetBrains Mono
  (small utility labels)
- Signature element: a quiet topographic contour motif in the hero,
  suggesting a path — used once, restrained
