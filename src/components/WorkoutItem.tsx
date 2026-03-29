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
    setSaving(true);
    await supabase.from("workouts").delete().eq("id", workout.id);
    setSaving(false);
    onUpdated();
  };

  return (
    <div
      className="panel"
      style={{
        boxShadow: "0 2px 22px rgba(77,211,201, 0.14)",
        background: "var(--card-2)",
        padding: 18,
        borderLeft: "4px solid var(--accent-2)",
        position: "relative",
        minHeight: 80,
        transition: "box-shadow 0.18s"
      }}
    >
      {editing ? (
        <div style={{display: "flex", flexDirection: "column", gap: 8}}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={saving}
            style={{fontWeight:700}}
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
            disabled={saving}
            style={{resize:"vertical"}}
          />
          <div style={{display: "flex", gap: 8, marginTop: 6}}>
            <button onClick={handleUpdate} disabled={saving}>💾 Save</button>
            <button
              className="helper"
              style={{
                color: "var(--error)",
                background: "transparent",
                border: "1px solid var(--border)",
              }}
              onClick={() => setEditing(false)}
              disabled={saving}
              type="button"
            >Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{
            fontWeight: 700,
            fontSize: 17,
            marginBottom: 4,
            color: "var(--accent-2)",
            letterSpacing: 0.2,
            display: "flex",
            alignItems: "center",
            gap: 9
          }}>
            🏷️ {workout.title}
          </div>
          <div className="helper" style={{
            fontSize: 15,
            color: "var(--text)",
            marginBottom: 6,
          }}>
            {workout.description}
          </div>
          <div style={{display:"flex",gap:7,marginTop:4}}>
            <button
              onClick={() => setEditing(true)}
              style={{
                background: "linear-gradient(135deg,var(--accent-2),#4fc9bd)",
                color: "#0f1524",
                border:"none",
                fontWeight:700,
                fontSize:14,
                padding:"7px 16px",
                borderRadius:7,
                boxShadow:"0 6px 12px rgba(77,211,201,0.18)",
                cursor: "pointer"
              }}>✏️ Edit</button>
            <button
              onClick={handleDelete}
              style={{
                background: "linear-gradient(135deg, var(--error), #b31b1b)",
                color: "white",
                border:"none",
                fontWeight:700,
                fontSize:14,
                padding:"7px 16px",
                borderRadius:7,
                boxShadow:"0 6px 16px rgba(255,107,107,0.15)",
                cursor: "pointer"
              }}
              disabled={saving}
            >🗑 Delete</button>
            <span className="helper" style={{marginLeft:"auto", fontSize:12}}>
              {workout.created_at ? new Date(workout.created_at).toLocaleString() : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}