import Link from "next/link";

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
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
  };

  const ghostLink: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "var(--text)",
    fontWeight: 700,
    textDecoration: "none",
    boxShadow: "0 8px 18px rgba(0,0,0,0.20)",
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
    <div className="bg-ball-left">
      {/* main top padding set to 0 to remove space above nav */}
      <main style={{ width: "min(1180px, 96vw)", margin: "0 auto", padding: "0 0 120px" }}>
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
              }}
            >
              H
            </div>
            <span style={{ fontWeight: 800, letterSpacing: 0.6, fontSize: 17 }}>HoopTrainer AI</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/login" style={ghostLink}>Login</Link>
            <Link href="/signup" style={{ ...ghostLink, borderColor: "rgba(79,201,189,0.45)" }}>
              Create account
            </Link>
          </div>
        </nav>

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
      </main>
    </div>
  );
}