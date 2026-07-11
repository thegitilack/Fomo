import * as React from "react";

/** The 28px / weight 300 page title ("Today", "Upcoming"). */
export interface PageTitleProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function PageTitle(props: PageTitleProps): React.ReactElement;
