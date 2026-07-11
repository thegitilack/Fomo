#!/usr/bin/env node
/**
 * Validates that component files don't contain hardcoded design values.
 *
 * Checks:
 *   1. No hardcoded hex colors (#xxx / #xxxxxx / #xxxxxxxx)
 *   2. No hardcoded px values (e.g. 16px, 0.5px) outside of SVG attributes
 *   3. Every Tailwind color utility class (bg-, text-, border-, fill-, stroke-,
 *      outline-, ring-, from-, to-, via-) references a scale that exists in
 *      src/tokens/tokens.ts
 *
 * Exits with code 1 if any violations are found.
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const COMPONENTS_DIR = path.join(ROOT, 'src/components')
const TOKENS_FILE = path.join(ROOT, 'src/tokens/tokens.ts')

// ---------------------------------------------------------------------------
// Parse known color scales from tokens.ts
// We look for top-level keys that contain nested objects: colors.brand, etc.
// ---------------------------------------------------------------------------

async function loadKnownColorScales() {
  let src
  try {
    src = await fs.readFile(TOKENS_FILE, 'utf8')
  } catch {
    console.warn('⚠ Could not read src/tokens/tokens.ts — skipping scale check')
    return new Set()
  }

  // Extract all quoted keys at any depth, e.g. "brand", "neutral", "danger"
  const keys = new Set()
  for (const m of src.matchAll(/"([a-z][a-z0-9-]*)"\s*:/g)) {
    keys.add(m[1])
  }
  return keys
}

// ---------------------------------------------------------------------------
// Patterns
// ---------------------------------------------------------------------------

// Hex colors — but allow them inside SVG fill/stroke attributes (currentColor
// and named colors are fine; hex literals are the problem)
const HEX_RE = /#([0-9a-fA-F]{3,8})\b/g

// Hardcoded px values — e.g. 16px, 1.5px
// We skip SVG geometry attrs (cx, cy, r, x, y, width, height, strokeWidth)
// by only flagging them when they appear as JS string values or className strings.
const PX_RE = /(?<![a-zA-Z])(\d+\.?\d*px)/g

// Tailwind color utility prefixes
const TW_COLOR_PREFIXES = [
  'bg', 'text', 'border', 'fill', 'stroke', 'outline', 'ring',
  'from', 'to', 'via', 'shadow', 'accent', 'caret', 'decoration',
  'placeholder',
]
const TW_COLOR_RE = new RegExp(
  `(?:^|[\\s'"\`])(?:${TW_COLOR_PREFIXES.join('|')})-([a-z][a-z0-9]*)(?:-\\d+)?(?=[\\s'"\`]|$)`,
  'gm'
)

// Lines to skip wholesale (imports, comments, SVG geometry, type annotations)
const SKIP_LINE_RE = /^\s*(\/\/|\/\*|\*|import\s|export\s+type|strokeWidth|cx=|cy=|r=\{)/

// ---------------------------------------------------------------------------
// Check a single file
// ---------------------------------------------------------------------------

async function checkFile(filePath, knownScales) {
  const src = await fs.readFile(filePath, 'utf8')
  const lines = src.split('\n')
  const violations = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNum = i + 1

    if (SKIP_LINE_RE.test(line)) continue

    // 1. Hardcoded hex colors
    for (const m of line.matchAll(HEX_RE)) {
      // Allow hex in comments (already skipped above) and SVG fill attr strings
      // that are part of SVG paths (d= strings contain hex-like substrings)
      if (/d=["']/.test(line)) continue
      violations.push({ lineNum, type: 'hardcoded-hex', value: m[0], line: line.trim() })
    }

    // 2. Hardcoded px values in className or style strings
    // Only flag lines that look like they're inside a className or style prop
    if (/className|style\s*=/.test(line)) {
      for (const m of line.matchAll(PX_RE)) {
        violations.push({ lineNum, type: 'hardcoded-px', value: m[0], line: line.trim() })
      }
    }
  }

  // 3. Unknown Tailwind color scales (whole file scan)
  if (knownScales.size > 0) {
    for (const m of src.matchAll(TW_COLOR_RE)) {
      const scale = m[1]
      // Skip Tailwind built-ins we allow: white, black, transparent, current, inherit
      if (['white', 'black', 'transparent', 'current', 'inherit'].includes(scale)) continue
      if (!knownScales.has(scale)) {
        // Find line number
        const upTo = src.slice(0, m.index)
        const lineNum = upTo.split('\n').length
        violations.push({
          lineNum,
          type: 'unknown-scale',
          value: m[0].trim(),
          line: lines[lineNum - 1]?.trim() ?? '',
        })
      }
    }
  }

  return violations
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const knownScales = await loadKnownColorScales()

  let files
  try {
    const entries = await fs.readdir(COMPONENTS_DIR)
    files = entries
      .filter((f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx'))
      .map((f) => path.join(COMPONENTS_DIR, f))
  } catch {
    console.error(`✖ Could not read ${COMPONENTS_DIR}`)
    process.exit(1)
  }

  if (files.length === 0) {
    console.log('No component files found — nothing to validate.')
    return
  }

  let totalViolations = 0

  for (const file of files) {
    const rel = path.relative(ROOT, file)
    const violations = await checkFile(file, knownScales)

    if (violations.length === 0) {
      console.log(`✔ ${rel}`)
      continue
    }

    console.log(`\n✖ ${rel} — ${violations.length} violation(s):`)
    for (const v of violations) {
      const label = {
        'hardcoded-hex': '⚠ hardcoded hex color',
        'hardcoded-px':  '⚠ hardcoded px value',
        'unknown-scale': '⚠ unknown token scale',
      }[v.type]
      console.log(`  Line ${v.lineNum}: ${label}: ${v.value}`)
      console.log(`    ${v.line}`)
    }
    totalViolations += violations.length
  }

  console.log('')
  if (totalViolations > 0) {
    console.error(`✖ ${totalViolations} token violation(s) found. Use @theme variables from src/index.css.`)
    process.exit(1)
  } else {
    console.log(`✔ All ${files.length} component(s) passed token validation.`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
