"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

const TIPS = [
  "Warm up 8–12 minutes (mobility + glute/core activation) before each session.",
  "Leave 48–72 hours between heavy jump/sprint days.",
  "If fatigue is high, cut volume (sets/reps) but keep speed/quality high.",
  "Film a few reps to check form on jumps and sprint starts.",
  "Hydrate and finish with 5–8 minutes cool-down after every session.",
];

function formatPlan(raw: string) {
  let s = raw.trim().replace(/\r\n/g, "\n");

  // Ensure day headings are Markdown headings
  s = s.replace(/(DAY\s*\d[^\n]*)/gi, "## $1");

  // Keep intentional blank lines as single blank lines (no massive gaps)
  s = s.replace(/\n{3,}/g, "\n\n");

  // Turn plain lines into bullet points (skip headings and “Additional Tips”)
  s = s.replace(
    /^(?!\s*$)(?!## )(?!Additional Tips)(?!- )(?!\d\.)(.+)$/gm,
    "- $1"
  );

  return s;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult("");
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "API request failed. Please try again.");
        return;
      }

      const formatted = formatPlan(String(data?.text ?? ""));
      setResult(formatted);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <header style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 30, margin: 0 }}>HoopTrainer AI</h1>
        <p className="helper" style={{ marginTop: 6 }}>
          Enter a request and generate a basketball-specific training plan.
        </p>
      </header>

      <form onSubmit={onSubmit} className="card" style={{ marginBottom: 12 }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
          Your request
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: 3 day plan for a guard, goal explosiveness and speed, intermediate, age 20"
          disabled={loading}
        />
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
          <button type="submit" className="primary" disabled={loading}>
            {loading ? "Generating..." : "Generate Plan"}
          </button>
          {loading && <span className="helper">Loading… please wait</span>}
        </div>
      </form>

      {error && (
        <div className="error-box">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <>
          <section className="card" style={{ marginTop: 12 }}>
            <h2 style={{ marginTop: 0, marginBottom: 6 }}>AI Response</h2>
            <div className="response-box md-body">
              <ReactMarkdown
                components={{
                  h2: (props) => <h2 className="md-heading" {...props} />,
                  p: (props) => <p className="md-p" {...props} />,
                  li: (props) => <li className="md-li" {...props} />,
                }}
              >
                {result}
              </ReactMarkdown>
            </div>
          </section>

          <section className="card" style={{ marginTop: 12 }}>
            <h3 style={{ marginTop: 0, marginBottom: 6 }}>Additional Tips</h3>
            <ul className="tips-list">
              {TIPS.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}