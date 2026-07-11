# Sync Figma tokens

Pull design tokens from the Figma file via MCP and rewrite the token files.

**Prerequisites:** Figma desktop app must be open with the file `RSx8gDQ0u9A1N9pBuQjPDI` and at least one layer selected.

## Steps

1. Call `get_variable_defs` with `fileKey: "RSx8gDQ0u9A1N9pBuQjPDI"` and `nodeId: "2030:492"`.

2. Parse the returned variable definitions using these mapping rules:
   - `COLOR` type → CSS key `--color-{slugified-name}`, value as hex
   - `FLOAT` with "spacing" in name → `--spacing-{slugified-name}`, value as `{n}px`
   - `FLOAT` with "radius" in name → `--radius-{slugified-name}`, value as `{n}px`
   - All other `FLOAT` / `STRING` → `--{slugified-name}`
   - Slugify: lowercase, spaces→hyphens, slashes→hyphens
   - Skip alias variables (value objects with a `type` field referencing another variable)

3. Overwrite `src/index.css` with this exact shape — preserve nothing from the old file:
   ```css
   @import "tailwindcss";

   @theme {
     --color-...: ...;
     --spacing-...: ...;
     --radius-...: ...;
   }
   ```

4. Overwrite `src/tokens/tokens.ts` with this exact shape:
   ```ts
   // Design tokens — synced from Figma via MCP
   // Do not edit manually; run: /sync-tokens

   export const tokens = { ... } as const

   export type Tokens = typeof tokens
   ```
   Build the `tokens` object as a nested structure mirroring the variable name path
   (e.g. `colors/brand/500` → `tokens.colors.brand['500']`).

5. Run `npm run validate-tokens` and report the result.

6. Print a summary: X colors, X spacing, X radii synced.
