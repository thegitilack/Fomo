import React from "react";

/* Centered circular add button. Floats above the bottom nav. */

export function FAB({ onClick, size = 58 }) {
  return (
    <button
      type="button"
      aria-label="Add task"
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--fomo-surface-raised)",
        border: "1px solid var(--fomo-border)",
        boxShadow: "var(--fomo-shadow-fab)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}
    >
      <span style={{ position: "relative", width: "20px", height: "20px", display: "block" }}>
        <span style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)", width: "1.5px", height: "20px", background: "var(--fomo-text-primary)" }} />
        <span style={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)", height: "1.5px", width: "20px", background: "var(--fomo-text-primary)" }} />
      </span>
    </button>
  );
}
