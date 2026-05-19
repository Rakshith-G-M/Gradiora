# Gradiora AI Interview Prep

Premium, local-first AI Interview Preparation SaaS demo built for hackathon presentations.

## Stack
- Next.js 14 + TypeScript
- TailwindCSS + shadcn-style UI components
- Framer Motion + Lucide React
- Recharts
- Transformers.js (browser, no API keys)
- Supabase Auth + storage (`@supabase/supabase-js`)

## Features
- Cinematic landing page with animated hero and feature cards
- Auth system: email/password + guest login + persistent session
- Protected dashboard/interview/report routes
- Auto-save interview sessions, answers, and final report analytics
- Dashboard report history retrieval from Supabase
- Local NLP scoring: embeddings + sentiment + keyword matching

## Setup
1. Install dependencies
```bash
npm install
```
2. Configure env vars in `.env.local`
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
3. Run SQL schema in Supabase (`supabase-schema.sql`).
4. Start app
```bash
npm run dev
```
Open `http://localhost:3000`.

## Model usage
All interview NLP models run in-browser via Transformers.js:
- `Xenova/all-MiniLM-L6-v2`
- `Xenova/distilbert-base-uncased-finetuned-sst-2-english`

No OpenAI/Gemini/Claude APIs are used.


## Demo Stability Fallbacks
- If Supabase auth is unavailable, app automatically falls back to localStorage auth.
- If DB writes fail, interview sessions/answers/reports are persisted to localStorage so demo flow remains functional.
