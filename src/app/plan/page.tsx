"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Protected } from "@/components/Protected";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function PlanPage() {
  const router = useRouter();

  // Structured fields (blank for user input)
  const [position, setPosition] = useState("");
  const [goal, setGoal] = useState("");
  const [days, setDays] = useState("");
  const [level, setLevel] = useState("");
  const [equipment, setEquipment] = useState("");
  const [intensity, setIntensity] = useState("");
  const [age, setAge] = useState("");
  const [notes, setNotes] = useState("");

  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto prompt from fields
  const builtPrompt = useMemo(
    () =>
      [
        days ? `Create a ${days}-day basketball training plan.` : "Create a basketball training plan.",
        position ? `Position: ${position}.` : "",
        level ? `Level: ${level}.` : "",
        goal ? `Goal: ${goal}.` : "",
        equipment ? `Equipment available: ${equipment}.` : "",
        intensity ? `Intensity: ${intensity}.` : "",
        age ? `Age: ${age}.` : "",
        `Include skill (ball-handling, shooting, footwork) AND athletic work (speed, plyos, strength/conditioning).`,
        `Format days as: DAY X (short theme) then bullet items with sets/reps/time and short rest guidance.`,
        notes ? `Extra notes: ${notes}.` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    [days, position, level, goal, equipment, intensity, age, notes]
  );

  const navStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 20,
    display: "flex",
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

  const navLink: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "var(--text)",
    fontWeight: 700,
    textDecoration: "none",
    boxShadow: "0 8px 18px rgba(0,0,0,0.20)",
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
  };

  const promptIsTooShort = (text: string) => text.trim().length < 40;

  const extractDays = (text: string) => {
    const match = text.match(/\b(\d+)\s*-?\s*day/i);
    const n = match ? parseInt(match[1], 10) : 4;
    return Math.max(1, Math.min(14, n));
  };

  const dynamicFallback = (dayCount: number) =>
    Array.from({ length: dayCount }, (_, i) => {
      const d = i + 1;
      return `
<strong>DAY ${d} (Skill + Athletic)</strong><br/>
- Ball-Handling: 3×40s combos, rest 30s<br/>
- Shooting: 60–80 makes (spot + pull-up mix)<br/>
- Footwork: closeouts/stance 3×10<br/>
- Plyo/Speed: bounds or short sprints 4–6 sets<br/>
- Strength: 2–3 lifts (hinge/squat/push/pull), 3–4×6–10<br/>
- Conditioning: 6×30/30 court or bike<br/><br/>`;
    }).join("\n");

  // Nicely format AI text
  const formatResponse = (text: string) => {
    let html = text.trim().replace(/\r\n/g, "\n");
    html = html.replace(/^(\s*DAY\s+\d+[^\n]*)$/gim, "<strong>$1</strong>");
    html = html.replace(/^Additional Tips:?$/gim, "<strong>Additional Tips</strong>");
    html = html.replace(/\n{2,}/g, "<br/><br/>").replace(/\n/g, "<br/>");
    return html;
  };

  const generatePlan = async () => {
    const finalPrompt = builtPrompt.trim();

    if (promptIsTooShort(finalPrompt)) {
      setError("Please add more detail (goal, days/week, position, level, equipment, constraints).");
      setOutput(null);
      return;
    }

    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      if (!res.ok) {
        const { error: apiError } = await res.json().catch(() => ({ error: "Failed to generate plan" }));
        throw new Error(apiError || "Failed to generate plan");
      }

      const data = await res.json();
      const rawText = data.text || data.html || "";
      const html = rawText ? formatResponse(rawText) : "No plan returned from AI.";
      setOutput(html);
    } catch (e: unknown) {
      const fallback = dynamicFallback(extractDays(builtPrompt));
      setOutput(fallback);
      setError(e instanceof Error ? e.message : "Using fallback plan because AI call failed.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <Protected>
      <div className="bg-ball-left" style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}>
        <main style={{ width: "min(1120px, 96vw)", margin: "0 auto", padding: "0 0 72px", display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Nav */}
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

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Link href="/dashboard" style={navLink}>Dashboard</Link>
              <button onClick={logout} style={signOutBtn}>Sign out</button>
            </div>
          </nav>

          {/* Inputs */}
          <section className="panel" style={{ padding: "16px 16px", display: "grid", gap: 12 }}>
            <strong style={{ fontSize: 18 }}>Your request</strong>

            <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              <label className="helper" style={{ display: "grid", gap: 4 }}>
                Position
                <input value={position} onChange={(e) => setPosition(e.target.value)} />
              </label>
              <label className="helper" style={{ display: "grid", gap: 4 }}>
                Days for plan
                <input value={days} onChange={(e) => setDays(e.target.value)} />
              </label>
              <label className="helper" style={{ display: "grid", gap: 4 }}>
                Level
                <input value={level} onChange={(e) => setLevel(e.target.value)} />
              </label>
              <label className="helper" style={{ display: "grid", gap: 4 }}>
                Intensity
                <input value={intensity} onChange={(e) => setIntensity(e.target.value)} />
              </label>
              <label className="helper" style={{ display: "grid", gap: 4 }}>
                Age
                <input value={age} onChange={(e) => setAge(e.target.value)} />
              </label>
            </div>

            <label className="helper" style={{ display: "grid", gap: 4 }}>
              Main goal
              <input value={goal} onChange={(e) => setGoal(e.target.value)} />
            </label>

            <label className="helper" style={{ display: "grid", gap: 4 }}>
              Equipment available
              <input value={equipment} onChange={(e) => setEquipment(e.target.value)} />
            </label>

            <label className="helper" style={{ display: "grid", gap: 4 }}>
              Extra notes (constraints, injuries, preferences)
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}
              />
            </label>

            {promptIsTooShort(builtPrompt) && (
              <span className="helper" style={{ color: "var(--accent)" }}>
                Please add more detail (goal, days/week, focus, equipment, notes) for best results.
              </span>
            )}

            <button
              onClick={generatePlan}
              disabled={loading}
              style={{
                width: 180,
                padding: "12px 14px",
                borderRadius: 10,
                border: "none",
                background: loading ? "#94a3b8" : "#3b82f6",
                color: "#fff",
                fontWeight: 800,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Generating..." : "Generate Plan"}
            </button>

            {error && (
              <span className="helper" style={{ color: "var(--accent)" }}>
                {error}
              </span>
            )}
          </section>

          {/* Response */}
          <section className="panel" style={{ padding: "16px 16px", display: "grid", gap: 10 }}>
            <strong style={{ fontSize: 18 }}>AI Response</strong>
            {output ? (
              <div
                style={{
                  margin: 0,
                  lineHeight: 1.55,
                  fontSize: 15,
                  whiteSpace: "normal",
                }}
                dangerouslySetInnerHTML={{ __html: output }}
              />
            ) : (
              <p className="helper" style={{ margin: 0 }}>
                Your plan will appear here after you generate it.
              </p>
            )}
          </section>
        </main>
      </div>
    </Protected>
  );
}