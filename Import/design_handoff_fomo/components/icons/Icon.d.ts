import * as React from "react";

export type IconName =
  | "today" | "chevron" | "list" | "plus" | "back"
  | "check" | "flag" | "calendar" | "repeat" | "note";

export interface IconProps {
  /** Which glyph to render. */
  name: IconName;
  /** Square pixel size. Default 22. */
  size?: number;
  /** Stroke (and fill, for flag/today-dot) color. Default currentColor. */
  stroke?: string;
  /** Stroke width. Defaults to 1.5 (1.3 for small-grid glyphs). */
  strokeWidth?: number;
  style?: React.CSSProperties;
}

/** The Fomo line-icon set. */
export function Icon(props: IconProps): React.ReactElement | null;
export const ICON_NAMES: IconName[];
