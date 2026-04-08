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
    background: "var(--card-2)",
    padding: "24px",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    marginBottom: "16px",
    transition: "transform 0.2s ease"
  };

  if (editing) {
    return (
      <div style={cardStyle}>
        <input 
          style={{
            width: '100%', padding: '10px', marginBottom: '10px',
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--text)', borderRadius: '4px'
          }}
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={saving}
          placeholder="Workout title"
        />
        <textarea 
          style={{
            width: '100%', padding: '10px', marginBottom: '15px',
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--text)', borderRadius: '4px', resize: 'none'
          }}
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={saving}
          rows={3}
          placeholder="Workout description"
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleUpdate}
            disabled={saving || !title.trim() || !description.trim()}
            style={{
              padding: '8px 20px',
              background: 'var(--accent-2)',
              border: 'none',
              borderRadius: '4px',
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
              padding: '8px 20px',
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
              borderRadius: '4px'
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
    <div style={cardStyle}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px"
      }}>
        <div>
          <h4 style={{ margin: 0, fontSize: "17px", fontWeight: 600, color: "var(--accent-2)" }}>{workout.title}</h4>
          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--muted)", textTransform: "uppercase" }}>
            {workout.created_at ? new Date(workout.created_at).toLocaleDateString('en-GB') : "Draft"}
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button 
            onClick={() => setEditing(true)}
            style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}
          >
            Edit
          </button>
          <button 
            onClick={handleDelete}
            style={{ background: "none", border: "none", color: "#e44949", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}
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