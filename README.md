# NightReset

A 10-minute guided reset for nights when your thoughts won't stop. Next.js App Router, Supabase, OpenAI, Razorpay, PostHog.

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in real values, see below
npm run dev
```

Open http://localhost:3000.

## Environment variables

See `.env.example` for the full list with comments. In short:

- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only).
- **OpenAI**: `OPENAI_API_KEY`, `OPENAI_MODEL` (server-only).
- **Razorpay**: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` (server-only) and `NEXT_PUBLIC_RAZORPAY_KEY_ID` (safe to expose).
- **PostHog**: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`.

## Supabase setup

1. Create a Supabase project.
2. In the SQL editor, run `supabase/schema.sql` — it creates `profiles`, `sessions`, `payments`, `entitlements`, `free_usage`, enables Row Level Security on all of them, and adds a trigger that creates a `profiles` row for every new auth user.
3. In **Authentication -> URL Configuration**, add your site URL and `/auth/callback` as a redirect URL (both local `http://localhost:3000/auth/callback` and your production domain).
4. Email OTP/magic-link sign-in is enabled by default in Supabase Auth — no extra config needed for the passwordless flow used here.

## Razorpay setup

1. Get your test/live Key ID and Key Secret from the Razorpay Dashboard.
2. Add a webhook under **Settings -> Webhooks** pointing to `https://<your-domain>/api/payment/webhook`, subscribed to at least `payment.captured`. Copy the webhook secret into `RAZORPAY_WEBHOOK_SECRET`.
3. The webhook is a backup path — normal purchases are verified synchronously in `/api/payment/verify` right after checkout.

## PostHog setup

1. Create a project in PostHog (cloud or self-hosted).
2. Copy the project API key into `NEXT_PUBLIC_POSTHOG_KEY` and the host into `NEXT_PUBLIC_POSTHOG_HOST`.
3. Only categorical/boolean event properties are ever sent — never brain dump text, email, or other free-form content.

## Architecture notes

- All OpenAI and Razorpay calls happen server-side (`lib/openai`, `lib/razorpay`) — secrets never reach the browser.
- `lib/entitlement` is the single source of truth for access: it always re-checks `entitlements.expires_at` against the current server time and never trusts client-supplied flags.
- `lib/supabase/admin.ts` (service role) is used only inside trusted server code for entitlement/payment/session writes; RLS policies in `supabase/schema.sql` protect everything else.
- The in-progress brain dump/concern draft lives in `localStorage` on the client only, and is cleared once a reset is successfully generated.

## Commands

```bash
npm run lint     # ESLint
npx tsc --noEmit # (after at least one `next build`/`next dev`, so generated route types exist)
npm run build    # production build
npm start        # run the production build locally
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add all environment variables from `.env.example` in the Vercel project settings (Production and Preview).
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
5. Deploy. Update the Razorpay webhook URL and Supabase redirect URL to the production domain afterward.
