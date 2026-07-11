import * as React from "react";

export type FomoView = "today" | "upcoming" | "all";

/**
 * Bottom navigation bar — the three smart views. Active tab in primary color,
 * inactive faint. Blurred translucent background.
 * @startingPoint section="Navigation" subtitle="Three-tab bottom bar" viewport="390x100"
 */
export interface BottomNavProps {
  active?: FomoView;
  onChange?: (view: FomoView) => void;
}
export function BottomNav(props: BottomNavProps): React.ReactElement;
