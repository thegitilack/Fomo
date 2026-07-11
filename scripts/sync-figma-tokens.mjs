#!/usr/bin/env node
/**
 * Reads a Figma Variables JSON export and rewrites:
 *   - src/index.css  (@theme block)
 *   - src/tokens/tokens.ts
 *
 * How to export from Figma:
 *   1. Open the Figma file
 *   2. Run the "Export/Import Variables" plugin (or any plugin that exports
 *      variables as JSON — Tokens Studio, "Variables to JSON", etc.)
 *   3. Save the output as figma-variables.json in the project root
 *   4. Run: npm run sync-tokens
 *
 * Supported JSON shapes:
 *   - Figma "Export/Import Variables" plugin  → { collections: [...] }
 *   - Tokens Studio                           → flat { global: { tokenName: { value, type } } }
 *   - Raw REST API shape (if ever available)  → { meta: { variables: {...} } }
 *
 * Mapping rules:
 *   COLOR  → --color-{name}
 *   FLOAT  with "spacing" in name → --spacing-{name}
 *   FLOAT  with "radius"  in name → --radius-{name}
 *   Other FLOAT / STRING          → --{name}
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const INPUT = path.join(ROOT, 'figma-variables.json')

// ---------------------------------------------------------------------------
// Colour helpers
// ---------------------------------------------------------------------------

function isRgba(v) {
  return v && typeof v === 'object' && 'r' in v && 'g' in v && 'b' in v
}

function rgbaToHex({ r, g, b, a = 1 }) {
  const h = (n) => Math.round(n * 255).toString(16).padStart(2, '0')
  return a < 1 ? `#${h(r)}${h(g)}${h(b)}${h(a)}` : `#${h(r)}${h(g)}${h(b)}`
}

function slugify(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')
}

function toParts(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-').split('/')
}

// ---------------------------------------------------------------------------
// Normalise → flat list of { name, type, value }
// Handles multiple JSON shapes from different export plugins.
// ---------------------------------------------------------------------------

function normalise(raw) {
  const entries = []

  // Shape 1: Figma "Export/Import Variables" plugin
  // { collections: [{ name, modes: [{ variables: [{ name, type, value }] }] }] }
  if (Array.isArray(raw.collections)) {
    for (const col of raw.collections) {
      const mode = col.modes?.[0]
      if (!mode) continue
      for (const v of mode.variables ?? []) {
        if (v.value == null || (typeof v.value === 'object' && 'type' in v.value)) continue
        entries.push({ name: v.name, type: (v.resolvedType ?? v.type ?? '').toUpperCase(), value: v.value })
      }
    }
    return entries
  }

  // Shape 2: REST API meta.variables object
  // { meta: { variables: { id: { name, resolvedType, valuesByMode } } } }
  if (raw.meta?.variables) {
    for (const v of Object.values(raw.meta.variables)) {
      const value = Object.values(v.valuesByMode ?? {})[0]
      if (value == null || (typeof value === 'object' && 'type' in value)) continue
      entries.push({ name: v.name, type: (v.resolvedType ?? '').toUpperCase(), value })
    }
    return entries
  }

  // Shape 3: Tokens Studio flat format
  // { global: { "color/brand/500": { value: "#2563eb", type: "color" } } }
  for (const group of Object.values(raw)) {
    if (typeof group !== 'object' || Array.isArray(group)) continue
    for (const [name, token] of Object.entries(group)) {
      if (!token?.value) continue
      entries.push({ name, type: (token.type ?? '').toUpperCase(), value: token.value })
    }
  }

  return entries
}

// ---------------------------------------------------------------------------
// Categorise one entry → { cssKey, cssValue, category }
// ---------------------------------------------------------------------------

function categorise({ name, type, value }) {
  const lower = name.toLowerCase()
  const slug = slugify(name)

  // Resolve colour value (RGBA object or hex string)
  if (type === 'COLOR' || isRgba(value)) {
    const cssValue = isRgba(value) ? rgbaToHex(value) : value
    return { cssKey: `--color-${slug}`, cssValue, category: 'colors' }
  }

  if (type === 'FLOAT' || type === 'NUMBER' || typeof value === 'number') {
    const cssValue = `${value}px`
    if (lower.includes('spacing')) return { cssKey: `--spacing-${slug}`, cssValue, category: 'spacing' }
    if (lower.includes('radius'))  return { cssKey: `--radius-${slug}`,  cssValue, category: 'radii' }
    return { cssKey: `--${slug}`, cssValue, category: 'other' }
  }

  if (type === 'STRING' || typeof value === 'string') {
    return { cssKey: `--${slug}`, cssValue: value, category: 'other' }
  }

  return null
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // Check input file exists
  try {
    await fs.access(INPUT)
  } catch {
    console.error(`✖ figma-variables.json not found at project root.`)
    console.error('')
    console.error('Export it from Figma:')
    console.error('  1. Open your Figma file')
    console.error('  2. Run the "Export/Import Variables" plugin')
    console.error('     (or Tokens Studio → Export → JSON)')
    console.error('  3. Save as figma-variables.json in the project root')
    console.error('  4. Re-run: npm run sync-tokens')
    process.exit(1)
  }

  const raw = JSON.parse(await fs.readFile(INPUT, 'utf8'))
  const entries = normalise(raw)

  if (entries.length === 0) {
    console.error('✖ No variables found in figma-variables.json.')
    console.error('  Check the file shape matches one of the supported export formats.')
    process.exit(1)
  }

  const counts = { colors: 0, spacing: 0, radii: 0, other: 0 }
  const cssVars = {}
  const tokenMap = {}

  for (const entry of entries) {
    const result = categorise(entry)
    if (!result) continue

    const { cssKey, cssValue, category } = result
    cssVars[cssKey] = cssValue
    counts[category]++

    // Build nested JS token map
    const parts = toParts(entry.name)
    let node = tokenMap
    for (let i = 0; i < parts.length - 1; i++) {
      node[parts[i]] ??= {}
      node = node[parts[i]]
    }
    node[parts[parts.length - 1]] = cssValue
  }

  // Write src/index.css
  const themeBlock = Object.entries(cssVars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n')

  const css = `@import "tailwindcss";\n\n@theme {\n${themeBlock}\n}\n`
  await fs.writeFile(path.join(ROOT, 'src/index.css'), css, 'utf8')
  console.log('✔ src/index.css written')

  // Write src/tokens/tokens.ts
  const ts = [
    '// Design tokens — generated by scripts/sync-figma-tokens.mjs',
    '// Source: figma-variables.json (export from Figma via plugin)',
    '// Do not edit manually; run: npm run sync-tokens',
    '',
    `export const tokens = ${JSON.stringify(tokenMap, null, 2)} as const`,
    '',
    'export type Tokens = typeof tokens',
    '',
  ].join('\n')

  await fs.writeFile(path.join(ROOT, 'src/tokens/tokens.ts'), ts, 'utf8')
  console.log('✔ src/tokens/tokens.ts written')

  console.log('')
  console.log('Sync summary:')
  console.log(`  Colors:  ${counts.colors}`)
  console.log(`  Spacing: ${counts.spacing}`)
  console.log(`  Radii:   ${counts.radii}`)
  if (counts.other) console.log(`  Other:   ${counts.other}`)
  console.log(`  Total:   ${Object.keys(cssVars).length}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
