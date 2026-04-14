import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import BrandMark from "@/components/BrandMark";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for HoopTrainer AI.",
};

const sectionStyle: CSSProperties = {
  display: "grid",
  gap: 10,
  padding: "22px 0",
  borderTop: "1px solid rgba(255,255,255,0.08)",
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <main
        style={{
          minHeight: "100vh",
          padding: "56px 18px 88px",
          flex: "1 0 auto",
        }}
      >
        <div
          style={{
            width: "min(860px, 100%)",
            margin: "0 auto",
            background: "rgba(20, 27, 44, 0.84)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
            padding: "30px 26px",
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <BrandMark size="sm" />
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link href="/" style={{ fontWeight: 700 }}>Back home</Link>
              <Link href="/dashboard" style={{ fontWeight: 700, color: "var(--accent-2)" }}>Dashboard</Link>
            </div>
          </div>

          <header style={{ display: "grid", gap: 10, padding: "24px 0 18px" }}>
            <p className="helper" style={{ margin: 0 }}>Last updated: April 14, 2026</p>
            <h1 style={{ fontSize: 34, lineHeight: 1.1 }}>Privacy Policy</h1>
            <p className="helper" style={{ margin: 0, maxWidth: 680 }}>
              HoopTrainer AI stores account and training data so the product can authenticate users, save workouts,
              and preserve AI conversations across sessions.
            </p>
          </header>

          <section style={sectionStyle}>
            <h2 style={{ fontSize: 22 }}>What We Store</h2>
            <p className="helper" style={{ margin: 0 }}>
              Depending on how you use the app, we may store your account email, display name, workout entries,
              and conversation history. This information supports the core features of the product.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={{ fontSize: 22 }}>How Data Is Used</h2>
            <p className="helper" style={{ margin: 0 }}>
              Your data is used to authenticate your account, personalize your experience, and return saved content
              such as workouts and chat history. We do not needlessly expose one user&apos;s data to another user.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={{ fontSize: 22 }}>AI Requests</h2>
            <p className="helper" style={{ margin: 0 }}>
              When you ask for a plan, relevant message content is sent to the configured AI provider so the app can generate
              a response. Avoid sharing sensitive personal or medical information in prompts unless you are comfortable doing so.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={{ fontSize: 22 }}>Data Access and Security</h2>
            <p className="helper" style={{ margin: 0 }}>
              We aim to protect stored data through standard platform controls and access restrictions. No internet-facing app
              can promise perfect security, so users should also choose strong passwords and protect their own devices.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={{ fontSize: 22 }}>Contact</h2>
            <p className="helper" style={{ margin: 0 }}>
              For privacy questions, contact <a href="mailto:support@hooptrainer.ai">support@hooptrainer.ai</a>.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter compact />
    </div>
  );
}
