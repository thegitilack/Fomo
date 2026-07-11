import React from "react";
import { Eyebrow } from "../../components/typography/Eyebrow.jsx";
import { PageTitle } from "../../components/typography/PageTitle.jsx";
import { TaskRow } from "../../components/task/TaskRow.jsx";

/* Upcoming view: dated tasks only, grouped by day under mono date headers. */

export function UpcomingScreen({ groups, onToggle, onOpen }) {
  return (
    <div>
      <div style={{ padding: "46px 26px 0" }}>
        <Eyebrow>Next 7 days</Eyebrow>
        <div style={{ height: "8px" }} />
        <PageTitle>Upcoming</PageTitle>
      </div>
      <div style={{ padding: "24px 26px 0" }}>
        {groups.map((g, gi) => (
          <div key={gi}>
            <div
              style={{
                fontFamily: "var(--fomo-font-mono)",
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--fomo-text-muted)",
                padding: gi === 0 ? "14px 0 4px" : "22px 0 4px",
              }}
            >
              {g.label}
            </div>
            {g.tasks.map((t, i) => (
              <TaskRow
                key={t.id}
                {...t}
                divider={i < g.tasks.length - 1}
                onToggle={() => onToggle(t.id)}
                onOpen={() => onOpen(t.id)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
