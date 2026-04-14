# HoopTrainer AI

HoopTrainer AI is a full-stack basketball training web app that combines AI-generated practice planning, workout tracking, and player-specific personalization in one product.

The app is built for players who want structured basketball development instead of generic fitness plans. Users can sign in, manage their own workout library, chat with an AI coach, save conversation history, and personalize training plans with a player profile.

## What The Project Does

- Generates basketball-specific training plans with an AI coach
- Saves multi-turn chat conversations to the user account
- Lets users create, edit, and delete their own workouts
- Provides a protected dashboard and account settings area
- Personalizes AI plans using a saved player profile
- Includes responsive layouts for landing, dashboard, account, and plan pages

## Current Features

### Authentication

- Email and password signup
- Email and password login
- Protected routes for authenticated users
- Session handling through Supabase Auth

### Landing And Navigation

- Marketing landing page with product messaging
- Shared brand components and shared footer
- Dedicated Terms and Privacy pages
- Reusable public menu for auth actions

### Dashboard

- Protected training dashboard
- Quick link into the AI planner
- Motivational quote and tip rotation
- Recent session summary cards
- Workout library area with CRUD support

### Workout Management

- Add workouts
- Edit workouts
- Delete workouts
- Save workouts to Supabase per user

### AI Planner

- Multi-turn chat interface at `/plan`
- Conversation history saved in Supabase
- New chat creation
- Rename chat
- Delete chat
- Mobile sidebar support
- Markdown rendering for AI responses
- Toast feedback for key actions

### Player Profile Personalization

- Account settings page for player details
- Save:
  - age
  - position
  - level
  - days per week
  - primary goal
  - equipment access
  - injury or recovery notes
- Player profile is shown in the planner sidebar
- Player profile is sent to the AI route so plans can be personalized

## Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Supabase
  - Authentication
  - Database
- OpenAI SDK
  - used against the Groq OpenAI-compatible API
- react-markdown
- Custom global CSS design system

## Architecture Overview

### Frontend

- `src/app/page.tsx`
  - landing page
- `src/app/dashboard/page.tsx`
  - protected dashboard
- `src/app/plan/page.tsx`
  - AI planner chat interface
- `src/app/account/page.tsx`
  - account settings and player profile
- `src/app/login/page.tsx`
  - login page
- `src/app/signup/page.tsx`
  - signup page
- `src/app/terms/page.tsx`
  - terms page
- `src/app/privacy/page.tsx`
  - privacy page

### Shared Components

- `src/components/BrandMark.tsx`
- `src/components/PublicMenu.tsx`
- `src/components/SiteFooter.tsx`
- `src/components/DashboardTopBar.tsx`
- `src/components/Protected.tsx`
- `src/components/AddWorkoutForm.tsx`
- `src/components/WorkoutList.tsx`
- `src/components/WorkoutItem.tsx`

### Backend

- `src/app/api/generate/route.ts`
  - receives planner requests
  - validates input
  - injects system instructions
  - includes player profile context when available
  - calls the Groq-hosted model through the OpenAI SDK

### Data Layer

- `src/lib/supabaseClient.ts`
  - Supabase client setup
- `src/context/AuthContext.tsx`
  - global auth state

## Database Tables

The app currently expects these Supabase tables:

### `conversations`

- `id`
- `user_id`
- `title`
- `created_at`

Stores each saved AI chat thread.

### `messages`

- `id`
- `conversation_id`
- `role`
- `content`
- `created_at`

Stores individual messages for each conversation.

### `workouts`

- `id`
- `user_id`
- `title`
- `description`
- `created_at`

Stores user-created workout entries.

## Design Direction

The project currently uses a custom dark visual system with:

- glass-style top bars
- shared layout shells
- dashboard panel styling
- responsive planner sidebar and chat layout
- reusable footer and brand treatment

The app does not currently rely on Tailwind utility classes for its UI styling. Most styling is handled through `src/app/globals.css` and page-level inline styles.

## Professional Improvements Already Added

These are some of the bigger cleanup steps already completed:

- replaced unsafe AI message HTML rendering with markdown rendering
- upgraded the planner from single-prompt behavior to multi-turn conversation history
- added shared brand, footer, and menu components
- improved dashboard and planner responsiveness
- added real Terms and Privacy pages
- introduced a first real product feature through player profile personalization

## Environment Variables

Create a `.env.local` file in the root of the project:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_API_BASE=https://api.groq.com/openai/v1
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
```

## Example Use Case

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

## Current Project Status

This project is currently in a strong MVP stage.

It already has:

- a clear niche
- real user accounts
- persisted AI conversations
- workout CRUD
- legal pages
- shared UI components
- player profile personalization

The next major professional steps would likely be:

- onboarding flow for first-time users
- structured saved training plans
- progress tracking
- calendar or scheduling support
- stronger test coverage
- more reusable design primitives

## Repository Summary

If someone asks what this project is today, the short answer is:

> HoopTrainer AI is a modern Next.js basketball training app with Supabase auth and data storage, a Groq-powered AI planner, workout CRUD, responsive dashboard and planner experiences, and a player profile system that personalizes generated plans.
