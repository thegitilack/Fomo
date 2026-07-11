import React from "react";
import { Checkbox } from "../inputs/Checkbox.jsx";
import { Icon } from "../icons/Icon.jsx";

/* A single task line. Composes Checkbox + name + optional priority-dot metadata
   line + optional flag. Flagged rows float to the top of a list (sort upstream).
   Completed rows dim and strike through. */

export function TaskRow({
  name,
  meta,
  priority = false,
  flagged = false,
  done = false,
  onToggle,
  onOpen,
  divider = true,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        padding: "14px 0",
        borderBottom: divider ? "1px solid var(--fomo-divider)" : "none",
      }}
    >
      <Checkbox checked={done} onChange={onToggle} />
      <div
        onClick={onOpen}
        style={{ flex: 1, minWidth: 0, cursor: onOpen ? "pointer" : "default" }}
      >
        <div
          style={{
            fontFamily: "var(--fomo-font-sans)",
            fontSize: "15px",
            fontWeight: 300,
            letterSpacing: "-0.01em",
            lineHeight: 1.35,
            color: done ? "var(--fomo-text-done)" : "var(--fomo-text-primary)",
            textDecoration: done ? "line-through" : "none",
            textDecorationColor: "var(--fomo-ring)",
          }}
        >
          {name}
        </div>
        {meta && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
            {priority && (
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "var(--fomo-accent)",
                  flex: "none",
                }}
              />
            )}
            <span style={{ fontSize: "13px", fontWeight: 400, color: "var(--fomo-text-secondary)" }}>
              {meta}
            </span>
          </div>
        )}
      </div>
      {flagged && (
        <div style={{ marginTop: "2px" }}>
          <Icon name="flag" size={14} stroke="var(--fomo-accent)" />
        </div>
      )}
    </div>
  );
}
