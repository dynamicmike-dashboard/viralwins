# VIRALWINS TASKS

All tasks begin by reading `SYSTEM_PROTOCOL.md` and `PROJECT_MANIFEST.md`.

## TASK: FIX SPIN-WHEEL ERRORS + DESIGN (FIRST TASK NEXT SESSION)
Read PROJECT_MANIFEST.md. Ask the user for the exact errors/design edits they reported on the spin-the-wheel (screenshots, console output, which view: Public Hub wheel, Customizer Wheel tab, campaign dropdown). Check known suspects in `src/components/SpinWheel/SpinWheelWidget.tsx`: segment label positioning (origin-top transform), spin timing sync (5s setTimeout vs CSS duration), label truncation. Also: customizer live preview should render the wheel when campaignType is spin_wheel. Fix, lint, build, commit, push (ask first), verify on production.

## TASK: COMMIT & PUSH UNCOMMITTED WORK
Read PROJECT_MANIFEST.md. Review `git diff`/`git status`. Stage only intended paths (never blind `git add -A` — watch for stray `.github/`, `scripts/`, embedded `promptos/`). Push with the explicit dynamicmike-dashboard URL + PAT. Ask the user before pushing.

## TASK: VERIFY TEST-ACCESS REVERT FIX
Read PROJECT_MANIFEST.md. Confirm the `/dashboard` session gate returns `authorized: true` for `test@dynamicmike.com` in dev and Vercel preview. Verify `/api/access/test` sets the cookie and returns `testToken`, and `/api/access/session` validates it via the exported `isValidSigned`. The sales page must NOT flash before the check resolves (loading gate present). Report the result.

## TASK: VERIFY TEABLE DEPLOYMENT
Check Vercel Production environment variable names without exposing values. Test `/api/health` and `/api/campaigns/<known-slug>`. Inspect Vercel logs. Do not change source until the environment issue is separated from schema issues.

## TASK: REMOVE MOCK CONTENT
Search the entire app for mockData, sample campaigns, fake subscribers, hardcoded leaderboard entries, fake analytics, placeholder prize details, fake IP addresses, and simulated notification content. Replace only with live Teable data or an explicit empty state.

## TASK: LIVE PARTICIPANT CAMPAIGN
Read the live campaign by `Public_Slug`. Render `Reward_Mode`, prize fields, countdown, theme, instructions, legal settings, form fields, and Campaign_Actions. Keep subscriber contact data server-side.

## TASK: DYNAMIC CAMPAIGN FORM
Read active `Campaign_Form_Fields` in `Sort_Order`. Preserve canonical email and first name. Validate required inputs and store custom values in `Subscriber_Responses`.

## TASK: VERIFIED ACTIONS
Resolve action definitions server-side. Enforce active state and completion limits. Use idempotent `External_Event_ID`. Award zero until the verification method confirms the action.

## TASK: LIVE PROMOTER CSV
Require authenticated promoter ownership. Export entrants from Teable with UTF-8 BOM and formula-injection protection. Standard exports must not include IP addresses or restricted fraud-risk details. Audit every export.

## TASK: REMOVE DESIGN BENCHMARK
Done in `44d4a1e` — verify no regressions (no Benchmark/Teable tabs in desktop nav, mobile nav, or PWA bottom dock).

## TASK: STRIPE ACCESS GATE
Build the sales page, Stripe Checkout session, verified webhook, promoter provisioning, and server-side dashboard entitlement checks. Never grant access from a client redirect alone.

## TASK: EMAIL DELIVERY
Wire SendGrid/Postmark for forgot-password reset links, welcome emails, and winner notices. Replace the raw reset-URL-in-JSON behavior in `api/auth/forgot`.

## TASK: PROMOTER ONBOARDING WIZARD
Build register → plan → Stripe → dashboard flow. Replace the temporary `/api/access/test` cookie entitlement with real `Plan_Tier`-driven entitlements.

## TASK: AUDITABLE DRAW
Implement seed commitment, eligibility freeze, immutable entry snapshot, seed reveal, algorithm version, winning index, operator, redraw reason, and Draw_Winners audit record before using "provably fair".

## TASK: RELEASE CHECK
Run `npm run lint`, `npm run build`, inspect `git diff`, confirm no secrets or `.env` files are staged, verify Vercel deployment, and report remaining warnings.
