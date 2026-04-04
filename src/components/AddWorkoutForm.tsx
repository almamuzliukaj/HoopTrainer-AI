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
        boxShadow: "0 8px 36px rgba(48,182,140,0.08), 0 1px 10px rgba(60,123,224,0.05)",
        padding: 33,
        marginBottom: 32,
        borderRadius: 17,
        border: "1.3px solid var(--border)",
        transition: "box-shadow 0.19s, border 0.24s",
        position: "relative"
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 22, color: "var(--accent-2)", marginBottom: 7, letterSpacing: 0.3, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-2) 40%, #3c7be0 100%)',
          display: 'grid', placeItems: 'center',
          color: '#0f1524', fontWeight: 900, fontSize: 21, boxShadow: '0 2px 8px rgba(60,123,224,0.09)'
        }}>+</span>
        Add New Workout
      </div>
      <div style={{ marginTop: 15, marginBottom: 22 }}>
        <label
          style={{
            fontWeight: 700,
            color: "var(--accent-2)",
            letterSpacing: ".06em",
          }}>Workout title</label>
        <input
          placeholder="e.g. Agility & Core Circuit"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          disabled={saving}
          maxLength={56}
          style={{
            margin: "6px 0 14px",
            fontWeight: 700,
            fontSize: 16,
            width: '100%',
            padding: "14px 12px",
            border: "1.3px solid var(--border)",
            borderRadius: 9,
            background: "var(--card-2)",
            color: "var(--text)",
            outline: "none",
            transition: "border-color 0.2s"
          }}
        />
        <label
          style={{
            fontWeight: 700,
            color: "var(--accent)",
            letterSpacing: ".06em",
          }}>Description</label>
        <textarea
          placeholder="Describe the workout (ex: sets, reps, focus, tips...)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          disabled={saving}
          rows={3}
          maxLength={224}
          style={{
            margin: "6px 0 10px",
            fontWeight: 500,
            fontSize: 15,
            width: '100%',
            padding: "14px 12px",
            border: "1.3px solid var(--border)",
            borderRadius: 9,
            background: "var(--card-2)",
            color: "var(--text)"
          }}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          disabled={saving || !title || !description}
          style={{
            minWidth: 142,
            fontWeight: 900,
            fontSize: 16,
            padding: "13px 0",
            borderRadius: 9,
            border: "none",
            background: "linear-gradient(90deg,var(--accent-2) 23%, #4fc9bd 90%)",
            color: "#0f1524",
            boxShadow: "0 8px 22px rgba(48,182,140,0.11)",
            cursor: saving ? "wait" : "pointer",
            letterSpacing: 0.18,
          }}>
          {saving ? "Saving..." : <>➕ Create workout</>}
        </button>
        {error &&
          <span className="helper"
            style={{
              color: "var(--error)",
              fontSize: 14.5,
              fontWeight: 600,
            }}>
            {error}
          </span>
        }
      </div>
    </form>
  );
}