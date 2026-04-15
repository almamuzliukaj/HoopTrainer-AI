import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import WorkoutItem from "./WorkoutItem";

interface Workout {
  id: string;
  title: string;
  description: string;
  created_at?: string;
}

export default function WorkoutListPro() {
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
    <div className="workout-library-list">
      <div className="workout-library-header">
        <div>
          <div className="section-kicker">WORKOUT LIBRARY</div>
          <h2 style={{ fontSize: "clamp(1.25rem, 4vw, 1.8rem)", fontWeight: 900, margin: "4px 0 0" }}>
            Saved sessions
          </h2>
        </div>
        <div className="workout-count-pill">
          {loading ? "..." : `${workouts.length} Total`}
        </div>
      </div>

      {loading && (
        <div className="workout-empty-state">
          Loading records...
        </div>
      )}

      <div className="workout-card-grid">
        {workouts.map((workout) => (
          <WorkoutItem key={workout.id} workout={workout} onUpdated={fetchWorkouts} />
        ))}
      </div>

      {!loading && workouts.length === 0 && (
        <div className="workout-empty-state">
          <div className="workout-empty-orb">0</div>
          <p style={{ fontSize: "15px", margin: 0, fontWeight: 800, color: "var(--text)" }}>No workouts yet</p>
          <p className="helper" style={{ margin: "6px auto 0", maxWidth: 320 }}>
            Add your first session above and start building a personal training library.
          </p>
        </div>
      )}
    </div>
  );
}
