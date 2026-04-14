"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function PublicMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        aria-label="Menu"
        onClick={() => setOpen((value) => !value)}
        style={{
          background: "rgba(31, 39, 64, 0.92)",
          border: "1.5px solid var(--border)",
          padding: 8,
          borderRadius: 11,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          boxShadow: open ? "0 4px 22px rgba(77,211,201,0.09)" : "none",
          outline: "none",
        }}
      >
        <svg width={27} height={27} viewBox="0 0 27 27" fill="none">
          <rect x="5.5" y="8" width="16" height="2.6" rx="1.3" fill="var(--accent)" />
          <rect x="5.5" y="13" width="16" height="2.6" rx="1.3" fill="var(--accent-2)" />
          <rect x="5.5" y="18" width="16" height="2.6" rx="1.3" fill="var(--muted)" />
        </svg>
      </button>
      {open ? (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 42,
            background: "var(--card-2)",
            border: "1.5px solid var(--border)",
            borderRadius: 14,
            boxShadow: "0 10px 40px rgba(90,160,255,0.13)",
            display: "flex",
            flexDirection: "column",
            minWidth: 164,
            zIndex: 101,
            gap: 2,
            overflow: "hidden",
            animation: "fadeInScale .16s",
          }}
        >
          <Link
            href="/login"
            style={{
              color: "var(--text)",
              background: "none",
              fontWeight: 700,
              padding: "13px 22px",
              fontSize: 15,
              border: "none",
              textDecoration: "none",
              letterSpacing: "0.2px",
            }}
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/signup"
            style={{
              color: "var(--accent-2)",
              fontWeight: 700,
              padding: "13px 22px",
              fontSize: 15,
              background: "none",
              border: "none",
              textDecoration: "none",
              letterSpacing: "0.2px",
            }}
            onClick={() => setOpen(false)}
          >
            Create account
          </Link>
        </div>
      ) : null}
    </div>
  );
}
