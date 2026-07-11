# Handoff: Fomo — Design System & App Screens

A complete Claude Code handoff for **Fomo**, a calm, minimal, near-monochrome
personal task manager. This bundle contains both the **design system** (tokens +
components) and the **five app screens** built from it.

---

## What Fomo is
One flat task list — no categories, no calendar, no collaboration. Three smart
views surface the right tasks automatically: **Today**, **Upcoming**, **All**.
The product goal is that opening the app feels like *relief*, not a productivity
system: "a beautiful notebook, not a dashboard." Visually it is dark-first and
near-monochromatic (reference: the Co-Star astrology app) — warm near-black
backgrounds, stark off-white type, maximum negative space, and a single warm
accent used only where it earns its place.

## About the files in this bundle
Unlike a pure mock handoff, this is a **working HTML/CSS/JSX design system**, not
just throwaway prototypes. The files are still **design references** — the task
is to **recreate them in your target codebase's environment** (React Native,
SwiftUI, Flutter, a web framework, etc.) using its established patterns. But
because the system is real code, you can lift the token values and component
logic directly rather than reverse-engineering them from screenshots.

If there is **no codebase yet**, pick the most appropriate framework for a
single-user mobile task app and implement there. The token + component structure
here maps cleanly onto any component framework.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, radii, and interaction
intent are all specified and present in code. Recreate pixel-faithfully using
your framework's primitives.

---

## How this bundle is organized

```
design_handoff_fomo/
  README.md                  ← you are here (self-sufficient)
  styles.css                 ← global entry; @imports all tokens
  tokens/
    colors.css               ← dark :root + .theme-light, every color token
    typography.css           ← font stacks + type scale custom properties
    spacing.css              ← spacing scale
    radius.css               ← radii
    elevation.css            ← shadows (dark + light)
  components/                ← reusable primitives, each .jsx + .d.ts + .prompt.md
    icons/Icon.jsx
    inputs/Checkbox.jsx, inputs/Chip.jsx
    task/TaskRow.jsx
    navigation/FAB.jsx, BottomNav.jsx, StatusBar.jsx
    typography/Eyebrow.jsx, PageTitle.jsx
  ui_kits/fomo/             ← the five screens, composed from the primitives
    AppShell.jsx, ListScreen.jsx, UpcomingScreen.jsx,
    EmptyState.jsx, TaskDetail.jsx, AddTaskSheet.jsx, Keyboard.jsx
    index.html               ← runnable interactive app (open in a browser)
  design-system.html         ← single-page visual overview of all tokens + components
  screens/
    Fomo.dc.html             ← dark theme, all 5 screens laid out (visual reference)
    Fomo Light.dc.html       ← light/paper theme
```

The `.jsx` components are plain React (no build step assumed — they read CSS
custom properties for all styling). The `.d.ts` files give you exact prop
contracts; the `.prompt.md` files give a one-paragraph usage note per component.

---

## DESIGN TOKENS

All styling flows through CSS custom properties defined in `tokens/`. Dark is the
default (`:root`); the paper theme is the same token names redefined under
`.theme-light`. **Recreate these as your platform's token/theme layer** — the
exact values are below (and authoritative in `tokens/colors.css`).

### Colors — Dark (default)
| Token | Hex / value | Use |
|---|---|---|
| `--fomo-bg` | `#0b0b0a` | screen background (warm near-black) |
| `--fomo-surface-sheet` | `#141413` | add-task sheet |
| `--fomo-surface-raised` | `#1a1a16` | FAB |
| `--fomo-keyboard-bg` | `#1c1c1e` | system keyboard backdrop |
| `--fomo-key` | `#545456` | keyboard letter key |
| `--fomo-key-special` | `#3a3a3c` | keyboard modifier key |
| `--fomo-text-primary` | `#eceae6` | titles, task names, status bar |
| `--fomo-text-secondary` | `#86837c` | metadata (date/time) |
| `--fomo-text-muted` | `#6f6c66` | eyebrows, date-group headers |
| `--fomo-text-faint` | `#66645e` | inactive nav |
| `--fomo-text-done` | `#5f5d57` | completed task (with line-through) |
| `--fomo-accent` | `#c6a47a` | **the only hue** — priority dot, flag, caret, done-fill, return key |
| `--fomo-accent-strong` | `#d8c3a1` | active chip text/icon |
| `--fomo-on-accent` | `#1a140b` | text on a filled accent surface |
| `--fomo-danger` | `#9a6b5e` | destructive (Delete task) |
| `--fomo-divider` | `rgba(255,255,255,0.055)` | task-row separators |
| `--fomo-ring` | `rgba(255,255,255,0.30)` | checkbox outline |
| `--fomo-hairline` | `rgba(255,255,255,0.07)` | card / sheet borders |
| `--fomo-border` | `rgba(255,255,255,0.13)` | chip outline |
| `--fomo-screen-border` | `rgba(255,255,255,0.09)` | device frame |
| `--fomo-nav-bg` | `rgba(11,11,10,0.94)` | bottom bar (blurred) |
| `--fomo-nav-border` | `rgba(255,255,255,0.06)` | bottom bar top border |
| `--fomo-scrim` | `rgba(0,0,0,0.50)` | add-task overlay |
| `--fomo-note-fill` | `rgba(255,255,255,0.03)` | note card fill |
| `--fomo-chip-active-bd` | `rgba(198,164,122,0.45)` | active chip border |
| `--fomo-chip-active-bg` | `rgba(198,164,122,0.10)` | active chip fill |
| `--fomo-home-indicator` | `rgba(255,255,255,0.16)` | iOS home indicator |

