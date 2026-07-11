import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '../tokens/tokens'

const meta: Meta = {
  title: 'Design Tokens/Overview',
  parameters: { layout: 'fullscreen' },
}
export default meta

// ─── CSS-variable-aware color constants ──────────────────────────────────────
// Use var(--color-*) so the theme toggle flips light ↔ dark automatically.

const V = {
  bg:           'var(--color-bg)',
  sheet:        'var(--color-surface-sheet)',
  raised:       'var(--color-surface-raised)',
  textPrimary:  'var(--color-text-primary)',
  textSecondary:'var(--color-text-secondary)',
  accent:       'var(--color-accent)',
  borderDefault:'var(--color-border-default)',
  fontSans:     tokens.typography.fontSans,
  fontMono:     tokens.typography.fontMono,
}

// ─── Layout helpers ──────────────────────────────────────────────────────────

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: V.bg,
      color: V.textPrimary,
      fontFamily: V.fontSans,
      minHeight: '100vh',
      padding: '48px 40px',
      transition: 'background 0.2s, color 0.2s',
    }}>
      {children}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 64 }}>
      <p style={{
        fontSize: 11,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: V.textSecondary,
        fontFamily: V.fontMono,
        marginBottom: 24,
        margin: '0 0 24px',
      }}>
        {title}
      </p>
      {children}
    </section>
  )
}

function Row({ children, gap = 12 }: { children: React.ReactNode; gap?: number }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap }}>{children}</div>
}

// ─── Swatch — uses a CSS var as background so it flips with theme ────────────

function Swatch({ label, cssVar, value }: { label: string; cssVar: string; value: string }) {
  return (
    <div style={{ width: 140 }}>
      <div style={{
        width: '100%',
        height: 56,
        borderRadius: 8,
        background: `var(${cssVar})`,
        border: `1px solid ${V.borderDefault}`,
        marginBottom: 8,
        /* checkerboard underlay for transparent swatches */
        backgroundImage: [
          `var(${cssVar})`,
          'linear-gradient(45deg,#888 25%,transparent 25%)',
          'linear-gradient(-45deg,#888 25%,transparent 25%)',
          'linear-gradient(45deg,transparent 75%,#888 75%)',
          'linear-gradient(-45deg,transparent 75%,#888 75%)',
        ].join(','),
        backgroundSize: '100% 100%, 8px 8px, 8px 8px, 8px 8px, 8px 8px',
        backgroundPosition: '0 0, 0 0, 0 4px, 4px -4px, -4px 0',
      }} />
      <p style={{ fontSize: 12, color: V.textPrimary, margin: '0 0 2px', fontWeight: 500 }}>{label}</p>
      <p style={{ fontSize: 11, color: V.textSecondary, margin: 0, fontFamily: V.fontMono }}>{value}</p>
    </div>
  )
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Colors: StoryObj = {
  render: () => (
    <Page>
      <Section title="Colors — Surfaces">
        <Row>
          <Swatch label="bg"             cssVar="--color-bg"             value={tokens.color.bg} />
          <Swatch label="surface-sheet"  cssVar="--color-surface-sheet"  value={tokens.color.surfaceSheet} />
          <Swatch label="surface-raised" cssVar="--color-surface-raised" value={tokens.color.surfaceRaised} />
        </Row>
      </Section>

      <Section title="Colors — Text">
        <Row>
          <Swatch label="text-primary"   cssVar="--color-text-primary"   value={tokens.color.textPrimary} />
          <Swatch label="text-secondary" cssVar="--color-text-secondary" value={tokens.color.textSecondary} />
          <Swatch label="text-muted"     cssVar="--color-text-muted"     value={tokens.color.textMuted} />
          <Swatch label="text-faint"     cssVar="--color-text-faint"     value={tokens.color.textFaint} />
          <Swatch label="text-done"      cssVar="--color-text-done"      value={tokens.color.textDone} />
          <Swatch label="text-inverse"   cssVar="--color-text-inverse"   value={tokens.color.textInverse} />
        </Row>
      </Section>

      <Section title="Colors — Accent &amp; Semantic">
        <Row>
          <Swatch label="accent"        cssVar="--color-accent"        value={tokens.color.accent} />
          <Swatch label="accent-strong" cssVar="--color-accent-strong" value={tokens.color.accentStrong} />
          <Swatch label="on-accent"     cssVar="--color-on-accent"     value={tokens.color.onAccent} />
          <Swatch label="danger"        cssVar="--color-danger"        value={tokens.color.danger} />
        </Row>
      </Section>

      <Section title="Colors — Lines &amp; Overlays">
        <Row>
          <Swatch label="border-default" cssVar="--color-border-default" value={tokens.color.borderDefault} />
          <Swatch label="border-subtle"  cssVar="--color-border-subtle"  value={tokens.color.borderSubtle} />
          <Swatch label="border-accent"  cssVar="--color-border-accent"  value={tokens.color.borderAccent} />
          <Swatch label="border-error"   cssVar="--color-border-error"   value={tokens.color.borderError} />
          <Swatch label="hairline"       cssVar="--color-hairline"       value={tokens.color.hairline} />
          <Swatch label="ring"           cssVar="--color-ring"           value={tokens.color.ring} />
          <Swatch label="divider"        cssVar="--color-divider"        value={tokens.color.divider} />
          <Swatch label="scrim"          cssVar="--color-scrim"          value={tokens.color.scrim} />
        </Row>
      </Section>
    </Page>
  ),
}

export const Typography: StoryObj = {
  render: () => (
    <Page>
      <Section title="Typography — Font Families">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'sans', value: tokens.typography.fontSans },
            { label: 'mono', value: tokens.typography.fontMono },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: V.sheet,
              borderRadius: 8,
              padding: '16px 20px',
              border: `1px solid ${V.borderDefault}`,
            }}>
              <p style={{ fontSize: 11, color: V.textSecondary, fontFamily: V.fontMono, margin: '0 0 8px' }}>{label}</p>
              <p style={{ fontSize: 18, color: V.textPrimary, fontFamily: value, margin: 0 }}>
                The quick brown fox jumps over the lazy dog
              </p>
              <p style={{ fontSize: 11, color: V.textSecondary, margin: '6px 0 0', fontFamily: V.fontMono, wordBreak: 'break-all' }}>{value}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography — Type Scale">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(
            [
              ['3xl',  tokens.typography.size3xl],
              ['2xl',  tokens.typography.size2xl],
              ['xl',   tokens.typography.sizeXl],
              ['lg',   tokens.typography.sizeLg],
              ['base', tokens.typography.sizeBase],
              ['sm',   tokens.typography.sizeSm],
              ['xs',   tokens.typography.sizeXs],
            ] as const
          ).map(([name, size]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
              <span style={{ width: 40, fontSize: 11, color: V.textSecondary, fontFamily: V.fontMono, flexShrink: 0 }}>{name}</span>
              <span style={{ width: 36, fontSize: 11, color: V.textSecondary, fontFamily: V.fontMono, flexShrink: 0 }}>{size}</span>
              <span style={{ fontSize: size, color: V.textPrimary, lineHeight: 1.2 }}>Fomo Design System</span>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  ),
}

