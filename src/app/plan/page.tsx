"use client";
import { useRef, useEffect, useState } from "react";
import { Protected } from "@/components/Protected";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

// Simple mobile check (if want to use window instead, see note below)
const isTouchDevice = () =>
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

type Conversation = { id: string; title: string; user_id?: string; created_at?: string };
type Message = { id: string; conversation_id: string; role: "user" | "ai"; content: string; created_at?: string };

// ===== NAVBAR =====
function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 30, display: "flex", justifyContent: "space-between", alignItems: "center",
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

  // Menu/UX state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // For desktop: which chat id menu is open
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  // For mobile: which chat id is "held" and is bottomsheet open
  const [mobileMenuId, setMobileMenuId] = useState<string | null>(null);

  // Touch/hold detection
  const holdTimer = useRef<NodeJS.Timeout | null>(null);

  // Fetch conversations on mount
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

  // Fetch messages upon activeId
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
        .insert([{ user_id: user.id, title: automaticTitle }])
        .select("*").single();
      if (error) { setErr(error.message); setSending(false); return; }
      convId = data.id;
      setConversations(cs => [{ ...data }, ...cs]);
      setActiveId(convId);
    }

    const { error: err1 } = await supabase
      .from("messages")
      .insert([{ conversation_id: convId, role: "user", content: input }]);
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
      if (!res.ok) aiMsg = "AI failed to respond. Try again later.";
      else {
        const data = await res.json();
        aiMsg = data.text || data.html || "AI didn't generate anything.";
      }
      await supabase.from("messages")
        .insert([{ conversation_id: convId, role: "ai", content: aiMsg }]);
      setMessages(ms => [...ms, {
        id: Math.random().toString(32).slice(2),
        conversation_id: convId!, role: 'ai', content: aiMsg, created_at: new Date().toISOString()
      }]);
    } catch (e) {
      setErr("Network error");
    } finally {
      setSending(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: 99999, behavior: "smooth" }), 200);
    }
  }

  async function addConversation() {
    setErr(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setErr("Not logged in!"); return; }
    const { data, error } = await supabase
      .from("conversations")
      .insert([{ user_id: user.id, title: "New Chat" }])
      .select("*").single();
    if (error) { setErr(error.message); return; }
    setConversations(cs => [{ ...data }, ...cs]);
    setActiveId(data.id);
    setMessages([]);
    setIsSidebarOpen(false);
  }

  // --- Rename & Delete logic, universal for mobile & desktop
  async function renameConversation(id: string, currentName: string) {
    const newName = window.prompt("Rename chat:", currentName);
    setMenuOpenId(null); setMobileMenuId(null); // close any open menu
    if (!newName || !newName.trim() || newName === currentName) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setErr("Not logged in!"); return; }
    const existing = conversations.find(c => c.id === id && c.user_id === user.id);
    if (!existing) { setErr("You can only rename your own chats."); return; }
    const { error } = await supabase.from("conversations").update({ title: newName.trim() }).eq("id", id).eq("user_id", user.id);
    if (!error) {
      // Refetch conversations for safety!
      const { data } = await supabase.from("conversations").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setConversations(data || []);
    } else {
      setErr("Rename failed: " + error.message);
    }
  }

  async function deleteConversation(id: string) {
    const isConfirmed = window.confirm("Are you sure you want to delete this chat?");
    setMenuOpenId(null); setMobileMenuId(null);
    if (!isConfirmed) return;
    setErr(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setErr("Not logged in!"); return; }
    const existing = conversations.find(c => c.id === id && c.user_id === user.id);
    if (!existing) { setErr("You can only delete your own chats."); return; }
    await supabase.from("messages").delete().eq("conversation_id", id);
    const { error } = await supabase.from("conversations").delete().eq("id", id).eq("user_id", user.id);
    if (!error) {
      const { data } = await supabase.from("conversations").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setConversations(data || []);
      if (activeId === id) {
        setActiveId(data?.[0]?.id);
        setMessages([]);
      }
    } else {
      setErr("Delete failed: " + error.message);
    }
  }

  // --- Hamburger/bottom-sheet for mobile: block touch scroll on sheet open
  useEffect(() => {
    if (mobileMenuId) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [mobileMenuId]);

  // --- Sidebar rendering (mobile & desktop behaviors)
  function renderConversationRow(c: Conversation) {
    // Desktop: click 3 dots for menu, mobile: hold for sheet
    const displayName = c.title?.trim() ? c.title : (messages.find(m => m.conversation_id === c.id)?.content?.slice(0, 25) ?? "New Chat");
    const isActive = activeId === c.id;

    // --- Handlers for touch/hold
    function handleTouchStart(e: React.TouchEvent) {
      if (holdTimer.current) clearTimeout(holdTimer.current);
      holdTimer.current = setTimeout(() => { setMobileMenuId(c.id); }, 480); // ~0.5s
    }
    function handleTouchEnd() { if (holdTimer.current) clearTimeout(holdTimer.current); }
    function handleTouchMove() { if (holdTimer.current) clearTimeout(holdTimer.current); }
    
    return (
      <div
        key={c.id}
        style={{
          display: "flex", alignItems: "center",
          background: isActive ? "rgba(48,189,186, 0.15)" : "transparent",
          border: isActive ? "1.5px solid var(--accent-2)" : "1.5px solid transparent",
          borderRadius: 8, position: "relative", padding: "10px 8px",
          fontWeight: 500, fontSize: "14.5px",
          color: isActive ? "var(--accent-2)" : "var(--text)",
          cursor: "pointer", transition: "all 0.13s",
          userSelect: "none"
        }}
        onClick={() => {
          setActiveId(c.id);
          setErr(null);
          setIsSidebarOpen(false);
        }}
        // For touch: long hold for menu, otherwise ignore touches.
        onTouchStart={e => {
          if (isTouchDevice()) handleTouchStart(e);
        }}
        onTouchEnd={e => {
          if (isTouchDevice()) handleTouchEnd();
        }}
        onTouchMove={e => {
          if (isTouchDevice()) handleTouchMove();
        }}
      >
        <span style={{
          flex: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
          paddingRight: 5, fontWeight: isActive ? 700 : 500
        }} title={displayName}>{displayName}</span>
        {/* Desktop: three-dots menu */}
        {!isTouchDevice() && (
          <div style={{ position: "relative", zIndex: 65 }}>
            <button
              onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === c.id ? null : c.id); }}
              style={{
                background: "none", border: "none",
                color: isActive ? "var(--accent-2)" : "#6b7dab",
                fontSize: 18, cursor: "pointer", padding: "0 4px",
                lineHeight: 1
              }}
              title="Options"
            >⋮</button>
            {menuOpenId === c.id && (
              <div style={{
                position: "absolute", right: 0, top: 24,
                background: "#1e2738", border: "1px solid var(--border)",
                borderRadius: 8, display: "flex", flexDirection: "column",
                minWidth: 100, boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
                overflow: "hidden", zIndex: 70
              }}>
                <button 
                  onClick={e => { e.stopPropagation(); renameConversation(c.id, displayName); }}
                  style={{
                    padding: "10px 14px", border: "none", background: "none",
                    color: "white", textAlign: "left", cursor: "pointer",
                    fontSize: 13.5, borderBottom: "1px solid var(--border)"
                  }}>Rename</button>
                <button 
                  onClick={e => { e.stopPropagation(); deleteConversation(c.id); }}
                  style={{
                    padding: "10px 14px", border: "none", background: "none",
                    color: "#ff5e5e", textAlign: "left", cursor: "pointer",
                    fontSize: 13.5
                  }}>Delete</button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // --- Hamburger sheet menu (mobile only)
  function renderMobileMenu() {
    if (!mobileMenuId) return null;
    const c = conversations.find(x => x.id === mobileMenuId);
    if (!c) return null;
    const displayName = c.title?.trim() ? c.title : "New Chat";
    return (
      <>
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: "rgba(0,0,0,0.40)"
        }} onClick={() => setMobileMenuId(null)} />
        <div style={{
          position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1000,
          background: "#19213a", borderTopLeftRadius: 18, borderTopRightRadius: 18,
          boxShadow: "0 -8px 32px rgba(0,0,0,.31)", minHeight: 136,
          padding: "18px 24px 12px 24px", display: "flex", flexDirection: "column", alignItems: "stretch", gap: 10
        }}>
          <div style={{ fontWeight: 700, color: "#79e9d8", fontSize: 16, marginBottom: 2, textAlign: "left" }}>{displayName}</div>
          <button
            onClick={() => renameConversation(c.id, displayName)}
            style={{
              background: "#333c5a", color: "white", border: "none",
              borderRadius: 7, fontWeight: 800, fontSize: 15, padding: "10px 3px", marginBottom: 4
            }}
          >Rename</button>
          <button
            onClick={() => deleteConversation(c.id)}
            style={{
              background: "#302d32", color: "#ef5858", border: "none",
              borderRadius: 7, fontWeight: 900, fontSize: 15, padding: "10px 3px"
            }}
          >Delete</button>
          <button
            onClick={() => setMobileMenuId(null)}
            style={{
              background: "none", color: "#89b1ba", border: "none", fontSize: 15, padding: 8, marginTop: 3
            }}
          >Cancel</button>
        </div>
      </>
    );
  }

  return (
    <Protected>
      {(menuOpenId || mobileMenuId) && (
        <div onClick={() => { setMenuOpenId(null); setMobileMenuId(null); }}
          style={{ position: "fixed", inset: 0, zIndex: 60 }}
        />
      )}
      {isSidebarOpen && (
        <div className="mobile-overlay" onClick={() => setIsSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }}
        />
      )}

      <div style={{ background: "linear-gradient(135deg, #181f2f 80%, #232f44 100%)", minHeight: "100vh" }}>
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div style={{
          display: "flex", alignItems: "stretch",
          height: "calc(100vh - 56px)", maxWidth: 1240, margin: "0 auto", width: "100%", position: "relative"
        }}>
          {/* === SIDEBAR === */}
          <aside className={`app-sidebar ${isSidebarOpen ? "open" : ""}`} style={{
            flex: "0 0 240px", maxWidth: 340, minWidth: 240,
            background: "rgba(17,23,38,0.993)", borderRadius: "14px 0 0 14px",
            boxShadow: "0 4px 29px rgba(26,189,155,0.07)",
            padding: "19px 12px 8px 17px", borderRight: "1.4px solid var(--border)",
            overflowY: "auto",
            display: "flex", flexDirection: "column", gap: 0,
            transition: "transform 0.3s ease"
          }}>
            <div style={{
              marginBottom: 20, display: "flex", alignItems: "center", gap: 9, justifyContent: "space-between"
            }}>
              <span style={{
                fontWeight: 900, fontSize: 21, color: 'var(--accent-2)',
                letterSpacing: '.06em', marginLeft: 2
              }}>Recents</span>
              <button
                onClick={addConversation}
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
          {/* --- Render hamburger/bottomsheet menu (mobile only) */}
          {renderMobileMenu()}
          {/* === CHAT PANEL === */}
          <section style={{
            flex: 1, background: "linear-gradient(128deg,#191f2b 50%,#222b38 98%)",
            borderRadius: "0 14px 14px 0",
            boxShadow: "0 8px 48px rgba(93,230,170,0.08), 0 1px 10px rgba(60,123,224,0.045)",
            display: "flex", flexDirection: "column", position: "relative", minWidth: 0
          }}>
            {/* CHAT */}
            <div ref={scrollRef} style={{
              flex: "1 1 0", padding: "23px 0 10px 0", overflowY: "auto",
              display: "flex", flexDirection: "column"
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
                      maxWidth: "85%", minWidth: 88,
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
              <div style={{ padding: "0 14px 14px 14px" }}>
                <form onSubmit={handleSend} style={{
                  maxWidth: 750, margin: "0 auto", padding: "10px 12px", borderRadius: 14,
                  border: "1.3px solid var(--border)", background: "rgba(16,22,37,0.97)",
                  display: "flex", alignItems: "flex-end", gap: 10,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
                }}>
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your request, goal or constraint..."
                    style={{ flex: "1 1 auto", padding: "8px 4px", minHeight: 24, maxHeight: 110,
                      border: "none", background: "transparent", color: "#ecf8fb", fontSize: 15.4,
                      fontWeight: 500, boxShadow: "none", resize: "none", lineHeight: 1.45, fontFamily: "inherit",
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
            left: 0;
            top: 56px;
            height: calc(100vh - 56px);
            z-index: 50;
            transform: translateX(-100%);
          }
          .app-sidebar.open {
            transform: translateX(0);
          }
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