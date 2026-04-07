<div align="center">

# 🏀 HoopTrainer AI

**AI-powered basketball training assistant** — chat with an AI coach to get personalized multi-day training plans, log and manage your own workouts, and track your progress, all in one sleek app.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3-F54D27?logo=meta&logoColor=white)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

### 🚀 [Live Demo on Vercel](https://hoop-trainer-ai.vercel.app)

</div>

---

## 📸 Screenshots

<div align="center" style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
  <img src="public/screenshots/screenshot.png" alt="HoopTrainer AI - Plan Generator" width="340" />
  <img src="public/screenshots/screenshot2.png" alt="HoopTrainer AI - Day 2/3 and Tips" width="340" />
</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **AI Chat Interface** | Full conversational chat UI — send prompts, get structured AI responses, continue conversations, all saved to your account |
| 📚 **Conversation History** | Sidebar lists all your past chats; switch between them instantly, auto-titled from your first message |
| ✏️ **Rename & Delete Chats** | Right-click (desktop) or long-press (mobile) any conversation to rename or delete it with confirmation |
| 🏋️ **My Workouts (CRUD)** | Log your own workouts with a title and notes; edit or delete any entry from your personal library |
| 👤 **Account Settings** | Update your display name and change your password from a dedicated settings page |
| 🔐 **Secure Auth** | Email/password authentication powered by Supabase — protected routes, persistent session management |
| 🏀 **Basketball-Specific AI** | AI combines on-court drills (ball-handling, shooting, finishing) with plyometrics, strength & conditioning |
| 📝 **Markdown Rendering** | Clean, formatted AI output with Day headings, bullet lists, sets/reps, and coaching tips |
| 📊 **Player Dashboard** | Motivational quotes & micro-tips that rotate every 20 seconds, today's session overview, and recent session recap |
| 🎨 **Dark Theme UI** | Sleek dark navy and cyan color palette with basketball-inspired watermark background |
| 📱 **Responsive Design** | Mobile-first layout — sticky navbar, collapsible sidebar, and adaptive account menu for all screen sizes |
| 🛡️ **Error Handling** | Validates empty inputs, handles API and network errors gracefully, with toast notifications for all actions |

---

## 🔄 Recent Changes

### Chat Interface Redesign (`/plan`)
- Replaced the single-form plan generator with a **full multi-turn chat interface** backed by Supabase
- **Conversations sidebar** lists all past chats, highlighted active conversation, and a "New Chat" button
- **Auto-titling**: the first message in a conversation automatically becomes the conversation title
- **Rename**: click ⋮ → Rename Conversation (modal with keyboard support)
- **Delete**: click ⋮ → Delete → confirmation modal before permanent removal
- Mobile: sidebar is collapsible via a ☰ hamburger button; long-press on a conversation row opens the action menu
- **Sticky navbar and sticky input bar** — the chat stays usable even on long message threads
- **Toast notifications** for all async actions (chat created, renamed, deleted, AI response received)
- Fixed state sync bugs where rename/delete would not immediately reflect in the sidebar without a page reload

### Workout Library (`/dashboard`)
- New **"My Workouts"** panel on the dashboard with full CRUD backed by Supabase `workouts` table
- **AddWorkoutForm** — title + description fields, saves directly to Supabase, clears on success
- **WorkoutList** — fetches the user's workouts ordered by newest first, shows a count badge
- **WorkoutItem** — inline edit mode (click Edit → modify title/description → Save Changes or Cancel) and delete with a browser confirmation
- Responsive: form and cards adapt to mobile widths, no horizontal overflow

### Account Settings (`/account`)
- New dedicated **Account Settings page** linked from the account dropdown
- Update **display name** (stored in Supabase user metadata)
- **Change password** with validation (min 6 chars, passwords must match)
- Sticky back-to-dashboard header; avatar initial shown in the profile card

### Account Dropdown Menu (Dashboard)
- **Avatar button** in the navbar shows your first initial (name or email fallback)
- Dropdown shows your full name and email, links to Account Settings, and a styled Sign Out button
- Click outside to dismiss; scales responsively for mobile viewports

