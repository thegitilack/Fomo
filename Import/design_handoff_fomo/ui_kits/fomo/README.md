# Fomo — UI kit

High-fidelity, interactive recreation of the Fomo mobile app, composed from the
design-system primitives in `components/`.

## Screens
- **AppShell** — device frame + status bar + (optional) FAB / bottom nav / home indicator.
- **ListScreen** — Today and All views. Flagged tasks float to the top.
- **UpcomingScreen** — dated tasks only, grouped by day under mono date headers.
- **EmptyState** — "Nothing due today." Breathing room, no illustration.
- **TaskDetail** — pushed editing sub-screen (no bottom chrome): back + flag,
  large title with checkbox, chip row, expandable note, delete.
- **AddTaskSheet** — bottom sheet over a scrim with the system `Keyboard`.
- **Keyboard** — theme-aware iOS-style QWERTY (presentational).

## index.html
Wires a small app: switch Today / Upcoming / All, tap a row to open its detail,
toggle completion, delete, and tap **+** to add a task (type on the keyboard,
press return). A Dark / Light toggle above the device flips the theme by
wrapping the tree in `.theme-light`.

## Notes
- All colour comes from the `--fomo-*` tokens in `styles.css`; nothing is
  hard-coded except the keyboard glyphs (⇧ / ⌫, conventional keyboard symbols).
- The caret in the add sheet uses `@keyframes fomo-caret`, defined on the host
  page (`index.html`).
- These compose the published primitives — they do not re-implement `Button`,
  `Checkbox`, `TaskRow`, etc.
