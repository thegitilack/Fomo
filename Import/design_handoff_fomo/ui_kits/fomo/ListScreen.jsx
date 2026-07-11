import React from "react";
import { Eyebrow } from "../../components/typography/Eyebrow.jsx";
import { PageTitle } from "../../components/typography/PageTitle.jsx";
import { TaskRow } from "../../components/task/TaskRow.jsx";

/* Today / All view content. Flagged tasks float to the top. */

export function ListScreen({ eyebrow, title, tasks, onToggle, onOpen }) {
  const sorted = [...tasks].sort((a, b) => (b.flagged ? 1 : 0) - (a.flagged ? 1 : 0));
  return (
    <div>
      <div style={{ padding: "46px 26px 0" }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <div style={{ height: "8px" }} />
        <PageTitle>{title}</PageTitle>
      </div>
      <div style={{ padding: "30px 26px 0" }}>
        {sorted.map((t, i) => (
          <TaskRow
            key={t.id}
            {...t}
            divider={i < sorted.length - 1}
            onToggle={() => onToggle(t.id)}
            onOpen={() => onOpen(t.id)}
          />
        ))}
      </div>
    </div>
  );
}
