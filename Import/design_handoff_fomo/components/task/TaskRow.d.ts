import * as React from "react";

/**
 * A single task line: circular checkbox, task name, optional priority-dot
 * metadata line, optional flag. Flagged tasks float to the top (sort upstream);
 * completed tasks dim + strike through.
 *
 * @startingPoint section="Task" subtitle="One task list row" viewport="360x96"
 */
export interface TaskRowProps {
  /** Task name. */
  name: string;
  /** Optional metadata line, e.g. "Today · 6:00 PM" or "9:30 AM". */
  meta?: string;
  /** Show the priority dot before the metadata. */
  priority?: boolean;
  /** Show the flag glyph (and float to top, handled by the parent list). */
  flagged?: boolean;
  /** Completed: accent-filled checkbox, strike-through, dimmed. */
  done?: boolean;
  /** Toggle completion. */
  onToggle?: () => void;
  /** Open the Task Detail screen. */
  onOpen?: () => void;
  /** Draw the bottom hairline divider. Default true. */
  divider?: boolean;
}

export function TaskRow(props: TaskRowProps): React.ReactElement;
