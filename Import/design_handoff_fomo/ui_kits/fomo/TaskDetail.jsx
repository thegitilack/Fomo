import React from "react";
import { Icon } from "../../components/icons/Icon.jsx";
import { Checkbox } from "../../components/inputs/Checkbox.jsx";
import { Chip } from "../../components/inputs/Chip.jsx";

/* Task Detail / Edit. A pushed sub-screen — no bottom nav or FAB. */

export function TaskDetail({ task, onBack, onToggle, onDelete }) {
  const t = task || {};
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 22px 0" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <Icon name="back" size={24} stroke="var(--fomo-text-primary)" />
        </button>
        <Icon name="flag" size={16} stroke="var(--fomo-accent)" />
      </div>

      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "0 26px", marginTop: "26px" }}>
        <div style={{ marginTop: "4px" }}>
          <Checkbox checked={!!t.done} size={24} onChange={onToggle} />
        </div>
        <div
          style={{
            fontFamily: "var(--fomo-font-sans)",
            fontSize: "23px",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
            color: t.done ? "var(--fomo-text-done)" : "var(--fomo-text-primary)",
            textDecoration: t.done ? "line-through" : "none",
            textDecorationColor: "var(--fomo-ring)",
          }}
        >
          {t.name || "Call the pharmacy before it closes"}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "9px", padding: "0 26px", marginTop: "28px" }}>
        <Chip label={t.meta || "Today · 6:00 PM"} active icon={<Icon name="calendar" size={13} stroke="var(--fomo-accent-strong)" />} />
        <Chip label="Flagged" active icon={<Icon name="flag" size={13} stroke="var(--fomo-accent-strong)" />} />
        <Chip label="Repeat" icon={<Icon name="repeat" size={13} stroke="var(--fomo-text-secondary)" />} />
      </div>

      <div style={{ margin: "26px 26px 0", borderRadius: "12px", background: "var(--fomo-note-fill)", border: "1px solid var(--fomo-hairline)", padding: "16px" }}>
        <div style={{ fontFamily: "var(--fomo-font-mono)", fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fomo-text-muted)", marginBottom: "12px" }}>
          Note
        </div>
        <div style={{ fontFamily: "var(--fomo-font-sans)", fontSize: "15px", fontWeight: 300, lineHeight: 1.6, color: "var(--fomo-text-primary)", opacity: 0.85 }}>
          {t.note || "Ask whether the new prescription is ready, and if they can hold it at the front counter until tomorrow morning."}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "40px", left: "26px" }}>
        <button
          onClick={onDelete}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "var(--fomo-font-sans)", fontSize: "15px", fontWeight: 300, color: "var(--fomo-danger)" }}
        >
          Delete task
        </button>
      </div>
      <div style={{ position: "absolute", bottom: "9px", left: "50%", transform: "translateX(-50%)", width: "134px", height: "5px", borderRadius: "3px", background: "var(--fomo-home-indicator)" }} />
    </div>
  );
}
