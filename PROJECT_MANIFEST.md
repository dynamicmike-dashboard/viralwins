# PROJECT MANIFEST

## STATUS
- Current Goal: Replace the AI Studio prototype state with secure, live Teable-backed ViralWins campaign, promoter, participant, analytics, CSV, and payment workflows.
- Last Session Date: 2026-08-17.
- Latest commit: `8b19b5a` (`Vibrant sales page, 3-tier pricing, fix blank dashboard route`).
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
- Entrant-cap mediation: `api/_lib/teable.ts` reads `Plan_Tier`/`Entrant_Cap`/`Current_Entrants`/`Entrant_Period_Start`; join blocks at 100% with `campaign_full`+upgradeUrl, returns approaching warnings at 80%; counter persisted on Teable after each join.
- Promoter-authorized usage endpoint `GET /api/campaigns/:slug/usage` returning `{count, cap, tier, pct, resetsAt}`; shared cookie auth in `api/_lib/access.ts` (also used by session.ts).
- `<EntrantUsageBanner>` on the promoter dashboard (green/amber/rose by pct, upgrade CTA at 75%+, locked state at 100%+).

## PENDING / NEXT
- [ ] Require Teable fields on the `Viral Referral Engine` table: `Plan_Tier` (starter/growth/scale), `Entrant_Cap` (optional override), `Current_Entrants` (counter), `Entrant_Period_Start` (ms epoch).
- [ ] Wire Stripe checkout and webhook so the temporary `/api/access/test` cookie becomes a real entitlement; entitlements should drive `Plan_Tier`.
- [ ] Remove all placeholder, mock, hallucinated, and sample campaign content.
- [ ] Replace mock subscriber/action/draw state with Teable reads.
- [ ] Render `Campaign_Form_Fields` dynamically and persist `Subscriber_Responses`.
- [ ] Add signed referral cookies and rate limiting.
- [ ] Add verified action webhooks and server-side points/entries computation.
- [ ] Add privacy-aware live leaderboard.
- [ ] Make entrant CSV a live authenticated promoter export.
- [ ] Remove the Design Benchmark tab and unrelated benchmark content.
- [ ] Add promoter authentication and agency/campaign ownership.
- [ ] Complete auditable draw workflow before using "provably fair" language.
- [ ] Keep the existing Next.js agency console stable until this app passes acceptance testing.
