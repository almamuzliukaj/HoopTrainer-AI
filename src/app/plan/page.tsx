"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

function formatPlan(raw: string) {
  let s = raw.trim().replace(/\r\n/g, "\n");
  s = s.replace(/^##\s*Plan\s*\n*/i, "");
  s = s.replace(/^(plan:?)(\s*)$/gim, "").trim();
  s = s.replace(/^\s*[•·]\s*/gm, "");
  s = s.replace(/^(day\s*\d+[^\n]*):?/gim, (_, d) => `## ${d}`);
  s = s.replace(/^\s*(warm-?up|main\s*workout|strength|plyo|conditioning|finisher|cool[-\s]?down):?/gim, (_, h) => `### ${h}`);
  s = s.replace(/(## [^\n]+)\n(?!\n)/g, "$1\n\n");
  s = s.replace(/(### [^\n]+)\n(?!\n)/g, "$1\n\n");
  s = s.replace(/\n{3,}/g, "\n\n");
  s = s.replace(
    /^(?!(?:##|###))\s*(\d+x[^\n]*|\d+\s?(?:sets?|reps?)[^\n]*|set\s*\d+[^\n]*|rep\s*\d+[^\n]*|tempo\s*\d+[^\n]*|rest\s*\d+[^\n]*|exercise\s*\d*[^\n]*|drill\s*\d*[^\n]*|interval[^\n]*|shooting[^\n]*|layup[^\n]*|sprint[^\n]*|jump[^\n]*)$/gim,
    "- $1"
  );
  s = s.replace(/([^\n])\n(- )/g, "$1\n\n- ");
  return s.trim();
}

function parseTips(raw: string): string[] {
  if (!raw.trim()) return [];
  let t = raw.trim().replace(/\r\n/g, "\n");
  t = t.replace(/^##\s*Tips?\s*\n*/i, "");
  const lines = t
    .split("\n")
    .map((line) =>
      line
        .trim()
        .replace(/^[•·\-\*]+\s*/, "") // strip any bullet markers
    )
    .filter((line) => line.length);
  const joined = lines.join("\n").replace(/\n{3,}/g, "\n\n");
  return joined
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length);
}

export default function PlanPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");
  const [tips, setTips] = useState<string[]>([]);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPlan("");
    setTips([]);

    if (!prompt.trim()) return setError("Please enter what you want in the plan.");

    setLoading(true);
    try {
      const fullPrompt = `${prompt}

Return TWO sections in Markdown:
## Plan
- Use headings for each day (Day 1, Day 2, etc.) and bullets for exercises/sets/reps.
## Tips
- Give 5-7 short, specific tips tailored to this athlete and request.`;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "API request failed. Please try again.");
        return;
      }

      const text = String(data?.text ?? "").trim();
      const split = text.split(/##\s*Tips?/i);
      const planPart = split[0] || "";
      const tipsPart = split[1] || "";

      setPlan(formatPlan(planPart));
      setTips(parseTips(tipsPart));
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ display: "flex", justifyContent: "center" }}>
      <section
        className="card"
        style={{
          width: "min(900px, 94vw)",
          padding: "26px 24px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <header style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div>
            <p className="helper" style={{ margin: 0 }}>HoopTrainer AI</p>
            <h1 style={{ margin: "4px 0 6px", fontSize: 28 }}>AI Plan Generator</h1>
            <p className="helper" style={{ margin: 0 }}>
              Describe the player, goals, timeframe, and constraints. We’ll craft a tailored plan.
            </p>
          </div>
          <Link
            href="/dashboard"
            style={{
              borderRadius: 12,
              padding: "10px 14px",
              border: "1px solid var(--border)",
              background: "linear-gradient(135deg, var(--accent), #3c7be0)",
              color: "#0f1524",
              textDecoration: "none",
              fontWeight: 700,
              boxShadow: "0 8px 20px rgba(60,123,224,0.25)",
            }}
          >
            ← Back to Dashboard
          </Link>
        </header>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: 10-day plan for a small forward to lose weight and improve speed; minimal equipment."
            disabled={loading}
            style={{ minHeight: 160, background: "var(--card-2)", lineHeight: 1.5 }}
          />
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button type="submit" className="primary" disabled={loading || !prompt.trim()}>
              {loading ? "Generating..." : "Generate Plan"}
            </button>
            {loading && <span className="helper">Hold on, crafting your plan…</span>}
          </div>
        </form>

        {error && (
          <div className="error-box">
            <strong>Error:</strong> {error}
          </div>
        )}

        {plan && (
          <section
            className="card"
            style={{
              background: "var(--card-2)",
              border: `1px solid var(--border)`,
              padding: "18px 18px 20px",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 10 }}>Plan</h2>
            <div
              className="response-box md-body"
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "14px 14px 6px",
                lineHeight: 1.6,
              }}
            >
              <ReactMarkdown
                components={{
                  h2: (props) => <h2 className="md-heading" {...props} />,
                  h3: (props) => <h3 className="md-heading" style={{ fontSize: 18 }} {...props} />,
                  p: (props) => <p className="md-p" {...props} />,
                  li: (props) => <li className="md-li" style={{ marginBottom: 4 }} {...props} />,
                }}
              >
                {plan}
              </ReactMarkdown>
            </div>
          </section>
        )}

        {tips.length > 0 && (
          <section
            className="card"
            style={{
              background: "var(--card-2)",
              border: `1x solid var(--border)`,
              padding: "16px 18px 18px",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Tips for this plan</h3>
            <ul
              style={{
                marginTop: 6,
                listStyleType: "disc",
                paddingLeft: 20,
                lineHeight: 1.55,
              }}
            >
              {tips.map((t, i) => (
                <li key={i} style={{ marginBottom: 6 }}>{t}</li>
              ))}
            </ul>
          </section>
        )}
      </section>
    </main>
  );
}