"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import BrandMark from "@/components/BrandMark";
import { Protected } from "@/components/Protected";
import { supabase } from "@/lib/supabaseClient";
import {
  buildPlayerProfileHighlights,
  hasPlayerProfile,
  normalizePlayerProfile,
  type PlayerProfile,
} from "@/lib/playerProfile";

type Conversation = {
  id: string;
  title: string;
  user_id?: string;
  created_at?: string;
};

type Message = {
  id: string;
  conversation_id: string;
  role: "user" | "ai";
  content: string;
  created_at?: string;
};

type ApiChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const QUICK_PROMPTS = [
  "Build me a 45-minute shooting workout for today.",
  "Create a 4-day basketball training plan for this week.",
  "Give me a vertical jump session with warm-up and cooldown.",
  "Make a ball handling workout I can do alone on court.",
];

function buildSavedPlanTitle(content: string) {
  const firstMeaningfulLine = content
    .split("\n")
    .map((line) => line.replace(/^#+\s*/, "").replace(/[*_`]/g, "").trim())
    .find((line) => line.length > 0);

  if (!firstMeaningfulLine) return "Saved AI training plan";
  return firstMeaningfulLine.length > 64 ? `${firstMeaningfulLine.slice(0, 61)}...` : firstMeaningfulLine;
}

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p style={{ margin: "0 0 0.8rem", lineHeight: 1.72 }}>{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul style={{ margin: "0.35rem 0 0.85rem", paddingLeft: "1.2rem" }}>{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol style={{ margin: "0.35rem 0 0.85rem", paddingLeft: "1.2rem" }}>{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li style={{ marginBottom: "0.35rem" }}>{children}</li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong style={{ color: "#f7fbff" }}>{children}</strong>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code
      style={{
        background: "rgba(255,255,255,0.08)",
        padding: "0.14rem 0.35rem",
        borderRadius: 6,
        fontSize: "0.92em",
      }}
    >
      {children}
    </code>
  ),
};

function Toaster({
  message,
  show,
  onHide,
}: {
  message: string;
  show: boolean;
  onHide: () => void;
}) {
  useEffect(() => {
    if (!show) return;
    const timeout = setTimeout(onHide, 2200);
    return () => clearTimeout(timeout);
  }, [show, onHide]);

  return (
    <div className={`planner-toast${show ? " is-visible" : ""}`}>
      <div className="planner-toast-pill">{message}</div>
    </div>
  );
}

function Navbar({
  onMenuClick,
  isMenuOpen,
}: {
  onMenuClick: () => void;
  isMenuOpen: boolean;
}) {
  return (
    <nav className="planner-topbar">
      <div className="planner-topbar-left">
        <button
          type="button"
          className={`planner-menu-button${isMenuOpen ? " is-open" : ""}`}
          onClick={onMenuClick}
          aria-label={isMenuOpen ? "Close conversations" : "Open conversations"}
          aria-expanded={isMenuOpen}
        >
          <svg width={27} height={27} viewBox="0 0 27 27" fill="none" aria-hidden="true">
            <rect x="5.5" y="8" width="16" height="2.6" rx="1.3" fill="var(--accent)" />
            <rect x="5.5" y="13" width="16" height="2.6" rx="1.3" fill="var(--accent-2)" />
            <rect x="5.5" y="18" width="16" height="2.6" rx="1.3" fill="var(--muted)" />
          </svg>
        </button>
        <BrandMark size="sm" />
      </div>
      <div className="planner-topbar-right">
        <Link href="/dashboard" className="planner-dashboard-link">
          Dashboard
        </Link>
      </div>
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
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>({});
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [isRenameModal, setIsRenameModal] = useState(false);
  const [renameTargetId, setRenameTargetId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toasterMsg, setToasterMsg] = useState("");
  const [toasterShow, setToasterShow] = useState(false);
  const [savingPlanId, setSavingPlanId] = useState<string | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);

  const isTouchDevice = () =>
    typeof window !== "undefined" && (("ontouchstart" in window) || navigator.maxTouchPoints > 0);

  function showToast(message: string) {
    setToasterMsg(message);
    setToasterShow(true);
  }

  function startNewChatDraft(nextPrompt = "") {
    setActiveId(undefined);
    setMessages([]);
    setErr(null);
    setInput(nextPrompt);
    setIsSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 40);
  }

  function handleQuickPrompt(prompt: string) {
    startNewChatDraft(prompt);
  }

  useEffect(() => {
    (async () => {
      setLoadingConvs(true);
      setErr(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setConversations([]);
        setLoadingConvs(false);
        setErr("Not logged in!");
        return;
      }

      setPlayerProfile(normalizePlayerProfile(user.user_metadata?.playerProfile));

      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) setErr(error.message || null);

      setConversations(data || []);
      setLoadingConvs(false);
      setActiveId(undefined);
      setMessages([]);
    })();
  }, []);

  useEffect(() => {
    if (!activeId) return;

    (async () => {
      setLoadingMsgs(true);
      setErr(null);

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", activeId)
        .order("created_at", { ascending: true });

      if (error) setErr(error.message);
      setMessages(data || []);
      setLoadingMsgs(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: 99999 }), 80);
    })();
  }, [activeId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const viewport = window.visualViewport;

    function syncViewportHeight() {
      const nextHeight = viewport?.height ?? window.innerHeight;
      root.style.setProperty("--planner-vvh", `${nextHeight}px`);
    }

    syncViewportHeight();

    if (viewport) {
      viewport.addEventListener("resize", syncViewportHeight);
      viewport.addEventListener("scroll", syncViewportHeight);
    } else {
      window.addEventListener("resize", syncViewportHeight);
    }

    return () => {
      if (viewport) {
        viewport.removeEventListener("resize", syncViewportHeight);
        viewport.removeEventListener("scroll", syncViewportHeight);
      } else {
        window.removeEventListener("resize", syncViewportHeight);
      }
      root.style.removeProperty("--planner-vvh");
    };
  }, []);

  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  }, [input]);

  useEffect(() => {
    function onEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setIsRenameModal(false);
      setActionMenuId(null);
      setConfirmDeleteId(null);
      setShowNewChatModal(false);
      setRenameTargetId(null);
    }

    if (actionMenuId || isRenameModal || confirmDeleteId || showNewChatModal) {
      document.addEventListener("keydown", onEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [actionMenuId, isRenameModal, confirmDeleteId, showNewChatModal]);

  async function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (sending || !input.trim()) return;

    setSending(true);
    setErr(null);

    let convId = activeId;
    const { data: { user } } = await supabase.auth.getUser();
    const automaticTitle = input.length > 25 ? `${input.slice(0, 25)}...` : input;

    if (!convId) {
      if (!user) {
        setErr("Not logged in!");
        setSending(false);
        return;
      }

      const { data, error } = await supabase
        .from("conversations")
        .insert([{ user_id: user.id, title: automaticTitle || "Untitled" }])
        .select("*")
        .single();

      if (error) {
        setErr(error.message);
        setSending(false);
        return;
      }

      convId = data.id;
      setConversations((current) => [{ ...data }, ...current]);
      setActiveId(convId);
    } else {
      const conversation = conversations.find((item) => item.id === convId);
      if (conversation && (!conversation.title || conversation.title.trim().toLowerCase() === "untitled")) {
        const { error } = await supabase
          .from("conversations")
          .update({ title: automaticTitle || "Untitled" })
          .eq("id", convId);

        if (!error) {
          setConversations((current) =>
            current.map((item) =>
              item.id === convId ? { ...item, title: automaticTitle || "Untitled" } : item
            )
          );
        }
      }
    }

    const userMessage = input;

    const { error: insertUserError } = await supabase
      .from("messages")
      .insert([{ conversation_id: convId, role: "user", content: userMessage }]);

    if (insertUserError) {
      setErr(insertUserError.message);
      setSending(false);
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: Math.random().toString(32).slice(2),
        conversation_id: convId!,
        role: "user",
        content: userMessage,
        created_at: new Date().toISOString(),
      },
    ]);

    setInput("");

    try {
      const apiMessages: ApiChatMessage[] = [
        ...messages,
        {
          id: Math.random().toString(32).slice(2),
          conversation_id: convId!,
          role: "user",
          content: userMessage,
          created_at: new Date().toISOString(),
        },
      ].map((message) => ({
        role: message.role === "ai" ? "assistant" : "user",
        content: message.content,
      }));

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          profile: normalizePlayerProfile(playerProfile),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        const message = data.error || "AI failed to respond. Try again later.";
        setErr(message);
        showToast(message);
        setSending(false);
        return;
      }

      const data = await res.json();
      const aiMsg = data.text || data.html || "AI did not generate anything.";

      await supabase.from("messages").insert([{ conversation_id: convId, role: "ai", content: aiMsg }]);

      setMessages((current) => [
        ...current,
        {
          id: Math.random().toString(32).slice(2),
          conversation_id: convId!,
          role: "ai",
          content: aiMsg,
          created_at: new Date().toISOString(),
        },
      ]);

      showToast("AI response added");
    } catch {
      setErr("Network error");
      showToast("Error sending message.");
    } finally {
      setSending(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: 99999, behavior: "smooth" }), 120);
    }
  }

  async function saveTrainingPlan(message: Message) {
    setErr(null);
    setSavingPlanId(message.id);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErr("Not logged in!");
      showToast("Log in to save plans.");
      setSavingPlanId(null);
      return;
    }

    const { error } = await supabase.from("training_plans").insert([{
      user_id: user.id,
      source_conversation_id: message.conversation_id,
      title: buildSavedPlanTitle(message.content),
      content: message.content,
      status: "saved",
    }]);

    setSavingPlanId(null);

    if (error) {
      setErr(error.message);
      showToast("Could not save plan.");
      return;
    }

    showToast("Training plan saved.");
  }

  async function doRename(id: string, value: string) {
    setIsRenameModal(false);
    setActionMenuId(null);
    setRenameTargetId(null);
    const name = value.trim();
    if (!name) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErr("Not logged in!");
      showToast("Rename failed.");
      return;
    }

    const existing = conversations.find((item) => item.id === id && item.user_id === user.id);
    if (!existing) {
      setErr("You can only rename your own chats.");
      showToast("Rename failed.");
      return;
    }

    const { error } = await supabase
      .from("conversations")
      .update({ title: name })
      .eq("id", id)
      .eq("user_id", user.id);

    if (!error) {
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setConversations(data || []);
      showToast("Renamed!");
    } else {
      setErr(`Rename failed: ${error.message}`);
      showToast("Rename failed.");
    }
  }

  async function actuallyDeleteConversation(id: string) {
    setConfirmDeleteId(null);
    setActionMenuId(null);
    setIsRenameModal(false);
    setRenameTargetId(null);
    setErr(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErr("Not logged in!");
      showToast("Not logged in.");
      return;
    }

    const existing = conversations.find((item) => item.id === id && item.user_id === user.id);
    if (!existing) {
      setErr("You can only delete your own chats.");
      showToast("Delete failed.");
      return;
    }

    await supabase.from("messages").delete().eq("conversation_id", id);
    const { error } = await supabase.from("conversations").delete().eq("id", id).eq("user_id", user.id);

    if (!error) {
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setConversations(data || []);
      if (activeId === id) {
        setActiveId(undefined);
        setMessages([]);
      }
      showToast("Chat deleted.");
    } else {
      setErr(`Delete failed: ${error.message}`);
      showToast("Delete failed.");
    }
  }

  async function realAddConversation(name: string) {
    setErr(null);
    setShowNewChatModal(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErr("Not logged in!");
      showToast("Not logged in.");
      return;
    }

    const { data, error } = await supabase
      .from("conversations")
      .insert([{ user_id: user.id, title: name || "Untitled" }])
      .select("*")
      .single();

    if (error) {
      setErr(error.message);
      showToast("Failed to create chat.");
      return;
    }

    setConversations((current) => [{ ...data }, ...current]);
    setActiveId(data.id);
    setMessages([]);
    setIsSidebarOpen(false);
    setNewChatName("");
    showToast("New chat created.");
  }

  function renderConversationRow(conversation: Conversation) {
    const displayName = conversation.title?.trim() ? conversation.title : "Untitled";
    const isActive = activeId === conversation.id;

    function handleTouchStart() {
      if (holdTimer.current) clearTimeout(holdTimer.current);
      holdTimer.current = setTimeout(() => setActionMenuId(conversation.id), 500);
    }

    function clearTouchTimer() {
      if (holdTimer.current) clearTimeout(holdTimer.current);
    }

    return (
      <div
        key={conversation.id}
        className={`planner-conversation${isActive ? " is-active" : ""}`}
        onClick={() => {
          setActiveId(conversation.id);
          setErr(null);
          setIsSidebarOpen(false);
        }}
        onTouchStart={isTouchDevice() ? handleTouchStart : undefined}
        onTouchEnd={isTouchDevice() ? clearTouchTimer : undefined}
        onTouchMove={isTouchDevice() ? clearTouchTimer : undefined}
      >
        <span className="planner-conversation-label" title={displayName}>{displayName}</span>
        <button
          type="button"
          className="planner-conversation-more"
          aria-label={`Open actions for ${displayName}`}
          onClick={(e) => {
            e.stopPropagation();
            setActionMenuId(conversation.id);
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="9" cy="4" r="1.45" fill="currentColor" />
            <circle cx="9" cy="9" r="1.45" fill="currentColor" />
            <circle cx="9" cy="14" r="1.45" fill="currentColor" />
          </svg>
        </button>
      </div>
    );
  }

  const profileHighlights = buildPlayerProfileHighlights(playerProfile);
  const hasProfileContext = hasPlayerProfile(playerProfile);
  const activeConversation = conversations.find((item) => item.id === activeId);

  return (
    <Protected>
      <Toaster message={toasterMsg} show={toasterShow} onHide={() => setToasterShow(false)} />

      {isSidebarOpen && <div className="planner-overlay" onClick={() => setIsSidebarOpen(false)} />}

      {showNewChatModal && (
        <>
          <div className="planner-modal-backdrop" onClick={() => { setShowNewChatModal(false); setNewChatName(""); }} />
          <div className="planner-modal">
            <div className="planner-modal-title">Name your chat</div>
            <input
              autoFocus
              className="planner-modal-input"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              placeholder="e.g. Shooting drills for 3-point improvement"
              onKeyDown={(e) => {
                if (e.key === "Enter") realAddConversation(newChatName.trim());
              }}
            />
            <div className="planner-modal-actions">
              <button type="button" onClick={() => realAddConversation(newChatName.trim())}>Create</button>
              <button type="button" className="is-secondary" onClick={() => { setShowNewChatModal(false); setNewChatName(""); }}>Cancel</button>
            </div>
          </div>
        </>
      )}

      {actionMenuId && (
        <>
          <div className="planner-modal-backdrop" onClick={() => setActionMenuId(null)} />
          <div className="planner-modal planner-action-modal">
            <div className="planner-action-head">
              <div className="planner-action-kicker">Chat options</div>
              <div className="planner-modal-title">
                {conversations.find((item) => item.id === actionMenuId)?.title || "Conversation"}
              </div>
            </div>
            <button
              type="button"
              className="planner-action-button"
              onClick={() => {
                const conversation = conversations.find((item) => item.id === actionMenuId);
                if (!conversation) return;
                setRenameTargetId(conversation.id);
                setRenameValue(conversation.title?.trim() || "Untitled");
                setIsRenameModal(true);
                setActionMenuId(null);
              }}
            >
              <span className="planner-action-icon" aria-hidden="true">
                <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                  <path d="M4 14.6V16h1.4l8.45-8.45-1.4-1.4L4 14.6Z" fill="currentColor" />
                  <path d="m13.25 5.35 1.4 1.4.72-.72a.98.98 0 0 0 0-1.38l-.02-.02a.98.98 0 0 0-1.38 0l-.72.72Z" fill="currentColor" />
                </svg>
              </span>
              <span>Rename conversation</span>
            </button>
            <button
              type="button"
              className="planner-action-button is-danger"
              onClick={() => {
                setConfirmDeleteId(actionMenuId);
                setActionMenuId(null);
              }}
            >
              <span className="planner-action-icon" aria-hidden="true">
                <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                  <path d="M7.2 3.5h5.6l.55 1.35H16v1.6H4v-1.6h2.65L7.2 3.5Z" fill="currentColor" />
                  <path d="M5.5 7.5h9l-.55 8.25A1.4 1.4 0 0 1 12.55 17h-5.1a1.4 1.4 0 0 1-1.4-1.25L5.5 7.5Z" fill="currentColor" />
                </svg>
              </span>
              <span>Delete chat</span>
            </button>
            <button type="button" className="planner-action-link" onClick={() => setActionMenuId(null)}>
              Cancel
            </button>
          </div>
        </>
      )}

      {isRenameModal && (
        <>
          <div className="planner-modal-backdrop" onClick={() => { setIsRenameModal(false); setRenameTargetId(null); }} />
          <div className="planner-modal">
            <div className="planner-modal-title">Rename conversation</div>
            <input
              autoFocus
              className="planner-modal-input"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              placeholder="New conversation name"
              onKeyDown={(e) => {
                if (e.key === "Enter" && renameTargetId) doRename(renameTargetId, renameValue);
              }}
            />
            <div className="planner-modal-actions">
              <button type="button" onClick={() => renameTargetId && doRename(renameTargetId, renameValue)}>Rename</button>
              <button type="button" className="is-secondary" onClick={() => { setIsRenameModal(false); setRenameTargetId(null); }}>Cancel</button>
            </div>
          </div>
        </>
      )}

      {confirmDeleteId && (
        <>
          <div className="planner-modal-backdrop" onClick={() => setConfirmDeleteId(null)} />
          <div className="planner-modal">
            <div className="planner-modal-title">Delete chat?</div>
            <div className="planner-modal-copy">
              Are you sure you want to delete <strong>{conversations.find((item) => item.id === confirmDeleteId)?.title || "this chat"}</strong>? This cannot be undone.
            </div>
            <div className="planner-modal-actions">
              <button type="button" className="is-danger" onClick={() => actuallyDeleteConversation(confirmDeleteId)}>Delete</button>
              <button type="button" className="is-secondary" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </>
      )}

      <div className="planner-shell">
        <Navbar
          onMenuClick={() => setIsSidebarOpen((current) => !current)}
          isMenuOpen={isSidebarOpen}
        />

        <div className="planner-frame" style={{ minHeight: 0 }}>
          <aside className={`planner-sidebar${isSidebarOpen ? " is-open" : ""}`}>
            <div className="planner-sidebar-head">
              <div>
                <div className="planner-sidebar-kicker">Workspace</div>
                <div className="planner-sidebar-title">Recent chats</div>
                <div className="planner-sidebar-count">
                  {loadingConvs ? "Loading chats..." : `${conversations.length} conversation${conversations.length === 1 ? "" : "s"}`}
                </div>
              </div>
              <button type="button" className="planner-new-button" onClick={() => startNewChatDraft()}>
                <span>+</span>
                New
              </button>
            </div>

            <div className="planner-profile-card">
              <div className="planner-profile-row">
                <div>
                  <div className="planner-profile-kicker">Player profile</div>
                  <div className="planner-profile-title">AI context</div>
                </div>
                <Link href="/account" className="planner-mini-link">Edit</Link>
              </div>

              <div className="planner-profile-state">
                {hasProfileContext ? "Profile connected" : "Profile incomplete"}
              </div>

              {profileHighlights.length > 0 ? (
                <div className="planner-profile-tags">
                  {profileHighlights.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              ) : (
                <div className="planner-profile-copy">
                  Add your player profile so the AI can tailor workouts to the athlete.
                </div>
              )}
            </div>

            {loadingConvs && <div className="planner-side-note">Loading...</div>}

            <div className="planner-conversation-list">
              {conversations.map((conversation) => renderConversationRow(conversation))}
            </div>

            {!loadingConvs && conversations.length === 0 && (
              <div className="planner-empty-side">
                No chat history yet. Start a new chat and build your first training thread.
              </div>
            )}
          </aside>

          <section className="planner-chat">
            <div className="planner-chat-head">
              <div className="planner-chat-title-block">
                <div className="planner-chat-kicker">AI TRAINING COACH</div>
                <h1>{activeConversation?.title || "New training chat"}</h1>
                <p>Start with a clear goal, time, equipment, and level for sharper basketball plans.</p>
              </div>
              <div className="planner-chat-badges">
                <div className="planner-badge planner-badge-live">
                  <span />
                  {hasProfileContext ? "Profile-aware" : "Ready"}
                </div>
                <div className="planner-badge">{activeId ? `${messages.length} messages` : "New chat"}</div>
              </div>
            </div>

            <div ref={scrollRef} className="planner-scroll">
              <div className="planner-messages">
                {(!activeId || (!loadingMsgs && messages.length === 0)) && (
                  <div className="planner-empty-main">
                    <div className="planner-empty-logo">AI</div>
                    <h2>Start a new basketball training chat.</h2>
                    <p>Choose a suggestion below or write your own prompt. Keep it simple, specific, and basketball-focused.</p>
                    <div className="planner-suggestion-box">
                      Try including: position, main goal, number of training days, available equipment, and recovery limits.
                    </div>
                    <div className="planner-suggestion-grid">
                      {QUICK_PROMPTS.map((prompt) => (
                        <button key={prompt} type="button" onClick={() => handleQuickPrompt(prompt)}>
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {loadingMsgs && <div className="planner-status-pill">Loading...</div>}

                {messages.map((message) => (
                  <div key={message.id} className={`planner-message ${message.role === "user" ? "is-user" : "is-ai"}`}>
                    <div className={`planner-bubble ${message.role === "user" ? "is-user" : "is-ai"}`}>
                      <div className="planner-bubble-top">
                        <span>{message.role === "user" ? "You" : "AI"}</span>
                        <span>{message.created_at ? new Date(message.created_at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : ""}</span>
                      </div>

                      {message.role === "ai" ? (
                        <div className="planner-bubble-body">
                          <ReactMarkdown components={markdownComponents}>{message.content}</ReactMarkdown>
                          <button
                            type="button"
                            className="planner-save-button"
                            onClick={() => saveTrainingPlan(message)}
                            disabled={savingPlanId === message.id}
                          >
                            {savingPlanId === message.id ? "Saving..." : "Save as training plan"}
                          </button>
                        </div>
                      ) : (
                        <div className="planner-bubble-body planner-bubble-user-text">{message.content}</div>
                      )}
                    </div>
                  </div>
                ))}

                {sending && <div className="planner-status-pill">AI is formulating...</div>}
                {err && <div className="planner-error-box">{err}</div>}
              </div>
            </div>

            <div className="planner-composer-wrap">
              <form className="planner-composer" onSubmit={handleSend}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe the athlete, goal, equipment, schedule, and any limits..."
                  className="planner-composer-input"
                  disabled={sending}
                  rows={1}
                  required
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !sending) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button type="submit" className="planner-send" disabled={sending || !input.trim()} aria-label="Send message">
                  <svg width="14" height="14" fill="none" viewBox="0 0 20 20">
                    <path
                      d="M4 10h7M10.7 4.3l4.3 4.2c.4.4.4 1 0 1.4l-4.3 4.2"
                      stroke="#07131f"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
              <div className="planner-composer-meta">
                <span>{hasProfileContext ? "Profile context is active. The AI can tailor output more precisely." : "Add a player profile in Account to get more personalized training plans."}</span>
                <span>Press `Enter` to send.</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        .planner-shell {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100dvh;
          min-height: 100dvh;
          max-height: 100dvh;
          background:
            radial-gradient(circle at 82% 14%, rgba(77,211,201,0.08), transparent 24%),
            radial-gradient(circle at 14% 86%, rgba(90,160,255,0.08), transparent 26%),
            linear-gradient(180deg, #0b101b 0%, #0f1523 52%, #0a0f19 100%);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .planner-topbar {
          width: min(1280px, calc(100vw - 28px));
          margin: 10px auto 12px;
          min-height: 62px;
          padding: 10px 14px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(17,24,38,0.82);
          box-shadow: 0 18px 44px rgba(0,0,0,0.24);
          backdrop-filter: blur(14px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex: 0 0 auto;
          position: relative;
          z-index: 60;
        }

        .planner-topbar-left,
        .planner-topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .planner-menu-button {
          display: none;
          width: auto;
          min-width: 44px;
          height: 44px;
          padding: 8px;
          border-radius: 11px;
          border: 1.5px solid var(--border);
          background: rgba(31, 39, 64, 0.92);
          box-shadow: none;
          align-items: center;
          justify-content: center;
        }

        .planner-menu-button.is-open {
          box-shadow: 0 4px 22px rgba(77,211,201,0.09);
        }

        .planner-dashboard-link {
          width: auto;
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid rgba(77,211,201,0.22);
          background: rgba(77,211,201,0.08);
          color: var(--accent-2);
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
        }

        .planner-dashboard-link:hover {
          text-decoration: none;
          background: rgba(77,211,201,0.14);
        }

        .planner-frame {
          width: min(1280px, calc(100vw - 28px));
          margin: 0 auto 12px;
          display: grid;
          grid-template-columns: 320px minmax(0, 1fr);
          gap: 12px;
          flex: 1 1 auto;
          height: auto;
          min-height: 0;
          overflow: hidden;
        }

        .planner-sidebar,
        .planner-chat {
          min-height: 0;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(12,18,31,0.92);
          box-shadow: 0 18px 54px rgba(0,0,0,0.24);
          backdrop-filter: blur(12px);
        }

        .planner-sidebar {
          overflow-y: auto;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .planner-sidebar-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .planner-sidebar-kicker,
        .planner-profile-kicker,
        .planner-chat-kicker {
          color: var(--accent-2);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .planner-sidebar-title,
        .planner-profile-title {
          margin-top: 5px;
          color: var(--text);
          font-size: 1.2rem;
          font-weight: 900;
          line-height: 1.15;
        }

        .planner-sidebar-count,
        .planner-side-note,
        .planner-profile-copy,
        .planner-empty-side {
          color: var(--muted);
          font-size: 12.8px;
          line-height: 1.55;
        }

        .planner-new-button {
          width: auto;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--accent-2), var(--accent));
          color: #07131f;
          font-size: 13px;
          font-weight: 900;
          box-shadow: 0 14px 32px rgba(77,211,201,0.18);
        }

        .planner-new-button span {
          font-size: 16px;
          line-height: 1;
        }

        .planner-profile-card {
          padding: 16px;
          border-radius: 20px;
          background:
            linear-gradient(145deg, rgba(77,211,201,0.12), rgba(90,160,255,0.08)),
            rgba(255,255,255,0.03);
          border: 1px solid rgba(77,211,201,0.18);
          display: grid;
          gap: 12px;
        }

        .planner-profile-row {
          display: flex;
          justify-content: space-between;
          align-items: start;
          gap: 12px;
        }

        .planner-mini-link {
          width: auto;
          color: var(--accent-2);
          font-size: 12.5px;
          font-weight: 800;
        }

        .planner-profile-state {
          width: fit-content;
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(8,13,22,0.34);
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--accent-2);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .planner-profile-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .planner-profile-tags span {
          width: auto;
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(9,15,25,0.34);
          border: 1px solid rgba(255,255,255,0.08);
          color: #d9f7f3;
          font-size: 12px;
          font-weight: 700;
        }

        .planner-conversation-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .planner-conversation {
          min-height: 54px;
          padding: 12px;
          border-radius: 16px;
          border: 1px solid transparent;
          background: rgba(255,255,255,0.025);
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: background 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
        }

        .planner-conversation:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(77,211,201,0.14);
        }

        .planner-conversation.is-active {
          background:
            linear-gradient(135deg, rgba(77,211,201,0.12), rgba(90,160,255,0.08)),
            rgba(255,255,255,0.03);
          border-color: rgba(77,211,201,0.3);
        }

        .planner-conversation-label {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: var(--text);
          font-size: 14px;
          font-weight: 700;
        }

        .planner-conversation-more {
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          padding: 0;
          border-radius: 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: none;
          color: #92a2c0;
          transition: background 0.16s ease, border-color 0.16s ease, color 0.16s ease;
        }

        .planner-conversation-more:hover:not(:disabled) {
          background: rgba(77,211,201,0.12);
          border-color: rgba(77,211,201,0.28);
          color: var(--accent-2);
          transform: none;
        }

        .planner-conversation-more:focus-visible {
          outline: none;
          border-color: rgba(90,160,255,0.6);
          box-shadow: 0 0 0 3px rgba(90,160,255,0.18);
        }

        .planner-empty-side {
          padding: 10px 4px 4px;
          text-align: center;
        }

        .planner-chat {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .planner-chat-head {
          flex: 0 0 auto;
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          min-height: 88px;
          padding: 18px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
        }

        .planner-chat-title-block {
          display: grid;
          gap: 4px;
        }

        .planner-chat-title-block h1 {
          margin: 0;
          color: var(--text);
          font-size: clamp(1.15rem, 2vw, 1.5rem);
          line-height: 1.15;
        }

        .planner-chat-title-block p {
          margin: 0;
          max-width: 560px;
          color: var(--muted);
          font-size: 13.5px;
          line-height: 1.55;
        }

        .planner-chat-badges {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .planner-badge {
          width: auto;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 11px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: var(--text);
          font-size: 12px;
          font-weight: 900;
        }

        .planner-badge-live {
          color: #c9f8f3;
        }

        .planner-badge-live span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent-2);
          box-shadow: 0 0 14px rgba(77,211,201,0.7);
        }

        .planner-scroll {
          flex: 1 1 auto;
          min-height: 0;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }

        .planner-messages {
          width: min(860px, 100%);
          margin: 0 auto;
          padding: 22px 18px 14px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .planner-empty-main {
          min-height: 100%;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 14px;
          padding: 24px 8px;
          text-align: center;
        }

        .planner-empty-logo {
          width: 58px;
          height: 58px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          color: #071322;
          font-size: 22px;
          font-weight: 950;
          background: linear-gradient(135deg, var(--accent-2), var(--accent));
          box-shadow: 0 18px 38px rgba(77,211,201,0.18);
        }

        .planner-empty-main h2 {
          margin: 0;
          color: var(--text);
          font-size: clamp(1.55rem, 4vw, 2.4rem);
          line-height: 1.08;
        }

        .planner-empty-main p {
          margin: 0;
          max-width: 620px;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.65;
        }

        .planner-suggestion-box {
          width: min(640px, 100%);
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          color: var(--muted);
          font-size: 13px;
          line-height: 1.55;
        }

        .planner-suggestion-grid {
          width: min(680px, 100%);
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .planner-suggestion-grid button {
          min-height: 58px;
          padding: 14px 16px;
          border-radius: 18px;
          text-align: left;
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: none;
          color: var(--text);
          font-size: 14px;
          font-weight: 800;
          line-height: 1.35;
        }

        .planner-suggestion-grid button:hover:not(:disabled) {
          background: rgba(255,255,255,0.065);
          border-color: rgba(77,211,201,0.22);
        }

        .planner-message {
          display: flex;
        }

        .planner-message.is-user {
          justify-content: flex-end;
        }

        .planner-message.is-ai {
          justify-content: flex-start;
        }

        .planner-bubble {
          max-width: min(760px, 88%);
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.07);
          padding: 16px 16px 14px;
          box-shadow: none;
        }

        .planner-bubble.is-ai {
          background: rgba(255,255,255,0.045);
          color: var(--text);
        }

        .planner-bubble.is-user {
          background: linear-gradient(135deg, #6fe4dc, #5aa0ff);
          color: #06131f;
        }

        .planner-bubble-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
          font-size: 11.5px;
          font-weight: 900;
          text-transform: uppercase;
          opacity: 0.82;
        }

        .planner-bubble-top span:last-child {
          font-weight: 700;
          opacity: 0.76;
        }

        .planner-bubble-body {
          font-size: 14.8px;
          line-height: 1.66;
          word-break: break-word;
        }

        .planner-bubble-user-text {
          white-space: pre-wrap;
        }

        .planner-save-button {
          width: auto;
          margin-top: 10px;
          padding: 8px 11px;
          border-radius: 999px;
          background: rgba(77,211,201,0.12);
          border: 1px solid rgba(77,211,201,0.24);
          box-shadow: none;
          color: var(--accent-2);
          font-size: 12px;
          font-weight: 900;
        }

        .planner-status-pill {
          width: fit-content;
          margin: 0 auto;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid rgba(77,211,201,0.24);
          background: rgba(77,211,201,0.1);
          color: var(--accent-2);
          font-size: 13px;
          font-weight: 800;
        }

        .planner-error-box {
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,107,107,0.34);
          background: rgba(255,107,107,0.1);
          color: #ff9393;
          font-size: 13.5px;
          line-height: 1.5;
        }

        .planner-composer-wrap {
          flex: 0 0 auto;
          position: sticky;
          bottom: 0;
          z-index: 3;
          padding: 12px 16px 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
          background: linear-gradient(180deg, rgba(10,15,26,0.12), rgba(10,15,26,0.95));
        }

        .planner-composer {
          width: min(860px, 100%);
          margin: 0 auto;
          display: flex;
          align-items: flex-end;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 22px;
          border: 1px solid rgba(77,211,201,0.14);
          background: rgba(11,17,28,0.98);
          box-shadow: 0 14px 34px rgba(0,0,0,0.22);
        }

        .planner-composer-input {
          flex: 1 1 auto;
          min-height: 26px !important;
          max-height: 180px !important;
          padding: 4px 2px !important;
          border: none !important;
          background: transparent !important;
          box-shadow: none !important;
          resize: none !important;
          color: #ecf8fb !important;
          font-size: 15px !important;
          line-height: 1.45 !important;
          overflow-y: auto;
        }

        .planner-composer-input:focus {
          box-shadow: none !important;
        }

        .planner-send {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0;
          background: linear-gradient(137deg,#13bfa5,#4fc9bd 120%);
          color: #07131f;
          box-shadow: none;
        }

        .planner-composer-meta {
          width: min(860px, 100%);
          margin: 10px auto 0;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.5;
        }

        .planner-toast {
          position: fixed;
          left: 50%;
          bottom: 28px;
          transform: translateX(-50%);
          z-index: 2000;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.24s ease;
        }

        .planner-toast.is-visible {
          opacity: 1;
        }

        .planner-toast-pill {
          background: linear-gradient(135deg,#19e6be,#33aadd 120%);
          color: #00303a;
          font-weight: 800;
          font-size: 14px;
          border-radius: 999px;
          padding: 10px 18px;
          box-shadow: 0 10px 32px rgba(32,253,213,0.24);
          white-space: nowrap;
        }

        .planner-overlay,
        .planner-modal-backdrop {
          position: fixed;
          inset: 0;
        }

        .planner-overlay {
          z-index: 49;
          background: rgba(8,13,22,0.34);
        }

        .planner-modal-backdrop {
          z-index: 1001;
          background: rgba(8,13,22,0.62);
          backdrop-filter: blur(5px);
        }

        .planner-modal {
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 1002;
          width: min(360px, calc(100vw - 24px));
          padding: 26px 22px 20px;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(180deg, rgba(24,33,52,0.98), rgba(14,20,33,0.98));
          box-shadow: 0 20px 60px rgba(0,0,0,0.34);
          display: grid;
          gap: 14px;
        }

        .planner-action-modal {
          width: min(340px, calc(100vw - 24px));
          padding: 18px;
          gap: 10px;
        }

        .planner-action-head {
          display: grid;
          gap: 4px;
          padding: 4px 4px 8px;
          text-align: left;
        }

        .planner-action-kicker {
          color: var(--accent-2);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .planner-modal-title {
          color: var(--text);
          font-size: 18px;
          font-weight: 900;
          text-align: center;
        }

        .planner-action-head .planner-modal-title {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: left;
          font-size: 16px;
          line-height: 1.25;
        }

        .planner-modal-copy {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.6;
          text-align: center;
        }

        .planner-modal-input {
          width: 100%;
        }

        .planner-modal-actions {
          display: flex;
          gap: 10px;
        }

        .planner-modal-actions button,
        .planner-action-button {
          flex: 1 1 0;
        }

        .planner-modal-actions .is-secondary,
        .planner-action-link {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          color: var(--text) !important;
          box-shadow: none !important;
        }

        .planner-modal-actions .is-danger,
        .planner-action-button.is-danger {
          background: rgba(255,83,110,0.11) !important;
          border-color: rgba(255,107,107,0.3) !important;
          color: #ffb7b7 !important;
        }

        .planner-action-button {
          width: 100%;
          min-height: 46px;
          padding: 12px 13px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 10px;
          background: rgba(255,255,255,0.045) !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          box-shadow: none !important;
          color: var(--text) !important;
          font-size: 14px;
          font-weight: 850;
          text-align: left;
        }

        .planner-action-button:hover:not(:disabled) {
          background: rgba(77,211,201,0.1) !important;
          border-color: rgba(77,211,201,0.26) !important;
          color: #d8fbf7 !important;
          transform: none;
        }

        .planner-action-button.is-danger:hover:not(:disabled) {
          background: rgba(255,83,110,0.17) !important;
          border-color: rgba(255,107,107,0.45) !important;
          color: #ffd7d7 !important;
        }

        .planner-action-icon {
          width: 28px;
          height: 28px;
          flex: 0 0 28px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background: rgba(77,211,201,0.12);
          color: var(--accent-2);
        }

        .planner-action-button.is-danger .planner-action-icon {
          background: rgba(255,107,107,0.16);
          color: #ffb7b7;
        }

        .planner-action-link {
          width: 100%;
          min-height: 42px;
          font-size: 14px;
          border-radius: 14px;
        }

        @media (max-width: 980px) {
          .planner-frame {
            grid-template-columns: 280px minmax(0, 1fr);
          }
        }

        @media (max-width: 880px) {
          .planner-menu-button {
            display: inline-flex;
          }

          .planner-frame {
            grid-template-columns: minmax(0, 1fr);
          }

          .planner-sidebar {
            position: fixed;
            left: 8px;
            top: 74px;
            width: min(86vw, 320px);
            height: calc(var(--planner-vvh, 100dvh) - 84px);
            z-index: 50;
            transform: translateX(-104%);
            transition: transform 0.24s ease;
          }

          .planner-sidebar.is-open {
            transform: translateX(0);
          }
        }

        @media (max-width: 700px) {
          html:has(.planner-shell),
          body:has(.planner-shell) {
            height: 100%;
            overflow: hidden;
          }

          .planner-shell {
            height: var(--planner-vvh, 100dvh);
            min-height: var(--planner-vvh, 100dvh);
            max-height: var(--planner-vvh, 100dvh);
            overflow: hidden;
          }

          .planner-topbar {
            width: calc(100vw - 12px);
            min-height: 52px;
            margin: 6px auto 6px;
            padding: 8px 10px;
            border-radius: 16px;
          }

          .planner-dashboard-link {
            padding: 8px 12px;
            font-size: 12px;
          }

          .planner-topbar-left {
            gap: 8px;
          }

          .planner-action-modal {
            top: auto;
            bottom: 10px;
            transform: translateX(-50%);
            width: calc(100vw - 20px);
            border-radius: 20px;
          }

          .planner-frame {
            width: calc(100vw - 12px);
            flex: 1 1 auto;
            height: auto;
            min-height: 0;
            margin: 0 auto 6px;
            gap: 0;
            overflow: hidden;
          }

          .planner-chat {
            border-radius: 18px;
          }

          .planner-chat-head {
            min-height: auto;
            padding: 12px;
            align-items: flex-start;
            gap: 10px;
          }

          .planner-chat-title-block h1 {
            font-size: 1rem;
          }

          .planner-chat-title-block p {
            font-size: 12.5px;
            line-height: 1.5;
          }

          .planner-chat-badges {
            width: 100%;
            justify-content: flex-start;
            gap: 8px;
          }

          .planner-badge {
            padding: 7px 9px;
            font-size: 11px;
          }

          .planner-messages {
            padding: 12px 8px 10px;
            gap: 12px;
          }

          .planner-empty-main {
            padding: 16px 2px 10px;
            gap: 10px;
          }

          .planner-empty-main h2 {
            font-size: clamp(1.24rem, 5vw, 1.7rem);
          }

          .planner-empty-main p,
          .planner-suggestion-box {
            font-size: 12.5px;
          }

          .planner-suggestion-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .planner-suggestion-grid button {
            min-height: 48px;
            padding: 11px 12px;
            border-radius: 15px;
            font-size: 13px;
          }

          .planner-bubble {
            max-width: 96%;
            padding: 12px;
            border-radius: 18px;
          }

          .planner-bubble-body {
            font-size: 14px;
            line-height: 1.62;
          }

          .planner-composer-wrap {
            padding: 8px 8px calc(8px + env(safe-area-inset-bottom));
            background: rgba(10,15,26,0.98);
            backdrop-filter: blur(12px);
          }

          .planner-composer {
            padding: 9px 10px;
            border-radius: 16px;
            min-height: 52px;
          }

          .planner-composer-input {
            font-size: 15px !important;
            line-height: 1.38 !important;
            max-height: 132px !important;
          }

          .planner-send {
            width: 38px;
            height: 38px;
            flex-basis: 38px;
          }

          .planner-composer-meta {
            display: none;
          }

          .planner-sidebar {
            top: 64px;
            height: calc(var(--planner-vvh, 100dvh) - 72px);
            border-radius: 18px;
          }
        }
      `}</style>
    </Protected>
  );
}
