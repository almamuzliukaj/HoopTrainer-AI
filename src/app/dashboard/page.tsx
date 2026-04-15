"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Protected } from "@/components/Protected";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import AddWorkoutForm from "@/components/AddWorkoutForm";
import WorkoutListPro from "@/components/WorkoutListPro";
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

const DAILY_CHALLENGES = [
  {
    title: "Handle heat check",
    focus: "Ball control",
    drills: ["3 min pound dribbles", "20 cross-cross attacks", "10 weak-hand finishes"],
  },
  {
    title: "Shooter's rhythm",
    focus: "Shot prep",
    drills: ["25 form shots", "15 one-dribble pull-ups", "10 free throws under pressure"],
  },
  {
    title: "First-step spark",
    focus: "Explosiveness",
    drills: ["8 sprint starts", "3x6 lateral bounds", "12 hard rip-through drives"],
  },
  {
    title: "Game legs",
    focus: "Conditioning",
    drills: ["6 shuttle runs", "20 defensive slides", "5 min cooldown mobility"],
  },
  {
    title: "Finishing package",
    focus: "Touch",
    drills: ["10 inside-hand finishes", "10 reverse finishes", "10 floaters each side"],
  },
];

type SavedTrainingPlan = {
  id: string;
  title: string;
  content: string;
  status?: string;
  created_at?: string;
};

