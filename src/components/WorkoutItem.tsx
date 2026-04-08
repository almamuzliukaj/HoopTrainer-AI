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

  const handleUpdate = async () => {
    setSaving(true);
    await supabase
      .from("workouts")
      .update({ title, description })
      .eq("id", workout.id);
    setSaving(false);
    setEditing(false);
    onUpdated();
  };

  const handleDelete = async () => {
    await supabase.from("workouts").delete().eq("id", workout.id);
    onUpdated();
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
          style={{ width: '100%', padding: '10px', marginBottom: '10px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }}
          value={title} 
          onChange={e => setTitle(e.target.value)} 
        />
        <textarea 
          style={{ width: '100%', padding: '10px', marginBottom: '15px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px', resize: 'none' }}
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          rows={3}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleUpdate} style={{ padding: '8px 20px', background: 'var(--accent-2)', border: 'none', borderRadius: '4px', fontWeight: 600 }}>Save Changes</button>
          <button onClick={() => setEditing(false)} style={{ padding: '8px 20px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '4px' }}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
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