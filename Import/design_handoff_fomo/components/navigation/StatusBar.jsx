import React from "react";

/* iOS-style status bar: time left, signal + battery right. Theme-aware. */

export function StatusBar({ time = "22:01", battery = 41 }) {
  const pct = Math.max(4, Math.min(100, battery));
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 30px 0" }}>
      <span style={{ fontFamily: "var(--fomo-font-sans)", fontSize: "16px", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--fomo-text-primary)" }}>
        {time}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "11px" }}>
          {[4, 6, 8, 11].map((h, i) => (
            <span key={i} style={{ width: "3px", height: h + "px", background: "var(--fomo-text-primary)", borderRadius: "1px" }} />
          ))}
        </div>
        <span style={{ fontFamily: "var(--fomo-font-sans)", fontSize: "13px", fontWeight: 600, color: "var(--fomo-text-primary)" }}>{battery}</span>
        <div style={{ width: "24px", height: "12px", border: "1px solid var(--fomo-ring)", borderRadius: "3px", position: "relative", padding: "1.5px" }}>
          <div style={{ width: pct + "%", height: "100%", background: "var(--fomo-text-primary)", borderRadius: "1px" }} />
          <span style={{ position: "absolute", right: "-3px", top: "3.5px", width: "2px", height: "5px", background: "var(--fomo-ring)", borderRadius: "0 1px 1px 0" }} />
        </div>
      </div>
    </div>
  );
}
