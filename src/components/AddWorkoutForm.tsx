import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AddWorkoutForm({ onAdded }: { onAdded: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }
    await supabase
      .from("workouts")
      .insert([{ user_id: user.id, title, description }]);
    setTitle("");
    setDescription("");
    setSaving(false);
    onAdded();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "var(--card-2)",
        padding: "24px",
        marginBottom: "30px",
        borderRadius: "8px",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}
    >
      <div>
        <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Title</label>
        <input
          placeholder="Workout name..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={saving}
          style={{
            width: '100%',
            padding: "12px",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            background: "rgba(255,255,255,0.02)",
            color: "var(--text)",
            marginTop: "5px",
            boxSizing: "border-box"
          }}
        />
      </div>

      <div>
        <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Description</label>
        <textarea
          placeholder="Details..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={saving}
          rows={3}
          style={{
            width: '100%',
            padding: "12px",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            background: "rgba(255,255,255,0.02)",
            color: "var(--text)",
            marginTop: "5px",
            resize: "none",
            boxSizing: "border-box"
          }}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        style={{
          background: "var(--accent-2)",
          color: "#0f1524",
          padding: "12px",
          borderRadius: "4px",
          border: "none",
          fontWeight: 700,
          cursor: "pointer",
          width: "100%",
          maxWidth: "200px"
        }}>
        {saving ? "Saving..." : "Save Workout"}
      </button>
    </form>
  );
}