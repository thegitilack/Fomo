import * as React from "react";

/**
 * Circular task checkbox: unfilled ring by default, accent-filled with a check
 * when complete.
 *
 * @startingPoint section="Inputs" subtitle="Circular complete toggle" viewport="240x120"
 */
export interface CheckboxProps {
  /** Completed state. */
  checked?: boolean;
  /** Diameter in px. Default 20 (24 on the detail screen). */
  size?: number;
  /** Click / toggle handler. */
  onChange?: () => void;
  ariaLabel?: string;
}

export function Checkbox(props: CheckboxProps): React.ReactElement;
