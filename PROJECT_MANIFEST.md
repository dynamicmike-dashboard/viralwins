# PROJECT MANIFEST

## STATUS
- Current Goal: Replace the AI Studio prototype state with secure, live Teable-backed ViralWins campaign, promoter, participant, analytics, CSV, and payment workflows.
- Last Session Date: 2026-08-17.
- Latest commit: `9ce432f` (`Use runtime-safe module imports for Vercel APIs`).
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

## PENDING / NEXT
- [ ] Recheck Vercel Production Teable values and make `/api/campaigns/:slug` return live data.
- [ ] Remove all placeholder, mock, hallucinated, and sample campaign content.
- [ ] Replace mock subscriber/action/draw state with Teable reads.
- [ ] Render `Campaign_Form_Fields` dynamically and persist `Subscriber_Responses`.
- [ ] Add signed referral cookies and rate limiting.
- [ ] Add verified action webhooks and server-side points/entries computation.
- [ ] Add privacy-aware live leaderboard.
- [ ] Make entrant CSV a live authenticated promoter export.
- [ ] Remove the Design Benchmark tab and unrelated benchmark content.
- [ ] Add promoter authentication and agency/campaign ownership.
- [ ] Add sales page, Stripe checkout, webhook confirmation, and paid dashboard entitlement.
- [ ] Complete auditable draw workflow before using “provably fair” language.
- [ ] Keep the existing Next.js agency console stable until this app passes acceptance testing.
