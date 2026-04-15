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
| Dashboard | Built | Training hub with AI planner entry point, workout library, tips, and recent session cards. |
| Workout CRUD | Built | Users can add, edit, and delete saved workouts from their own account. |
| AI Planner | Built | Multi-turn chat interface with saved conversations, rename/delete, markdown output, and toast feedback. |
| Player Profile | Built | Saves player details and sends them to the AI route for personalized recommendations. |
| Legal Pages | Built | Terms and Privacy pages linked from shared footer navigation. |
| Responsive Design | In progress | Core screens support mobile layouts; ongoing polish continues page by page. |

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
| Account Settings | `src/app/account/page.tsx` | Display name, password, and player profile settings. |
| Legal Pages | `src/app/terms/page.tsx`, `src/app/privacy/page.tsx` | Basic product trust and legal pages. |
| API Route | `src/app/api/generate/route.ts` | AI request validation, prompt setup, profile context, and Groq response handling. |
| Shared Components | `src/components/*` | Reusable brand, footer, auth protection, dashboard, and workout UI pieces. |
| Shared Utilities | `src/lib/*` | Supabase client and player profile helpers. |
| Auth Context | `src/context/AuthContext.tsx` | Global Supabase auth state management. |

## 📁 Project Structure

```text
src/
  app/
    account/       Account settings and player profile
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

Player profile data is currently stored in Supabase Auth user metadata.

## 🎨 Design Direction

The project currently uses a custom dark visual system with:

| Design Area | Current Direction |
| --- | --- |
| Theme | Dark basketball training aesthetic with navy panels and cyan highlights. |
| Navigation | Shared glass-style top bars and reusable footer. |
| Layout | Shared app shells and responsive page frames. |
| Dashboard | Card-based training overview with stronger AI generator emphasis. |
| Planner | Sidebar + chat workspace with profile context, conversation list, and composer. |
| Responsiveness | Mobile-aware dashboard, account, and planner layouts. |

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

## 🧪 Debugging, Review And Hardening Pass

Latest stability pass completed for the project:

| Requirement | What Changed | Files |
| --- | --- | --- |
| Bug fixed | Prevented duplicate AI planner submissions by blocking `handleSend` when a message is already being generated. | `src/app/plan/page.tsx` |
| UX / feedback | Improved AI generation feedback and added profile-aware helper text in the planner composer. | `src/app/plan/page.tsx` |
| Refactor / cleanup | Extracted shared player profile normalization, highlights, and AI context helpers. | `src/lib/playerProfile.ts` |
| README update | Documented the hardening pass, setup, features, stack, live demo, and project status. | `README.md` |

This pass makes the project more stable, easier to demo, and easier to maintain.

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
6. Save personal workouts separately in the dashboard

## 📌 Current Project Status

This project is currently in a **strong MVP stage**.

| Area | Status |
| --- | --- |
| Product idea | Clear basketball-specific niche. |
| Auth | Working Supabase authentication. |
| AI Planner | Persisted multi-turn conversations. |
| Workout Tracking | CRUD workout library. |
| Legal / Trust | Terms and Privacy pages added. |
| Design System | Shared components and global layout styles started. |
| Personalization | Player profile context connected to AI generation. |

## 🗺️ Roadmap

| Priority | Future Improvement | Why It Matters |
| --- | --- | --- |
| High | First-time onboarding flow | Helps new users complete their profile before using the planner. |
| High | Structured saved training plans | Turns AI responses into reusable plans instead of only chat messages. |
| Medium | Progress tracking | Lets players track completed sessions, streaks, and development over time. |
| Medium | Calendar scheduling | Makes generated workouts easier to follow week by week. |
| Medium | More reusable UI primitives | Improves consistency and speeds up future development. |
| Medium | Automated tests | Makes the app harder to break as features grow. |

## 🧾 Repository Summary

If someone asks what this project is today, the short answer is:

> HoopTrainer AI is a modern Next.js basketball training app with Supabase auth and data storage, a Groq-powered AI planner, workout CRUD, responsive dashboard and planner experiences, and a player profile system that personalizes generated plans.
