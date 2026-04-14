import Link from "next/link";
import BrandMark from "@/components/BrandMark";

type SiteFooterProps = {
  compact?: boolean;
};

export default function SiteFooter({ compact = false }: SiteFooterProps) {
  return (
    <footer
      style={{
        borderTop: "1.4px solid var(--border)",
        background: "rgba(24, 33, 52, 0.94)",
        color: "var(--muted)",
        padding: compact ? "28px 0 16px" : "36px 0 20px",
        textAlign: "center",
        fontSize: compact ? 14 : 15,
        boxShadow: "0 -1px 18px rgba(20,27,44,0.14)",
        flexShrink: 0,
        width: "100%",
        marginTop: "auto",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 18,
          padding: "0 18px",
        }}
      >
        <BrandMark size="sm" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <a
            href="mailto:support@hooptrainer.ai"
            style={{
              color: "var(--accent-2)",
              textDecoration: "none",
              fontWeight: 700,
              marginRight: 18,
              fontSize: compact ? 14 : 15,
            }}
          >
            Support
          </a>
          <Link
            href="/terms"
            style={{
              color: "var(--muted)",
              textDecoration: "none",
              fontWeight: 500,
              marginRight: 18,
              fontSize: compact ? 14 : 15,
            }}
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            style={{
              color: "var(--muted)",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: compact ? 14 : 15,
            }}
          >
            Privacy
          </Link>
        </div>
      </div>
      <div
        style={{
          color: "#6b7dab",
          fontSize: compact ? 12 : 13,
          marginTop: 16,
          letterSpacing: 0.1,
        }}
      >
        &copy; {new Date().getFullYear()} HoopTrainer. All rights reserved.
      </div>
    </footer>
  );
}
