import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AddWorkoutForm({ onAdded }: { onAdded: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not logged in");
      setSaving(false);
      return;
    }
    const { error: insertError } = await supabase
      .from("workouts")
      .insert([{ user_id: user.id, title, description }]);
    if (insertError) {
      setError(insertError.message);
    } else {
      setTitle("");
      setDescription("");
      onAdded();
    }
    setSaving(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="panel"
      style={{
        background: "var(--card-2)",
        boxShadow: "0 2px 16px rgba(90, 160, 255, 0.095)",
        padding: 18,
        marginBottom: 15,
        borderLeft: "4px solid var(--accent)"
      }}
    >
      <div style={{display: "flex", flexDirection:"column", gap:8}}>
        <input
          placeholder="Workout title (e.g. Speed Drills)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          disabled={saving}
          style={{fontWeight:700}}
        />
        <textarea
          placeholder="Describe the workout (what, sets/reps, focus...)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          disabled={saving}
          rows={2}
        />
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          <button disabled={saving || !title || !description} style={{width:'auto', minWidth:120, fontWeight:800}}>
            ➕ Add Workout
          </button>
          {error && <span className="error">{error}</span>}
        </div>
      </div>
    </form>
  );
}