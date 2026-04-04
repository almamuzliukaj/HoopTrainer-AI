"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto focus 'x' button kur hapet menuja
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (mobileMenuOpen) {
      setTimeout(() => closeBtnRef.current?.focus(), 120);
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/login", label: "Login" },
    { href: "/signup", label: "Create account" }
  ];

  const ghostLink: React.CSSProperties = {
    padding: "10px 18px",
    borderRadius: 12,
    border: "1.5px solid rgba(79,201,189,0.28)",
    background: "rgba(80,140,220,0.13)",
    color: "var(--text)",
    fontWeight: 700,
    textDecoration: "none",
    fontSize: 15,
    margin: "3px 0",
    boxShadow: "0 3px 12px rgba(0,0,0,0.10)",
    transition: "background .16s,border .16s",
    display: "block",
    textAlign: "left",
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

  return (
    <div className="bg-ball-left" style={{ minHeight: "100vh" }}>
      <main
        className="responsive-main"
        style={{
          width: "100vw",
          maxWidth: "100vw",
          minWidth: "0",
          margin: "0",
          padding: "0 0 120px",
          boxSizing: "border-box",
        }}
      >
        {/* --- NAV START --- */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            width: "100%",
            boxSizing: "border-box",
            marginBottom: 8,
            padding: 0,
            background: "transparent",
          }}
        >
          <div
            style={{
              background: "rgba(20, 27, 44, 0.92)",
              borderRadius: "0 0 18px 18px",
              boxShadow: "0 4px 32px 0 rgba(25,32,46,0.16)",
              minHeight: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 0 0 18px",
              maxWidth: "100vw",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, var(--accent), #3c7be0)",
                  boxShadow: "0 6px 22px rgba(60,123,224,0.20)",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 900,
                  color: "#0f1524",
                  marginRight: 5,
                  fontSize: 22,
                  letterSpacing: 0.4,
                  userSelect: "none",
                }}
              >
                H
              </div>
              <span style={{ fontWeight: 800, letterSpacing: 0.6, fontSize: 18, whiteSpace: "nowrap" }}>HoopTrainer AI</span>
            </div>

            {/* Burger + Desktop links */}
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Desktop links */}
              <nav className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <Link href="/login" style={ghostLink}>Login</Link>
                <Link href="/signup" style={{ ...ghostLink, borderColor: "rgba(79,201,189,0.45)" }}>
                  Create account
                </Link>
              </nav>
              {/* Burger (mobile) */}
              <button
                className="nav-burger-btn"
                style={{
                  background: "none",
                  border: "none",
                  display: "none",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 7,
                  margin: "0 14px 0 8px",
                  borderRadius: 9,
                  cursor: "pointer",
                }}
                aria-label="Open menu"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Bars3Icon style={{ width: 32, height: 32, color: "var(--accent)" }} />
              </button>
            </div>

            {/* Only border-bottom right, short, just below burger */}
            <span
              style={{
                position: "absolute",
                right: 5, bottom: 0,
                width: 60,
                height: 0,
                borderBottom: "4px solid var(--accent-2)",
                borderRadius: 3,
                boxShadow: "0 2px 16px rgba(79,201,189,0.18)",
                transition: "width .22s",
                // Hide on desktop, show only when burger visible
                display: "none",
              }}
              className="nav-bottom-accent"
            ></span>
          </div>
        </header>

        {/* Overlay mobile menu — elegant, radial shadow, close btn INSIDE */}
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="nav-dialog">
          <div
            className="nav-dialog-backdrop"
            aria-hidden="true"
            style={{
              position: "fixed", inset: 0,
              background: "rgba(13,23,32,0.32)",
              zIndex: 100,
              backdropFilter: "blur(1.5px)"
            }} />
          <Dialog.Panel
            style={{
              position: "fixed",
              top: 16,
              right: 16,
              width: 305,
              maxWidth: "calc(100vw - 30px)",
              minHeight: 10,
              background: "linear-gradient(135deg, #172035 77%, #273242 100%)",
              zIndex: 120,
              padding: "20px 18px 18px 22px",
              boxShadow: "0 16px 70px 18px rgba(77,211,201,0.16)",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              borderRadius: "0 0 24px 28px",
              border: "2px solid var(--accent-2)",
              animation: "slideIn .23s cubic-bezier(.61,1.8,.3,1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{
                fontWeight: 800, fontSize: 18, letterSpacing: 0.6, color: "var(--accent)", lineHeight: 1.12
              }}>Menu</span>
              <button
                ref={closeBtnRef}
                style={{
                  background: "none", border: "none", cursor: "pointer", borderRadius: 8,
                  padding: "6px 7px", marginRight: -8, marginTop: -2, display: "flex",
                  alignItems: "center", justifyContent: "center"
                }}
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}>
                <XMarkIcon style={{ width: 32, height: 32, color: "var(--accent-2)" }} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              {navLinks.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    ...ghostLink,
                    border: "2px solid var(--accent-2)",
                    background: "rgba(90,170,255,0.06)",
                    color: "var(--accent-2)",
                    textAlign: "left",
                    fontSize: 18,
                    margin: 0,
                    fontWeight: 700,
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </Dialog.Panel>
        </Dialog>

        {/* Hero/strip/vibes — pa ndryshime nga versioni yt */}

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
      </main>
      {/* NAV-BORDER ONLY UNDER BURGER */}
      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-burger-btn { display: flex !important; }
          .nav-bottom-accent { display: block !important; }
        }
        @media (min-width: 901px) {
          .nav-burger-btn { display: none !important; }
          .nav-bottom-accent { display: none !important; }
        }
        .nav-dialog { z-index: 140; }
        @keyframes slideIn {
          from {transform: translateX(44px) scale(0.97); opacity: 0.2;}
          to {transform: none; opacity:1;}
        }
      `}</style>
    </div>
  );
}