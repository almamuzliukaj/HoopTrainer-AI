"use client";
import { useRef, useEffect, useState } from "react";
import { Protected } from "@/components/Protected";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

// ========== Toaster =============
function Toaster({ message, show, onHide }: { message: string; show: boolean; onHide: () => void }) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onHide, 2100);
      return () => clearTimeout(t);
    }
  }, [show, onHide]);
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: 44,
        transform: "translateX(-50%)",
        zIndex: 2000,
        pointerEvents: "none",
        opacity: show ? 1 : 0,
        transition: "opacity 0.36s cubic-bezier(.46,.03,.52,.96)",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg,#19e6be,#33aadd 120%)",
          color: "#00303a",
          fontWeight: 700,
          fontSize: 15.7,
          borderRadius: 15,
          padding: "11px 26px",
          boxShadow: "0px 4px 26px 0px #20fdd5c7,0px 1px 9px #0fbede1e",
          opacity: 0.94,
          letterSpacing: ".02em",
        }}
      >
        {message}
      </div>
    </div>
  );
}

// ===== NAVBAR =====
function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 30,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0 1rem", minHeight: 56, background: "rgba(24,31,49,0.98)",
      borderBottom: "1.7px solid var(--border)", boxShadow: "0 6px 18px rgba(36,58,90,0.12)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="mobile-menu-btn" onClick={onMenuClick} style={{
          background: "transparent", border: "none", color: "white",
          fontSize: 16, cursor: "pointer", padding: "4px 6px", display: "none", alignItems: "center"
        }}>☰</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, var(--accent), #3c7be0)",
            boxShadow: "0 6px 18px rgba(60,123,224,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, color: "#0f1524", fontSize: 17,
          }}>H</div>
          <span style={{
            fontWeight: 800, letterSpacing: 0.33, fontSize: 17.2, color: "white", display: "flex",
            alignItems: "baseline", gap: "3px"
          }}>
            HoopTrainer
            <span style={{
              color: "var(--accent-2)", fontWeight: 900, fontSize: "17.2px", marginLeft: "2.5px"
            }}>AI</span>
          </span>
        </div>
      </div>
      <Link href="/dashboard" style={{
        padding: "7px 18px", borderRadius: 8, border: "1.3px solid var(--accent-2)",
        background: "linear-gradient(135deg,rgba(79,201,189,0.07) 92%,#222e4b 100%)",
        color: "var(--accent-2)", fontWeight: 800, textDecoration: "none", fontSize: 14.9,
        boxShadow: "0 2px 6px rgba(79,201,189,0.065)", transition: "background 0.17s"
      }}>Dashboard</Link>
    </nav>
  );
}

type Conversation = { id: string; title: string; user_id?: string; created_at?: string };
type Message = { id: string; conversation_id: string; role: "user" | "ai"; content: string; created_at?: string };

