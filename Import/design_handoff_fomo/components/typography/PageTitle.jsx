import React from "react";

/* The 28/300 page title — "Today", "Upcoming". */

export function PageTitle({ children, style }) {
  return (
    <div
      style={{
        fontFamily: "var(--fomo-font-sans)",
        fontSize: "28px",
        fontWeight: 300,
        letterSpacing: "-0.025em",
        color: "var(--fomo-text-primary)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
