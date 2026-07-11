import * as React from "react";

/** iOS-style status bar: time + signal/battery. Inherits the active theme. */
export interface StatusBarProps {
  /** 24h time string. Default "22:01". */
  time?: string;
  /** Battery percent 0–100. Default 41. */
  battery?: number;
}
export function StatusBar(props: StatusBarProps): React.ReactElement;