### Colors — Light / paper (`.theme-light`)
| Token | Hex / value |
|---|---|
| `--fomo-bg` | `#f4f2ec` |
| `--fomo-surface-raised` | `#ffffff` |
| `--fomo-surface-sheet` | `#faf8f3` |
| `--fomo-keyboard-bg` | `#d3d6dc` |
| `--fomo-key` | `#ffffff` |
| `--fomo-key-special` | `#adb2bc` |
| `--fomo-text-primary` | `#1a1712` |
| `--fomo-text-secondary` | `#837e72` |
| `--fomo-text-muted` | `#9a958a` |
| `--fomo-text-faint` | `#a8a298` |
| `--fomo-text-done` | `#b3aea3` |
| `--fomo-accent` | `#a8742f` (deeper ochre for contrast on paper) |
| `--fomo-accent-strong` | `#8a5f24` |
| `--fomo-on-accent` | `#fbf6ee` |
| `--fomo-danger` | `#a1503f` |
| `--fomo-divider` | `rgba(0,0,0,0.07)` |
| `--fomo-ring` | `rgba(0,0,0,0.30)` |
| `--fomo-hairline` | `rgba(0,0,0,0.07)` |
| `--fomo-border` | `rgba(0,0,0,0.13)` |
| `--fomo-screen-border` | `rgba(0,0,0,0.09)` |
| `--fomo-nav-bg` | `rgba(244,242,236,0.90)` |
| `--fomo-note-fill` | `rgba(0,0,0,0.025)` |
| `--fomo-chip-active-bd` | `rgba(168,116,47,0.50)` |
| `--fomo-chip-active-bg` | `rgba(168,116,47,0.12)` |
| `--fomo-home-indicator` | `rgba(0,0,0,0.18)` |

### Typography
System font stack only — **renders as San Francisco on Apple platforms**:
`-apple-system, "Segoe UI", system-ui, sans-serif`. Small uppercase labels use a
monospace stack: `ui-monospace, "SF Mono", "Segoe UI Mono", Menlo, monospace`.
No webfonts are shipped — these are platform fonts by design.

| Role | Size | Weight | Tracking | Notes |
|---|---|---|---|---|
| Page title (Today/Upcoming) | 28 | 300 | −0.025em | |
| Detail task title | 23 | 300 | −0.02em | line-height 1.3 |
| Task name | 15 | 300 | −0.01em | line-height 1.35 |
| Metadata | 13 | 400 | — | |
| Eyebrow / date-group header | 11 | 400 (mono) | 0.18–0.20em | UPPERCASE |
| Bottom-bar label | 11 | 500 | 0.04em | |
| Note body | 15 | 300 | — | line-height 1.6 |
| Status-bar time | 16 | 600 | −0.01em | |
| Empty-state primary | 19 | 300 | −0.01em | |

### Spacing
26 screen horizontal padding · 14 task-row vertical padding · 14 checkbox→text
gap · 6 name→metadata gap · 22 between Upcoming date groups · 46 from status bar
to page title. Scale: 4 / 6 / 8 / 12 / 14 / 18 / 22 / 26 / 46.

### Radius
sm 4 · md 8 · lg 12 (note card) · sheet 22 (sheet top corners) · full 999
(chips, FAB, checkbox). Device frame 46 (mock only).

### Elevation (shadows are quiet)
- FAB (dark): `0 12px 30px -8px rgba(0,0,0,0.70)` · (light) `0 10px 26px -8px rgba(0,0,0,0.16)`
- Screen/device: `0 40px 90px -30px rgba(0,0,0,0.70)` · (light) `0 30px 70px -28px rgba(0,0,0,0.22)`
- Keyboard key: `0 1px 0 rgba(0,0,0,0.40)` · (light) `0 1px 0 rgba(0,0,0,0.15)`
Only the FAB floats in app chrome; content has no drop shadows.

---

## COMPONENTS
Each has source in `components/<group>/`. Props are authoritative in the `.d.ts`.

- **Icon** (`icons/Icon.jsx`) — the entire icon set, thin-stroke geometric line
  icons (no icon font, no SVG files). Names: `today` (ring+dot), `chevron`,
  `list`, `plus`, `back`, `check`, `flag` (filled pennant), `calendar`,
  `repeat`, `note`. Stroke ~1.5 (1.3 on small glyphs); color via `stroke` prop.
  Closest CDN equivalent if you must substitute: Lucide/Feather at ~1.5px.
