<div align="center">

# HoopTrainer AI

### AI-powered basketball training planner, workout tracker, and player development dashboard.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=0f172a)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Database-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Groq](https://img.shields.io/badge/Groq-Llama%203.3-F55036)](https://groq.com/)
[![Status](https://img.shields.io/badge/Status-Strong%20MVP-4dd3c9)](#current-project-status)

**Live Demo:** [https://hoop-trainer-ai.vercel.app](https://hoop-trainer-ai.vercel.app)

</div>

---

## 🧭 Overview

**HoopTrainer AI** is a full-stack basketball training web app that combines AI-generated practice planning, workout tracking, and player-specific personalization in one product.

The app is built for athletes who want structured basketball development instead of generic fitness plans. Users can sign in, manage their own workout library, chat with an AI coach, save conversation history, and personalize training plans with a player profile.

> Short version: HoopTrainer AI helps players generate smarter basketball workouts, save their progress, and train with more intent.

## 🏀 What The Project Does

| Area | Description |
| --- | --- |
| AI Training Plans | Generates basketball-specific workouts with skill, strength, conditioning, and recovery context. |
| Saved Conversations | Stores multi-turn AI planner chats so users can continue previous training discussions. |
| Workout Library | Lets users create, edit, and delete their own personal workout entries. |
| Player Profile | Personalizes AI plans using age, position, level, goal, equipment, and injury notes. |
| Protected Dashboard | Gives authenticated users a focused training hub. |
| Responsive UI | Supports desktop and mobile layouts across landing, dashboard, account, and planner pages. |

## ✨ Current Features

| Feature | Status | Details |
| --- | --- | --- |
| Authentication | Built | Email/password signup, login, persistent session handling, and protected routes. |
| Landing Page | Built | Product-focused marketing page with shared branding and navigation. |
| Dashboard | Built | Training hub with daily challenge, streaks, weekly progress, saved plans, workout library, and creative basketball cards. |
| Workout CRUD | Built | Users can add, edit, and delete saved workouts from their own account with a polished responsive UI. |
| AI Planner | Built | Multi-turn chat interface with saved conversations, rename/delete, markdown output, toast feedback, profile context, and save-as-plan actions. |
| Saved Training Plans | Built | Users can save AI responses as reusable training plans and reopen/delete them from the dashboard. |
| Daily Challenge + Streaks | Built | Daily basketball challenges, completion state, streak tracking, and weekly progress are saved to the user account. |
| Player Profile | Built | Saves player details, shows onboarding/profile completion, and sends profile context to the AI route for personalized recommendations. |
| Legal Pages | Built | Terms and Privacy pages linked from shared footer navigation. |
| Basketball Visual System | Built | Basketball background atmosphere, Spin Lab image card, Shot Arc Lab illustration, and polished mobile-first cards. |
| Responsive Design | Built | Core screens support mobile layouts across landing, auth, dashboard, account, and planner pages. |

## 🛠️ Tech Stack

| Category | Technology | Purpose |
| --- | --- | --- |
| Framework | Next.js 16 App Router | Full-stack routing, pages, layouts, and API routes. |
| UI | React 19 | Interactive client components and app screens. |
| Language | TypeScript | Safer types across frontend, API routes, and shared helpers. |
| Auth + Database | Supabase | User accounts, sessions, conversations, messages, and workouts. |
| AI SDK | OpenAI SDK | Calls Groq through an OpenAI-compatible API client. |
| AI Model Provider | Groq | Fast LLM responses for basketball plan generation. |
| Markdown | react-markdown | Safe AI response rendering without raw HTML injection. |
| Styling | Custom CSS | Shared dark theme, glass panels, responsive shells, and page-level polish. |

## 🧱 Architecture Overview

| Layer | Files | Responsibility |
| --- | --- | --- |
| Public App | `src/app/page.tsx` | Landing page and product presentation. |
| Auth Pages | `src/app/login/page.tsx`, `src/app/signup/page.tsx` | Email/password authentication flows. |
| Protected Dashboard | `src/app/dashboard/page.tsx` | User training hub and workout library entry point. |
| AI Planner | `src/app/plan/page.tsx` | Saved chat interface for training plan generation. |
| Account Settings | `src/app/account/page.tsx` | Display name, player profile onboarding, profile completion, and player command center. |
| Legal Pages | `src/app/terms/page.tsx`, `src/app/privacy/page.tsx` | Basic product trust and legal pages. |
| API Route | `src/app/api/generate/route.ts` | AI request validation, prompt setup, profile context, and Groq response handling. |
| Shared Components | `src/components/*` | Reusable brand, footer, auth protection, dashboard, and workout UI pieces. |
| Shared Utilities | `src/lib/*` | Supabase client and player profile helpers. |
| Auth Context | `src/context/AuthContext.tsx` | Global Supabase auth state management. |

## 📁 Project Structure

```text
src/
  app/
    account/       Account settings, onboarding, and player profile
    api/generate/  AI generation route
    dashboard/     Protected training dashboard
    login/         Login page
    plan/          AI planner chat page
    privacy/       Privacy page
    signup/        Signup page
    terms/         Terms page
    globals.css    Shared global styling
    layout.tsx     Root app layout
    page.tsx       Landing page
  components/
    BrandMark.tsx
    DashboardTopBar.tsx
    PublicMenu.tsx
    SiteFooter.tsx
    Protected.tsx
    AddWorkoutForm.tsx
    WorkoutList.tsx
    WorkoutListPro.tsx
    WorkoutItem.tsx
  context/
    AuthContext.tsx
  lib/
    playerProfile.ts
    supabaseClient.ts
```

## 🗄️ Database Tables

The app currently expects these Supabase tables:

| Table | Main Columns | Purpose |
| --- | --- | --- |
| `conversations` | `id`, `user_id`, `title`, `created_at` | Stores each saved AI chat thread. |
| `messages` | `id`, `conversation_id`, `role`, `content`, `created_at` | Stores user and AI messages for each conversation. |
| `workouts` | `id`, `user_id`, `title`, `description`, `created_at` | Stores user-created workout entries. |
| `training_plans` | `id`, `user_id`, `source_conversation_id`, `title`, `content`, `status`, `created_at` | Stores AI responses that users save as reusable training plans. |

Player profile data and daily challenge completion history are currently stored in Supabase Auth user metadata.

Recommended `training_plans` table:

```sql
create table if not exists public.training_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_conversation_id uuid references public.conversations(id) on delete set null,
  title text not null,
  content text not null,
  status text not null default 'saved',
  created_at timestamptz not null default now()
);
```

## 🎨 Design Direction

The project currently uses a custom dark visual system with:

| Design Area | Current Direction |
| --- | --- |
| Theme | Dark basketball training aesthetic with navy panels and cyan highlights. |
| Navigation | Shared glass-style top bars and reusable footer. |
| Layout | Shared app shells and responsive page frames. |
| Dashboard | Card-based training overview with stronger AI generator emphasis. |
| Planner | Sidebar + chat workspace with profile context, conversation list, save-as-plan actions, and fixed mobile composer. |
| Account | Player command center, profile completion ring, onboarding banner, and athlete-specific profile form. |
| Visual Identity | Basketball atmosphere background, Spin Lab image widget, Shot Arc Lab CSS illustration, glass panels, and cyan/blue accents. |
| Responsiveness | Mobile-aware dashboard, auth, account, planner, and landing layouts. |

The app does not currently rely on Tailwind utility classes for its UI styling. Most styling is handled through `src/app/globals.css` and page-level inline styles.

## ✅ Professional Improvements Already Added

These are some of the bigger cleanup steps already completed:

| Improvement | Why It Matters |
| --- | --- |
| Safe markdown rendering | Avoids raw HTML injection in AI responses. |
| Multi-turn conversation history | Makes the AI planner behave like a real chat assistant. |
| Shared brand and footer components | Reduces duplicated layout code across pages. |
| Dashboard and planner responsiveness | Makes the app easier to demo on different screen sizes. |
| Terms and Privacy pages | Improves trust and removes broken footer links. |
| Player profile personalization | Turns the product from generic chatbot into athlete-aware training tool. |
| Player onboarding after signup | Sends new users to account setup so AI plans can become personalized immediately. |
| Saved AI training plans | Converts useful AI responses into reusable dashboard cards instead of temporary chat output. |
| Daily challenge and streak tracking | Gives players a reason to return and creates visible training momentum. |
| Weekly progress tracker | Shows completion percentage, active streak, and completed challenge days. |
| Polished workout CRUD | Makes the manual workout library feel like part of the product instead of a basic form. |
| Basketball visual polish | Adds a more branded feel with image atmosphere, Spin Lab, and Shot Arc Lab cards. |

## 🧪 Debugging, Review And Hardening Pass

Latest stability pass completed for the project:

| Requirement | What Changed | Files |
| --- | --- | --- |
| Bug fixed | Prevented duplicate AI planner submissions by blocking `handleSend` when a message is already being generated. | `src/app/plan/page.tsx` |
| UX / feedback | Improved AI generation feedback and added profile-aware helper text in the planner composer. | `src/app/plan/page.tsx` |
| Refactor / cleanup | Extracted shared player profile normalization, highlights, and AI context helpers. | `src/lib/playerProfile.ts` |
| README update | Documented the hardening pass, setup, features, stack, live demo, and project status. | `README.md` |

This pass makes the project more stable, easier to demo, and easier to maintain.

## Latest Product Update

The newest development pass focused on turning the MVP into a more complete basketball training product:

| Area | What Changed | Why It Matters |
| --- | --- | --- |
| Signup onboarding | New accounts are guided toward player profile setup instead of being dropped directly into the dashboard. | Helps the AI planner become personalized earlier. |
| Account settings | Reworked account into a player command center with profile completion and quick actions. | Makes the account page feel more useful and less like a plain settings form. |
| Saved plans | AI responses can be saved as reusable training plans, reopened, previewed, and deleted from the dashboard. | Turns AI chat output into persistent training assets. |
| Dashboard engagement | Added Daily Court Challenge, streak tracking, weekly progress, readiness check, coach signal, and focus stack. | Makes the dashboard feel alive and gives users a reason to return. |
| Workout library | Added a more professional CRUD experience with polished add form, workout cards, empty states, and responsive layout. | Improves usability and demo quality. |
| Mobile planner | Reduced bottom spacing, fixed composer behavior, and kept chat messages scrollable without moving the whole page. | Makes the AI page much easier to use on phones. |
| Visual design | Added basketball image atmosphere, Spin Lab card, Shot Arc Lab illustration, and refined spacing across pages. | Makes the app feel more branded, creative, and basketball-specific. |

The app now behaves less like a simple school CRUD project and more like an early product experience for basketball players.

## 🔐 Environment Variables

Create a `.env.local` file in the root of the project:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_API_BASE=https://api.groq.com/openai/v1
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

| Variable | Required | Description |
| --- | --- | --- |
| `GROQ_API_KEY` | Yes | API key used by the AI generation route. |
| `GROQ_API_BASE` | Yes | Groq OpenAI-compatible base URL. |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase public anon key for client-side auth/database access. |

## 🚀 Getting Started Locally

### 1. Clone the repository

```bash
git clone https://github.com/almamuzliukaj/HoopTrainer-AI.git
cd HoopTrainer-AI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create `.env.local` and add the variables listed above.

### 4. Run the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## 📜 Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Starts the local development server. |
| `npm run build` | Builds the app for production. |
| `npm start` | Starts the production build. |
| `npm run lint` | Runs ESLint checks across the project. |

## 🎯 Example Use Case

A player can:

1. Create an account
2. Fill in a player profile in account settings
3. Open the AI planner
4. Ask for something like:

```text
Give me a 3-day guard workout plan focused on first-step speed and finishing. I have access to a court, dumbbells, and bands.
```

5. Receive a more personalized basketball plan based on both the prompt and the saved profile
6. Save the AI response as a reusable training plan
7. Complete the daily challenge and build a streak
8. Track weekly progress from the dashboard
9. Save personal workouts separately in the dashboard

## 📌 Current Project Status

This project is currently in a **strong MVP stage**.

| Area | Status |
| --- | --- |
| Product idea | Clear basketball-specific niche. |
| Auth | Working Supabase authentication. |
| AI Planner | Persisted multi-turn conversations. |
| Saved Training Plans | AI responses can be saved, previewed, opened, and deleted. |
| Workout Tracking | Polished CRUD workout library. |
| Daily Challenges | Daily challenge completion and streak state saved to user metadata. |
| Progress Tracking | Weekly challenge progress and current streak shown in the dashboard. |
| Legal / Trust | Terms and Privacy pages added. |
| Design System | Shared components, global layout styles, basketball visuals, and responsive cards. |
| Personalization | Player profile context connected to AI generation. |

## 🗺️ Roadmap

| Priority | Future Improvement | Why It Matters |
| --- | --- | --- |
| Done | First-time onboarding flow | Helps new users complete their profile before using the planner. |
| Done | Structured saved training plans | Turns AI responses into reusable plans instead of only chat messages. |
| Done | Progress tracking | Lets players track completed challenges, streaks, and development over time. |
| Medium | Calendar scheduling | Makes generated workouts easier to follow week by week. |
| Medium | More reusable UI primitives | Improves consistency and speeds up future development. |
| Medium | Automated tests | Makes the app harder to break as features grow. |
| Medium | Dedicated plans page | Gives saved plans a full library with search, filters, and plan details. |
| Medium | Editable daily challenge history | Lets players review or correct completed challenge days. |

## 🧾 Repository Summary

If someone asks what this project is today, the short answer is:

> HoopTrainer AI is a modern Next.js basketball training app with Supabase auth and data storage, a Groq-powered AI planner, saved training plans, workout CRUD, daily challenges, streak/progress tracking, responsive dashboard and planner experiences, and a player profile system that personalizes generated plans.

## Demo Preparation

- Presentation plan: `docs/demo-plan.md`
- Live demo URL: `https://hoop-trainer-ai.vercel.app`
- Backup option: run locally with `npm run dev`
- First professor demo flow prepared: landing page -> login -> player profile -> AI Generator -> save plan -> dashboard -> saved plan modal -> workout library.
- Demo readiness checks: lint/build, live URL, login, AI generation, saved plans, workout CRUD, responsive layout, Terms, and Privacy pages.
- Plan B: localhost demo, existing saved plans/chat history, and screenshots from `public/screenshots/`.
