import Link from "next/link";

export default function Page() {
  return (
    <main style={{ display: "flex", justifyContent: "center" }}>
      <section
        className="card"
        style={{
          width: "min(420px, 90vw)",
          padding: "22px 20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <header>
          <p className="helper" style={{ margin: 0 }}>HoopTrainer AI</p>
          <h1 style={{ margin: "4px 0 6px", fontSize: 26 }}>Welcome</h1>
          <p className="helper" style={{ margin: 0 }}>
            Choose how you’d like to continue.
          </p>
        </header>

        <div style={{ display: "grid", gap: 12 }}>
          <Link
            href="/login"
            style={{
              borderRadius: 12,
              padding: "12px 14px",
              background: "linear-gradient(135deg, var(--accent), #365fd6)",
              color: "#0b1020",
              fontWeight: 700,
              textAlign: "center",
              boxShadow: "0 10px 24px rgba(54,95,214,0.3)",
              display: "inline-block",
            }}
          >
            Go to Login
          </Link>

          <Link
            href="/signup"
            style={{
              borderRadius: 12,
              padding: "12px 14px",
              background: "linear-gradient(135deg, var(--accent-2), #52c7ff)",
              color: "#0b1020",
              fontWeight: 700,
              textAlign: "center",
              boxShadow: "0 10px 24px rgba(82,199,255,0.28)",
              display: "inline-block",
            }}
          >
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}