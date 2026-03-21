"use client";

import { Protected } from "@/components/Protected";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <Protected>
      <main style={{ display: "flex", justifyContent: "center", padding: "72px 0 96px" }}>
        <section className="card" style={{ width: "min(520px, 90vw)", padding: "22px 20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 24 }}>Dashboard</h1>
          <p className="helper" style={{ marginTop: 4 }}>Je i loguar.</p>
          <button onClick={logout} style={{ width: "180px", marginTop: 8 }}>
            Logout
          </button>
        </section>
      </main>
    </Protected>
  );
}