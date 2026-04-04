"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

// Hamburger menu for auth actions
function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", zIndex: 110 }}>
      <button
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "var(--card-2)",
          border: "1.5px solid var(--border)",
          padding: 8,
          borderRadius: 11,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          boxShadow: open ? "0 4px 22px rgba(77,211,201,0.09)" : "none",
          outline: "none",
        }}
      >
        {/* Hamburger icon */}
        <svg width={27} height={27} viewBox="0 0 27 27" fill="none">
          <rect x="5.5" y="8" width="16" height="2.6" rx="1.3" fill="var(--accent)"/>
          <rect x="5.5" y="13" width="16" height="2.6" rx="1.3" fill="var(--accent-2)"/>
          <rect x="5.5" y="18" width="16" height="2.6" rx="1.3" fill="var(--muted)"/>
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 42,
            background: "var(--card-2)",
            border: "1.5px solid var(--border)",
            borderRadius: 14,
            boxShadow: "0 10px 40px rgba(90,160,255,0.13)",
            display: "flex",
            flexDirection: "column",
            minWidth: 164,
            zIndex: 101,
            gap: 2,
            overflow: "hidden",
            animation: "fadeInScale .16s",
          }}
        >
          <Link
            href="/login"
            style={{
              color: "var(--text)",
              background: "none",
              fontWeight: 700,
              padding: "13px 22px",
              fontSize: 15,
              border: "none",
              textDecoration: "none",
              transition: "background .15s",
              outline: "none",
              letterSpacing: "0.2px",
            }}
            onClick={() => setOpen(false)}
          >Login</Link>
          <Link
            href="/signup"
            style={{
              color: "var(--accent-2)",
              fontWeight: 700,
              padding: "13px 22px",
              fontSize: 15,
              background: "none",
              border: "none",
              textDecoration: "none",
              transition: "background .15s",
              outline: "none",
              letterSpacing: "0.2px",
            }}
            onClick={() => setOpen(false)}
          >Create account</Link>
        </div>
      )}
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(.92);}
          to { opacity: 1; transform: scale(1);}
        }
      `}</style>
    </div>
  );
}

export default function Page() {
  const navStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
    marginBottom: 8,
    borderRadius: 14,
    background: "rgba(20, 27, 44, 0.78)",
    backdropFilter: "blur(10px)",
    border: "1px solid var(--border)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.28)",
  };

  const ctaPrimary: React.CSSProperties = {
    padding: "14px 18px",
    borderRadius: 12,
    background: "linear-gradient(135deg, var(--accent), #3c7be0)",
    color: "#0f1524",
    fontWeight: 800,
    boxShadow: "0 14px 30px rgba(60,123,224,0.35)",
    textAlign: "center",
    border: "none",
    minWidth: 160,
    textDecoration: "none",
    display: "inline-block",
  };

  const ctaSecondary: React.CSSProperties = {
    padding: "14px 18px",
    borderRadius: 12,
    background: "linear-gradient(135deg, var(--accent-2), #4fc9bd)",
    color: "#0f1524",
    fontWeight: 800,
    boxShadow: "0 14px 30px rgba(79,201,189,0.32)",
    textAlign: "center",
    border: "1px solid rgba(79,201,189,0.55)",
    minWidth: 160,
    textDecoration: "none",
    display: "inline-block",
  };

  const vibes = [
    "“Good reps > big numbers.”",
    "“Feet under you, eyes up, breathe.”",
    "“Smooth is fast—let the handle breathe.”",
    "“Land soft, load strong, explode clean.”",
  ];

  // How it works items in ENGLISH
  const howItWorks = [
    {
      icon: "🎯",
      title: "Set your goals",
      desc: "Define your basketball focus for each session.",
    },
    {
      icon: "📝",
      title: "Choose your skill areas",
      desc: "Select from shooting, defense, strength, cardio & more.",
    },
    {
      icon: "⚡️",
      title: "Get your custom plan",
      desc: "AI instantly creates a session tailored to you.",
    },
    {
      icon: "📱",
      title: "Open your workout dashboard",
      desc: "View workouts, timers, and tips all in one place.",
    },
    {
      icon: "🏀",
      title: "Train & track",
      desc: "Execute the workout and mark drills as complete.",
    },
    {
      icon: "💡",
      title: "Get AI feedback",
      desc: "Review micro-tips and session improvements after each rep.",
    },
  ];

  // Testimonials in ENGLISH
  const testimonials = [
    {
      text: `"HoopTrainer AI saves me hours planning every week. I’ve never been more focused during practices!"`,
      author: "Jane, student-athlete",
    },
    {
      text: `"Every session feels different and motivates my whole team. Our bodies get tired, but our minds stay fresh!"`,
      author: "Coach Ali",
    },
    {
      text: `"The customized plans helped me level up to varsity. No more wasted workouts!"`,
      author: "Eddie, point guard",
    },
    {
      text: `"Using micro-cues each drill keeps me locked in. The feedback after training is pure gold!"`,
      author: "Sarah, shooting guard",
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "none"
    }}>
      <div className="bg-ball-left" style={{ flex: "1 0 auto", display: "flex", flexDirection: "column", padding: 0 }}>
        <nav style={navStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "linear-gradient(135deg, var(--accent), #3c7be0)",
                boxShadow: "0 10px 20px rgba(60,123,224,0.35)",
                display: "grid",
                placeItems: "center",
                fontWeight: 900,
                color: "#0f1524",
                letterSpacing: 0.4,
                fontSize: 22,
              }}
            >
              H
            </div>
            <span style={{ fontWeight: 800, letterSpacing: 0.6, fontSize: 17 }}>HoopTrainer AI</span>
          </div>
          <div>
            <HamburgerMenu />
          </div>
        </nav>

        <main style={{ flex: 1, maxWidth: "1180px", margin: "0 auto", padding: "0 16px 120px", width: "100%" }}>
          {/* Hero */}
          <section
            className="card"
            style={{
              padding: "34px 32px 38px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 28,
              alignItems: "center",
              minHeight: 360,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p className="helper" style={{ margin: 0, fontSize: 15 }}>AI-powered training, tailored to you</p>
              <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.15 }}>Build smarter basketball sessions with one click</h1>
              <p className="helper" style={{ margin: 0, fontSize: 15 }}>
                HoopTrainer AI crafts full practice plans—strength, skill, conditioning—then layers cues and micro-tips so every rep has intent.
                Keep everything in one calm, focused workspace.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 4 }}>
                <Link href="/signup" style={ctaPrimary}>Get started free</Link>
                <Link href="/login" style={ctaSecondary}>I already have an account</Link>
              </div>
              <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                <div className="helper">• AI plan generator (strength, shooting, conditioning)</div>
                <div className="helper">• Rotating quotes & micro-tips to keep intent sharp</div>
                <div className="helper">• Clean, distraction-free dark UI with big readable panels</div>
                <div className="helper">• Supabase-authenticated, ready for your sessions</div>
              </div>
            </div>

            <div
              className="card"
              style={{
                borderRadius: 16,
                padding: "18px 20px",
                background: "linear-gradient(145deg, rgba(77,211,201,0.22), rgba(93,230,170,0.18))",
                border: "1px solid rgba(77,211,201,0.45)",
                boxShadow: "0 18px 40px rgba(77,211,201,0.28)",
                display: "grid",
                gap: 12,
              }}
            >
              <h3 style={{ margin: "0 0 6px" }}>What you’ll get</h3>
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.65 }}>
                <li className="helper">Fast onboarding to generate personalized plans</li>
                <li className="helper">Daily focus cards and accessory cues</li>
                <li className="helper">Quote + micro-tip rotation to stay intentional</li>
                <li className="helper">Consistent layout from landing to dashboard</li>
              </ul>
              <div style={{ marginTop: 6, display: "grid", gap: 6 }}>
                <div className="helper" style={{ fontWeight: 700 }}>Built with: Next.js, Supabase Auth, Vercel AI SDK</div>
                <div className="helper">Save time planning; spend more time training.</div>
              </div>
            </div>
          </section>

          {/* Feature strip */}
          <section
            className="card"
            style={{
              marginTop: 22,
              padding: "24px 26px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {[
              { title: "Plan in seconds", desc: "Enter goals, get a balanced session with strength, skill, and conditioning." },
              { title: "Stay on track", desc: "Dashboard panels keep daily focus, tips, and actions clear." },
              { title: "Train with intent", desc: "Micro-tips remind posture, tempo, and efficiency on every rep." },
              { title: "Designed to calm", desc: "Soft gradients, clear spacing, and dark mode keep focus high." },
            ].map((f, i) => (
              <div key={i} style={{ display: "grid", gap: 6 }}>
                <strong style={{ fontSize: 16 }}>{f.title}</strong>
                <p className="helper" style={{ margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </section>

          {/* Court-side vibes */}
          <section
            className="card"
            style={{
              marginTop: 22,
              padding: "24px 24px",
              display: "grid",
              gap: 12,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 22 }}>Court-side vibes</h2>
            <p className="helper" style={{ margin: 0, maxWidth: 680 }}>
              A few reminders before you hit the floor—pick one and let it set the tone for today’s session.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
              {vibes.map((line, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: 14,
                    padding: "12px 14px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: "0 10px 22px rgba(0,0,0,0.24)",
                  }}
                  className="helper"
                >
                  {line}
                </div>
              ))}
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section
            className="card"
            style={{
              marginTop: 32,
              padding: "28px 24px",
              display: "grid",
              gap: 24,
            }}
          >
            <h2 style={{ fontSize: 22, margin: "0 0 18px" }}>How HoopTrainer AI Works</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 20 }}>
              {howItWorks.map((step, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{step.icon}</div>
                  <strong>{step.title}</strong>
                  <div className="helper" style={{ marginTop: 4 }}>{step.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section
            className="card"
            style={{
              marginTop: 32,
              padding: "28px 24px",
              display: "grid",
              gap: 22,
            }}
          >
            <h2 style={{ fontSize: 22, margin: "0 0 16px" }}>What Athletes & Coaches Say</h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))",
              gap: 24,
            }}>
              {testimonials.map((t, i) => (
                <div key={i} style={{ fontStyle: "italic", color: "var(--muted)", padding: "8px 0" }}>
                  {t.text}
                  <br />
                  <span style={{ fontWeight: 700, color: "var(--accent-2)" }}>{t.author}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1.6px solid var(--border)",
          background: "var(--card-2)",
          color: "var(--muted)",
          padding: "36px 0 20px",
          textAlign: "center",
          fontSize: 15,
          boxShadow: "0 -1px 18px rgba(20,27,44,0.14)",
          flexShrink: 0,
          width: "100%",
          marginTop: "auto"
        }}
      >
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 22,
            padding: "0 18px",
          }}
        >
          <div style={{ display: 'flex', alignItems: "center", gap: 9 }}>
            <span style={{
              fontWeight: 900,
              fontSize: 21,
              color: "var(--accent)",
              marginRight: 4,
            }}>H</span>
            <span style={{
              fontWeight: 700,
              fontSize: 17,
              letterSpacing: 0.2,
              color: "var(--text)",
            }}>HoopTrainer AI</span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap"
          }}>
            <a
              href="mailto:support@hooptrainer.ai"
              style={{
                color: "var(--accent-2)",
                textDecoration: "none",
                fontWeight: 700,
                marginRight: 18,
                fontSize: 15
              }}
            >
              Support
            </a>
            <Link
              href="/terms"
              style={{
                color: "var(--muted)",
                textDecoration: "none",
                fontWeight: 500,
                marginRight: 18,
                fontSize: 15
              }}
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              style={{
                color: "var(--muted)",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: 15
              }}
            >
              Privacy
            </Link>
          </div>
        </div>
        <div style={{
          color: "#6b7dab",
          fontSize: 13,
          marginTop: 18,
          letterSpacing: 0.1
        }}>
          &copy; {new Date().getFullYear()} HoopTrainer. All rights reserved.
        </div>
      </footer>
    </div>
  );
}