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
        boxShadow: "0 5px 28px rgba(77,211,201, 0.13), 0 2px 8px rgba(60,123,224,0.07)",
        background: "var(--card-2)",
        padding: 30,
        borderRadius: 17,
        border: "1.4px solid var(--border)",
        minHeight: 98,
        position: "relative",
        transition: "box-shadow .22s, border .23s",
        marginBottom: 0,
        marginTop: 0,
        cursor: editing ? "default" : "pointer"
      }}
    >
      {editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={saving}
            style={{
              fontWeight: 900,
              fontSize: 17,
              border: "1.3px solid var(--border)",
              borderRadius: 8,
              padding: "11px 14px",
              background: "var(--card-2)"
            }}
            maxLength={56}
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            disabled={saving}
            maxLength={224}
            style={{
              fontSize: 15.5,
              fontWeight: 500,
              border: "1.3px solid var(--border)",
              borderRadius: 8,
              padding: "11px 14px",
              background: "var(--card-2)"
            }}
          />
          <div style={{ display: "flex", gap: 12, marginTop: 5 }}>
            <button
              onClick={handleUpdate}
              disabled={saving || !title}
              style={{
                background: "linear-gradient(135deg,var(--accent-2),#4fc9bd 85%)",
                color: "#0f1524",
                border: "none",
                fontWeight: 900,
                fontSize: 15,
                padding: "10px 22px",
                borderRadius: 8,
                boxShadow: "0 7px 16px rgba(79,201,189,0.13)",
                transition: 'filter 0.13s'
              }}>💾 Save</button>
            <button
              className="helper"
              style={{
                color: "var(--muted)",
                background: "rgba(79,201,189,0.075)",
                border: "1.5px solid var(--border)",
                fontWeight: 800,
                fontSize: 15,
                borderRadius: 8,
                padding: "10px 22px"
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
            fontWeight: 900,
            fontSize: 21,
            marginBottom: 7,
            color: "var(--accent-2)",
            letterSpacing: 0.12,
            display: "flex",
            alignItems: "center",
            gap: 12,
            minHeight: 35
          }}>
            <span aria-label="icon" style={{
              fontSize: 22,
              background: "linear-gradient(135deg,var(--accent-2),#4fc9bd)",
              borderRadius: "50%",
              color: "#0f1524",
              boxShadow: "0 2px 6px rgba(77,211,201,0.09)",
              width: 34,
              height: 34,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center"
            }}>💡</span>
            {workout.title}
            <span className="helper" style={{
              marginLeft: "auto",
              fontSize: 13,
              color: "var(--muted)",
              fontWeight: 500,
              paddingTop: 2,
              fontStyle: 'italic'
            }}>
              {workout.created_at ? new Date(workout.created_at).toLocaleString() : ""}
            </span>
          </div>
          <div className="helper" style={{
            fontSize: 15.8,
            color: "var(--text)",
            marginBottom: 13,
            fontWeight: 500,
            letterSpacing: 0.02,
          }}>
            {workout.description}
          </div>
          <div style={{ display: "flex", gap: 13, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setEditing(true)}
              style={{
                background: "linear-gradient(135deg,var(--accent-2),#4fc9bd)",
                color: "#0f1524",
                border: "none",
                fontWeight: 900,
                fontSize: 15,
                padding: "10px 20px",
                borderRadius: 8,
                boxShadow: "0 4px 13px rgba(79,201,189,0.12)",
                cursor: "pointer",
                letterSpacing: 0.15,
                transition: "filter 0.13s"
              }}>✏️ Edit</button>
            <button
              onClick={handleDelete}
              style={{
                background: "linear-gradient(90deg, #d9ece9, #e2f5fc 85%)",
                color: "var(--accent-2)",
                border: "none",
                fontWeight: 900,
                fontSize: 15,
                padding: "10px 20px",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(48,182,140,0.10)",
                cursor: "pointer"
              }}
              disabled={saving}
            >🗑️ Remove</button>
          </div>
        </div>
      )}
    </div>
  );
}