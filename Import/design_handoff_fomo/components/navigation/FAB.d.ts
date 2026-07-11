import * as React from "react";

/**
 * Centered circular add button. Floats ~16px above the bottom nav.
 * @startingPoint section="Navigation" subtitle="Add-task FAB" viewport="160x160"
 */
export interface FABProps {
  onClick?: () => void;
  /** Diameter in px. Default 58. */
  size?: number;
}
export function FAB(props: FABProps): React.ReactElement;
