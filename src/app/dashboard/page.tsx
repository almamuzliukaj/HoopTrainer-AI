"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Protected } from "@/components/Protected";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const SNIPPETS = [
  { quote: "The more you sweat in practice, the less you bleed in battle.", tip: "Cue: keep ribcage stacked over hips during sprints for better force transfer." },
  { quote: "Repetition is the mother of learning, the father of action.", tip: "Finish every drill with 3 perfect reps to lock in mechanics." },
  { quote: "Confidence comes from discipline and training.", tip: "Soft landings: knees track over toes, hips back, chest tall on every jump." },
  { quote: "Success is where preparation and opportunity meet.", tip: "Film 1–2 reps per set; fix one small thing each time." },
  { quote: "Don’t count the days; make the days count.", tip: "Set a 10‑minute clock: tight handles + decisive first step, no wasted dribbles." },
];

export default function Dashboard() {
  const router = useRouter();
  const [snippetIndex, setSnippetIndex] = useState(0);

  const [sleep, setSleep] = useState(7);
  const [soreness, setSoreness] = useState(3);
  const [energy, setEnergy] = useState(7);
  const [note, setNote] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    const pickNew = () => {
      setSnippetIndex((prev) => {
        let next = prev;
        while (next === prev) next = Math.floor(Math.random() * SNIPPETS.length);
        return next;
      });
    };
    const id = setInterval(pickNew, 25000);
    return () => clearInterval(id);
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const handleSave = () => {
    // TODO: wire to Supabase later
    setSavedMsg("Check-in saved locally. (Hook this up to Supabase to persist.)");
    setTimeout(() => setSavedMsg(""), 2600);
  };

  const focus = {
    session: "Strength",
    cue: "Focus: hip hinge depth — 3×8 RDL with 2–3 sec eccentric",
    extras: ["Accessory: single-leg balance + calf iso holds", "Finish: 8 min hips/ankles mobility"],
  };

  const current = SNIPPETS[snippetIndex];

  return (
    <Protected>
      <div className="bg-ball-left">
        <main style={{ width: "min(1120px, 96vw)", display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Top bar */}
          <nav style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "14px 0 6px" }}>
            <button onClick={logout} style={{ width: 120 }}>Logout</button>
          </nav>

          <header style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <div>
              <p className="helper" style={{ margin: 0 }}>HoopTrainer AI</p>
              <h1 style={{ margin: "4px 0 6px", fontSize: 26 }}>Dashboard</h1>
              <p className="helper" style={{ margin: 0 }}>You’re signed in. Choose your next action.</p>
            </div>
          </header>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 18,
            }}
          >
            <Link
              href="/plan"
              className="panel"
              style={{
                textDecoration: "none",
                color: "var(--text)",
                background: "linear-gradient(145deg, rgba(77,211,201,0.22), rgba(93,230,170,0.18))",
                border: "1px solid rgba(77,211,201,0.45)",
                boxShadow: "0 14px 34px rgba(77,211,201,0.25)",
              }}
            >
              <strong style={{ fontSize: 17, display: "block", marginBottom: 8 }}>AI Plan Generator</strong>
              <span className="helper">Create a personalized workout in seconds →</span>
            </Link>

            <div className="panel" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <strong style={{ fontSize: 17 }}>Today’s Focus: {focus.session}</strong>
              <p className="helper" style={{ margin: "2px 0 0", color: "var(--text)" }}>{focus.cue}</p>
              <ul style={{ margin: "8px 0 0", paddingLeft: 18, lineHeight: 1.55 }}>
                {focus.extras.map((t, i) => (
                  <li key={i} className="helper" style={{ color: "var(--text)", marginBottom: 6 }}>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <strong style={{ fontSize: 17 }}>Quote & micro-tip</strong>
              <p style={{ margin: "6px 0 0", fontStyle: "italic", color: "var(--text)" }}>
                “{current.quote}”
              </p>
              <p className="helper" style={{ margin: 0, color: "var(--text)" }}>
                {current.tip}
              </p>
            </div>

            {/* New Readiness Check-in */}
            <div className="panel" style={{ display: "grid", gap: 10 }}>
              <strong style={{ fontSize: 17 }}>Daily Readiness Check</strong>
              <label className="helper" style={{ display: "grid", gap: 6 }}>
                Sleep (1–10)
                <input type="range" min={1} max={10} value={sleep} onChange={(e) => setSleep(Number(e.target.value))} />
                <span className="helper">Current: {sleep}/10</span>
              </label>

              <label className="helper" style={{ display: "grid", gap: 6 }}>
                Soreness (1–10)
                <input type="range" min={1} max={10} value={soreness} onChange={(e) => setSoreness(Number(e.target.value))} />
                <span className="helper">Current: {soreness}/10</span>
              </label>

              <label className="helper" style={{ display: "grid", gap: 6 }}>
                Energy (1–10)
                <input type="range" min={1} max={10} value={energy} onChange={(e) => setEnergy(Number(e.target.value))} />
                <span className="helper">Current: {energy}/10</span>
              </label>

              <label className="helper" style={{ display: "grid", gap: 6 }}>
                Note (optional)
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Knees a bit tight; lower body volume ok, but skip max jumps."
                />
              </label>

              <button onClick={handleSave}>Save check-in</button>
              {savedMsg && <span className="helper" style={{ color: "var(--accent)" }}>{savedMsg}</span>}
            </div>
          </div>
        </main>
      </div>
    </Protected>
  );
}