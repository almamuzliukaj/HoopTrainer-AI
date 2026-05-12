"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Protected } from "@/components/Protected";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import AddWorkoutForm from "@/components/AddWorkoutForm";
import WorkoutListPro from "@/components/WorkoutListPro";
import BrandMark from "@/components/BrandMark";
import SiteFooter from "@/components/SiteFooter";
import { normalizePlayerProfile, type PlayerProfile } from "@/lib/playerProfile";

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
        className="account-trigger-button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: isMobile ? 36 : 48,
          height: isMobile ? 36 : 48,
          borderRadius: "50%",
          border: "1px solid rgba(77,211,201,0.32)",
          background:
            "linear-gradient(145deg, #182236 0%, #223150 62%, #142035 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          outline: "none",
          boxShadow: open
            ? "0 16px 36px rgba(0,0,0,0.26), 0 0 0 4px rgba(77,211,201,0.1), inset 0 1px 0 rgba(255,255,255,0.12)"
            : "0 10px 24px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.1)",
          fontWeight: 900,
          color: "var(--accent-2)",
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
                background: "linear-gradient(145deg, #182236, #223150)",
                color: "var(--accent-2)",
                border: "1px solid rgba(77,211,201,0.26)",
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

type WorkoutSummary = {
  id: string;
  title: string;
  description?: string;
  created_at?: string;
};

