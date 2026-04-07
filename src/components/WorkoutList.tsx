import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import WorkoutItem from "./WorkoutItem";

interface Workout {
  id: string;
  title: string;
  description: string;
  created_at?: string;
}

export default function WorkoutList() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setWorkouts((data as Workout[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
  let ignore = false;
  async function run() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      if (!ignore) setWorkouts([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!ignore) {
      setWorkouts((data as Workout[]) || []);
      setLoading(false);
    }
  }
  run();
  return () => { ignore = true; };
}, []);

  return (
    <div style={{ 
      marginTop: "20px",
      display: "flex",
      flexDirection: "column",
      // Ky padding-bottom siguron që record-i i fundit mos të prekë footer-in
      paddingBottom: "80px", 
      minHeight: "400px" 
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: "16px",
        marginBottom: "24px",
        borderBottom: "1px solid var(--border)",
        position: "sticky", // E mban titullin lart edhe kur bën scroll
        top: 0,
        background: "var(--background)", // Sigurohu që ka background që mos të shihen tekstet poshtë
        zIndex: 10
      }}>
        <h2 style={{ fontSize: "19px", fontWeight: 600, color: "var(--text)", margin: 0 }}>
          Library
        </h2>
        <div style={{ 
          fontSize: "11px", 
          background: "var(--border)", 
          padding: "4px 10px", 
          borderRadius: "4px", 
          fontWeight: 700, 
          color: "var(--muted)",
          textTransform: "uppercase"
        }}>
          {loading ? "..." : `${workouts.length} Total`}
        </div>
      </div>

      {loading && (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)", fontSize: "14px" }}>
          Loading records...
        </div>
      )}

      <div style={{ 
        display: "grid", 
        gap: "12px",
        /* Kjo pjesë parandalon që lista të deformojë layout-in në mobile */
        width: "100%",
        overflowX: "hidden" 
      }}>
        {workouts.map((workout) => (
          <WorkoutItem key={workout.id} workout={workout} onUpdated={fetchWorkouts} />
        ))}
      </div>

      {!loading && workouts.length === 0 && (
        <div style={{
          padding: "40px 20px",
          textAlign: "center",
          border: "1px dashed var(--border)",
          borderRadius: "8px",
          color: "var(--muted)"
        }}>
          <p style={{ fontSize: "14px" }}>No entries found.</p>
        </div>
      )}
    </div>
  );
}