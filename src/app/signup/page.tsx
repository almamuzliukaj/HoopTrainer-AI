"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isPasswordShort = password.length > 0 && password.length < 6;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (isPasswordShort) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }, // store in user_metadata
    });

    setLoading(false);
    if (error) return setError(error.message || "Signup failed");
    router.replace("/dashboard");
  };

  return (
    <div
      className="bg-ball-left"
      style={{
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        padding: "0 16px",
      }}
    >
      <main
        className="responsive-main"
        style={{
          width: "min(520px, 100%)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          className="auth-card"
          style={{
            padding: "32px 32px 34px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Link
              href="/"
              className="helper"
              style={{
                fontWeight: 700,
                padding: "6px 10px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >← Home</Link>
          </div>

          <h1 style={{ marginBottom: 10, fontSize: 30, letterSpacing: 0.3 }}>Create account</h1>
          <p className="helper" style={{ marginTop: 0 }}>Join HoopTrainer AI to generate your plans.</p>

          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
            <div>
              <label className="helper">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="helper">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="helper">Password (min 6 chars)</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              {isPasswordShort && (
                <span className="helper" style={{ color: "var(--accent)" }}>
                  Password must be at least 6 characters.
                </span>
              )}
            </div>
            {error && <div className="error-box">Error: {error}</div>}
            <button
              type="submit"
              disabled={loading || !email || !password || !name || isPasswordShort}
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                background: "linear-gradient(135deg, var(--accent-2), #4fc9bd)",
                color: "#0f1524",
                fontWeight: 800,
                border: "1px solid rgba(79,201,189,0.55)",
                boxShadow: "0 12px 26px rgba(79,201,189,0.30)",
              }}
            >
              {loading ? "Creating..." : "Sign up"}
            </button>
          </form>

          <div style={{
            marginTop: 18,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}>
            <span className="auth-switch" style={{
              color: "var(--muted)",
              fontSize: 15,
              fontWeight: 500
            }}>Already have an account?</span>
            <Link
              href="/login"
              style={{
                padding: "11px 24px",
                borderRadius: 10,
                fontWeight: 700,
                background: "linear-gradient(135deg, var(--accent), #3c7be0)",
                color: "#0f1524",
                boxShadow: "0 6px 18px rgba(60,123,224,0.22)",
                border: "none",
                textDecoration: "none",
                fontSize: 15,
                transition: "background 0.2s, box-shadow 0.2s"
              }}
            >
              Login
            </Link>
          </div>
        </div>
      </main>
      <style>{`
        @media (max-width: 600px) {
          .auth-card {
            padding-left: 13px !important;
            padding-right: 13px !important;
          }
          .responsive-main {
            padding-left: 0 !important;
            padding-right: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}