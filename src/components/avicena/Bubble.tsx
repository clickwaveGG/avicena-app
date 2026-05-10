import type { ReactNode } from "react";
import { HipAvatar } from "./HipAvatar";

export function UserBubble({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
      <div
        style={{
          maxWidth: "78%",
          background: "var(--brand-soft-bg)",
          color: "var(--ink)",
          padding: "12px 16px",
          borderRadius: "18px 18px 6px 18px",
          fontSize: 15,
          lineHeight: 1.55,
          whiteSpace: "pre-wrap",
        }}
      >
        {children}
      </div>
    </div>
  );
}

type HipProps = {
  children: ReactNode;
  streaming?: boolean;
  footer?: boolean;
};

export function HipBubble({ children, streaming, footer = true }: HipProps) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 18, alignItems: "flex-start" }}>
      <HipAvatar pulsing={streaming} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            background: "var(--bg-elev-1)",
            border: "1px solid var(--border)",
            padding: "14px 18px",
            borderRadius: "6px 18px 18px 18px",
            fontSize: 15,
            lineHeight: 1.6,
            color: "var(--ink)",
          }}
        >
          {children}
          {streaming && <span className="av-cursor" />}
        </div>
        {footer && (
          <div
            style={{
              marginTop: 6,
              fontSize: 11,
              color: "var(--ink-faint)",
              fontStyle: "italic",
              paddingLeft: 4,
            }}
          >
            Material de estudo.
          </div>
        )}
      </div>
    </div>
  );
}
