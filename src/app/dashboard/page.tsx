"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Protected } from "@/components/Protected";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import AddWorkoutForm from "@/components/AddWorkoutForm";
import WorkoutList from "@/components/WorkoutList";
import BrandMark from "@/components/BrandMark";
import SiteFooter from "@/components/SiteFooter";

// === HELPER: Get user name/email from Supabase ===
function useAuthUser() {
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      const user = res.data?.user;
      const name = user?.user_metadata?.name || "";
      setUser({ email: user?.email, name });
    });
  }, []);
  return user;
}

// === Account Dropdown Menu ===
function AccountMenu({ onSignOut }: { onSignOut: () => void }) {
  const user = useAuthUser();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const name = user?.name?.trim() || "";
  const email = user?.email?.trim() || "";
  const initial = name
    ? name[0].toUpperCase()
    : (email ? email[0].toUpperCase() : "U");

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 570);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", zIndex: 110 }}>
      <button
        aria-label="Account"
        onClick={() => setOpen(v => !v)}
        style={{
          width: isMobile ? 36 : 48,
          height: isMobile ? 36 : 48,
          borderRadius: "50%",
          border: "2px solid var(--accent-2)",
          background: "linear-gradient(135deg, var(--accent-2), #3c7be0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          outline: "none",
          boxShadow: open ? "0 2px 24px rgba(77,211,201,0.18)" : "none",
          fontWeight: 900,
          color: "#0f1524",
          fontSize: isMobile ? 16 : 23,
          letterSpacing: 0.2,
          margin: 0,
          transition: "box-shadow 0.18s, width 0.18s, height 0.18s, font-size 0.18s"
        }}
      >
        {initial}
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: isMobile ? 40 : 54,
            background: "var(--card-2)",
            border: "2px solid var(--accent-2)",
            borderRadius: 16,
            boxShadow: "0 16px 64px rgba(60,123,224,0.15)",
            display: "flex",
            flexDirection: "column",
            minWidth: isMobile ? 200 : 270,
            zIndex: 101,
            gap: 2,
            overflow: "hidden",
            animation: "fadeInScale .16s",
          }}
        >
          <div style={{
            padding: isMobile ? "12px 16px 12px" : "20px 28px 18px",
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 12 : 18,
            borderBottom: "1.5px solid var(--border)",
            background: "rgba(79,201,189,0.07)"
          }}>
            <div
              style={{
                width: isMobile ? 32 : 46,
                height: isMobile ? 32 : 46,
                borderRadius: "50%",
                background: "linear-gradient(135deg,var(--accent-2),#3c7be0)",
                color: "#0f1524",
                fontWeight: 900,
                fontSize: isMobile ? 15 : 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              {initial}
            </div>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              minWidth: 0 
            }}>
              <span style={{
                fontWeight: 700,
                fontSize: isMobile ? 14.2 : 18,
                color: "var(--text)",
                lineHeight: 1.16,
                maxWidth: isMobile ? 90 : 170,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {name || "User"}
              </span>
              <span style={{
                fontSize: isMobile ? 11.7 : 15.5,
                color: "var(--muted)",
                lineHeight: 1.15,
                maxWidth: isMobile ? 90 : 170,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginTop: 2,
              }}>
                {email || "…"}
              </span>
            </div>
          </div>
          <Link
            href="/account"
            style={{
              color: "var(--accent-2)",
              fontWeight: 700,
              fontSize: isMobile ? 13.6 : 17,
              padding: isMobile ? "11px 16px" : "16px 28px",
              textDecoration: "none",
              background: "none",
              border: "none",
              textAlign: "left",
              transition: "background 0.08s",
              display: "flex",
              alignItems: "center",
              gap: 11,
              letterSpacing: 0.15,
            }}
            onClick={() => setOpen(false)}
          >
            <svg width={20} height={20} style={{ minWidth: 20 }} fill="none" viewBox="0 0 20 20">
              <circle cx="10" cy="7" r="4" stroke="var(--accent-2)" strokeWidth={1.6} />
              <path d="M18 17c0-3-3-5-8-5s-8 2-8 5" stroke="var(--accent-2)" strokeWidth={1.6} strokeLinecap="round" />
            </svg>
            Account Settings
          </Link>
          <button
            onClick={() => { setOpen(false); onSignOut(); }}
            style={{
              textAlign: "left",
              background: "none",
              border: "none",
              fontWeight: 800,
              fontSize: isMobile ? 13 : 17,
              padding: isMobile ? "11px 16px" : "16px 28px",
              color: "var(--error)",
              cursor: "pointer",
              transition: "background 0.13s",
              display: "flex",
              alignItems: "center",
              gap: 11,
              borderTop: "1.2px solid var(--border)",
            }}
          >
            <svg width={20} height={20} fill="none" viewBox="0 0 20 20" style={{ minWidth: 20 }}>
              <path d="M10.833 13.333 14.167 10m0 0-3.334-3.333M14.167 10H3.333m10 8.333a1.667 1.667 0 0 0 1.667-1.666V3.333A1.667 1.667 0 0 0 13.333 1.667H6.667A1.667 1.667 0 0 0 5 3.333v2.5" stroke="var(--error)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sign out
          </button>
        </div>
      )}
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(.92);}
          to { opacity: 1; transform: scale(1);}
        }
      `}</style>
    </div>
  );
}

// === Navbar ===
function Navbar({ onSignOut }: { onSignOut: () => void }) {
  return (
    <nav className="glass-topbar dashboard-topbar" style={{
      position: "sticky",
      top: 0,
      zIndex: 20,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 14px",
      minHeight: 56,
      marginBottom: 10,
    }}>
      <BrandMark size="sm" />
      <AccountMenu onSignOut={onSignOut} />
    </nav>
  );
}

// === Footer ===
function Footer() {
  return <SiteFooter compact />;
}

// === Dashboard Content ===
const SNIPPETS = [
  { quote: "The more you sweat in practice, the less you bleed in battle.", tip: "Keep ribcage stacked over hips during sprints." },
  { quote: "Repetition is the mother of learning, the father of action.", tip: "End every drill with 3 perfect reps to lock mechanics." },
  { quote: "Confidence comes from discipline and training.", tip: "Land soft: knees over toes, hips back, chest tall." },
  { quote: "Success is where preparation and opportunity meet.", tip: "Film 1-2 reps per set; fix one small thing each time." },
];

export default function Dashboard() {
  const router = useRouter();
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [listRefresh, setListRefresh] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setSnippetIndex((p) => (p + 1) % SNIPPETS.length), 20000);
    return () => clearInterval(id);
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <Protected>
      <div className="app-shell" style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "none"
      }}>
        <Navbar onSignOut={logout} />

        <div className="page-frame bg-ball-left" style={{ flex: "1 0 auto", display: "flex", flexDirection: "column", padding: "0 9px" }}>
          <main
            className="responsive-main dashboard-main"
            style={{
              width: "min(1120px, 96vw)",
              margin: "0 auto",
              padding: "0 0 20px", // NDDRYSHIMI 1: Zvogëluam padding-un poshtë
              display: "flex",
              flexDirection: "column",
              gap: 18,
              flex: "1 0 auto",
            }}
          >
            <header className="dashboard-hero" style={{ display: "grid", gap: 5, marginTop: 12, marginBottom: 2 }}>
              <p className="helper" style={{ margin: 0 }}>Welcome back</p>
              <h1 style={{ margin: 0, fontSize: "clamp(1.9rem, 4vw, 2.5rem)", lineHeight: 1.05 }}>Your training dashboard</h1>
              <p className="helper" style={{ margin: 0, maxWidth: 620 }}>Quick access to today&apos;s focus, recent momentum, and your personal workout library.</p>
            </header>

            <section className="dashboard-grid">
              <div className="panel dashboard-panel" style={{ display: "grid", gap: 9, padding: "11px 11px" }}>
                <strong style={{ fontSize: 16 }}>Today&apos;s session</strong>
                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.55 }}>
                  <li className="helper">Warm-up: hips/ankles + bands (8 min)</li>
                  <li className="helper">Strength: 3x8 RDL @ tempo 3-1-1</li>
                  <li className="helper">Skill: ball-handling ladder + pull-up series</li>
                  <li className="helper">Conditioning: shuttle runs 6x20s / 40s rest</li>
                  <li className="helper">Cool-down: hip flexor + calf stretch (6 min)</li>
                </ul>
              </div>

              <Link
                href="/plan"
                className="panel dashboard-panel dashboard-panel-accent"
                style={{
                  display: "grid",
                  gap: 8,
                  padding: "11px 11px",
                  background: "linear-gradient(145deg, rgba(77,211,201,0.22), rgba(93,230,170,0.18))",
                  border: "1px solid rgba(77,211,201,0.45)",
                  boxShadow: "0 14px 34px rgba(77,211,201,0.25)",
                  textDecoration: "none",
                  color: "var(--text)",
                }}
              >
                <strong style={{ fontSize: 16 }}>AI Generator</strong>
                <p className="helper" style={{ margin: 0 }}>
                  Need a different flow? Jump into the generator and tune focus, time, and equipment.
                </p>
                <span style={{ color: "var(--accent)", fontWeight: 700 }}>Open AI Generator -&gt;</span>
              </Link>

              <div className="panel dashboard-panel" style={{ display: "grid", gap: 9, padding: "11px 11px" }}>
                <strong style={{ fontSize: 16 }}>Quote & micro-tip</strong>
                <p style={{ margin: "6px 0 0", fontStyle: "italic", color: "var(--text)" }}>
                  &quot;{SNIPPETS[snippetIndex].quote}&quot;
                </p>
                <p className="helper" style={{ margin: 0, color: "var(--text)" }}>
                  {SNIPPETS[snippetIndex].tip}
                </p>
              </div>

              <div className="panel dashboard-panel" style={{ display: "grid", gap: 9, padding: "11px 11px" }}>
                <strong style={{ fontSize: 16 }}>Recent sessions</strong>
                <div style={{ display: "grid", gap: 8 }}>
                  <div className="dashboard-row" style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700 }}>Handles + shooting</span>
                    <span className="helper">Yesterday - 42 min</span>
                  </div>
                  <div className="dashboard-row" style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700 }}>Lower-body strength</span>
                    <span className="helper">2 days ago - 50 min</span>
                  </div>
                  <div className="dashboard-row" style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700 }}>Tempo conditioning</span>
                    <span className="helper">4 days ago - 28 min</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ========== CRUD AREA: Your Workouts ========== */}
            {/* NDRYSHIMI 2: Rregullimi i panelit CRUD për të qenë responsive */}
            <section style={{ width: "100%", overflow: "hidden" }}>
              <div className="panel dashboard-library" style={{ 
                display: "grid", 
                gap: 8, 
                padding: "16px 16px 0px 16px", 
                marginTop: 17,
                overflow: "hidden" 
              }}>
                <strong style={{ fontSize: 18, borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
                   My Workouts
                </strong>
                <div style={{ marginTop: "10px" }}>
                   <AddWorkoutForm onAdded={() => setListRefresh(r => !r)} />
                </div>
                <div style={{ width: "100%" }}>
                   <WorkoutList key={listRefresh ? "A" : "B"} />
                </div>
              </div>
            </section>
          </main>
        </div>
        <Footer />
      </div>
    </Protected>
  );
}
