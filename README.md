# Gradiora AI Interview Prep

Premium, local-first AI Interview Preparation SaaS demo built for hackathon presentations.

## Stack
- Next.js 14 + TypeScript
- TailwindCSS + shadcn-style UI components
- Framer Motion + Lucide React
- Recharts
- Transformers.js (browser, no API keys)

## Features
- Cinematic landing page with animated hero and feature cards
- Dashboard with role selection, tracker, analytics cards
- Live interview chat experience with adaptive difficulty cues
- Local NLP scoring: embeddings + sentiment + keyword matching
- Final report with score cards, radar chart, and progress graph
- Local datasets (30 frontend, 30 backend, 30 AI/ML, 20 HR)

## Local Run
```bash
npm install
npm run dev
```
Then open `http://localhost:3000`.

## Model usage
All models run in-browser via Transformers.js:
- `Xenova/all-MiniLM-L6-v2` for embeddings/similarity
- `Xenova/distilbert-base-uncased-finetuned-sst-2-english` for sentiment

No cloud API keys are required.
