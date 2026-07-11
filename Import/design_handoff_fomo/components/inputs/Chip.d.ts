import * as React from "react";

/**
 * Pill-shaped metadata button (Due date / Priority / Repeat / Note). Inactive
 * shows a hairline outline; active is accent-tinted once a value is set.
 *
 * @startingPoint section="Inputs" subtitle="Metadata pill button" viewport="320x120"
 */
export interface ChipProps {
  /** Visible label, e.g. "Due date" or a set value like "Today · 6:00 PM". */
  label: string;
  /** Leading icon node, typically an <Icon/>. */
  icon?: React.ReactNode;
  /** Active = a value has been chosen (accent-tinted). */
  active?: boolean;
  onClick?: () => void;
}

export function Chip(props: ChipProps): React.ReactElement;