- **Checkbox** (`inputs/Checkbox.jsx`) — circular. Unfilled ring (`--fomo-ring`)
  by default; on `checked`, fills with `--fomo-accent` + check glyph. Always
  pair completion with strike-through + `--fomo-text-done` on the label.
  ~150ms ease. Sizes 20 (list) / 24 (detail).
- **Chip** (`inputs/Chip.jsx`) — pill metadata button. Inactive = hairline
  outline + secondary text. Active (a value set) = accent-tinted. The four
  canonical chips: Due date, Priority (flag), Repeat, Note.
- **TaskRow** (`task/TaskRow.jsx`) — checkbox + name + optional priority-dot
  metadata line + optional flag. Flagged rows float to the top of a list (sort
  upstream). Completed rows dim + strike. Rows divided by `--fomo-divider`.
- **FAB** (`navigation/FAB.jsx`) — centered circular add button, floats above
  the nav. 58px.
- **BottomNav** (`navigation/BottomNav.jsx`) — three tabs (Today/Upcoming/All)
  with the `today`/`chevron`/`list` icons. Active = primary color, inactive =
  faint. Translucent blurred background.
- **StatusBar** (`navigation/StatusBar.jsx`) — iOS-style time + signal/battery.
- **Eyebrow** / **PageTitle** (`typography/`) — the mono date label and the
  weight-300 view title that open every screen.

---

## SCREENS (`ui_kits/fomo/`)
Composed from the primitives above. `index.html` runs them as an interactive
app; `screens/Fomo.dc.html` shows all five laid out for visual reference.

1. **Today** (`ListScreen`) — eyebrow (`SAT · 27 JUNE`) + title `Today`, then the
   task list. Flagged tasks float to top. FAB + bottom nav present.
   Content order: "Call the pharmacy before it closes" (flag, priority, Today ·
   6:00 PM) → "Sign the apartment lease" (flag, Today) → "Reply to Mara about the
   weekend" (9:30 AM) → "Water the olive tree" → "Finish the last chapter"
   (priority, Today) → "Morning walk" (completed).
2. **Add task** (`AddTaskSheet` over a screen) — bottom sheet over a 50% scrim:
   grab handle, single text input with a blinking accent caret, chip row (Due
   date / Priority / Repeat / Note), and the system `Keyboard` below. *In a real
   build the keyboard is the OS keyboard — don't rebuild it.*
3. **Upcoming** (`UpcomingScreen`) — dated tasks only, grouped by day under mono
   date headers (`TOMORROW · SUN 28`, `MONDAY 29`, `TUESDAY 30`). Tasks without a
   due date never appear here.
4. **Task Detail** (`TaskDetail`) — pushed sub-screen (no bottom nav/FAB): back
   chevron + flag toggle, large title with checkbox, chip row (active chips
   accent-tinted), expandable note card, "Delete task" pinned near the bottom.
5. **Empty State** (`EmptyState`) — Today with nothing due. "Nothing due today."
   + "A good day to rest. Add something only if it matters." Breathing room, no
   illustration, no bright color.

---

## INTERACTIONS & BEHAVIOR
- **Checkbox tap** → toggle complete (fill + check, ~150ms ease; label strikes
  through and dims).
- **FAB tap** → present Add Task sheet (slide up, scrim fades in, input
  auto-focuses, keyboard rises).
- **Bottom nav** → switch Today / Upcoming / All.
- **Task row tap** → open Task Detail.
- **Flag toggle (detail)** → toggle flagged; reflected in accent. Flagged tasks
  sort to the top of a view.
- **Note chip / field** → expand the note editor.
- **Delete task** → remove + return to the list.
- Motion is calm: short soft easing, no bounce/spring, no gamified flourishes.

## STATE MODEL
- `tasks[]`: `{ id, name, done, flagged, priority (bool), dueDate?, dueTime?, note? }`
- Derived views: **Today** = due today OR undated-but-active (flagged first);
  **Upcoming** = future due date only, grouped by day; **All** = everything.
- `activeView`: 'today' | 'upcoming' | 'all'. `addSheetOpen`: bool.
  `editingTaskId`: id | null.
- Single-user; persist locally. No sync/collaboration UI.

## EXPLICITLY EXCLUDED (do not add)
Light mode was originally out of scope but a paper theme is now included as an
*optional* alternate — dark remains the default. Still excluded: calendar /
multi-day views, habit streaks / progress rings / gamification, category or tag
systems, collaboration UI. No emoji anywhere.

## ASSETS
None. No raster images, logos, or photography. All icons are the geometric
line set in `components/icons/Icon.jsx`. The keyboard is the OS keyboard.

## Screenshots
`screenshots/dark/` and `screenshots/light/` contain rendered PNGs of all five
screens in each theme (`01-today`, `02-add-task`, `03-upcoming`,
`04-task-detail`, `05-empty-state`). Use them as the visual target.

## Where to start
Read `CLAUDE_CODE_PROMPT.md` for a ready-to-paste kickoff prompt.

## Quick start to view the references
Open `design-system.html` for the token + component overview, and
`ui_kits/fomo/index.html` for the runnable app (tap rows, add tasks, switch
views, toggle theme). Both are self-contained — no server or build needed.
