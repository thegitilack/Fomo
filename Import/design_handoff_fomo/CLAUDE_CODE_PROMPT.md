# Claude Code kickoff prompt — Fomo

Copy everything below the line into Claude Code (run it from the folder that
contains this `design_handoff_fomo/` directory).

---

I'm building **Fomo**, a calm, minimal, dark-first personal task manager. The
folder `design_handoff_fomo/` is a complete design handoff — start by reading
`design_handoff_fomo/README.md` in full, then look at the reference screenshots
in `design_handoff_fomo/screenshots/dark/` (and `…/light/` for the paper theme).

**What Fomo is:** one flat task list — no categories, no calendar, no
collaboration. Three smart views surface tasks automatically: Today, Upcoming,
All. It should feel like relief to open, "a beautiful notebook, not a
dashboard." Near-monochrome, warm near-black background, stark off-white type,
lots of negative space, a single warm accent.

**The design system is real code, not just mockups.** Use it directly:
- `design_handoff_fomo/styles.css` + `tokens/` — all color/type/spacing/radius/
  elevation tokens as CSS custom properties (dark `:root` + `.theme-light`).
  Port these into my app's theme layer verbatim — exact values are in the README.
- `design_handoff_fomo/components/` — the primitives (Icon, Checkbox, Chip,
  TaskRow, FAB, BottomNav, StatusBar, Eyebrow, PageTitle), each with a `.jsx`
  reference implementation, a `.d.ts` prop contract, and a `.prompt.md` usage
  note.
- `design_handoff_fomo/ui_kits/fomo/` — the five screens composed from those
  primitives (`index.html` runs the whole app interactively).

**What I want you to do:**
1. Recreate Fomo in the stack we chose already. 
2. Set up the token/theme layer first (dark default, optional `.theme-light`
   paper theme), then build the components to match the reference 1:1, then
   assemble the five screens.
3. Wire the real behavior: checkbox completion (fill + check, strike-through,
   ~150ms), FAB → Add Task sheet, bottom-nav view switching, row → Task Detail,
   flag toggling (flagged tasks float to the top), note editing, delete. State
   model and derived views (Today / Upcoming / All) are in the README. Persist
   tasks locally; single-user, no sync.
4. Match the visuals **pixel-faithfully** — this is a high-fidelity handoff.
   Exact hex, type weights/tracking, and spacing are all in the README.

**Hard constraints (do not add):** no calendar/multi-day views, no habit
streaks / progress rings / gamification, no category or tag systems, no
collaboration UI, no emoji. Keep it minimal — every element must earn its place.

Before writing code, give me a short plan: the framework/structure you'll use,
how you'll map the tokens, and the component build order. Then proceed.
