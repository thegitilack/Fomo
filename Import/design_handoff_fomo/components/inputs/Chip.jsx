import React from "react";

/* Pill metadata button used in the Add-Task sheet and Task Detail chip row.
   Inactive = hairline outline + muted text. Active = accent-tinted (a value is
   set). Pass an <Icon> as `icon`. */

export function Chip({ label, icon, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        padding: "9px 14px",
        borderRadius: "var(--fomo-radius-full)",
        border: `1px solid ${active ? "var(--fomo-chip-active-bd)" : "var(--fomo-border)"}`,
        background: active ? "var(--fomo-chip-active-bg)" : "transparent",
        color: active ? "var(--fomo-accent-strong)" : "var(--fomo-text-secondary)",
        fontFamily: "var(--fomo-font-sans)",
        fontSize: "13px",
        fontWeight: 400,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