export default function PlanPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeId, setActiveId] = useState<string | undefined>();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Modal and toast state
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [isRenameModal, setIsRenameModal] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toasterMsg, setToasterMsg] = useState('');
  const [toasterShow, setToasterShow] = useState(false);

  // New Chat input modal state:
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState("");

  function showToast(m: string) {
    setToasterMsg(m); setToasterShow(true);
  }

  // Touch/hold detection for mobile
  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const isTouchDevice = () =>
    typeof window !== "undefined" && (("ontouchstart" in window) || navigator.maxTouchPoints > 0);

  // Fetch conversations/messages
  useEffect(() => {
    (async () => {
      setLoadingConvs(true); setErr(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setConversations([]); setLoadingConvs(false); setErr("Not logged in!"); return; }
      const { data, error } = await supabase
        .from("conversations").select("*").eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) setErr(error.message || null);
      setConversations(data || []); setLoadingConvs(false);
      if (data?.length) setActiveId(a => a ?? data[0].id);
    })();
  }, []);
  useEffect(() => {
    if (!activeId) return;
    (async () => {
      setLoadingMsgs(true); setErr(null);
      const { data, error } = await supabase
        .from("messages").select("*").eq("conversation_id", activeId)
        .order("created_at", { ascending: true });
      if (error) setErr(error.message);
      setMessages(data || []); setLoadingMsgs(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: 99999 }), 120);
    })();
  }, [activeId]);

  // --- Main actions
  async function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    setSending(true); setErr(null);
    let convId = activeId;
    const { data: { user } } = await supabase.auth.getUser();
    const automaticTitle = input.length > 25 ? input.slice(0, 25) + "..." : input;
    if (!convId) {
      if (!user) { setErr("Not logged in!"); setSending(false); return; }
      const { data, error } = await supabase
        .from("conversations")
        .insert([{ user_id: user.id, title: automaticTitle || "Untitled" }])
        .select("*").single();
      if (error) { setErr(error.message); setSending(false); return; }
      convId = data.id;
      setConversations(cs => [{ ...data }, ...cs]);
      setActiveId(convId);
    } else {
      // If conversation exists, but has no title or is "Untitled", set name to the first user message.
      const convo = conversations.find(c => c.id === convId);
      if (convo && (!convo.title || convo.title.trim().toLowerCase() === "untitled" || convo.title.trim() === "")) {
        const { error } = await supabase
          .from("conversations")
          .update({ title: automaticTitle || "Untitled" })
          .eq("id", convId);
        if (!error)
          setConversations(cs => cs.map(c => c.id === convId ? { ...c, title: automaticTitle || "Untitled" } : c));
      }
    }

    // Insert user message right away
    const { error: err1 } = await supabase
      .from("messages").insert([{ conversation_id: convId, role: "user", content: input }]);
    if (err1) { setErr(err1.message); setSending(false); return; }
    setMessages(ms => [...ms, {
      id: Math.random().toString(32).slice(2),
      conversation_id: convId!, role: 'user', content: input, created_at: new Date().toISOString()
    }]);
    const promptToSend = input;
    setInput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptToSend }),
      });
      let aiMsg = "";
      if (!res.ok) {
        // THIS IS THE FIX: Show backend error message, no supabase insert for AI
        const data = await res.json();
        aiMsg = data.error || "AI failed to respond. Try again later.";
        setErr(aiMsg);
        showToast(aiMsg);
        setSending(false);
        return;
      } else {
        const data = await res.json();
        aiMsg = data.text || data.html || "AI didn't generate anything.";
        await supabase.from("messages")
          .insert([{ conversation_id: convId, role: "ai", content: aiMsg }]);
        setMessages(ms => [...ms, {
          id: Math.random().toString(32).slice(2),
          conversation_id: convId!, role: 'ai', content: aiMsg, created_at: new Date().toISOString()
        }]);
        showToast("AI response added");
      }
    } catch (e) {
      setErr("Network error");
      showToast("Error sending message.");
    } finally {
      setSending(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: 99999, behavior: "smooth" }), 200);
    }
  }

  async function realAddConversation(name: string) {
    setErr(null);
    setShowNewChatModal(false);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setErr("Not logged in!"); showToast("Not logged in."); return; }
    const { data, error } = await supabase
      .from("conversations")
      .insert([{ user_id: user.id, title: name || "Untitled" }])
      .select("*").single();
    if (error) { setErr(error.message); showToast("Failed to create chat."); return; }
    setConversations(cs => [{ ...data }, ...cs]);
    setActiveId(data.id);
    setMessages([]);
    setIsSidebarOpen(false);
    showToast("New chat created.");
    setNewChatName("");
  }

  // --- Rename logic (identical)
  async function doRename(id: string, value: string) {
    setIsRenameModal(false);
    setActionMenuId(null);
    const name = value.trim();
    if (!name) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setErr("Not logged in!"); showToast("Rename failed."); return; }
    const existing = conversations.find(c => c.id === id && c.user_id === user.id);
    if (!existing) { setErr("You can only rename your own chats."); showToast("Rename failed."); return; }
    const { error } = await supabase.from("conversations").update({ title: name }).eq("id", id).eq("user_id", user.id);
    if (!error) {
      const { data } = await supabase.from("conversations").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setConversations(data || []);
      showToast("Renamed!");
    } else {
      setErr("Rename failed: " + error.message); showToast("Rename failed.");
    }
  }
  // --- Actually delete, after confirmation
  async function actuallyDeleteConversation(id: string) {
    setConfirmDeleteId(null);
    setActionMenuId(null);
    setIsRenameModal(false);
    setErr(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setErr("Not logged in!"); showToast("Not logged in."); return; }
    const existing = conversations.find(c => c.id === id && c.user_id === user.id);
    if (!existing) { setErr("You can only delete your own chats."); showToast("Delete failed."); return; }
    await supabase.from("messages").delete().eq("conversation_id", id);
    const { error } = await supabase.from("conversations").delete().eq("id", id).eq("user_id", user.id);
    if (!error) {
      const { data } = await supabase.from("conversations").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setConversations(data || []);
      if (activeId === id) {
        setActiveId(data?.[0]?.id);
        setMessages([]);
      }
      showToast("Chat deleted.");
    } else {
      setErr("Delete failed: " + error.message); showToast("Delete failed.");
    }
  }

  // Modal/Sheet: Escape, overlay
  useEffect(() => {
    function esc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsRenameModal(false);
        setActionMenuId(null);
        setConfirmDeleteId(null);
        setShowNewChatModal(false);
      }
    }
    if (actionMenuId || isRenameModal || confirmDeleteId || showNewChatModal) {
      document.addEventListener("keydown", esc);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    }
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [actionMenuId, isRenameModal, confirmDeleteId, showNewChatModal]);

  // Overlay for closing sidebar by clicking outside it
  function SidebarOverlay() {
    if (!isSidebarOpen) return null;
    return (
      <div
        onClick={() => setIsSidebarOpen(false)}
        style={{
          position: "fixed", zIndex: 49, inset: 0,
          background: "rgba(8,13,22,0.24)",
          cursor: "pointer"
        }}
        aria-label="Close sidebar"
      />
    );
  }

  // New Chat Modal
  function renderNewChatModal() {
    if (!showNewChatModal) return null;
    return (
      <>
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1020,
            background: "rgba(12,18,27,0.55)"
          }} onClick={() => {setShowNewChatModal(false); setNewChatName("");}} />
        <div
          style={{
            position: "fixed", left: "50%", top: "50%",
            transform: "translate(-50%,-50%)",
            zIndex: 1025,
            background: "#18212c",
            minWidth: 330,
            borderRadius: 21,
            padding: "32px 24px 19px 24px",
            boxShadow: "0 10px 32px rgba(44,252,208,.13), 0 2px 12px #0e161d8a",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 21
          }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: "#27ffd1",
              marginBottom: 2
            }}
          >Name your chat</div>
          <input
            autoFocus
            value={newChatName}
            onChange={e => setNewChatName(e.target.value)}
            placeholder="e.g. Shooting drills for 3-point improvement"
            style={{
              border: "1.4px solid #36d4c6",
              background: "#232b3a", color: "#dbfff3", fontWeight: 700,
              borderRadius: 8, fontSize: 15.7, padding: "11px 8px",
              marginBottom: 7, width: "100%", maxWidth: 240,
              outline: "none"
            }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                realAddConversation(newChatName.trim());
              }
            }}
          />
          <div style={{ display: "flex", gap: 14 }}>
            <button
              onClick={() => realAddConversation(newChatName.trim())}
              style={{
                padding: "8px 28px", background: "linear-gradient(123deg, #20e9c9 80%, #146db6 100%)",
                color: "#212d2d", border: "none", borderRadius: 7, fontWeight: 900, fontSize: 15
              }}
            >Create</button>
            <button
              onClick={() => {setShowNewChatModal(false); setNewChatName("");}}
              style={{
                padding: "8px 18px", background: "#293040",
                color: "#76cacc", border: "none", borderRadius: 7, fontWeight: 900, fontSize: 15
              }}
            >Cancel</button>
          </div>
        </div>
      </>
    );
  }

  function renderActionMenu() {
    if (!actionMenuId) return null;
    const c = conversations.find(x => x.id === actionMenuId);
    if (!c) return null;
    const displayName = c.title?.trim() ? c.title : "Untitled";
    return (
      <>
        <div style={{
          position: "fixed", inset: 0, zIndex: 1001, background: "rgba(12,18,27,0.45)",
          display: "flex", justifyContent: "center", alignItems: "center"
        }} onClick={() => setActionMenuId(null)} />
        <div style={{
          position: "fixed", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
          zIndex: 1002, background: "#212d43", boxShadow: "0 10px 38px -8px #121b26",
          borderRadius: 20, minWidth: 300, maxWidth: 97, minHeight: 158, padding: "30px 28px 12px 28px",
          display: "flex", flexDirection: "column", alignItems: "stretch", gap: 12
        }}>
          <div style={{
            fontWeight: 700, color: "#24f0c6", fontSize: 16, marginBottom: 10, textAlign: "center", letterSpacing: ".01em",
            textShadow: "0px 2px 16px #1861494d"
          }}>{displayName}</div>
          <button
            onClick={() => { setIsRenameModal(true); setActionMenuId(null); setRenameValue(displayName); }}
            style={{
              background: "#1e283a", color: "#baf7ea", border: "none",
              borderRadius: 7, fontWeight: 900, fontSize: 16, padding: "13px 3px", marginBottom: 4,
              boxShadow: "0 1px 8px #00d7b22e", outline: "none", transition: ".13s"
            }}
          >Rename Conversation</button>
          <button
            onClick={() => { setConfirmDeleteId(c.id); setActionMenuId(null);} }
            style={{
              background: "#281a20", color: "#ff7e7e", border: "none",
              borderRadius: 7, fontWeight: 900, fontSize: 16, padding: "13px 3px"
            }}
          >Delete</button>
          <button
            onClick={() => setActionMenuId(null)}
            style={{
              background: "none", color: "#7eced6", border: "none", fontSize: 15, padding: 10, marginTop: 3
            }}
          >Cancel</button>
        </div>
      </>
    );
  }

  function renderRenameModal() {
    if (!isRenameModal) return null;
    const c = conversations.find(x => x.id === activeId);
    return (
      <>
        <div style={{
          position: "fixed", inset: 0, zIndex: 2001, background: "rgba(20,32,48,0.56)"
        }} onClick={() => setIsRenameModal(false)}/>
        <div style={{
          position: "fixed", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
          zIndex: 2002, background: "#222a36", boxShadow: "0 10px 38px -8px #121b26", borderRadius: 18,
          minWidth: 335, maxWidth: 97, minHeight: 158, padding: "35px 22px 24px 22px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 15
        }}>
          <div style={{
            color: "#21e0ac", fontWeight: 800, fontSize: 18, letterSpacing: ".001em", marginBottom: 0
          }}>Rename Conversation</div>
          <input
            autoFocus
            placeholder="New conversation name"
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            style={{
              padding: "12px 10px", fontSize: 15, borderRadius: 10, border: "1.5px solid #29f1d1",
              background: "#1a2448", color: "#d4ffe1", fontWeight: 700, marginBottom: 6, outline: "none", minWidth: 210
            }}
            onKeyDown={(e) => { if (e.key === "Enter") doRename(activeId!, renameValue); }}
          />
          <div style={{ display: "flex", gap: 16 }}>
            <button
              onClick={() => doRename(activeId!, renameValue)}
              style={{
                padding: "8px 26px", background: "linear-gradient(135deg, #15f7c1 80%, #168ad1 120%)",
                border: "none", borderRadius: 8, color: "#003d37", fontWeight: 900, fontSize: 15
              }}>Rename</button>
            <button
              onClick={() => setIsRenameModal(false)}
              style={{
                padding: "8px 20px", background: "#1f2326",
                border: "none", borderRadius: 8, color: "#7bc8ce", fontWeight: 800, fontSize: 15
              }}>Cancel</button>
          </div>
        </div>
      </>
    );
  }

  function renderDeleteConfirmModal() {
    if (!confirmDeleteId) return null;
    const c = conversations.find(x => x.id === confirmDeleteId);
    return (
      <>
        <div style={{
          position: "fixed", inset: 0, zIndex: 3001, background: "rgba(30,38,46,.6)"
        }} onClick={() => setConfirmDeleteId(null)}/>
        <div style={{
          position: "fixed", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
          zIndex: 3002, background: "#232b38", boxShadow: "0 12px 40px -8px #121b26",
          borderRadius: 22, minWidth: 345, padding: "36px 28px 22px 28px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 20
        }}>
          <div style={{
            color: "#ff6a82", fontWeight: 900, fontSize: 19, letterSpacing: ".01em", marginBottom: 2,
            textShadow: "0px 2px 10px #7d354d38"
          }}>
            Delete chat?
          </div>
          <div style={{ color: "#c2e5e0", fontSize: 15.5, marginBottom: 3, textAlign: "center" }}>
            Are you sure you want to delete <span style={{fontWeight:800,color:"#27eed7"}}>{c?.title || "this chat"}</span>?
            <br/>This can’t be undone.
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <button
              onClick={() => actuallyDeleteConversation(confirmDeleteId)}
              style={{
                padding: "10px 30px", background: "linear-gradient(100deg, #ff366a 60%, #f27c66 120%)",
                border: "none", borderRadius: 8, color: "#ffeef7", fontWeight: 900, fontSize: 15, boxShadow: "0 1px 11px #f2105e31"
              }}>
              Delete
            </button>
            <button
              onClick={() => setConfirmDeleteId(null)}
              style={{
                padding: "10px 18px", background: "#181b33",
                border: "none", borderRadius: 8, color: "#b6cddb", fontWeight: 800, fontSize: 15
              }}>
              Cancel
            </button>
          </div>
        </div>
      </>
    );
  }

  function renderConversationRow(c: Conversation) {
    const displayName = c.title?.trim() ? c.title : "Untitled";
    const isActive = activeId === c.id;
    function handleTouchStart(e: React.TouchEvent) {
      if (holdTimer.current) clearTimeout(holdTimer.current);
      holdTimer.current = setTimeout(() => { setActionMenuId(c.id); }, 500);
    }
    function handleTouchEnd() { if (holdTimer.current) clearTimeout(holdTimer.current); }
    function handleTouchMove() { if (holdTimer.current) clearTimeout(holdTimer.current); }
    return (
      <div
        key={c.id}
        style={{
          display: "flex", alignItems: "center", background: isActive ? "rgba(48,189,186, 0.15)" : "transparent",
          border: isActive ? "1.5px solid var(--accent-2)" : "1.5px solid transparent",
          borderRadius: 8, position: "relative", padding: "10px 8px",
          fontWeight: 500, fontSize: "14.5px", color: isActive ? "var(--accent-2)" : "var(--text)",
          cursor: "pointer", transition: "all 0.13s", userSelect: "none"
        }}
        onClick={() => { setActiveId(c.id); setErr(null); }}
        onTouchStart={isTouchDevice() ? handleTouchStart : undefined}
        onTouchEnd={isTouchDevice() ? handleTouchEnd : undefined}
        onTouchMove={isTouchDevice() ? handleTouchMove : undefined}
      >
        <span style={{
          flex: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
          paddingRight: 5, fontWeight: isActive ? 700 : 500
        }} title={displayName}>{displayName}</span>
        <div style={{ position: "relative", zIndex: 65 }}>
          <button
            onClick={e => { e.stopPropagation(); setActionMenuId(c.id); }}
            style={{
              background: "none", border: "none", color: isActive ? "var(--accent-2)" : "#6b7dab",
              fontSize: 18, cursor: "pointer", padding: "0 4px", lineHeight: 1
            }}
            title="Options"
            tabIndex={0}
          >⋮</button>
        </div>
      </div>
    );
  }

  return (
    <Protected>
      <Toaster message={toasterMsg} show={toasterShow} onHide={() => setToasterShow(false)} />
      {actionMenuId && renderActionMenu()}
      {isRenameModal && renderRenameModal()}
      {renderDeleteConfirmModal()}
      {renderNewChatModal()}
      <SidebarOverlay />
      <div style={{ background: "linear-gradient(135deg, #181f2f 80%, #232f44 100%)", minHeight: "100vh" }}>
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div style={{
          display: "flex", alignItems: "stretch",
          height: "calc(100vh - 56px)", maxWidth: 1240, margin: "0 auto", width: "100%", position: "relative"
        }}>
          <aside className={`app-sidebar ${isSidebarOpen ? "open" : ""}`} style={{
            flex: "0 0 240px", maxWidth: 340, minWidth: 240,
            background: "rgba(17,23,38,0.993)", borderRadius: "14px 0 0 14px",
            boxShadow: "0 4px 29px rgba(26,189,155,0.07)",
            padding: "19px 12px 8px 17px", borderRight: "1.4px solid var(--border)",
            overflowY: "auto", display: "flex", flexDirection: "column", gap: 0, transition: "transform 0.3s ease"
          }}>
            <div style={{
              marginBottom: 20, display: "flex", alignItems: "center", gap: 9, justifyContent: "space-between"
            }}>
              <span style={{
                fontWeight: 900, fontSize: 21, color: 'var(--accent-2)',
                letterSpacing: '.06em', marginLeft: 2
              }}>Recents</span>
              <button
                onClick={() => setShowNewChatModal(true)}
                title="Create a new chat"
                style={{
                  background: "linear-gradient(126deg, var(--accent-2), #328ec8 85%)",
                  color: "#0f1524", fontWeight: 800, fontSize: 13.5,
                  borderRadius: 16, border: 'none', padding: "6px 14px",
                  cursor: "pointer", boxShadow: "0 2px 7px rgba(77,211,201,0.15)",
                  display: "flex", alignItems: "center", gap: 4, transition: "filter 0.15s"
                }}>
                  <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New
              </button>
            </div>
            {loadingConvs && <div style={{ color: "var(--muted)", marginLeft: 2 }}>Loading…</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {conversations.map(c => renderConversationRow(c))}
            </div>
            {!loadingConvs && conversations.length === 0 && (
              <div style={{
                color: "var(--muted)", fontWeight: 500, padding: "20px 4px 8px", textAlign: "center", fontSize: 14.2
              }}>No chat history yet.</div>
            )}
          </aside>
          {/* === CHAT PANEL === */}
          <section style={{
            flex: 1,
            background: "linear-gradient(128deg,#191f2b 50%,#222b38 98%)",
            borderRadius: "0 14px 14px 0",
            boxShadow: "0 8px 48px rgba(93,230,170,0.08), 0 1px 10px rgba(60,123,224,0.045)",
            display: "flex", flexDirection: "column", position: "relative", minWidth: 0,
            height: "calc(100vh - 56px)", overflow: "hidden"
          }}>
            {/* CHAT */}
            <div ref={scrollRef} style={{
              flex: "1 1 0", overflowY: "auto", WebkitOverflowScrolling: "touch",
              display: "flex", flexDirection: "column", minHeight: 0
            }}>
              <div style={{
                maxWidth: 750, margin: "0 auto", display: "flex", flexDirection: "column",
                gap: 13, padding: "7px 16px", width: "100%"
              }}>
                {!activeId && <div style={{
                  color: "var(--muted)", padding: 38, textAlign: "center", fontSize: 16
                }}>Start a new conversation by clicking “+ New”</div>}
                {loadingMsgs && <div style={{ color: "var(--muted)", fontWeight: 700 }}>Loading…</div>}
                {messages.map(msg =>
                  <div key={msg.id} style={{
                    display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
                  }}>
                    <div style={{
                      maxWidth: "85vw", minWidth: 88,
                      borderRadius: msg.role === "user" ? "12px 12px 3px 14px" : "11px 12px 13px 3px",
                      boxShadow: msg.role === "user"
                        ? "0 2px 9px rgba(48,182,140,0.09)"
                        : "0 2px 8px rgba(60,123,224,0.06)",
                      background: msg.role === "user"
                        ? "linear-gradient(122deg,#2aefd2 80%, #245e74 160%)"
                        : "linear-gradient(124deg,#212b3d 70%,#194b68 105%)",
                      color: "#eff9fb",
                      padding: "12px 13px 10px 14px",
                      marginLeft: msg.role === "user" ? "auto" : undefined,
                      marginRight: msg.role === "ai" ? "auto" : undefined,
                      fontSize: 14.8, fontWeight: 500, lineHeight: 1.59, letterSpacing: ".01em",
                      transition: "background 0.13s"
                    }}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 7, marginBottom: 3,
                        color: msg.role === "user" ? "#011a19" : "var(--accent-2)",
                        fontWeight: 700, fontSize: 12
                      }}>
                        <span>{msg.role === "user" ? "You" : "AI"}</span>
                        <span style={{
                          color: "#89b1ba", fontWeight: 500, fontSize: 11.4, marginLeft: 5
                        }}>{msg.created_at ? new Date(msg.created_at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : ""}</span>
                      </div>
                      <span
                        style={{ fontSize: 14.8, fontFamily: "inherit", display: "inline-block", wordBreak: "break-word" }}
                        dangerouslySetInnerHTML={{
                          __html: msg.content.replace(/\n/g, "<br>")
                        }}
                      />
                    </div>
                  </div>
                )}
                {sending &&
                  <div style={{ display: "flex", margin: "0 0 0 auto" }}>
                    <div style={{
                      background: "linear-gradient(135deg,#13bfa5,#4fc9bd 85%)",
                      color: "#1d424f", fontWeight: 700, fontSize: 13,
                      padding: "8px 14px", borderRadius: "13px 11px 2px 14px",
                      minWidth: 60,
                    }}>AI is formulating…</div>
                  </div>}
                {err && <div style={{ color: "var(--error)", fontWeight: 650, fontSize: 14, padding: 7 }}>{err}</div>}
              </div>
            </div>
            {activeId && (
              <div style={{ padding: "0 14px 27px 14px" }}>
                <form onSubmit={handleSend} style={{
                  maxWidth: 750, margin: "0 auto", padding: "13px 12px 22px 12px", borderRadius: 14,
                  border: "1.3px solid var(--border)", background: "rgba(16,22,37,0.97)",
                  display: "flex", alignItems: "flex-end", gap: 10,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
                }}>
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your request, goal or constraint..."
                    style={{ flex: "1 1 auto", padding: "9px 4px", minHeight: 28, maxHeight: 110,
                      border: "none", background: "transparent", color: "#ecf8fb", fontSize: 15.4,
                      fontWeight: 500, boxShadow: "none", resize: "none", lineHeight: 1.52, fontFamily: "inherit",
                      outline: "none"
                    }}
                    disabled={sending} rows={1} required
                    onKeyDown={e => {
                      if (e.key === "Enter" && !e.shiftKey && !sending) {
                        e.preventDefault(); handleSend();
                      }
                    }}
                  />
                  <button type="submit" disabled={sending || !input.trim()} style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flex: "0 0 32px", height: 32, borderRadius: "50%",
                    background: "linear-gradient(137deg,#13bfa5,#4fc9bd 120%)",
                    color: "#022923", border: "none", boxShadow: "0 2px 7px rgba(34,208,189,0.13)",
                    cursor: sending ? "not-allowed" : "pointer", marginBottom: 2
                  }} aria-label="Send">
                    <svg width="14" height="14" fill="none" viewBox="0 0 20 20"><path
                      d="M4 10h7M10.7 4.3l4.3 4.2c.4.4.4 1 0 1.4l-4.3 4.2"
                      stroke="#08514a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
        <style>{`
        @media (max-width: 880px) {
          .mobile-menu-btn { display: flex !important; }
          .app-sidebar {
            position: fixed;
            left: 0; top: 56px; height: calc(100vh - 56px); z-index: 50;
            transform: translateX(-100%);
          }
          .app-sidebar.open { transform: translateX(0); }
        }
        @media (max-width:610px) {
          section { border-radius: 0 !important; }
          nav { padding:0 8px!important; min-height:48px!important;}
        }
        `}</style>
      </div>
    </Protected>
  );
}