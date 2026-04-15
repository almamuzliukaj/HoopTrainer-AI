import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AddWorkoutForm({ onAdded }: { onAdded: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // EDGE 1: Prevent empty
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }
    // EDGE 2: Prevent double submit
    if (saving) return;
    setError("");
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Session expired, please log in again.");
        setSaving(false);
        return;
      }
      const { error: insertError } = await supabase
        .from("workouts")
        .insert([{ user_id: user.id, title, description }]);
      // EDGE 3: API error
      if (insertError) setError("Database error: " + insertError.message);
      else {
        setTitle("");
        setDescription("");
        onAdded();
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setSaving(false);
  };

  return (
    <form
      className="workout-form-card"
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start" }}>
        <div>
          <div style={{ color: "var(--accent-2)", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em" }}>
            QUICK LOG
          </div>
          <h3 style={{ marginTop: 5, fontSize: 22 }}>Add workout</h3>
          <p className="helper" style={{ margin: "6px 0 0", lineHeight: 1.5 }}>
            Save sessions, notes, or drills you want to repeat.
          </p>
        </div>
        <span className="workout-form-icon">+</span>
      </div>

      <div className="workout-form-grid">
        <label style={{ display: "grid", gap: 7 }}>
          <span className="helper" style={{ fontWeight: 800 }}>Workout title</span>
          <input
            placeholder="Shooting rhythm, lower-body strength..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={saving}
          />
        </label>

        <label style={{ display: "grid", gap: 7 }}>
          <span className="helper" style={{ fontWeight: 800 }}>Session notes</span>
          <textarea
            placeholder="Add drills, sets, reps, focus, or what you felt..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={saving}
            rows={4}
            style={{ resize: "vertical" }}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={saving || !title.trim() || !description.trim()}
        style={{
          justifySelf: "start",
          width: "auto",
          padding: "12px 18px",
          borderRadius: 14,
          background: "linear-gradient(135deg, var(--accent-2), #5aa0ff)",
          color: "#0f1524",
          fontWeight: 950,
        }}>
        {saving ? "Saving..." : "Save Workout"}
      </button>
      {error && <div className="error-box">{error}</div>}
    </form>
  );
}
