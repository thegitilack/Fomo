# Design System — Claude Code Rules

## Stack

- Vite 6 · React 19 · TypeScript · Storybook 8 · Tailwind CSS v4
- Vite is **pinned to v6** — Storybook 8 requires `peer vite@"^4 || ^5 || ^6"`; do not upgrade to Vite 7+.

## Component rules

- **Only use components that exist in Storybook.** Before building any screen or composing components, call the Storybook MCP to list available components.
- **New pattern = stories first.** When a new component is needed, write the `.stories.tsx` file before the implementation. The story is the contract.
- Every component lives in `src/components/<Name>.tsx` with a `src/components/<Name>.stories.tsx` alongside it.
- All components must be exported from `src/components/index.ts`.

## Token rules

- **No hardcoded colors, spacing, or radii.** Every value must come from the `@theme` block in `src/index.css`.
- Use Tailwind utility classes that map to `@theme` variables (e.g. `bg-brand-600`, `text-neutral-700`, `rounded-lg`).
- The JS mirror of tokens is at `src/tokens/tokens.ts` — use it when you need token values in non-CSS contexts.

## Building screens

1. Call the Storybook MCP (`storybook_get_index` or equivalent) to list available components.
2. Compose only from that list. If a needed component doesn't exist, create its story first (see above).
3. Never reach outside `src/components/` for UI primitives.

## Figma token sync

Preferred method — **MCP (interactive):**
- Open the Figma file in the desktop app and select any layer
- Run `/sync-tokens` (Claude Code slash command) — calls `get_variable_defs` via MCP and rewrites both token files directly
- Or from the terminal: `npm run sync-tokens-mcp`

Fallback method — **plugin JSON export:**
- Export variables from Figma using the "Export/Import Variables" plugin → save as `figma-variables.json` at the project root
- `npm run sync-tokens` — reads `figma-variables.json`, rewrites `src/index.css` + `src/tokens/tokens.ts`, then validates

Both methods run `npm run validate-tokens` at the end.
`npm run sync-and-dev` / `npm run sync-and-storybook` — sync then launch.

## Storybook MCP

The Storybook MCP server runs against `http://localhost:6006`. Start Storybook first (`npm run storybook`), then the MCP is available in this project via `.claude/mcp.json`.
