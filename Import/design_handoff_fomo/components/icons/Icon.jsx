import React from "react";

/* Fomo line-icon set. Every icon in the app is a simple geometric line/shape
   icon — recreate-able with any thin-stroke icon library. Color comes from the
   `stroke` prop (defaults to currentColor); the flag and today-dot are filled. */

const ICONS = {
  today: {
    vb: "0 0 24 24",
    el: (c, sw) => [
      <circle key="r" cx="12" cy="12" r="6.5" stroke={c} strokeWidth={sw} fill="none" />,
      <circle key="d" cx="12" cy="12" r="1.7" fill={c} />,
    ],
  },
  chevron: {
    vb: "0 0 24 24",
    el: (c, sw) => [
      <path key="p" d="M9 6l6 6-6 6" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    ],
  },
  list: {
    vb: "0 0 24 24",
    el: (c, sw) => [
      <path key="p" d="M5 8h14M5 12h14M5 16h10" stroke={c} strokeWidth={sw} strokeLinecap="round" />,
    ],
  },
  plus: {
    vb: "0 0 24 24",
    el: (c, sw) => [
      <path key="p" d="M12 5v14M5 12h14" stroke={c} strokeWidth={sw} strokeLinecap="round" />,
    ],
  },
  back: {
    vb: "0 0 24 24",
    el: (c, sw) => [
      <path key="p" d="M15 5l-7 7 7 7" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    ],
  },
  check: {
    vb: "0 0 12 12",
    el: (c, sw) => [
      <path key="p" d="M2.5 6.2l2.3 2.3 4.7-5" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    ],
  },
  flag: {
    vb: "0 0 12 14",
    el: (c, sw) => [
      <path key="pole" d="M2 1v12" stroke={c} strokeWidth={sw} strokeLinecap="round" />,
      <path key="pen" d="M2.4 1.6l7.6 2.1-7.6 2.1z" fill={c} fillOpacity="0.9" />,
    ],
  },
  calendar: {
    vb: "0 0 14 14",
    el: (c, sw) => [
      <rect key="b" x="1.5" y="2.5" width="11" height="10" rx="2" stroke={c} strokeWidth={sw} fill="none" />,
      <path key="l" d="M1.5 5.5h11M4.5 1v2M9.5 1v2" stroke={c} strokeWidth={sw} strokeLinecap="round" />,
    ],
  },
  repeat: {
    vb: "0 0 14 14",
    el: (c, sw) => [
      <path key="a" d="M2 7a5 5 0 1 1 1.5 3.6" stroke={c} strokeWidth={sw} strokeLinecap="round" fill="none" />,
      <path key="h" d="M2 11V7.5h3.5" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    ],
  },
  note: {
    vb: "0 0 14 14",
    el: (c, sw) => [
      <path key="p" d="M3 3.5h8M3 7h8M3 10.5h5" stroke={c} strokeWidth={sw} strokeLinecap="round" />,
    ],
  },
};

export function Icon({ name, size = 22, stroke = "currentColor", strokeWidth = 1.5, style }) {
  const ic = ICONS[name];
  if (!ic) return null;
  // small glyphs (native viewBox < 16) read better with a slightly heavier stroke
  const sw = strokeWidth ?? (ic.vb.endsWith("12") || ic.vb.endsWith("14") ? 1.3 : 1.5);
  return (
    <svg width={size} height={size} viewBox={ic.vb} fill="none" style={{ display: "block", flex: "none", ...style }}>
      {ic.el(stroke, sw)}
    </svg>
  );
}

export const ICON_NAMES = Object.keys(ICONS);
