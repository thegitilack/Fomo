import React from "react";

/* Circular task checkbox. Unfilled by default; fills with the accent and shows
   a check on completion. Pair with line-through + dimmed text on the label. */

export function Checkbox({ checked = false, size = 20, onChange, ariaLabel = "Toggle complete" }) {
  const px = size + "px";
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={checked}
      onClick={onChange}
      style={{
        width: px,
        height: px,
        flex: "none",
        padding: 0,
        margin: 0,
        cursor: "pointer",
        borderRadius: "50%",
        background: checked ? "var(--fomo-accent)" : "transparent",
        border: checked ? "1.5px solid var(--fomo-accent)" : "1.5px solid var(--fomo-ring)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 150ms ease, border-color 150ms ease",
      }}
    >
      {checked && (
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6.2l2.3 2.3 4.7-5"
            stroke="var(--fomo-bg)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
