"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import BrandMark from "@/components/BrandMark";

function useAuthUser() {
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      const nextUser = res.data?.user;
      const name = nextUser?.user_metadata?.name || "";
      setUser({ email: nextUser?.email, name });
    });
  }, []);

  return user;
}

function AccountMenu({ onSignOut }: { onSignOut: () => void }) {
  const user = useAuthUser();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const name = user?.name?.trim() || "";
  const email = user?.email?.trim() || "";
  const initial = name ? name[0].toUpperCase() : email ? email[0].toUpperCase() : "U";

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 570);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", zIndex: 110 }}>
      <button
        aria-label="Account"
        className="account-trigger-button"
        onClick={() => setOpen((value) => !value)}
        style={{
          width: isMobile ? 38 : 48,
          height: isMobile ? 38 : 48,
          borderRadius: "50%",
          border: "1px solid rgba(77,211,201,0.32)",
          background:
            "linear-gradient(145deg, #182236 0%, #223150 62%, #142035 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          outline: "none",
          boxShadow: open
            ? "0 16px 36px rgba(0,0,0,0.26), 0 0 0 4px rgba(77,211,201,0.1), inset 0 1px 0 rgba(255,255,255,0.12)"
            : "0 10px 24px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.1)",
          fontWeight: 900,
          color: "var(--accent-2)",
          fontSize: isMobile ? 16 : 23,
          transition: "box-shadow 0.18s, width 0.18s, height 0.18s, font-size 0.18s",
        }}
      >
        {initial}
      </button>
      {open ? (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: isMobile ? 42 : 54,
            background: "var(--card-2)",
            border: "2px solid var(--accent-2)",
            borderRadius: 16,
            boxShadow: "0 16px 64px rgba(60,123,224,0.15)",
            display: "flex",
            flexDirection: "column",
            minWidth: isMobile ? 220 : 270,
            zIndex: 101,
            gap: 2,
            overflow: "hidden",
            animation: "fadeInScale .16s",
          }}
        >
          <div
            style={{
              padding: isMobile ? "12px 16px 12px" : "20px 28px 18px",
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 12 : 18,
              borderBottom: "1.5px solid var(--border)",
              background: "rgba(79,201,189,0.07)",
            }}
          >
            <div
              style={{
                width: isMobile ? 32 : 46,
                height: isMobile ? 32 : 46,
                borderRadius: "50%",
                background: "linear-gradient(145deg, #182236, #223150)",
                color: "var(--accent-2)",
                border: "1px solid rgba(77,211,201,0.26)",
                fontWeight: 900,
                fontSize: isMobile ? 15 : 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {initial}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                minWidth: 0,
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: isMobile ? 14.2 : 18,
                  color: "var(--text)",
                  lineHeight: 1.16,
                  maxWidth: isMobile ? 110 : 170,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {name || "User"}
              </span>
              <span
                style={{
                  fontSize: isMobile ? 11.7 : 15.5,
                  color: "var(--muted)",
                  lineHeight: 1.15,
                  maxWidth: isMobile ? 110 : 170,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginTop: 2,
                }}
              >
                {email || "..."}
              </span>
            </div>
          </div>
          <Link
            href="/account"
            style={{
              color: "var(--accent-2)",
              fontWeight: 700,
              fontSize: isMobile ? 13.6 : 17,
              padding: isMobile ? "11px 16px" : "16px 28px",
              textDecoration: "none",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: 11,
              letterSpacing: 0.15,
            }}
            onClick={() => setOpen(false)}
          >
            <svg width={20} height={20} style={{ minWidth: 20 }} fill="none" viewBox="0 0 20 20">
              <circle cx="10" cy="7" r="4" stroke="var(--accent-2)" strokeWidth={1.6} />
              <path d="M18 17c0-3-3-5-8-5s-8 2-8 5" stroke="var(--accent-2)" strokeWidth={1.6} strokeLinecap="round" />
            </svg>
            Account Settings
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            style={{
              textAlign: "left",
              background: "none",
              border: "none",
              fontWeight: 800,
              fontSize: isMobile ? 13 : 17,
              padding: isMobile ? "11px 16px" : "16px 28px",
              color: "var(--error)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 11,
              borderTop: "1.2px solid var(--border)",
              boxShadow: "none",
              width: "100%",
            }}
          >
            <svg width={20} height={20} fill="none" viewBox="0 0 20 20" style={{ minWidth: 20 }}>
              <path d="M10.833 13.333 14.167 10m0 0-3.334-3.333M14.167 10H3.333m10 8.333a1.667 1.667 0 0 0 1.667-1.666V3.333A1.667 1.667 0 0 0 13.333 1.667H6.667A1.667 1.667 0 0 0 5 3.333v2.5" stroke="var(--error)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function DashboardTopBar({ onSignOut }: { onSignOut: () => void }) {
  return (
    <nav
      className="glass-topbar"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 14px",
        minHeight: 52,
        marginBottom: 10,
      }}
    >
      <BrandMark size="sm" />
      <AccountMenu onSignOut={onSignOut} />
    </nav>
  );
}
