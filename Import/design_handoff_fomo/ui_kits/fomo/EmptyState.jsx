import React from "react";
import { Eyebrow } from "../../components/typography/Eyebrow.jsx";
import { PageTitle } from "../../components/typography/PageTitle.jsx";

/* Empty state — breathing room, not a void. */

export function EmptyState({ eyebrow = "Sat · 27 June", title = "Today" }) {
  return (
    <div>
      <div style={{ padding: "46px 26px 0" }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <div style={{ height: "8px" }} />
        <PageTitle>{title}</PageTitle>
      </div>
      <div style={{ padding: "0 26px", position: "absolute", top: "340px" }}>
        <div
          style={{
            fontFamily: "var(--fomo-font-sans)",
            fontSize: "19px",
            fontWeight: 300,
            letterSpacing: "-0.01em",
            lineHeight: 1.5,
            color: "var(--fomo-text-primary)",
            opacity: 0.85,
          }}
        >
          Nothing due today.
        </div>
        <div
          style={{
            fontFamily: "var(--fomo-font-sans)",
            fontSize: "15px",
            fontWeight: 300,
            lineHeight: 1.5,
            color: "var(--fomo-text-muted)",
            marginTop: "10px",
          }}
        >
          A good day to rest. Add something only if it matters.
        </div>
      </div>
    </div>
  );
}