function getPlanPreview(content: string) {
  return content
    .replace(/[#*_`>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 130);
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getDailyChallenge() {
  const dayNumber = Math.floor(Date.now() / 86400000);
  return DAILY_CHALLENGES[dayNumber % DAILY_CHALLENGES.length];
}

function countCurrentStreak(completedDates: string[], todayKey: string) {
  const completed = new Set(completedDates);
  let streak = 0;
  const cursor = new Date(`${todayKey}T12:00:00`);

  while (completed.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function getCurrentWeekDays(todayKey: string) {
  const today = todayKey ? new Date(`${todayKey}T12:00:00`) : new Date();
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return {
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 3),
      day: date.getDate(),
    };
  });
}

export default function Dashboard() {
  const router = useRouter();
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [listRefresh, setListRefresh] = useState(false);
  const [savedPlans, setSavedPlans] = useState<SavedTrainingPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SavedTrainingPlan | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);
  const [dailyChallenge, setDailyChallenge] = useState(DAILY_CHALLENGES[0]);
  const [todayKey, setTodayKey] = useState("");
  const [completedChallengeDates, setCompletedChallengeDates] = useState<string[]>([]);
  const [challengeSaving, setChallengeSaving] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setSnippetIndex((p) => (p + 1) % SNIPPETS.length), 20000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      setTodayKey(getTodayKey());
      setDailyChallenge(getDailyChallenge());
    });

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (cancelled) return;
      const savedDates = user?.user_metadata?.dailyChallenge?.completedDates;
      setCompletedChallengeDates(Array.isArray(savedDates) ? savedDates.filter(Boolean) : []);
    });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    (async () => {
      setPlansLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSavedPlans([]);
        setPlansLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("training_plans")
        .select("id,title,content,status,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4);

      setSavedPlans(error ? [] : data || []);
      setPlansLoading(false);
    })();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const deleteSavedPlan = async (planId: string) => {
    setDeletingPlanId(planId);
    const { error } = await supabase.from("training_plans").delete().eq("id", planId);
    setDeletingPlanId(null);

    if (error) return;

    setSavedPlans((plans) => plans.filter((plan) => plan.id !== planId));
    setSelectedPlan((plan) => (plan?.id === planId ? null : plan));
  };

  const challengeCompletedToday = todayKey ? completedChallengeDates.includes(todayKey) : false;
  const currentStreak = todayKey ? countCurrentStreak(completedChallengeDates, todayKey) : 0;
  const weekDays = getCurrentWeekDays(todayKey);
  const completedThisWeek = weekDays.filter((day) => completedChallengeDates.includes(day.key)).length;
  const weeklyProgress = Math.round((completedThisWeek / weekDays.length) * 100);

  const completeDailyChallenge = async () => {
    if (!todayKey || challengeCompletedToday || challengeSaving) return;

    setChallengeSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setChallengeSaving(false);
      return;
    }

    const nextDates = Array.from(new Set([todayKey, ...completedChallengeDates])).sort();
    const { error } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        dailyChallenge: {
          completedDates: nextDates,
          lastCompletedAt: new Date().toISOString(),
        },
      },
    });

    if (!error) setCompletedChallengeDates(nextDates);
    setChallengeSaving(false);
  };

  return (
    <Protected>
      {selectedPlan && (
        <>
          <div
            onClick={() => setSelectedPlan(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2000,
              background: "rgba(8,13,22,0.72)",
              backdropFilter: "blur(8px)",
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedPlan.title}
            style={{
              position: "fixed",
              inset: "50% auto auto 50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2001,
              width: "min(720px, calc(100vw - 28px))",
              maxHeight: "min(760px, calc(100dvh - 36px))",
              overflow: "hidden",
              borderRadius: 26,
              border: "1px solid rgba(77,211,201,0.28)",
              background: "linear-gradient(145deg, rgba(31,39,64,0.98), rgba(18,25,42,0.98))",
              boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "20px 22px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                justifyContent: "space-between",
                gap: 18,
                alignItems: "flex-start",
              }}
            >
              <div>
                <div style={{ color: "var(--accent-2)", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em" }}>
                  SAVED TRAINING PLAN
                </div>
                <h2 style={{ marginTop: 6, fontSize: "clamp(1.25rem, 4vw, 1.8rem)" }}>{selectedPlan.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                aria-label="Close saved plan"
                style={{
                  width: 38,
                  height: 38,
                  flex: "0 0 38px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.06)",
                  color: "var(--text)",
                  boxShadow: "none",
                }}
              >
                x
              </button>
            </div>
            <pre
              style={{
                margin: 0,
                padding: "22px",
                overflow: "auto",
                whiteSpace: "pre-wrap",
                lineHeight: 1.65,
                fontFamily: "inherit",
                color: "var(--text)",
              }}
            >
              {selectedPlan.content}
            </pre>
          </div>
        </>
      )}
      <div className="app-shell" style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "none"
      }}>
        <Navbar onSignOut={logout} />

        <div className="page-frame bg-ball-left basketball-atmosphere" style={{ flex: "1 0 auto", display: "flex", flexDirection: "column", padding: "0 9px" }}>
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
            <header className="dashboard-hero" style={{ display: "grid", gap: 5, marginTop: 0, marginBottom: 2 }}>
              <p className="helper" style={{ margin: 0 }}>Welcome back</p>
              <h1 style={{ margin: 0, fontSize: "clamp(1.9rem, 4vw, 2.5rem)", lineHeight: 1.05 }}>Your training dashboard</h1>
              <p className="helper" style={{ margin: 0, maxWidth: 620 }}>Quick access to today&apos;s focus, recent momentum, and your personal workout library.</p>
            </header>

            <section className="dashboard-grid">
              <div className="panel dashboard-panel daily-challenge-panel" style={{ display: "grid", gap: 14, padding: "18px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start" }}>
                  <div>
                    <div style={{ color: "var(--accent-2)", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em" }}>
                      DAILY COURT CHALLENGE
                    </div>
                    <h2 style={{ marginTop: 6, fontSize: "clamp(1.45rem, 4vw, 2.15rem)", lineHeight: 1 }}>
                      {dailyChallenge.title}
                    </h2>
                    <p className="helper" style={{ margin: "8px 0 0" }}>{dailyChallenge.focus}</p>
                  </div>
                  <div className="streak-badge" style={{
                    minWidth: 92,
                    padding: "10px 12px",
                    borderRadius: 18,
                    background: "rgba(8,13,22,0.36)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    textAlign: "center",
                  }}>
                    <div style={{ fontSize: 28, fontWeight: 950, color: "var(--accent-2)", lineHeight: 1 }}>
                      {currentStreak}
                    </div>
                    <div className="helper" style={{ fontSize: 11.5, fontWeight: 800, textTransform: "uppercase" }}>
                      day streak
                    </div>
                  </div>
                </div>
                <div className="challenge-drill-list" style={{ display: "grid", gap: 8 }}>
                  {dailyChallenge.drills.map((drill, index) => (
                    <div key={drill} style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      padding: "9px 10px",
                      borderRadius: 14,
                      background: "rgba(255,255,255,0.045)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}>
                      <span style={{
                        width: 24,
                        height: 24,
                        borderRadius: 10,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(77,211,201,0.16)",
                        color: "var(--accent-2)",
                        fontWeight: 900,
                        flex: "0 0 auto",
                      }}>
                        {index + 1}
                      </span>
                      <span style={{ fontWeight: 750 }}>{drill}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={completeDailyChallenge}
                  disabled={challengeSaving || challengeCompletedToday}
                  style={{
                    marginTop: 2,
                    padding: "12px 14px",
                    borderRadius: 16,
                    background: challengeCompletedToday
                      ? "rgba(77,211,201,0.12)"
                      : "linear-gradient(135deg, var(--accent-2), #5aa0ff)",
                    color: challengeCompletedToday ? "var(--accent-2)" : "#0f1524",
                    border: challengeCompletedToday ? "1px solid rgba(77,211,201,0.28)" : "none",
                    boxShadow: challengeCompletedToday ? "none" : "0 14px 28px rgba(77,211,201,0.2)",
                    fontWeight: 950,
                  }}
                >
                  {challengeCompletedToday ? "Completed today" : challengeSaving ? "Saving..." : "Mark challenge complete"}
                </button>
              </div>

              <div className="panel dashboard-panel progress-tracker-card" style={{ display: "grid", gap: 14, padding: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start" }}>
                  <div>
                    <div className="section-kicker">PROGRESS TRACKER</div>
                    <strong style={{ display: "block", fontSize: 20, marginTop: 5 }}>Weekly consistency</strong>
                    <p className="helper" style={{ margin: "6px 0 0", lineHeight: 1.5 }}>
                      Complete daily challenges to build visible training momentum.
                    </p>
                  </div>
                  <div className="progress-score">
                    <span>{weeklyProgress}%</span>
                    <small>week</small>
                  </div>
                </div>

                <div className="weekly-progress-ring" style={{ ["--progress" as string]: `${weeklyProgress}%` }}>
                  <div>
                    <strong>{completedThisWeek}/7</strong>
                    <span>days complete</span>
                  </div>
                </div>

                <div className="week-day-strip">
                  {weekDays.map((day) => {
                    const isDone = completedChallengeDates.includes(day.key);
                    const isToday = day.key === todayKey;

                    return (
                      <div key={day.key} className={`week-day-chip${isDone ? " is-done" : ""}${isToday ? " is-today" : ""}`}>
                        <span>{day.label}</span>
                        <strong>{day.day}</strong>
                      </div>
                    );
                  })}
                </div>

                <p className="helper" style={{ margin: 0, lineHeight: 1.5 }}>
                  {currentStreak > 0
                    ? `${currentStreak} day streak active. Keep the chain alive.`
                    : "Complete today's challenge to start your first streak."}
                </p>
              </div>

              <div className="panel dashboard-panel readiness-card" style={{ display: "grid", gap: 13, padding: "16px" }}>
                <div>
                  <div className="section-kicker">READINESS CHECK</div>
                  <strong style={{ display: "block", fontSize: 18, marginTop: 5 }}>Train smart today</strong>
                </div>
                <div className="readiness-meter" aria-label="Readiness score">
                  <span />
                </div>
                <div className="readiness-grid">
                  <div>
                    <strong>Energy</strong>
                    <span className="helper">Medium-high</span>
                  </div>
                  <div>
                    <strong>Load</strong>
                    <span className="helper">Controlled</span>
                  </div>
                </div>
                <p className="helper" style={{ margin: 0, lineHeight: 1.55 }}>
                  Keep the session sharp: high intent, clean reps, and stop one set before form breaks.
                </p>
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

              <div className="panel dashboard-panel quote-card" style={{ display: "grid", gap: 12, padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start" }}>
                  <div>
                    <div className="section-kicker">COACH SIGNAL</div>
                    <strong style={{ display: "block", fontSize: 18, marginTop: 5 }}>Mindset + detail</strong>
                  </div>
                  <span className="quote-mark">&quot;</span>
                </div>
                <p style={{ margin: 0, fontSize: "clamp(1rem, 3vw, 1.18rem)", lineHeight: 1.5, fontWeight: 850, color: "var(--text)" }}>
                  {SNIPPETS[snippetIndex].quote}
                </p>
                <div className="micro-tip-box">
                  <span>Micro-tip</span>
                  <p>{SNIPPETS[snippetIndex].tip}</p>
                </div>
              </div>

              <div className="panel dashboard-panel focus-stack-card" style={{ display: "grid", gap: 12, padding: "16px" }}>
                <div>
                  <div className="section-kicker">FOCUS STACK</div>
                  <strong style={{ display: "block", fontSize: 18, marginTop: 5 }}>Next 3 priorities</strong>
                </div>
                <div className="focus-stack-list">
                  <div>
                    <span>01</span>
                    <strong>Start fast</strong>
                    <p>Win the first 10 minutes with warm-up discipline.</p>
                  </div>
                  <div>
                    <span>02</span>
                    <strong>Track one cue</strong>
                    <p>Pick one skill detail and judge every rep against it.</p>
                  </div>
                  <div>
                    <span>03</span>
                    <strong>Close clean</strong>
                    <p>End with makes, mobility, and a note for tomorrow.</p>
                  </div>
                </div>
              </div>

              <div className="panel dashboard-panel saved-plans-panel" style={{ display: "grid", gap: 12, padding: "16px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                  <div>
                    <strong style={{ fontSize: 17 }}>Saved training plans</strong>
                    <p className="helper" style={{ margin: "4px 0 0", fontSize: 12.8 }}>
                      Reopen your best AI plans anytime.
                    </p>
                  </div>
                  <Link href="/plan" style={{ width: "auto", color: "var(--accent-2)", fontWeight: 800, fontSize: 13 }}>
                    Add plan
                  </Link>
                </div>
                {plansLoading && <p className="helper" style={{ margin: 0 }}>Loading saved plans...</p>}
                {!plansLoading && savedPlans.length === 0 && (
                  <p className="helper" style={{ margin: 0, lineHeight: 1.55 }}>
                    Save an AI response from the planner and it will appear here as a reusable training plan.
                  </p>
                )}
                {!plansLoading && savedPlans.length > 0 && (
                  <div
                    className="saved-plan-list"
                    style={{
                      display: "flex",
                      gap: 12,
                      overflowX: "auto",
                      padding: "2px 2px 8px",
                      scrollSnapType: "x mandatory",
                    }}
                  >
                    {savedPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="saved-plan-card"
                        style={{
                          flex: "0 0 min(280px, 82vw)",
                          padding: "12px",
                          borderRadius: 18,
                          background: "linear-gradient(145deg, rgba(77,211,201,0.1), rgba(255,255,255,0.035))",
                          border: "1px solid rgba(77,211,201,0.16)",
                          display: "grid",
                          gap: 8,
                          scrollSnapAlign: "start",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 900, lineHeight: 1.25 }}>{plan.title}</div>
                            <div className="helper" style={{ marginTop: 4, fontSize: 12.2 }}>
                              {plan.created_at ? new Date(plan.created_at).toLocaleDateString() : "Saved recently"}
                            </div>
                          </div>
                          <span
                            style={{
                              flex: "0 0 auto",
                              padding: "5px 8px",
                              borderRadius: 999,
                              background: "rgba(77,211,201,0.13)",
                              color: "var(--accent-2)",
                              fontSize: 11.5,
                              fontWeight: 900,
                              textTransform: "uppercase",
                            }}
                          >
                            {plan.status || "saved"}
                          </span>
                        </div>
                        <p className="helper" style={{ margin: 0, lineHeight: 1.45, fontSize: 12.8 }}>
                          {getPlanPreview(plan.content)}...
                        </p>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button
                            type="button"
                            onClick={() => setSelectedPlan(plan)}
                            style={{
                              width: "auto",
                              padding: "8px 12px",
                              borderRadius: 999,
                              background: "linear-gradient(135deg, var(--accent-2), #4fc9bd)",
                              color: "#0f1524",
                              boxShadow: "none",
                              fontSize: 12.5,
                              fontWeight: 900,
                            }}
                          >
                            Open
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSavedPlan(plan.id)}
                            disabled={deletingPlanId === plan.id}
                            style={{
                              width: "auto",
                              padding: "8px 12px",
                              borderRadius: 999,
                              background: "rgba(255,107,107,0.1)",
                              color: "var(--error)",
                              border: "1px solid rgba(255,107,107,0.2)",
                              boxShadow: "none",
                              fontSize: 12.5,
                              fontWeight: 900,
                            }}
                          >
                            {deletingPlanId === plan.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="panel dashboard-panel saved-plans-sidecar" aria-hidden="true">
                <div className="saved-plans-widget-image" />
                <div>
                  <span>Spin Lab</span>
                  <strong>Turn AI ideas into repeatable reps.</strong>
                  <p>Save the plan, run the session, then come back tomorrow with a sharper ask.</p>
                  <div className="sidecar-cue-list">
                    <small>Save</small>
                    <small>Train</small>
                    <small>Refine</small>
                  </div>
                </div>
              </div>

              <div className="panel dashboard-panel shot-arc-card" aria-hidden="true">
                <div className="shot-arc-illustration">
                  <div className="shot-arc-ball" />
                  <div className="shot-arc-line" />
                  <div className="shot-arc-backboard" />
                  <div className="shot-arc-rim" />
                  <div className="shot-arc-net" />
                </div>
                <div>
                  <span>Shot Arc Lab</span>
                  <strong>High arc. Soft touch. Same release.</strong>
                  <p>Use saved plans to build rhythm, then keep one shooting cue locked for the whole workout.</p>
                </div>
              </div>
            </section>

            {/* ========== CRUD AREA: Your Workouts ========== */}
            {/* NDRYSHIMI 2: Rregullimi i panelit CRUD për të qenë responsive */}
            <section style={{ width: "100%", overflow: "hidden" }}>
              <div className="panel dashboard-library workout-library-panel" style={{ 
                display: "grid", 
                gap: 20, 
                padding: 22, 
                marginTop: 17,
                overflow: "hidden" 
              }}>
                <div style={{ display: "grid", gap: 6 }}>
                  <div style={{ color: "var(--accent-2)", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em" }}>
                    TRAINING NOTEBOOK
                  </div>
                  <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", margin: 0 }}>My Workouts</h2>
                  <p className="helper" style={{ margin: 0, maxWidth: 680 }}>
                    Keep your manually saved workouts next to your AI-generated plans, so the dashboard feels like one training command center.
                  </p>
                </div>
                <div>
                   <AddWorkoutForm onAdded={() => setListRefresh(r => !r)} />
                </div>
                <div style={{ width: "100%", minWidth: 0 }}>
                   <WorkoutListPro key={listRefresh ? "A" : "B"} />
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
