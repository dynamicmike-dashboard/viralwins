# PROJECT MANIFEST

## STATUS
- Current Goal: Replace the AI Studio prototype state with secure, live Teable-backed ViralWins campaign, promoter, participant, analytics, CSV, and payment workflows.
- Last Session Date: 2026-08-17.
- Latest commit: `8b19b5a` (`Vibrant sales page, 3-tier pricing, fix blank dashboard route`). **New auth/legal/quick-win work is UNCOMMITTED on the working tree.**
- Repository: `https://github.com/dynamicmike-dashboard/viralwins.git`.
- Production URL: `https://viralwins.vercel.app`.

## SYSTEM STATE
- Frontend: Vite + React + Tailwind + Lucide + Motion.
- API: Vercel serverless functions under `api/`; local Express compatibility remains in `server.ts`.
- Backend: Teable base `bseGn6eb9JmnGXyH8WF` using server-only environment variables.
- Visual prototype components are present, but the original mock data must not be treated as production data.
- `GET /api/health` is live and returns 200.
- Vercel environment variable names are configured, but the campaign endpoint last reported that `TEABLE_BASE_ID` and `TEABLE_API_TOKEN` were unavailable to the function. Recheck Production values before further debugging.
- `npm run lint` passes.
- `npm run build` passes; only the existing 500 KB bundle-size warning remains.
- AUTH_SECRET signing key in use by test + promoter session cookies; PAID_TEST_EMAIL falls back to `test@dynamicmike.com`.

## IMPLEMENTED
- Server Teable gateway under `api/_lib/teable.ts`.
- Public campaign read endpoint: `GET /api/campaigns/:slug`.
- Public join endpoint: `POST /api/campaigns/:slug/join`.
- Server-side action intent endpoint: `POST /api/campaigns/:slug/actions/:actionKey/complete`.
- Live campaign loading for `/c/:slug`.
- Duplicate join protection and server-generated referral codes.
- Pending-verification action state; browser clicks award zero until verified.
- Safer promoter CSV serialization with no invented IP data.
- PWA manifest, icons, legal modals, complaints modal, install flow, AI Studio customizer, analytics prototype, and draw preview.
- Bright vibrant brand sales page with benefits-led copy and 3-tier pricing (Starter $18/mo annual, Growth $24/mo up to 2,500 entrants, Scale $36/mo annual or $42/mo up to 25,000; contact note for more).
- Gateway: `/dashboard` renders correctly (split gate routing from StudioApp to fix the hooks-count crash).
- Entrant-cap mediation aligned to the Teable-owned computed contract (commit `7bfef6b` on the Teable side): reads `Total_Subscribers` rollup + `Entrant_Cap`, `Cap_Enforcement`, `Entrant_Cap_Status`, `Entrant_Usage_Pct`, `Entrants_Remaining`, `Plan_Tier`; join warns at `Approaching` and hard-stops only when status is `Full` + enforcement `Hard Stop`. No mutable counter written by the server. `Upgrade_URL`, plan pricing, and plan reference stay out of public responses.
- Promoter-authorized usage endpoint `GET /api/campaigns/:slug/usage` returning `{count, cap, tier, status, enforcement, pct, remaining, warningPct, resetsAt, upgradeUrl, warningMessage, reachedMessage}`; shared cookie auth in `api/_lib/access.ts` (also used by session.ts).
- `<EntrantUsageBanner>` on the promoter dashboard (green/amber/rose by status, upgrade CTA when Approaching, locked state when Full + Hard Stop; hides for Unlimited/no cap).
- **Promoter auth endpoints**: `api/auth/register`, `login`, `logout`, `forgot`, `reset`; scrypt password helper `api/_lib/password.ts`; signed-session cookies `vw_promoter_session` + legacy `vw_paid_access`; array-safe cookie parsing; `isValidSigned` exported.
- **Dashboard access gate**: `/api/access/session` returns `{loggedIn, authorized/paid, email, name, planTier, accessStatus}`; test access (`vw_paid_access` cookie + `x-vw-test-token` header fallback via sessionStorage) with a loading spinner on `/dashboard` so the sales page no longer flashes before the check resolves.
- **Sales page**: new `SalesFooter` with full Privacy / Terms / Disclaimer / Install-App modals; "Promoter App" highlight card in the Features section; removed old one-line footer.
- **Promoter legal settings**: editable per-campaign `platformNonLiabilityNotice` (default wording provided), plus "Save & publish legal settings" button → `PATCH /api/campaigns/[slug]/settings` (promoter-authed) → persists `Legal_Settings_JSON` on the Teable campaign record; `getPublicCampaign` parses it back; end-user footer ribbon shows the notice; `publicCampaign.ts` maps `legalSettings` into prototype campaigns.
- **Quick wins (implemented)**: 4 campaign templates in `mockData.ts` (gym, SaaS beta, product launch, café); Duplicate Campaign button in customizer; filtered CSV export dropdown (All/Active/Verified/Flagged/Last-7d/Last-30d); analytics date-range picker (All/7d/30d/90d) with daily signup sparkline; dashboard empty state with "Open public entrant page" CTA.

## PENDING / NEXT
- [x] UNCOMMITTED work to commit + push to `viralwins`: auth endpoints, sales footer, legal settings, campaign templates, duplicate campaign, filtered CSV export, analytics date-range + sparkline, empty state, dashboard loading gate.
- [ ] **Re-verify the test-access revert end-to-end** (user still saw dashboard→sales-page flash in incognito before the latest fixes). Root causes fixed from last session: (a) `isValidSigned` imported but NOT exported → token fallback threw → sales page; (b) `Secure` cookie flag on HTTP localhost; (c) no loading gate → dashboard flashed. Confirm in dev/preview now that lint passes.
- [ ] Map a promoter plan to each campaign in Teable (`Plan_Tier` + `Entrant_Cap`) — currently only the `new leaderboard test` campaign is Growth/2,500; everything else is Unlimited by design.
- [ ] For exact hard-stop caps, add a per-campaign server lock or atomic reservation (read-then-create can overshoot under simultaneous joins).
- [ ] Wire Stripe checkout and webhook so the temporary `/api/access/test` cookie becomes a real entitlement; entitlements should drive `Plan_Tier`.
- [ ] Email delivery (SendGrid/Postmark) for forgot-password reset links + winner notices (`api/auth/forgot` currently returns a raw reset URL in JSON).
- [ ] Promoter onboarding wizard (register → plan → Stripe → dashboard) replacing the test cookie.
- [ ] Teable schema lock: confirm `Legal_Settings_JSON` long-text field exists on `Viral Referral Engine`; add Promoters table indexes.
- [ ] Remove all placeholder, mock, hallucinated, and sample campaign content.
- [ ] Replace mock subscriber/action/draw state with Teable reads.
- [ ] Render `Campaign_Form_Fields` dynamically and persist `Subscriber_Responses`.
- [ ] Add signed referral cookies and rate limiting.
- [ ] Add verified action webhooks and server-side points/entries computation.
- [ ] Add privacy-aware live leaderboard.
- [ ] Make entrant CSV a live authenticated promoter export.
- [ ] Remove the Design Benchmark tab and unrelated benchmark content.
- [ ] Complete auditable draw workflow before using "provably fair" language.
- [ ] Keep the existing Next.js agency console stable until this app passes acceptance testing.
