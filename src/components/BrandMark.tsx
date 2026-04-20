import type { CSSProperties } from "react";
import Link from "next/link";

type BrandMarkProps = {
  size?: "sm" | "md" | "lg";
  href?: string;
  showWordmark?: boolean;
};

const sizes = {
  sm: {
    box: 36,
    radius: 10,
    label: 16,
    gap: 9,
  },
  md: {
    box: 48,
    radius: 14,
    label: 18,
    gap: 12,
  },
  lg: {
    box: 58,
    radius: 17,
    label: 21,
    gap: 15,
  },
} as const;

export default function BrandMark({
  size = "md",
  href = "/",
  showWordmark = true,
}: BrandMarkProps) {
  const current = sizes[size];

  const content = (
    <div
      className="brand-mark"
      style={{
        display: "flex",
        alignItems: "center",
        gap: current.gap,
      }}
    >
      <div
        className="brand-icon"
        style={{
          width: current.box,
          height: current.box,
          borderRadius: current.radius,
          background: "linear-gradient(160deg, #0f1524, #1c2943 78%, #132035)",
          boxShadow: "0 14px 30px rgba(7,11,21,0.34), inset 0 1px 0 rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}
        >
        <svg
          viewBox="0 0 64 64"
          aria-hidden="true"
          style={{
            width: Math.round(current.box * 0.88),
            height: Math.round(current.box * 0.88),
            display: "block",
          }}
        >
          <defs>
            <linearGradient id="brandBall" x1="18" y1="16" x2="44" y2="46" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffcf86" />
              <stop offset="55%" stopColor="#f18a35" />
              <stop offset="100%" stopColor="#ad5524" />
            </linearGradient>
            <linearGradient id="brandStroke" x1="10" y1="8" x2="56" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#73f0e8" />
              <stop offset="100%" stopColor="#5aa0ff" />
            </linearGradient>
            <linearGradient id="brandMarkStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f6fbff" />
              <stop offset="100%" stopColor="#d7f7f3" />
            </linearGradient>
          </defs>
          <rect x="6.5" y="6.5" width="51" height="51" rx="16" fill="rgba(14,20,34,0.82)" stroke="url(#brandStroke)" strokeWidth="1.8" />
          <circle cx="32" cy="30" r="15.5" fill="url(#brandBall)" />
          <path d="M16.5 30h31M32 14.5v31" stroke="rgba(19,32,53,0.34)" strokeWidth="2.1" strokeLinecap="round" />
          <path d="M20 18c7 2.4 11.5 8.2 11.5 12S27 39.6 20 42M44 18c-7 2.4-11.5 8.2-11.5 12S37 39.6 44 42" stroke="rgba(19,32,53,0.34)" strokeWidth="2.1" strokeLinecap="round" />
          <path d="M20 44h24" stroke="url(#brandStroke)" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M24 44 26.5 50M32 44v8M40 44 37.5 50" stroke="rgba(230,248,255,0.7)" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M23 19.5v21M41 19.5v21M23 30h18"
            fill="none"
            stroke="url(#brandMarkStroke)"
            strokeWidth="4.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {showWordmark ? (
        <span
          className="brand-wordmark"
          style={{
            fontWeight: 900,
            letterSpacing: 0.1,
            fontSize: current.label,
            color: "var(--text)",
            textShadow: "0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          HoopTrainer AI
        </span>
      ) : null}
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      href={href}
      style={{ textDecoration: "none" } as CSSProperties}
      aria-label="HoopTrainer AI"
    >
      {content}
    </Link>
  );
}
