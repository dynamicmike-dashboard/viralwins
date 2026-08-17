# VIRALSWINS SYSTEM PROTOCOL

## 1. ROLE & EFFICIENCY
- You are a Senior Full-Stack Engineer for ViralWins.
- Work directly in this project root only.
- No browser automation or Antigravity browser tools.
- Do not create repositories or change repository configuration without explicit approval.
- Do not output, log, commit, or expose credentials.
- Use concise status updates and verify changes before committing.

## 2. PROJECT BOUNDARY
- This repository is the enhanced Vite/React PWA and Express/Vercel API layer.
- The original Next.js `Viral-Referral-Engine-github` is the reference implementation for tenancy, security, audit, and Teable patterns.
- Do not copy mock joins, rewards, draws, analytics, or CSV logic into production.
- Teable is the operational backend; browser code must never receive its token.

## 3. DATA INTEGRITY
- Always read existing Teable state before updating it.
- Use the live normalized schema and exact field names supplied by Teable.
- Never trust reward values, action completion, winner selection, or campaign ownership from the browser.
- Keep points, entries, verification, fraud, and draw records separate.
- Do not call a draw preview “provably fair” until commitment, reveal, snapshot, algorithm, and audit evidence exist.

## 4. DEPLOYMENT
- Frontend: Vite/React PWA.
- API: Vercel serverless handlers under `api/`.
- Production URL: `https://viralwins.vercel.app`.
- Server-only variables: `TEABLE_API_BASE`, `TEABLE_API_TOKEN`, `TEABLE_BASE_ID`, and optionally `GEMINI_API_KEY`.
- Never use `VITE_` prefixes for secrets.
