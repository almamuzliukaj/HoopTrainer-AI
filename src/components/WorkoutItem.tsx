import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Workout {
  id: string;
  title: string;
  description: string;
  created_at?: string;
}

export default function WorkoutItem({ workout, onUpdated }: { workout: Workout; onUpdated: () => void }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(workout.title);
  const [description, setDescription] = useState(workout.description);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async () => {
    // EDGE 1: Prevent empty
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }
    // EDGE 2: Prevent double submit
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("workouts")
        .update({ title, description })
        .eq("id", workout.id);
      // EDGE 3: DB error
      if (error) setError("Database error: " + error.message);
      else {
        setEditing(false);
        onUpdated();
      }
    } catch {
      setError("Network error. Try again.");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if(!confirm("Are you sure you want to delete this workout?")) return;
    setSaving(true);
    try {
      await supabase.from("workouts").delete().eq("id", workout.id);
      onUpdated();
    } finally {
      setSaving(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    background: "linear-gradient(145deg, rgba(35,45,72,0.96), rgba(25,33,54,0.96))",
    padding: "16px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 14px 34px rgba(0,0,0,0.22)",
    transition: "transform 0.2s ease, border-color 0.2s ease",
  };

  if (editing) {
    return (
      <div className="workout-item-card" style={cardStyle}>
        <input 
          style={{
            width: "100%", padding: "12px 13px", marginBottom: "10px",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            color: "var(--text)", borderRadius: 12,
          }}
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={saving}
          placeholder="Workout title"
        />
        <textarea 
          style={{
            width: "100%", padding: "12px 13px", marginBottom: "15px",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            color: "var(--text)", borderRadius: 12, resize: "vertical",
          }}
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={saving}
          rows={3}
          placeholder="Workout description"
        />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={handleUpdate}
            disabled={saving || !title.trim() || !description.trim()}
            style={{
              width: "auto",
              padding: "9px 14px",
              background: "linear-gradient(135deg, var(--accent-2), #5aa0ff)",
              border: "none",
              borderRadius: 999,
              fontWeight: 600,
              cursor: saving ? "wait" : "pointer"
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={() => { setEditing(false); setError(null); }}
            disabled={saving}
            style={{
              width: "auto",
              padding: "9px 14px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--muted)",
              borderRadius: 999,
              boxShadow: "none",
            }}
          >
            Cancel
          </button>
        </div>
        {error && (
          <div style={{ color: "var(--error)", marginTop: 8, fontSize: 13 }}>
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="workout-item-card" style={cardStyle}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, marginBottom: "12px"
      }}>
        <div style={{ minWidth: 0 }}>
          <h4 style={{ margin: 0, fontSize: "17px", fontWeight: 900, color: "var(--text)", lineHeight: 1.2 }}>{workout.title}</h4>
          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)", textTransform: "uppercase" }}>
            {workout.created_at ? new Date(workout.created_at).toLocaleDateString('en-GB') : "Draft"}
          </p>
        </div>
        <div className="workout-actions" style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button 
            onClick={() => setEditing(true)}
            style={{ width: "auto", padding: "7px 10px", background: "rgba(90,160,255,0.1)", border: "1px solid rgba(90,160,255,0.18)", color: "var(--accent)", cursor: "pointer", fontSize: "12.5px", fontWeight: 900, borderRadius: 999, boxShadow: "none" }}
          >
            Edit
          </button>
          <button 
            onClick={handleDelete}
            style={{ width: "auto", padding: "7px 10px", background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.2)", color: "var(--error)", cursor: "pointer", fontSize: "12.5px", fontWeight: 900, borderRadius: 999, boxShadow: "none" }}
            disabled={saving}
          >
            Delete
          </button>
        </div>
      </div>
      <p style={{ 
        margin: 0, 
        fontSize: "14px", 
        lineHeight: "1.6", 
        color: "var(--text)", 
        whiteSpace: "pre-line",
        opacity: 0.9 
      }}>
        {workout.description}
      </p>
    </div>
  );
}
