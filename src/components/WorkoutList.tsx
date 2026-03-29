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
  const fetchData = async () => {
    await fetchWorkouts();
  };
  fetchData();
}, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          margin: "16px 0 10px",
        }}
      >
        <h2 style={{
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: 0.7,
          margin: 0,
          color: "var(--accent)",
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          🗂️ My Workouts
        </h2>
        <span style={{
          color: "var(--muted)",
          fontSize: 14,
          fontWeight: 500,
          paddingTop: 3
        }}>
          {workouts.length} total
        </span>
      </div>
      {loading && <div className="helper" style={{ padding: 15 }}>Loading...</div>}
      {(!loading && !workouts.length) && (
        <div className="helper" style={{ padding: 20, textAlign: "center" }}>
          <b>🚫 You have no workouts yet.</b>
          <br />
          Start by adding a new one!
        </div>
      )}
      <div style={{
        display: 'grid',
        gap: 16,
      }}>
        {workouts.map(workout => (
          <WorkoutItem key={workout.id} workout={workout} onUpdated={fetchWorkouts} />
        ))}
      </div>
    </div>
  );
}