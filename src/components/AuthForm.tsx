"use client";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return setError("Invalid email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Auth failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card">
      {mode === "signup" && (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          disabled={loading}
        />
      )}
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        disabled={loading}
        required
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        disabled={loading}
        required
        minLength={6}
      />
      <button type="submit" disabled={loading}>
        {loading ? "..." : mode === "signup" ? "Sign Up" : "Login"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}