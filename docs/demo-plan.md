# Demo Plan: HoopTrainer AI

## 1. What the Project Is and Who It Serves

**HoopTrainer AI** is a full-stack basketball training web application that helps players create, save, and track structured training plans. The project combines an AI workout generator, player profile personalization, saved training plans, manual workout tracking, daily challenges, streaks, and a training dashboard.

The project is designed for:

- basketball players who want personalized practice plans based on position, skill level, goals, equipment, and limitations;
- student-athletes who want a clearer way to organize their development;
- coaches or users who want faster basketball-specific workout ideas;
- users who want to save AI-generated plans and manual workouts in one place.

Main value:

- it generates basketball-specific plans instead of generic fitness workouts;
- it uses the player profile as context for more personalized AI responses;
- useful AI responses can be saved as reusable training plans;
- the dashboard turns the app into a product experience with progress, streaks, daily challenges, and workout tracking.

## 2. Live URL

Live demo URL:

```text
https://hoop-trainer-ai.vercel.app
```

Verification:

- The live URL was checked with:

```bash
curl.exe -I -L --max-time 60 https://hoop-trainer-ai.vercel.app
```

- The response returned:

```text
HTTP/1.1 200 OK
```

Before the final presentation, I will also open the URL manually in the browser and confirm that login, dashboard, AI Generator, and saved plans work correctly.

## 3. Main Demo Flow

This is the main flow I will demonstrate because it shows the complete product value: profile personalization, AI generation, saved plans, and progress tracking.

1. Open the live URL and briefly introduce the landing page.
2. Log in with a prepared demo account.
3. Open `Account Settings` and show the `Player Profile`.
4. Explain that the profile is used as context for personalized AI plans.
5. Open the `AI Generator`.
6. Use a quick prompt or enter this prepared prompt:

```text
Create a 3-day guard workout plan focused on first-step speed, finishing, and conditioning. I have access to a court, dumbbells, and bands.
```

7. Show the AI-generated structured basketball plan.
8. Click `Save as training plan`.
9. Go back to the `Dashboard`.
10. Open the saved plan from `Saved training plans`.
11. Show the formatted saved-plan modal/playbook.
12. Show the `Daily Court Challenge`, streak, and weekly consistency tracker.
13. Show `My Workouts`, where a user can manually add and manage workouts.

## 4. 5-7 Minute Presentation Timeline

| Time | Part | What I Will Show or Explain |
| --- | --- | --- |
| 0:00 - 0:40 | Introduction | Project name, problem, target users, and core value. |
| 0:40 - 1:15 | Landing page | Show the product positioning and explain that it is basketball-specific. |
| 1:15 - 2:00 | Login and profile | Log in, open Account Settings, and show the player profile. |
| 2:00 - 4:00 | AI Generator | Send a prompt, show the AI response, explain personalization, and save the plan. |
| 4:00 - 5:20 | Dashboard | Show saved plans, daily challenge, streak, weekly progress, and the saved-plan modal. |
| 5:20 - 6:10 | Workout Library | Show that users can also add and manage manual workouts. |
| 6:10 - 6:50 | Technical explanation | Briefly explain Next.js, Supabase, database tables, API route, and AI provider. |
| 6:50 - 7:00 | Closing | Summarize why the project is a strong MVP and what could be improved next. |

## 5. Technical Parts I Will Explain Briefly

I will keep the technical explanation short and focused on the main architecture:

- **Next.js App Router + React + TypeScript**  
  Used for routing, pages, interactive UI, protected screens, and API routes.

- **Supabase Auth**  
  Used for signup, login, session handling, and protected routes.

- **Supabase Database**  
  Stores conversations, messages, workouts, and saved training plans.

- **Supabase user metadata**  
  Stores the player profile and daily challenge completion history.

- **AI API route**  
  `src/app/api/generate/route.ts` receives the chat messages, adds the system prompt and player profile context, then calls the AI provider.

- **Saved training plan flow**  
  The AI response can be saved into the `training_plans` table and reopened later from the dashboard.

- **Responsive UI and product polish**  
  I will briefly mention the work done on the dashboard, AI Generator, saved-plan modal, profile badge, legal pages, and mobile responsiveness.

## 6. What I Checked Before the Demo

Before the final presentation, I checked or prepared the following:

- `npm run lint` passes;
- `npm run build` passes after rerunning outside the sandbox because Windows/OneDrive locked `.next`;
- live URL returns `HTTP/1.1 200 OK`;
- demo flow is planned step by step;
- README includes demo preparation information;
- AI Generator page has a professional chat layout and quick prompts;
- saved plan modal is formatted and more presentable;
- dashboard includes saved plans, daily challenge, streak, and weekly consistency;
- workout library supports adding and managing manual workouts;
- Privacy and Terms pages are present and professionally styled;
- backup plan is ready if the live demo fails.

Final manual checks before presenting:

- open the live URL in the browser;
- log in with the demo account;
- confirm the AI Generator returns a response;
- confirm `Save as training plan` works;
- confirm the saved plan appears on the dashboard;
- confirm desktop layout looks good on the presentation laptop.

## 7. Plan B If the Live Demo Fails

If the live URL or internet connection fails:

1. Run the project locally:

```bash
npm run dev
```

2. Present the same flow from:

```text
http://localhost:3000
```

3. If the AI API fails:

- show existing saved conversations;
- show saved training plans from the dashboard;
- show the workout library and daily challenge;
- explain that the issue is related to network/API/provider conditions, not the overall application structure.

4. If the local demo also has issues:

- use screenshots from `public/screenshots/`;
- show the README and repository structure;
- explain the planned flow and technical architecture from the codebase.

## 8. Demo Day Organization

Before the presentation starts, I will:

- open the live URL in advance;
- log in to the demo account before presenting;
- keep one prepared AI prompt ready;
- keep at least one saved training plan ready as backup;
- keep a local server ready as Plan B;
- keep the README and this demo plan open;
- explain the product value first, then the technical parts briefly.

## 9. Opening Statement

```text
HoopTrainer AI is a basketball training web application that combines AI-generated training plans, player profile personalization, saved plans, and workout tracking in one dashboard. In this demo, I will show how a player sets up a profile, generates a personalized plan with AI, saves the plan, and tracks training progress from the dashboard.
```

## 10. Closing Statement

```text
This project is a functional MVP with real product value. It is not only an AI chat page; it has a full user flow where a player personalizes their profile, generates a plan, saves it, and tracks training activity. The next improvements would be calendar scheduling, a dedicated saved-plans library, and stronger automated test coverage.
```
