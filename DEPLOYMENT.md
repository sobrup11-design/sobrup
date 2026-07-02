# Going live — step by step

This assumes you've unzipped `sobrup-phase1.zip` somewhere on your computer
and have Node.js installed.

## 1. Get it running locally first

```bash
cd sobrup
npm install
npm run dev
```

Visit http://localhost:3000 — it should work immediately on mock data, no
accounts needed yet. Confirm this works before moving on.

## 2. Create a Supabase project (free tier is fine to start)

1. Go to supabase.com → New project
2. In the SQL Editor, run `lib/supabase/schema.sql`, then `lib/supabase/seed.sql`
3. Go to Project Settings → API and copy: Project URL, `anon` public key,
   and `service_role` key (keep this one secret — never put it in
   `NEXT_PUBLIC_...`)
4. Go to Authentication → URL Configuration and add:
   - `http://localhost:3000/auth/callback` (for local testing)
   - your future production URL, e.g. `https://sobrup.com/auth/callback`
     (add this now if you know your domain — you can also add it later)

## 3. Set up your local environment file

```bash
cp .env.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` — from step 2
- `ADMIN_EMAILS` — your own email, so you can access `/admin/claims`

Restart `npm run dev`. The homepage should now be reading from Supabase
(you'll see the 8 seeded facilities — same ones as before, just from a real
database now). Try the full loop: sign in with magic link → claim a listing
→ approve it at `/admin/claims` → edit it at `/dashboard`.

## 4. Push the code to GitHub

If you don't have git set up in the folder yet:

```bash
git init
git add .
git commit -m "Initial commit"
```

Create a new empty repository on github.com (don't initialize it with a
README), then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/sobrup.git
git branch -M main
git push -u origin main
```

`.env.local` is already excluded via `.gitignore` — it will not be pushed,
which is correct (secrets shouldn't live in git).

## 5. Connect Netlify

1. netlify.com → Add new site → Import an existing project
2. Authorize GitHub, select the `sobrup` repo
3. Netlify should auto-detect Next.js and fill in the build settings —
   leave them as detected
4. Before deploying, add environment variables (Site settings → Environment
   variables): the same ones from your `.env.local`
5. Click Deploy

## 6. Point your domain at it

In Netlify: Domain settings → Add a domain → follow the DNS instructions
for `sobrup.com` (usually pointing your registrar's DNS to Netlify's
nameservers, or adding the records Netlify shows you).

Once the domain is live, go back to Supabase → Authentication → URL
Configuration and make sure `https://sobrup.com/auth/callback` is in the
allowed redirect list — magic-link sign-in won't work on production without
this.

## 7. Before telling anyone it's live

- Test the full flow on the real production URL: search → facility page →
  claim → sign-in → admin approve → edit listing
- Double check `/admin/claims` is only reachable by your own email
- Payments aren't connected yet (that's next) — the pricing page is honest
  about this ("we'll follow up by email"), so nothing's misleading to
  visitors in the meantime
