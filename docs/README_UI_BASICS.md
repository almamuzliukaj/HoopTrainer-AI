# UI Basics - Planner, Dashboard, Progression

## What it covers
- AI planner chat form submitted to `/api/generate`
- Loading state: submit disabled while the AI response is generating
- Error handling: empty input, API failures, and network failures
- Markdown rendering of AI plans with day headings and bullets
- Saved AI responses that become reusable training plans
- Dashboard progression cards: XP, ranks, weekly quests, skill badges, rewards, and streak freezes
- Mobile planner composer behavior: fixed viewport, scrollable messages, and keyboard-safe input sizing

## How to run
```bash
npm install
npm run dev
```

Open http://localhost:3000

## Test cases
- Valid prompt: should show a structured basketball plan.
- Empty prompt: shows a helpful request message.
- During loading: submit button is disabled.
- Save AI response: saved plan appears on the dashboard.
- Daily challenge: completing it updates streak, weekly progress, and XP.
- Streak freeze: after enough completed challenges, a freeze can protect a missed previous day.
- Mobile planner: focusing and closing the keyboard should not leave the page zoomed or oversized.

## Files
- Planner UI: `src/app/plan/page.tsx`
- Dashboard UI: `src/app/dashboard/page.tsx`
- API: `src/app/api/generate/route.ts`
- Styles: `src/app/globals.css`
