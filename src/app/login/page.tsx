"use client";

import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main style={{ display: "flex", justifyContent: "center" }}>
      <section className="card" style={{ width: "min(420px, 90vw)", padding: "22px 20px 26px", display: "flex", flexDirection: "column", gap: 16 }}>
        <header>
          <p className="helper" style={{ margin: 0 }}>HoopTrainer AI</p>
          <h1 style={{ margin: "4px 0 6px", fontSize: 26 }}>Login</h1>
          <p className="helper" style={{ margin: 0 }}>Sign in to your account.</p>
        </header>

        <AuthForm mode="login" />

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <Link href="/signup" className="helper">Don’t have an account? Sign up</Link>
        </div>
      </section>
    </main>
  );
}