# PROJECT MANIFEST

## STATUS
- Current Goal: **Fix spin-the-wheel errors + design edits reported by user (NEXT SESSION'S FIRST TASK)**, then continue live Teable-backed campaign/promoter/payment workflows.
- Last Session Date: 2026-08-19 (this session).
- Latest commit: `44d4a1e` (`Remove Benchmark/Teable tabs; rebrand ViralEngine->ViralWins; add spin-the-wheel campaign style`) — pushed to origin/main, deployed.
- Repository: `https://github.com/dynamicmike-dashboard/viralwins.git`.
- Production URL: `https://viralwins.vercel.app`.
- **USER REPORT (end of session)**: "there are errors and design edits required" on the newly shipped spin wheel / dashboard — user will review tomorrow. Get exact error details (screenshots/console) from user first, then fix.

## SYSTEM STATE
- Frontend: Vite + React + Tailwind + Lucide + Motion.
- API: Vercel serverless functions under `api/`; local Express compatibility remains in `server.ts`.
- Backend: Teable base `bseGn6eb9JmnGXyH8WF` using server-only environment variables.
- `GET /api/health` is live and returns 200.
- `npm run lint` passes; `npm run build` passes (only the existing 500 KB bundle-size warning).
- AUTH_SECRET signing key in use by test + promoter session cookies; PAID_TEST_EMAIL falls back to `test@dynamicmike.com`.
- SEO/title fully rebranded to "ViralWins" (index.html, manifest.webmanifest, PwaInstallModal, all legal modals, footer, official rules, customizer).
- Test access WORKS in production: `test@dynamicmike.com` → dashboard (user confirmed).
- **GIT PUSH REMINDER**: local git credential helper uses the `realaicasa` PAT (denied for this repo). Push with the explicit dynamicmike-dashboard URL + PAT. Do NOT `git add -A` blindly — stage only intended paths.

### TEST-ACCESS BUG — RESOLVED (session 2026-08-19)
**Root causes (both fixed):**
1. **`isValidSigned` split bug** (`d610932`): the function used `raw.split('.')` which splits on ALL dots. Emails like `test@dynamicmike.com` contain dots, so the split produced `['test@dynamicmike', 'com', 'expiry', 'sig']` instead of `['test@dynamicmike.com', 'expiry', 'sig']`. The reconstructed payload never matched the signature, so the `x-vw-test-token` header fallback always failed → session returned `authorized:false` → dashboard reverted to sales page. **Fix**: split on the LAST two dots only (`parts.pop()` × 2), join the rest as the email.
2. **PowerShell curl quoting artifact**: `-d "{\"email\":\"...\"}"` in PowerShell sends literal backslashes, corrupting the JSON body on the wire. The browser's `fetch` with `JSON.stringify()` sends clean JSON. (Form-encoded bodies `-d "email=..."` work from PowerShell as a testing workaround.)

**Verified working in production**: POST `/api/access/test` → `{ok:true, testToken}`; GET `/api/access/session` with `x-vw-test-token` → `{authorized:true}`.

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
- **Quick wins (implemented)**: 5 campaign templates in `mockData.ts` (gym, SaaS beta, product launch, café, spin-wheel); Duplicate Campaign button in customizer; filtered CSV export dropdown (All/Active/Verified/Flagged/Last-7d/Last-30d); analytics date-range picker (All/7d/30d/90d) with daily signup sparkline; dashboard empty state with "Open public entrant page" CTA; home hyperlink on sales-page logo.
- **REMOVED (user-requested, commit `44d4a1e`)**: Design Benchmark tab + component folder; Teable Schema Viewer tab + component folder (desktop nav, mobile nav, PWA bottom dock); all "ViralEngine Studio"/"Viral Referral Engine" brand references (legal modals, footer, official rules, customizer, PWA install modal → "ViralWins").
- **SPIN-THE-WHEEL CAMPAIGN STYLE (commit `44d4a1e` — HAS REPORTED ERRORS/DESIGN ISSUES, user reviewing tomorrow)**:
  - `spin_wheel` added to `CampaignType`; `SpinWheelSegment` + `SpinWheelConfig` types; `Campaign.spinWheel?` field.
  - `src/components/SpinWheel/SpinWheelWidget.tsx` — public widget: conic-gradient wheel, pointer, 5s animated spin (cubic-bezier easing), prize reveal card, spin-again/reset, optional background image w/ overlay, unlimited segments (labels truncated at 16 chars).
  - `src/components/SpinWheel/SpinWheelEditor.tsx` — customizer editor: title, description, button label, result message, background image URL + 3 presets, unlimited add/remove segments, "Load sample" template.
  - Customizer: new "Wheel" sub-tab (between Tiers and Legal, Disc3 icon); Campaign Style selector in Prize tab (Sweepstakes / Points Milestones / Hybrid / Spin the Wheel) that auto-seeds default spinWheel config.
  - App.tsx: when `campaignType === 'spin_wheel'`, Public Hub renders SpinWheelWidget + (if not joined) the join form below.
  - Template campaign `tmpl-spin-wheel` ("Spin & Win Instant Prizes", Main Street Boutique) selectable from the campaign dropdown.
  - Sales page: "Spin-the-wheel campaigns" feature card in benefits grid.
  - **KNOWN LIKELY ISSUES to check when user reports details**: segment label positioning (origin-top transform math may misplace labels at various segment counts), wheel label readability/rotation, spin result timing sync (5s setTimeout vs CSS 5000ms), duplicate-campaign of spin campaigns, customizer live preview doesn't render the wheel (preview shows landing/hub views only).

## PENDING / NEXT
- [x] **TEST-ACCESS BUG RESOLVED** (`d610932`) — user confirmed dashboard access works with `test@dynamicmike.com`.
- [x] Design Benchmark + Teable tabs removed; ViralEngine → ViralWins rebrand complete (`44d4a1e`).
- [x] Spin-the-wheel campaign style scaffolded (`44d4a1e`) — **BUT user reports errors + design edits needed. FIRST TASK NEXT SESSION: get exact error details (screenshots/console messages) from user, then fix.**
- [ ] **Spin-wheel polish (user-driven)**: fix reported errors; likely label positioning, customizer live preview of wheel, spin timing sync, visual design edits per user feedback.
- [ ] Map a promoter plan to each campaign in Teable (`Plan_Tier` + `Entrant_Cap`).
- [ ] Wire Stripe checkout and webhook so the temporary `/api/access/test` cookie becomes a real entitlement.
- [ ] Email delivery (SendGrid/Postmark) for forgot-password reset links + winner notices.
- [ ] Promoter onboarding wizard (register → plan → Stripe → dashboard) replacing the test cookie.
- [ ] Teable schema lock: confirm `Legal_Settings_JSON` long-text field exists on `Viral Referral Engine`; add Promoters table indexes.
- [ ] Remove all placeholder, mock, hallucinated, and sample campaign content.
- [ ] Replace mock subscriber/action/draw state with Teable reads.
- [ ] Render `Campaign_Form_Fields` dynamically and persist `Subscriber_Responses`.
- [ ] Add signed referral cookies and rate limiting.
- [ ] Add verified action webhooks and server-side points/entries computation.
- [ ] Add privacy-aware live leaderboard.
- [ ] Make entrant CSV a live authenticated promoter export.
- [ ] Complete auditable draw workflow before using "provably fair" language.
- [ ] Keep the existing Next.js agency console stable until this app passes acceptance testing.
