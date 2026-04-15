"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { emptyPlayerProfile, normalizePlayerProfile, type PlayerProfile } from "@/lib/playerProfile";

export default function AccountSettingsPage() {
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [name, setName] = useState("");
  const [profile, setProfile] = useState<Required<PlayerProfile>>(emptyPlayerProfile);
  const [msg, setMsg] = useState<string | null>(null);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
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
    const { error } = await supabase.auth.updateUser({
      data: {
        name,
        playerProfile: normalizePlayerProfile(profile),
      },
    });
    setLoading(false);
    if (error) {
      setMsg("Could not update name. Try again.");
    } else {
      setUser((current) => (current ? { ...current, name } : current));
      setMsg("Name updated.");
    }
  };

  const handleProfileChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    const { error } = await supabase.auth.updateUser({
      data: {
        name,
        playerProfile: normalizePlayerProfile(profile),
      },
    });
    setProfileLoading(false);
    if (error) {
      setProfileMsg("Could not update player profile. Try again.");
    } else {
      setProfileMsg("Player profile updated.");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwLoading(true);
    setPwMsg(null);
    if (pw1.length < 6) {
      setPwMsg("Password must be at least 6 characters.");
      setPwLoading(false);
      return;
    }
    if (pw1 !== pw2) {
      setPwMsg("Passwords do not match.");
      setPwLoading(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: pw1 });
    setPwLoading(false);
    if (error) {
      setPwMsg("Could not change password. Try again.");
    } else {
      setPwMsg("Password changed.");
      setPw1(""); setPw2("");
    }
  };

  function updateProfileField<K extends keyof PlayerProfile>(key: K, value: PlayerProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  return (
    <div
      className="app-shell"
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
        <div
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

        {/* Password card */}
        <form
          onSubmit={handlePasswordChange}
          style={{
            marginTop: 12,
            padding: "24px 28px 30px 28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 11,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 16.5, marginBottom: 2 }}>Change password</div>
          <input
            type="password"
            value={pw1}
            onChange={e => setPw1(e.target.value)}
            minLength={6}
            placeholder="New password"
            style={{
              padding: "12px 13px",
              borderRadius: 9,
              fontSize: 16,
              border: "1.3px solid var(--border)",
              background: "var(--card-2)",
              color: "var(--text)",
              fontWeight: 500,
              width: "100%"
            }}
          />
          <input
            type="password"
            value={pw2}
            onChange={e => setPw2(e.target.value)}
            minLength={6}
            placeholder="Repeat new password"
            style={{
              padding: "12px 13px",
              borderRadius: 9,
              fontSize: 16,
              border: "1.3px solid var(--border)",
              background: "var(--card-2)",
              color: "var(--text)",
              fontWeight: 500,
              width: "100%"
            }}
          />
          <button
            type="submit"
            disabled={pwLoading || !pw1 || !pw2}
            style={{
              marginTop: 1,
              background: "linear-gradient(135deg, var(--accent), #3c7be0)",
              color: "#0f1524",
              fontWeight: 800,
              cursor: pwLoading ? "wait" : "pointer",
              padding: "11px 26px",
              border: "1.3px solid #7ac6ee36",
              borderRadius: 9,
              fontSize: 15.6,
              boxShadow: "0 3px 11px rgba(60,123,224,0.08)"
            }}
          >
            {pwLoading ? "Saving..." : "Save password"}
          </button>
          {pwMsg && (
            <div style={{
              color: pwMsg.toLowerCase().includes("changed") ? "var(--accent)" : "var(--error)",
              fontSize: 15.5,
              marginTop: 3,
              fontWeight: 600
            }}>{pwMsg}</div>
          )}
        </form>
        </div>

        <section
          className="panel"
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
              <div style={{ color: profileMsg.toLowerCase().includes("updated") ? "var(--accent-2)" : "var(--error)", fontWeight: 700 }}>
                {profileMsg}
              </div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}
