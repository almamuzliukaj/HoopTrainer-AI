# UI Basics – Form → Loading → AI Response

## What it covers
- Text form with submit to `/api/generate`
- Loading state: button disabled + label change
- Clears old error/response before each request
- Error handling: empty input + API failures
- Markdown rendering of AI plan (Day headings, bullets)
- Additional Tips block (static)

## How to run
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Test cases
- Valid prompt: should show Day 1–3 plan + Tips.
- Empty prompt: shows error “Please write your request...”.
- During loading: button disabled, previous response cleared.

## Files
- UI: `src/app/page.tsx`
- API: `src/app/api/generate/route.ts`
- Styles: `src/app/globals.css`