### Professional Dashboard Layout
- Responsive CSS grid with 4 panels: Today's Session, AI Generator quick-link, Quote & Micro-tip, Recent Sessions
- Quote rotates every 20 seconds (down from 25)
- Sticky navbar with blur backdrop, footer with Support / Terms / Privacy links

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **AI / LLM** | [Groq API](https://groq.com/) — `llama-3.3-70b-versatile` via OpenAI-compatible SDK |
| **Authentication & DB** | [Supabase](https://supabase.com/) — Auth, `conversations`, `messages`, and `workouts` tables |
| **Markdown** | [react-markdown](https://github.com/remarkjs/react-markdown) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```
HoopTrainer-AI/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing / welcome page
│   │   ├── layout.tsx            # Root layout with Auth provider
│   │   ├── globals.css           # Global dark-theme styles
│   │   ├── api/
│   │   │   └── generate/
│   │   │       └── route.ts      # POST /api/generate — Groq chat completion
│   │   ├── plan/
│   │   │   └── page.tsx          # AI Chat interface (conversations + messages)
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Protected player dashboard + My Workouts CRUD
│   │   ├── account/
│   │   │   └── page.tsx          # Account settings (name + password)
│   │   ├── login/
│   │   │   └── page.tsx          # Login form (Supabase auth)
│   │   └── signup/
│   │       └── page.tsx          # Sign-up form (Supabase auth)
│   ├── components/
│   │   ├── AddWorkoutForm.tsx     # Form to add a new workout entry
│   │   ├── WorkoutList.tsx        # Fetches and renders the user's workout library
│   │   ├── WorkoutItem.tsx        # Single workout card with inline edit + delete
│   │   ├── AuthForm.tsx           # Reusable authentication form
│   │   └── Protected.tsx          # Route-protection wrapper
│   ├── context/
│   │   └── AuthContext.tsx       # Global auth state (Supabase session)
│   └── lib/
│       └── supabaseClient.ts     # Supabase client initialization
├── public/
│   └── screenshots/              # App UI screenshots
├── docs/                         # Additional documentation
├── .env.local                    # Environment variables (not committed)
├── package.json
└── next.config.ts
```

---

## 🗄️ Supabase Database Tables

| Table | Columns | Description |
|---|---|---|
| `conversations` | `id`, `user_id`, `title`, `created_at` | One row per AI chat thread |
| `messages` | `id`, `conversation_id`, `role`, `content`, `created_at` | Each message in a conversation (`role`: `user` or `ai`) |
| `workouts` | `id`, `user_id`, `title`, `description`, `created_at` | User-logged personal workout entries |

---

## ⚙️ Prerequisites

- **Node.js** 18 or later
- A **[Groq](https://console.groq.com/)** account and API key
- A **[Supabase](https://supabase.com/)** project (URL + anon key) with the three tables above created

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/almamuzliukaj/HoopTrainer-AI.git
cd HoopTrainer-AI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Groq AI
GROQ_API_KEY=your_groq_api_key_here
GROQ_API_BASE=https://api.groq.com/openai/v1

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Never commit `.env.local` to version control.** It is already listed in `.gitignore`.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏋️ Usage

1. **Create an account** or log in via the Sign-up / Login pages.
2. From the **Dashboard**, explore your training overview and manage your **Workout Library**.
3. Click **AI Generator** (or navigate to `/plan`) to open the **Chat Interface**.
4. Type a training request, for example:

   > *"3-day plan for a guard, goal: explosiveness and speed, intermediate level, age 20"*

5. Press **Enter** or **Send** — the AI coach responds with a structured multi-day plan.
6. Continue the conversation to refine the plan, or create a **New Chat** for a fresh topic.
7. Access **Account Settings** from the avatar dropdown to update your name or password.

---

## 🖥️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Build the application for production |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint across the codebase |

---

## 🌍 Deployment

HoopTrainer AI is deployed on **[Vercel](https://vercel.com/)**: **[https://hoop-trainer-ai.vercel.app](https://hoop-trainer-ai.vercel.app)**

To deploy your own instance:

1. Push your repository to GitHub.
2. Import the project on [vercel.com/new](https://vercel.com/new).
3. Add all required environment variables in the Vercel dashboard (Settings → Environment Variables).
4. Deploy — Vercel auto-detects Next.js and handles the build.

Any other Next.js-compatible hosting platform (AWS Amplify, Railway, Render, etc.) also works.

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m 'feat: add your feature'`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request.

Please ensure your code passes linting (`npm run lint`) before submitting.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  Built with ❤️ for ballers who take their game seriously.
</div>
