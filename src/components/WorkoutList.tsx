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
    if (!user) {
      setWorkouts([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setWorkouts((data as Workout[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await fetchWorkouts();
    })();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          margin: "24px 0 19px",
        }}
      >
        <h2 style={{
          fontSize: 25,
          fontWeight: 900,
          letterSpacing: 0.9,
          margin: 0,
          color: "var(--accent-2)",
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          🏋️‍♂️ My Workouts
        </h2>
        <span style={{
          color: "var(--muted)",
          fontSize: 15.2,
          fontWeight: 600,
        }}>
          {workouts.length} total
        </span>
      </div>
      {loading && <div className="helper" style={{ padding: 21, fontWeight: 600, fontSize:16 }}>Loading...</div>}
      {(!loading && !workouts.length) && (
        <div className="helper" style={{ padding: 32, textAlign: "center", color: "var(--muted)", fontWeight:700, fontSize:17 }}>
          <b>🚫 You have no workouts yet.</b>
          <br />
          <span style={{fontSize:15, fontWeight:500}}>Start by adding a new one!</span>
        </div>
      )}
      <div style={{
        display: 'grid',
        gap: 26,
      }}>
        {workouts.map(workout => (
          <WorkoutItem key={workout.id} workout={workout} onUpdated={fetchWorkouts} />
        ))}
      </div>
    </div>
  );
}