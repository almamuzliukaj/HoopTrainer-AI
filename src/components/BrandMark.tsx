import type { CSSProperties } from "react";
import Link from "next/link";

type BrandMarkProps = {
  size?: "sm" | "md" | "lg";
  href?: string;
  showWordmark?: boolean;
};

const sizes = {
  sm: {
    box: 32,
    radius: 8,
    letter: 17,
    label: 15,
    gap: 8,
  },
  md: {
    box: 42,
    radius: 12,
    letter: 22,
    label: 17,
    gap: 12,
  },
  lg: {
    box: 52,
    radius: 15,
    letter: 26,
    label: 20,
    gap: 14,
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
      style={{
        display: "flex",
        alignItems: "center",
        gap: current.gap,
      }}
    >
      <div
        style={{
          width: current.box,
          height: current.box,
          borderRadius: current.radius,
          background: "linear-gradient(135deg, var(--accent), #3c7be0)",
          boxShadow: "0 10px 22px rgba(60,123,224,0.28)",
          display: "grid",
          placeItems: "center",
          fontWeight: 900,
          color: "#0f1524",
          letterSpacing: 0.4,
          fontSize: current.letter,
          flexShrink: 0,
        }}
      >
        H
      </div>
      {showWordmark ? (
        <span
          style={{
            fontWeight: 800,
            letterSpacing: 0.35,
            fontSize: current.label,
            color: "var(--text)",
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