export const Spacing: StoryObj = {
  render: () => (
    <Page>
      <Section title="Spacing">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(Object.entries(tokens.spacing) as [string, string][]).map(([name, value]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <span style={{ width: 36, fontSize: 11, color: V.textSecondary, fontFamily: V.fontMono, flexShrink: 0 }}>{name}</span>
              <span style={{ width: 36, fontSize: 11, color: V.textSecondary, fontFamily: V.fontMono, flexShrink: 0 }}>{value}</span>
              <div style={{
                height: 20,
                width: value,
                background: V.accent,
                borderRadius: 3,
                flexShrink: 0,
                minWidth: value === '0px' ? 2 : undefined,
                opacity: value === '0px' ? 0.2 : 1,
              }} />
            </div>
          ))}
        </div>
      </Section>
    </Page>
  ),
}

export const Radius: StoryObj = {
  render: () => (
    <Page>
      <Section title="Border Radius">
        <Row gap={20}>
          {(Object.entries(tokens.radius) as [string, string][]).map(([name, value]) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div style={{
                width: 72,
                height: 72,
                background: V.sheet,
                border: `1px solid ${V.borderDefault}`,
                borderRadius: value,
                marginBottom: 10,
              }} />
              <p style={{ fontSize: 12, color: V.textPrimary, margin: '0 0 2px', fontWeight: 500 }}>{name}</p>
              <p style={{ fontSize: 11, color: V.textSecondary, margin: 0, fontFamily: V.fontMono }}>{value}</p>
            </div>
          ))}
        </Row>
      </Section>
    </Page>
  ),
}

export const Elevation: StoryObj = {
  render: () => (
    <Page>
      <Section title="Elevation — Shadows">
        <Row gap={40}>
          {(Object.entries(tokens.shadow) as [string, string][]).map(([name, value]) => (
            <div key={name}>
              <div style={{
                width: 120,
                height: 80,
                background: V.raised,
                borderRadius: 12,
                boxShadow: `var(--shadow-${name})`,
                marginBottom: 16,
              }} />
              <p style={{ fontSize: 12, color: V.textPrimary, margin: '0 0 4px', fontWeight: 500 }}>shadow-{name}</p>
              <p style={{ fontSize: 11, color: V.textSecondary, margin: 0, fontFamily: V.fontMono, maxWidth: 160, wordBreak: 'break-all' }}>{value}</p>
            </div>
          ))}
        </Row>
      </Section>
    </Page>
  ),
}
