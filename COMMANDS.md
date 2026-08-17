# VIRALWINS TASKS

All tasks begin by reading `SYSTEM_PROTOCOL.md` and `PROJECT_MANIFEST.md`.

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
Remove the Design Benchmark tab, navigation item, and presentation-only comparison content. Do not remove the useful visual design components.

## TASK: STRIPE ACCESS GATE
Build the sales page, Stripe Checkout session, verified webhook, promoter provisioning, and server-side dashboard entitlement checks. Never grant access from a client redirect alone.

## TASK: AUDITABLE DRAW
Implement seed commitment, eligibility freeze, immutable entry snapshot, seed reveal, algorithm version, winning index, operator, redraw reason, and Draw_Winners audit record before using “provably fair”.

## TASK: RELEASE CHECK
Run `npm run lint`, `npm run build`, inspect `git diff`, confirm no secrets or `.env` files are staged, verify Vercel deployment, and report remaining warnings.
