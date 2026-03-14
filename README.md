# HoopTrainer AI

Basketball-specific training plan generator with on-court drills + athletic development. Built with Next.js (App Router) and Groq (OpenAI-compatible) chat completions.

## Features
- ✏️ Prompt form with validation
- 🔄 Loading state (button disabled) + clear previous results per request
- 🛡️ Error handling for API and empty input
- 🧠 Groq-backed API (`/api/generate`) with HoopTrainer system prompt (skill + athletic)
- 📝 Markdown rendering for clean Day 1–3 plans (compact spacing)
- 💡 Additional Tips section (always shown under plans)
- 🎨 Dark theme styling (`globals.css`)

## Project Structure
```
src/
  app/
    page.tsx           # UI form + Markdown rendering
    api/
      generate/
        route.ts       # Groq chat completion endpoint
    layout.tsx
  lib/
    supabaseClient.ts  # (optional helper)
.env.local             # API keys (not committed)
```

## Prerequisites
- Node 18+
- Groq API key

## Setup
1. Install deps
   ```bash
   npm install
   ```
2. Create `.env.local`
   ```bash
   GROQ_API_KEY=your_key_here
   GROQ_API_BASE=https://api.groq.com/openai/v1
   ```
3. Run dev server
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## Usage
1. Write a prompt (e.g., “3-day plan for a guard, goal: explosiveness and speed, intermediate, age 20”).
2. Click **Generate Plan**.
3. During loading, the button is disabled; previous result/error is cleared.
4. View the Markdown-formatted plan (Day headings bold/larger) plus “Additional Tips”.

## Scripts
- `npm run dev` – start dev server
- `npm run build` – production build
- `npm start` – run production build
- `npm run lint` – lint

## Deployment
- Any Next.js-compatible host (Vercel recommended).  
- Ensure `.env` variables are set in hosting dashboard.

## Notes
- `.env.local` is gitignored; never commit secrets.
- If you change the API path, update the fetch URL in `page.tsx`.
- Markdown spacing/headings can be tuned via `globals.css` (`.md-heading`, `.md-p`, `.md-li`).
