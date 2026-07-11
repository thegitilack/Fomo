import React from "react";
import { Icon } from "../icons/Icon.jsx";

/* Bottom navigation: three smart views. Icon + label, active tab in primary
   text color, others faint. */

const TABS = [
  { id: "today", label: "Today", icon: "today" },
  { id: "upcoming", label: "Upcoming", icon: "chevron" },
  { id: "all", label: "All", icon: "list" },
];

export function BottomNav({ active = "today", onChange }) {
  return (
    <nav
      style={{
        height: "88px",
        background: "var(--fomo-nav-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--fomo-nav-border)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-around",
        paddingTop: "13px",
      }}
    >
      {TABS.map((t) => {
        const on = t.id === active;
        const color = on ? "var(--fomo-text-primary)" : "var(--fomo-text-faint)";
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange && onChange(t.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              padding: 0,
            }}
          >
            <Icon name={t.icon} size={22} stroke={color} />
            <span
              style={{
                fontFamily: "var(--fomo-font-sans)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.04em",
                color,
              }}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
