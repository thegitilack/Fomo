import React from "react";
import { Chip } from "../../components/inputs/Chip.jsx";
import { Icon } from "../../components/icons/Icon.jsx";
import { Keyboard } from "./Keyboard.jsx";

/* Add-task bottom sheet over a scrim, with the system keyboard. The caret
   animation references @keyframes fomo-caret (define it on the host page). */

export function AddTaskSheet({ value = "", onKey, onBackspace, onClose, onSubmit }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "var(--fomo-scrim)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
        <div style={{ background: "var(--fomo-surface-sheet)", borderRadius: "22px 22px 0 0", borderTop: "1px solid var(--fomo-hairline)", padding: "0 24px 22px" }}>
          <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "var(--fomo-ring)", margin: "10px auto 22px" }} />

          <div style={{ paddingBottom: "18px", borderBottom: "1px solid var(--fomo-hairline)" }}>
            <span style={{ fontFamily: "var(--fomo-font-sans)", fontSize: "17px", fontWeight: 300, letterSpacing: "-0.01em", color: value ? "var(--fomo-text-primary)" : "var(--fomo-text-muted)" }}>
              {value || "Task name"}
            </span>
            <span style={{ display: "inline-block", width: "2px", height: "20px", background: "var(--fomo-accent)", verticalAlign: "-4px", marginLeft: "2px", animation: "fomo-caret 1s steps(1) infinite" }} />
          </div>

          <div style={{ display: "flex", gap: "9px", marginTop: "18px", overflow: "hidden" }}>
            <Chip label="Due date" icon={<Icon name="calendar" size={13} stroke="var(--fomo-text-secondary)" />} />
            <Chip label="Priority" icon={<Icon name="flag" size={13} stroke="var(--fomo-text-secondary)" />} />
            <Chip label="Repeat" icon={<Icon name="repeat" size={13} stroke="var(--fomo-text-secondary)" />} />
            <Chip label="Note" icon={<Icon name="note" size={13} stroke="var(--fomo-text-secondary)" />} />
          </div>
        </div>
        <Keyboard onKey={onKey} onBackspace={onBackspace} onReturn={onSubmit} />
      </div>
    </div>
  );
}