const savedPlanMarkdownComponents = {
  h1: ({ children }: { children?: ReactNode }) => <h1 className="saved-plan-md-heading">{children}</h1>,
  h2: ({ children }: { children?: ReactNode }) => <h2 className="saved-plan-md-heading">{children}</h2>,
  h3: ({ children }: { children?: ReactNode }) => <h3 className="saved-plan-md-subheading">{children}</h3>,
  p: ({ children }: { children?: ReactNode }) => <p className="saved-plan-md-paragraph">{children}</p>,
  ul: ({ children }: { children?: ReactNode }) => <ul className="saved-plan-md-list">{children}</ul>,
  ol: ({ children }: { children?: ReactNode }) => <ol className="saved-plan-md-list saved-plan-md-numbered">{children}</ol>,
  li: ({ children }: { children?: ReactNode }) => <li>{children}</li>,
  strong: ({ children }: { children?: ReactNode }) => <strong className="saved-plan-md-strong">{children}</strong>,
  code: ({ children }: { children?: ReactNode }) => <code className="saved-plan-md-code">{children}</code>,
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

function countCurrentStreak(completedDates: string[], todayKey: string, freezeDates: string[] = []) {
  const completed = new Set(completedDates);
  const frozen = new Set(freezeDates);
  let streak = 0;
  const cursor = new Date(`${todayKey}T12:00:00`);

  while (completed.has(cursor.toISOString().slice(0, 10)) || frozen.has(cursor.toISOString().slice(0, 10))) {
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

function getActivityDates(items: { created_at?: string }[], completedDates: string[]) {
  return Array.from(new Set([
    ...completedDates,
    ...items
      .map((item) => item.created_at?.slice(0, 10))
      .filter(Boolean),
  ] as string[])).sort();
}

function getIntensityLabel(workouts: WorkoutSummary[], savedPlans: SavedTrainingPlan[]) {
  const text = [...workouts, ...savedPlans]
    .map((item) => `${item.title} ${"content" in item ? item.content : item.description || ""}`)
    .join(" ")
    .toLowerCase();

  if (/conditioning|sprint|shuttle|defense|plyo|jump|explosive|speed/.test(text)) return "Explosive";
  if (/shoot|form|free throw|3-point|three|range|pull-up/.test(text)) return "Skill";
  if (/handle|dribble|ball/.test(text)) return "Handle";
  if (/mobility|recovery|stretch|warm/.test(text)) return "Recovery";
  return "Balanced";
}

function getAdaptiveFocus(profile: PlayerProfile, workouts: WorkoutSummary[], savedPlans: SavedTrainingPlan[], currentStreak: number) {
  const normalized = normalizePlayerProfile(profile);
  const goal = normalized.primaryGoal || "overall basketball development";
  const position = normalized.position || "player";
  const days = Number.parseInt(normalized.daysPerWeek, 10);
  const hasRecentWork = workouts.length > 0 || savedPlans.length > 0 || currentStreak > 0;

  if (currentStreak >= 5) {
    return {
      title: "Deload with precision",
      copy: `Keep the ${position} sharp with a lower-load ${goal} session and extra recovery detail.`,
      blocks: ["Movement prep", "Low-volume skill reps", "Film or notes"],
    };
  }

  if (Number.isFinite(days) && days <= 3) {
    return {
      title: "Compact high-value session",
      copy: `Use a focused ${days}-day rhythm: one skill priority, one athletic block, one clean finisher.`,
      blocks: ["Primary skill", "Game-speed burst", "Short finisher"],
    };
  }

  if (!hasRecentWork) {
    return {
      title: "Build your baseline",
      copy: `Start with a balanced ${goal} plan so the AI has a clearer training pattern to adapt from.`,
      blocks: ["Skill assessment", "Controlled conditioning", "Recovery note"],
    };
  }

  return {
    title: "Progress the next session",
    copy: `Advance ${goal} without overloading: repeat the strongest block and add one harder constraint.`,
    blocks: ["Repeat best drill", "Add pressure", "Log one cue"],
  };
}

function getPlayerLevel(totalXp: number) {
  return Math.max(1, Math.floor(totalXp / 120) + 1);
}

function getPlayerRank(level: number) {
  if (level >= 18) return "Franchise";
  if (level >= 14) return "All-Star";
  if (level >= 10) return "Captain";
  if (level >= 6) return "Starter";
  if (level >= 3) return "Rotation Player";
  return "Rookie";
}

function getNextRank(level: number) {
  if (level < 3) return "Rotation Player";
  if (level < 6) return "Starter";
  if (level < 10) return "Captain";
  if (level < 14) return "All-Star";
  if (level < 18) return "Franchise";
  return "Max rank";
}

function getSkillBadges(workouts: WorkoutSummary[], savedPlans: SavedTrainingPlan[]) {
  const text = [...workouts, ...savedPlans]
    .map((item) => `${item.title} ${"content" in item ? item.content : item.description || ""}`)
    .join(" ")
    .toLowerCase();

  const badges = [
    { title: "Shooter", terms: ["shoot", "form", "free throw", "3-point", "range", "pull-up"] },
    { title: "Ball Handler", terms: ["handle", "dribble", "crossover", "weak-hand", "ball"] },
    { title: "Finisher", terms: ["finish", "layup", "rim", "floater", "drive"] },
    { title: "Defender", terms: ["defense", "slide", "closeout", "stance"] },
    { title: "Athlete", terms: ["jump", "sprint", "speed", "plyo", "explosive", "conditioning"] },
    { title: "Recovery Pro", terms: ["mobility", "recovery", "stretch", "warm", "cooldown"] },
  ];

  return badges.map((badge) => ({
    ...badge,
    unlocked: badge.terms.some((term) => text.includes(term)),
  }));
}

function getLevelRewards(level: number) {
  return [
    { title: "Smart warm-up templates", level: 2 },
    { title: "Pressure shooting prompts", level: 4 },
    { title: "Advanced weekly quests", level: 6 },
    { title: "Captain challenge mode", level: 10 },
  ].map((reward) => ({ ...reward, unlocked: level >= reward.level }));
}

function getPreviousDayKey(todayKey: string) {
  const previous = new Date(`${todayKey}T12:00:00`);
  previous.setDate(previous.getDate() - 1);
  return previous.toISOString().slice(0, 10);
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
  const [streakFreezeDates, setStreakFreezeDates] = useState<string[]>([]);
  const [challengeSaving, setChallengeSaving] = useState(false);
  const [freezeSaving, setFreezeSaving] = useState(false);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>({});
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutSummary[]>([]);

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
      const dailyMeta = user?.user_metadata?.dailyChallenge;
      const savedDates = dailyMeta?.completedDates;
      const savedFreezeDates = dailyMeta?.freezeDates;
      setPlayerProfile(normalizePlayerProfile(user?.user_metadata?.playerProfile));
      setCompletedChallengeDates(Array.isArray(savedDates) ? savedDates.filter(Boolean) : []);
      setStreakFreezeDates(Array.isArray(savedFreezeDates) ? savedFreezeDates.filter(Boolean) : []);
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

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setRecentWorkouts([]);
        return;
      }

      const { data, error } = await supabase
        .from("workouts")
        .select("id,title,description,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6);

      setRecentWorkouts(error ? [] : (data as WorkoutSummary[]) || []);
    })();
  }, [listRefresh]);

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
  const previousDayKey = todayKey ? getPreviousDayKey(todayKey) : "";
  const currentStreak = todayKey ? countCurrentStreak(completedChallengeDates, todayKey, streakFreezeDates) : 0;
  const weekDays = getCurrentWeekDays(todayKey);
  const completedThisWeek = weekDays.filter((day) => completedChallengeDates.includes(day.key)).length;
  const weeklyProgress = Math.round((completedThisWeek / weekDays.length) * 100);
  const activityDates = getActivityDates([...recentWorkouts, ...savedPlans], completedChallengeDates);
  const trainingDays = activityDates.length;
  const challengeXp = completedChallengeDates.length * 40;
  const workoutXp = recentWorkouts.length * 25;
  const planXp = savedPlans.length * 35;
  const streakBonusXp = Math.floor(currentStreak / 7) * 150;
  const weeklyQuests = [
    { title: "Complete 5 daily challenges", progress: completedThisWeek, target: 5, xp: 120 },
    { title: "Log 3 workouts", progress: Math.min(recentWorkouts.length, 3), target: 3, xp: 90 },
    { title: "Save 2 AI plans", progress: Math.min(savedPlans.length, 2), target: 2, xp: 80 },
  ];
  const questBonusXp = weeklyQuests
    .filter((quest) => quest.progress >= quest.target)
    .reduce((sum, quest) => sum + quest.xp, 0);
  const totalXp = challengeXp + workoutXp + planXp + streakBonusXp + questBonusXp;
  const playerLevel = getPlayerLevel(totalXp);
  const playerRank = getPlayerRank(playerLevel);
  const nextRank = getNextRank(playerLevel);
  const nextLevelXp = playerLevel * 120;
  const levelProgress = Math.min(100, Math.round((totalXp / nextLevelXp) * 100));
  const intensityLabel = getIntensityLabel(recentWorkouts, savedPlans);
  const adaptiveFocus = getAdaptiveFocus(playerProfile, recentWorkouts, savedPlans, currentStreak);
  const earnedFreezes = Math.floor(completedChallengeDates.length / 5);
  const availableFreezes = Math.max(0, earnedFreezes - streakFreezeDates.length);
  const canUseFreeze = Boolean(
    previousDayKey &&
    availableFreezes > 0 &&
    !completedChallengeDates.includes(previousDayKey) &&
    !streakFreezeDates.includes(previousDayKey)
  );
  const skillBadges = getSkillBadges(recentWorkouts, savedPlans);
  const levelRewards = getLevelRewards(playerLevel);
  const achievements = [
    { title: "First Spark", copy: "Complete one daily challenge", unlocked: completedChallengeDates.length > 0 },
    { title: "Plan Builder", copy: "Save an AI training plan", unlocked: savedPlans.length > 0 },
    { title: "Notebook Pro", copy: "Log three workouts", unlocked: recentWorkouts.length >= 3 },
    { title: "Streak Mode", copy: "Reach a 5-day streak", unlocked: currentStreak >= 5 },
    { title: "Freeze Ready", copy: "Earn your first streak freeze", unlocked: earnedFreezes > 0 },
    { title: "Rank Up", copy: "Reach Rotation Player", unlocked: playerLevel >= 3 },
  ];

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
          freezeDates: streakFreezeDates,
          lastCompletedAt: new Date().toISOString(),
        },
      },
    });

    if (!error) setCompletedChallengeDates(nextDates);
    setChallengeSaving(false);
  };

  const useStreakFreeze = async () => {
    if (!canUseFreeze || freezeSaving || !previousDayKey) return;

    setFreezeSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setFreezeSaving(false);
      return;
    }

    const nextFreezeDates = Array.from(new Set([previousDayKey, ...streakFreezeDates])).sort();
    const { error } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        dailyChallenge: {
          completedDates: completedChallengeDates,
          freezeDates: nextFreezeDates,
          lastFreezeUsedAt: new Date().toISOString(),
        },
      },
    });

    if (!error) setStreakFreezeDates(nextFreezeDates);
    setFreezeSaving(false);
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
            className="saved-plan-modal"
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
              className="saved-plan-modal-header"
              style={{
                padding: "20px 22px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                justifyContent: "space-between",
                gap: 18,
                alignItems: "flex-start",
              }}
            >
              <div className="saved-plan-modal-title">
                <div style={{ color: "var(--accent-2)", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em" }}>
                  SAVED TRAINING PLAN
                </div>
                <h2 style={{ marginTop: 6, fontSize: "clamp(1.25rem, 4vw, 1.8rem)" }}>{selectedPlan.title}</h2>
                <div className="saved-plan-modal-chips">
                  <span>{selectedPlan.status || "saved"}</span>
                  <span>{selectedPlan.created_at ? new Date(selectedPlan.created_at).toLocaleDateString() : "recent"}</span>
                  <span>{Math.max(1, Math.round(selectedPlan.content.split(/\s+/).filter(Boolean).length / 120))} min read</span>
                </div>
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
            <div className="saved-plan-playbook-strip" aria-hidden="true">
              <div>
                <span>01</span>
                Warm up
              </div>
              <div>
                <span>02</span>
                Main work
              </div>
              <div>
                <span>03</span>
                Finish clean
              </div>
            </div>
            <div
              className="saved-plan-modal-content"
              style={{
                margin: 0,
                padding: "22px",
                overflow: "auto",
                lineHeight: 1.65,
                fontFamily: "inherit",
                color: "var(--text)",
              }}
            >
              <ReactMarkdown components={savedPlanMarkdownComponents}>
                {selectedPlan.content}
              </ReactMarkdown>
            </div>
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
              <div>
                <p className="helper" style={{ margin: 0 }}>Welcome back</p>
                <h1 style={{ margin: 0, fontSize: "clamp(1.9rem, 4vw, 2.5rem)", lineHeight: 1.05 }}>Your training dashboard</h1>
                <p className="helper" style={{ margin: 0, maxWidth: 620 }}>Quick access to today&apos;s focus, recent momentum, and your personal workout library.</p>
              </div>
              <div className="dashboard-hero-stats">
                <div>
                  <span>{currentStreak}</span>
                  <small>day streak</small>
                </div>
                <div>
                  <span>{completedThisWeek}/7</span>
                  <small>this week</small>
                </div>
                <div>
                  <span>{savedPlans.length}</span>
                  <small>saved plans</small>
                </div>
              </div>
            </header>

            <section className="performance-command-panel">
              <div className="performance-command-head">
                <div>
                  <div className="section-kicker">AI PERFORMANCE TRACKING</div>
                  <h2>Training intelligence</h2>
                  <p className="helper">
                    Your activity, saved plans, and daily challenge rhythm now feed a smarter training snapshot.
                  </p>
                </div>
                <div className="player-level-badge">
                  <span>{playerRank}</span>
                  <strong>Level {playerLevel}</strong>
                  <small>{totalXp} XP</small>
                </div>
              </div>

              <div className="performance-command-grid">
                <div className="performance-score-card">
                  <div className="performance-score-ring" style={{ ["--score" as string]: `${weeklyProgress}%` }}>
                    <div>
                      <strong>{weeklyProgress}</strong>
                      <span>score</span>
                    </div>
                  </div>
                  <div>
                    <strong>Performance signal</strong>
                    <p>
                      {completedThisWeek >= 4
                        ? "Strong weekly rhythm. Keep quality high and avoid junk volume."
                        : "Build the week with one focused session and one recovery note."}
                    </p>
                  </div>
                </div>

                <div className="adaptive-plan-card">
                  <div className="adaptive-plan-top">
                    <span>ADAPTIVE TRAINING PLAN</span>
                    <Link href="/plan">Generate</Link>
                  </div>
                  <strong>{adaptiveFocus.title}</strong>
                  <p>{adaptiveFocus.copy}</p>
                  <div className="adaptive-blocks">
                    {adaptiveFocus.blocks.map((block) => (
                      <span key={block}>{block}</span>
                    ))}
                  </div>
                </div>

                <div className="progress-dashboard-card">
                  <div className="progress-metric-row">
                    <span>Training days</span>
                    <strong>{trainingDays}</strong>
                  </div>
                  <div className="progress-metric-row">
                    <span>Recent workouts</span>
                    <strong>{recentWorkouts.length}</strong>
                  </div>
                  <div className="progress-metric-row">
                    <span>Current focus</span>
                    <strong>{intensityLabel}</strong>
                  </div>
                  <div className="level-progress-track">
                    <span style={{ width: `${levelProgress}%` }} />
                  </div>
                  <small className="xp-next-rank">Next: {nextRank}</small>
                </div>

                <div className="streak-freeze-card">
                  <div>
                    <span>STREAK FREEZE</span>
                    <strong>{availableFreezes} available</strong>
                    <p>Earn 1 freeze every 5 completed challenges. Use it to protect a missed yesterday.</p>
                  </div>
                  <button type="button" onClick={useStreakFreeze} disabled={!canUseFreeze || freezeSaving}>
                    {freezeSaving ? "Saving..." : canUseFreeze ? "Use freeze" : "No freeze needed"}
                  </button>
                </div>
              </div>
            </section>

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
                    const isFrozen = streakFreezeDates.includes(day.key);
                    const isToday = day.key === todayKey;

                    return (
                      <div key={day.key} className={`week-day-chip${isDone ? " is-done" : ""}${isFrozen ? " is-frozen" : ""}${isToday ? " is-today" : ""}`}>
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

            <section className="progression-details-panel">
              <div className="progression-details-head">
                <div>
                  <div className="section-kicker">PLAYER PROGRESSION</div>
                  <h2>Quests, badges, and rewards</h2>
                </div>
                <p className="helper">Extra progress details are grouped here so the top dashboard stays focused.</p>
              </div>

              <div className="progression-details-grid">
                <div className="weekly-quest-card">
                  <div className="gamification-title">
                    <span>WEEKLY QUESTS</span>
                    <strong>{weeklyQuests.filter((quest) => quest.progress >= quest.target).length}/{weeklyQuests.length}</strong>
                  </div>
                  <div className="quest-list">
                    {weeklyQuests.map((quest) => (
                      <div key={quest.title}>
                        <div>
                          <strong>{quest.title}</strong>
                          <span>+{quest.xp} XP</span>
                        </div>
                        <small>{quest.progress}/{quest.target}</small>
                        <div className="quest-progress-track">
                          <span style={{ width: `${Math.min(100, Math.round((quest.progress / quest.target) * 100))}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="skill-badge-card">
                  <div className="gamification-title">
                    <span>SKILL BADGES</span>
                    <strong>{skillBadges.filter((badge) => badge.unlocked).length}/{skillBadges.length}</strong>
                  </div>
                  <div className="skill-badge-grid">
                    {skillBadges.map((badge) => (
                      <span key={badge.title} className={badge.unlocked ? "is-unlocked" : ""}>
                        {badge.title}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="level-reward-card">
                  <div className="gamification-title">
                    <span>LEVEL REWARDS</span>
                    <strong>{levelRewards.filter((reward) => reward.unlocked).length}/{levelRewards.length}</strong>
                  </div>
                  <div className="reward-list">
                    {levelRewards.map((reward) => (
                      <div key={reward.title} className={reward.unlocked ? "is-unlocked" : ""}>
                        <span>Lv {reward.level}</span>
                        <strong>{reward.title}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="gamification-card">
                  <div className="gamification-title">
                    <span>ACHIEVEMENTS</span>
                    <strong>{achievements.filter((item) => item.unlocked).length}/{achievements.length}</strong>
                  </div>
                  <div className="achievement-grid">
                    {achievements.map((achievement) => (
                      <div key={achievement.title} className={achievement.unlocked ? "is-unlocked" : ""}>
                        <span>{achievement.unlocked ? "OK" : "--"}</span>
                        <strong>{achievement.title}</strong>
                        <small>{achievement.copy}</small>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="xp-detail-card">
                  <div className="gamification-title">
                    <span>XP BREAKDOWN</span>
                    <strong>{totalXp}</strong>
                  </div>
                  <div className="xp-breakdown">
                    <span>Challenges +{challengeXp}</span>
                    <span>Workouts +{workoutXp}</span>
                    <span>Plans +{planXp}</span>
                    <span>Streak bonus +{streakBonusXp}</span>
                    <span>Quest bonus +{questBonusXp}</span>
                  </div>
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
