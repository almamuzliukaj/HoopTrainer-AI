import type { Metadata } from "next";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for HoopTrainer AI.",
};

const privacySections = [
  {
    title: "What We Store",
    body:
      "Depending on how you use the app, HoopTrainer AI may store your account email, display name, player profile, workout entries, saved plans, and conversation history. This data supports authentication, personalization, and saved training workflows.",
  },
  {
    title: "How Data Is Used",
    body:
      "Your data is used to sign you in, tailor training recommendations, save workouts, return chat history, and keep your dashboard useful across sessions. We do not needlessly expose one user's private data to another user.",
  },
  {
    title: "AI Requests",
    body:
      "When you ask for a plan, relevant message content and profile context may be sent to the configured AI provider so the app can generate a response. Avoid sharing sensitive personal, medical, or financial information in prompts unless you are comfortable doing so.",
  },
  {
    title: "Data Access and Security",
    body:
      "We aim to protect stored data through standard platform controls, authentication, and access restrictions. No internet-facing app can promise perfect security, so users should also choose strong passwords and protect their own devices.",
  },
  {
    title: "Contact",
    body:
      "For privacy questions, contact support@hooptrainer.ai. We will use that channel for privacy, data access, and policy questions.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="legal-page-shell">
      <main className="legal-page-main">
        <nav className="legal-topbar">
          <BrandMark size="sm" />
          <div className="legal-nav-actions">
            <Link href="/">Landing page</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </nav>

        <section className="legal-hero">
          <div>
            <div className="section-kicker">HOOPTRAINER AI POLICY</div>
            <h1>Privacy Policy</h1>
            <p>
              A clear overview of what HoopTrainer AI stores, why it is used, and how AI-generated training
              requests are handled.
            </p>
          </div>
          <div className="legal-hero-card">
            <span>Last updated</span>
            <strong>April 26, 2026</strong>
            <small>Applies to accounts, workouts, saved plans, and AI planner activity.</small>
          </div>
        </section>

        <section className="legal-summary-grid" aria-label="Privacy summary">
          <div>
            <span>01</span>
            <strong>Account data</strong>
            <p>Email, display name, and player profile help personalize the product.</p>
          </div>
          <div>
            <span>02</span>
            <strong>Training data</strong>
            <p>Workouts, saved plans, and chats are stored so your progress is not lost.</p>
          </div>
          <div>
            <span>03</span>
            <strong>AI context</strong>
            <p>Relevant prompts may be sent to the AI provider to generate responses.</p>
          </div>
        </section>

        <section className="legal-content-card">
          {privacySections.map((section) => (
            <article key={section.title} className="legal-section">
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </section>

        <section className="legal-bottom-actions">
          <div>
            <strong>Ready to keep training?</strong>
            <p>Return to your dashboard or revisit the public landing page.</p>
          </div>
          <div>
            <Link className="legal-primary-action" href="/dashboard">Back to dashboard</Link>
            <Link className="legal-secondary-action" href="/">Back to landing page</Link>
          </div>
        </section>
      </main>
      <SiteFooter compact />
    </div>
  );
}
