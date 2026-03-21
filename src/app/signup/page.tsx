"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) return setError(error.message || "Signup failed");
    router.replace("/dashboard");
  };

  return (
    <div className="bg-ball-left" style={{ minHeight: "100vh", alignItems: "center" }}>
      <main style={{ width: "min(520px, 94vw)", display: "flex", justifyContent: "center" }}>
        <div className="auth-card" style={{ padding: "30px 30px 32px", width: "100%" }}>
          <h1 style={{ marginBottom: 8, fontSize: 28, letterSpacing: 0.2 }}>Create account</h1>
          <p className="helper" style={{ marginTop: 0 }}>Join HoopTrainer AI to generate your plans.</p>

          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
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
              <label className="helper">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {error && <div className="error-box">Error: {error}</div>}
            <button type="submit" disabled={loading || !email || !password}>
              {loading ? "Creating..." : "Sign up"}
            </button>
          </form>

          <div className="auth-actions" style={{ marginTop: 16 }}>
            <span className="auth-switch">Already have an account?</span>
            <Link href="/login" style={{ color: "var(--accent)" }}>Login</Link>
          </div>
        </div>
      </main>
    </div>
  );
}