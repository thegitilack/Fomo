import React from "react";

/* Small uppercase monospace eyebrow / date-group header. */

export function Eyebrow({ children, style }) {
  return (
    <div
      style={{
        fontFamily: "var(--fomo-font-mono)",
        fontSize: "11px",
        letterSpacing: "0.20em",
        textTransform: "uppercase",
        color: "var(--fomo-text-muted)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
