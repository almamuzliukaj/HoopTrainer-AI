"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message || "Login failed");
    router.replace("/dashboard");
  };

  return (
    <div className="bg-ball-left" style={{ minHeight: "100vh", alignItems: "center" }}>
      <main className="responsive-main" style={{ width: "min(520px, 94vw)", display: "flex", justifyContent: "center" }}>
        <div className="auth-card" style={{ padding: "32px 32px 34px", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Link href="/" className="helper" style={{ fontWeight: 700, padding: "6px 10px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>← Home</Link>
          </div>

          <h1 style={{ marginBottom: 10, fontSize: 30, letterSpacing: 0.3 }}>Login</h1>
          <p className="helper" style={{ marginTop: 0 }}>Welcome back. Please sign in to continue.</p>

          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
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
            </div>
            {error && <div className="error-box">Error: {error}</div>}
            <button
              type="submit"
              disabled={loading || !email || !password || password.length < 6}
              style={{ padding: "12px 16px", borderRadius: 12, background: "linear-gradient(135deg, var(--accent), #3c7be0)", color: "#0f1524", fontWeight: 800, border: "none", boxShadow: "0 12px 26px rgba(60,123,224,0.30)" }}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="auth-actions" style={{ marginTop: 18 }}>
            <span className="auth-switch">Don’t have an account?</span>
            <Link href="/signup" style={{ color: "var(--accent)", fontWeight: 700 }}>Sign up</Link>
          </div>
        </div>
      </main>
    </div>
  );
}