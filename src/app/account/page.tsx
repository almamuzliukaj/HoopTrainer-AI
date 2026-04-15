"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { emptyPlayerProfile, normalizePlayerProfile, type PlayerProfile } from "@/lib/playerProfile";

export default function AccountSettingsPage() {
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [name, setName] = useState("");
  const [profile, setProfile] = useState<Required<PlayerProfile>>(emptyPlayerProfile);
  const [msg, setMsg] = useState<string | null>(null);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const isOnboarding = useSyncExternalStore(
    () => () => undefined,
    () => new URLSearchParams(window.location.search).get("welcome") === "1",
    () => false
  );
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const notSignedInMessage = "Please log in first. If you just created your account, confirm your email and then log in.";

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        setUser(null);
        setMsg(notSignedInMessage);
        setProfileMsg(notSignedInMessage);
        return;
      }

      const nextProfile = normalizePlayerProfile(user?.user_metadata?.playerProfile);
      setUser({
        email: user?.email ?? "",
        name: user?.user_metadata?.name ?? "",
      });
      setName(user?.user_metadata?.name ?? "");
      setProfile(nextProfile);
    });
  }, []);

  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setMsg(notSignedInMessage);
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        name,
        playerProfile: normalizePlayerProfile(profile),
      },
    });
    setLoading(false);
    if (error) {
      setMsg(error.message || "Could not update name. Try again.");
    } else {
      setUser((current) => (current ? { ...current, name } : current));
      setMsg("Name updated.");
    }
  };

  const handleProfileChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setProfileMsg(notSignedInMessage);
      setProfileLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        name,
        playerProfile: normalizePlayerProfile(profile),
      },
    });
    setProfileLoading(false);
    if (error) {
      setProfileMsg(error.message || "Could not update player profile. Try again.");
    } else {
      setProfileMsg(
        isOnboarding
          ? "Player profile saved. Your AI plans are now personalized."
          : "Player profile updated."
      );
    }
  };

  function updateProfileField<K extends keyof PlayerProfile>(key: K, value: PlayerProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  const profileFields = Object.values(profile);
  const completedProfileFields = profileFields.filter(Boolean).length;
  const profileCompletion = Math.round((completedProfileFields / profileFields.length) * 100);
  const isProfileReady = completedProfileFields >= 4;

  return (
    <div
      className="app-shell basketball-atmosphere account-settings-shell"
      style={{
        minHeight: "100vh",
        background: "none",
        padding: "32px 14px 40px",
      }}
    >
      <div
        className="page-frame account-grid"
        style={{
          width: "100%",
          maxWidth: 980,
          display: "grid",
          gridTemplateColumns: "minmax(0, 420px) minmax(0, 1fr)",
          gap: 18,
          alignItems: "start",
        }}
      >
        {isOnboarding && (
          <section
            className="panel account-onboarding-card"
            style={{
              gridColumn: "1 / -1",
              minHeight: "auto",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.25fr) minmax(220px, 0.75fr)",
              gap: 18,
              alignItems: "center",
              background:
                "linear-gradient(135deg, rgba(77,211,201,0.18), rgba(60,123,224,0.16) 54%, rgba(24,33,52,0.94))",
              border: "1px solid rgba(77,211,201,0.32)",
            }}
          >
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ color: "var(--accent-2)", fontWeight: 900, fontSize: 13, letterSpacing: "0.09em" }}>
                WELCOME TO HOOPTRAINER AI
              </div>
              <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.7rem)", lineHeight: 1.02 }}>
                Build your player profile first.
              </h1>
              <p className="helper" style={{ margin: 0, maxWidth: 680, lineHeight: 1.65 }}>
                This setup helps the AI coach understand your position, skill level, weekly schedule, equipment,
                goals, and recovery limits before creating training plans.
              </p>
            </div>

            <div
              style={{
                padding: 16,
                borderRadius: 18,
                background: "rgba(8,13,22,0.35)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "grid",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                <span style={{ fontWeight: 800 }}>Profile setup</span>
                <span style={{ color: "var(--accent-2)", fontWeight: 900 }}>{profileCompletion}%</span>
              </div>
              <div style={{ height: 10, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${profileCompletion}%`,
                    height: "100%",
                    borderRadius: 999,
                    background: "linear-gradient(135deg, var(--accent-2), var(--accent))",
                    transition: "width 0.2s ease",
                  }}
                />
              </div>
              <p className="helper" style={{ margin: 0 }}>
                Complete at least position, level, days/week, and goal for better AI plans.
              </p>
            </div>
          </section>
        )}

        <div
          className="account-summary-card"
          style={{
            borderRadius: 18,
            background: "var(--card-2)",
            boxShadow: "0 8px 36px rgba(60,123,224,0.13), 0 1.5px 7px rgba(79,201,189,0.09)",
            padding: "0",
            border: "1.5px solid var(--border)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
        {/* Sticky top nav for back */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 12,
            background: "var(--card-2)",
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            borderBottom: "1.3px solid var(--border)",
            padding: "18px 24px 10px 18px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Link
            href="/dashboard"
            style={{
              color: "var(--accent-2)",
              fontWeight: 700,
              fontSize: 16,
              padding: "7px 15px 7px 10px",
              background: "rgba(79,201,189,0.08)",
              borderRadius: 8,
              border: "1.2px solid var(--accent-2)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center"
            }}
          >
            <span style={{ fontSize: 18, marginRight: 7 }}>←</span>
            Dashboard
          </Link>
          <span style={{ fontWeight: 800, fontSize: 20, marginLeft: 8, color: "var(--text)" }}>Settings</span>
        </div>

        {/* Profile Pane */}
        <div style={{
          padding: "30px 24px 8px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12
        }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent-2), #3c7be0)",
              color: "#0f1524",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 35,
              letterSpacing: 0.3,
              marginBottom: 4,
              marginTop: 2,
              boxShadow: "0 3px 22px rgba(60,123,224,0.17)"
            }}
          >
            {(user?.name?.[0] ?? user?.email?.[0] ?? "U").toUpperCase()}
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 22 }}>{user?.name || "User"}</div>
            <div style={{ color: "var(--muted)", fontSize: 16, marginTop: 2 }}>{user?.email}</div>
          </div>
        </div>

        {/* Horizontal line */}
        <div style={{ borderBottom: "1.3px solid var(--border)", margin: "14px 0 0" }} />

        {/* Name change card */}
        <form
          onSubmit={handleNameChange}
          style={{
            padding: "30px 28px 18px 28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 16.5, marginBottom: 4 }}>Display name</div>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            style={{
              padding: "12px 13px",
              borderRadius: 9,
              fontSize: 16,
              border: "1.3px solid var(--border)",
              background: "var(--card-2)",
              color: "var(--text)",
              fontWeight: 500,
              width: "100%",
            }}
          />
          <button
            type="submit"
            disabled={loading || !name.trim()}
            style={{
              marginTop: 1,
              background: "linear-gradient(135deg, var(--accent-2), #4fc9bd)",
              color: "#0f1524",
              fontWeight: 800,
              cursor: loading ? "wait" : "pointer",
              padding: "11px 26px",
              border: "1.3px solid rgba(79,201,189,0.5)",
              borderRadius: 9,
              fontSize: 15.6,
              boxShadow: "0 4px 18px rgba(79,201,189,0.13)"
            }}
          >
            {loading ? "Saving..." : "Save name"}
          </button>
          {msg &&
            <div style={{
              color: msg.includes("updated") ? "var(--accent-2)" : "var(--error)",
              fontSize: 15.5,
              marginTop: 3,
              fontWeight: 600
            }}>{msg}</div>}
        </form>

        <section className="account-insight-card">
          <div>
            <div className="section-kicker">PLAYER COMMAND CENTER</div>
            <h2>Ready for smarter plans</h2>
            <p className="helper">
              Your account profile powers AI planning, saved plans, streaks, and dashboard personalization.
            </p>
          </div>
          <div className="account-completion-ring" style={{ ["--profile-progress" as string]: `${profileCompletion}%` }}>
            <div>
              <strong>{profileCompletion}%</strong>
              <span>profile</span>
            </div>
          </div>
          <div className="account-mini-grid">
            <div>
              <strong>{isProfileReady ? "Personalized" : "Needs details"}</strong>
              <span className="helper">AI context</span>
            </div>
            <div>
              <strong>{user?.email ? "Connected" : "Signed out"}</strong>
              <span className="helper">Account status</span>
            </div>
          </div>
          <div className="account-action-row">
            <Link href="/plan">Open AI Planner</Link>
            <Link href="/dashboard">Back to dashboard</Link>
          </div>
        </section>
        </div>

        <section
          className="panel account-profile-card-main"
          style={{
            minHeight: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div>
            <div style={{ color: "var(--accent-2)", fontWeight: 800, fontSize: 13, letterSpacing: "0.08em" }}>
              PLAYER PROFILE
            </div>
            <div style={{ fontWeight: 900, fontSize: 24, marginTop: 6 }}>Make every plan athlete-specific</div>
            <div className="helper" style={{ marginTop: 8, maxWidth: 540 }}>
              Your AI plans can now adapt to the athlete&apos;s position, level, weekly schedule, goal, and recovery notes.
            </div>
          </div>

          <form onSubmit={handleProfileChange} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="account-profile-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <span style={{ fontWeight: 700 }}>Age</span>
                <input value={profile.age} onChange={e => updateProfileField("age", e.target.value)} placeholder="16" />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <span style={{ fontWeight: 700 }}>Position</span>
                <input value={profile.position} onChange={e => updateProfileField("position", e.target.value)} placeholder="Guard, wing, big" />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <span style={{ fontWeight: 700 }}>Level</span>
                <input value={profile.level} onChange={e => updateProfileField("level", e.target.value)} placeholder="High school varsity" />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <span style={{ fontWeight: 700 }}>Days per week</span>
                <input value={profile.daysPerWeek} onChange={e => updateProfileField("daysPerWeek", e.target.value)} placeholder="4" />
              </label>
            </div>

            <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <span style={{ fontWeight: 700 }}>Primary goal</span>
              <input
                value={profile.primaryGoal}
                onChange={e => updateProfileField("primaryGoal", e.target.value)}
                placeholder="Explosiveness, first step, shooting off the dribble"
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <span style={{ fontWeight: 700 }}>Equipment access</span>
              <input
                value={profile.equipment}
                onChange={e => updateProfileField("equipment", e.target.value)}
                placeholder="Full gym, court only, bands, dumbbells"
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <span style={{ fontWeight: 700 }}>Injury or recovery notes</span>
              <textarea
                value={profile.injuryNotes}
                onChange={e => updateProfileField("injuryNotes", e.target.value)}
                placeholder="Patellar tendon soreness, ankle recovery, no current issues"
                rows={4}
                style={{ resize: "vertical" }}
              />
            </label>

            <button type="submit" disabled={profileLoading}>
              {profileLoading ? "Saving profile..." : "Save player profile"}
            </button>

            {profileMsg && (
              <div style={{ color: profileMsg.toLowerCase().includes("could not") ? "var(--error)" : "var(--accent-2)", fontWeight: 700 }}>
                {profileMsg}
              </div>
            )}

            {isOnboarding && profileMsg && !profileMsg.toLowerCase().includes("could not") && (
              <div
                style={{
                  display: "grid",
                  gap: 10,
                  padding: 14,
                  borderRadius: 16,
                  background: "rgba(77,211,201,0.1)",
                  border: "1px solid rgba(77,211,201,0.24)",
                }}
              >
                <div style={{ fontWeight: 800 }}>
                  {isProfileReady
                    ? "Great. Your AI coach has enough context to start."
                    : "Profile saved. You can add more details anytime."}
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link
                    href="/plan"
                    style={{
                      width: "auto",
                      padding: "10px 14px",
                      borderRadius: 12,
                      background: "linear-gradient(135deg, var(--accent-2), #4fc9bd)",
                      color: "#0f1524",
                      fontWeight: 900,
                      textDecoration: "none",
                    }}
                  >
                    Open AI Planner
                  </Link>
                  <Link
                    href="/dashboard"
                    style={{
                      width: "auto",
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "var(--text)",
                      fontWeight: 800,
                      textDecoration: "none",
                      background: "rgba(255,255,255,0.04)",
                    }}
                  >
                    Go to dashboard
                  </Link>
                </div>
              </div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}
