"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Protected } from "@/components/Protected";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

// 👇 CRUD imports!
import AddWorkoutForm from "@/components/AddWorkoutForm";
import WorkoutList from "@/components/WorkoutList";

const SNIPPETS = [
  { quote: "The more you sweat in practice, the less you bleed in battle.", tip: "Keep ribcage stacked over hips during sprints." },
  { quote: "Repetition is the mother of learning, the father of action.", tip: "End every drill with 3 perfect reps to lock mechanics." },
  { quote: "Confidence comes from discipline and training.", tip: "Land soft: knees over toes, hips back, chest tall." },
  { quote: "Success is where preparation and opportunity meet.", tip: "Film 1–2 reps per set; fix one small thing each time." },
];

export default function Dashboard() {
  const router = useRouter();
  const [snippetIndex, setSnippetIndex] = useState(0);
  // 👇 Add refresh state for CRUD list
  const [listRefresh, setListRefresh] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setSnippetIndex((p) => (p + 1) % SNIPPETS.length), 20000);
    return () => clearInterval(id);
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const navStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 20,
    display: "flex",
    flexWrap: "wrap",     // Responsive
    minWidth: 0,          // Responsive
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
    marginBottom: 12,
    borderRadius: 14,
    background: "rgba(20, 27, 44, 0.78)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
  };

  const signOutBtn: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "linear-gradient(135deg, var(--accent-2), #4fc9bd)",
    color: "#0f1524",
    fontWeight: 800,
    boxShadow: "0 10px 22px rgba(79,201,189,0.32)",
    cursor: "pointer",
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "auto",
  };

  return (
    <Protected>
      <div className="bg-ball-left">
        <main
          className="responsive-main"
          style={{
            width: "min(1120px, 96vw)",
            margin: "0 auto",
            padding: "0 0 72px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* Nav */}
          <nav style={navStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
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

            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <button onClick={logout} style={signOutBtn}>Sign out</button>
            </div>
          </nav>

          {/* Header */}
          <header style={{ display: "grid", gap: 6 }}>
            <p className="helper" style={{ margin: 0 }}>Welcome back</p>
            <h1 style={{ margin: 0, fontSize: 28 }}>Your training dashboard</h1>
            <p className="helper" style={{ margin: 0 }}>Quick view of today and your recent sessions.</p>
          </header>

          {/* Main grid */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 16,
            }}
          >
            <div className="panel" style={{ display: "grid", gap: 10, padding: "16px 16px" }}>
              <strong style={{ fontSize: 18 }}>Today’s session</strong>
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.55 }}>
                <li className="helper">Warm-up: hips/ankles + bands (8 min)</li>
                <li className="helper">Strength: 3×8 RDL @ tempo 3-1-1</li>
                <li className="helper">Skill: ball-handling ladder + pull-up series</li>
                <li className="helper">Conditioning: shuttle runs 6×20s / 40s rest</li>
                <li className="helper">Cool-down: hip flexor + calf stretch (6 min)</li>
              </ul>
            </div>

            <Link
              href="/plan"
              className="panel"
              style={{
                display: "grid",
                gap: 10,
                padding: "16px 16px",
                background: "linear-gradient(145deg, rgba(77,211,201,0.22), rgba(93,230,170,0.18))",
                border: "1px solid rgba(77,211,201,0.45)",
                boxShadow: "0 14px 34px rgba(77,211,201,0.25)",
                textDecoration: "none",
                color: "var(--text)",
              }}
            >
              <strong style={{ fontSize: 18 }}>AI Generator</strong>
              <p className="helper" style={{ margin: 0 }}>
                Need a different flow? Jump to the generator and tweak focus, time, and gear.
              </p>
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>Open AI Generator →</span>
            </Link>

            <div className="panel" style={{ display: "grid", gap: 10, padding: "16px 16px" }}>
              <strong style={{ fontSize: 18 }}>Quote & micro-tip</strong>
              <p style={{ margin: "6px 0 0", fontStyle: "italic", color: "var(--text)" }}>
                “{SNIPPETS[snippetIndex].quote}”
              </p>
              <p className="helper" style={{ margin: 0, color: "var(--text)" }}>
                {SNIPPETS[snippetIndex].tip}
              </p>
            </div>

            <div className="panel" style={{ display: "grid", gap: 10, padding: "16px 16px" }}>
              <strong style={{ fontSize: 18 }}>Recent sessions</strong>
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700 }}>Handles + shooting</span>
                  <span className="helper">Yesterday · 42 min</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700 }}>Lower-body strength</span>
                  <span className="helper">2 days ago · 50 min</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700 }}>Tempo conditioning</span>
                  <span className="helper">4 days ago · 28 min</span>
                </div>
              </div>
            </div>
          </section>

          {/* ========== CRUD AREA: Your Workouts ========== */}
          <section>
            <div className="panel" style={{ display: "grid", gap: 10, padding: "16px 16px", marginTop: 22 }}>
              <strong style={{ fontSize: 18 }}>My Workouts (CRUD Demo)</strong>
              <AddWorkoutForm onAdded={() => setListRefresh(r => !r)} />
              <WorkoutList key={listRefresh ? "A" : "B"} />
            </div>
          </section>
        </main>
      </div>
    </Protected>
  );
}