import React from "react";
import { StatusBar } from "../../components/navigation/StatusBar.jsx";
import { BottomNav } from "../../components/navigation/BottomNav.jsx";
import { FAB } from "../../components/navigation/FAB.jsx";

/* Device frame + status bar + (optional) bottom chrome. Screens render their
   content as children; the shell owns the FAB, nav and home indicator. */

export function AppShell({ children, chrome = true, view = "today", onView, onAdd }) {
  return (
    <div
      style={{
        position: "relative",
        width: "390px",
        height: "844px",
        background: "var(--fomo-bg)",
        borderRadius: "46px",
        border: "1px solid var(--fomo-screen-border)",
        overflow: "hidden",
        boxShadow: "var(--fomo-shadow-screen)",
        fontFamily: "var(--fomo-font-sans)",
      }}
    >
      <StatusBar />
      {children}
      {chrome && (
        <React.Fragment>
          <div style={{ position: "absolute", bottom: "106px", left: "50%", transform: "translateX(-50%)" }}>
            <FAB onClick={onAdd} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
            <BottomNav active={view} onChange={onView} />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "9px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "134px",
              height: "5px",
              borderRadius: "3px",
              background: "var(--fomo-home-indicator)",
            }}
          />
        </React.Fragment>
      )}
    </div>
  );
}
