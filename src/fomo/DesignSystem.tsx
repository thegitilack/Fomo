import { useState, useEffect } from 'react'
import { Icon } from './components/Icon'
import { Checkbox } from './components/Checkbox'
import { Chip } from './components/Chip'
import { TaskRow } from './components/TaskRow'
import { FAB } from './components/FAB'
import { BottomNav } from './components/BottomNav'
import { Eyebrow } from './components/Eyebrow'
import { PageTitle } from './components/PageTitle'
import { StatusBar } from './components/StatusBar'
import { ListScreen } from './screens/ListScreen'
import { UpcomingScreen } from './screens/UpcomingScreen'
import { EmptyState } from './screens/EmptyState'
import { TaskDetail } from './screens/TaskDetail'
import { AddTaskSheet } from './sheets/AddTaskSheet'

// ── Helpers ──────────────────────────────────────────────────────────────────

function Section({ id, num, title, sub, children }: {
  id: string; num: string; title: string; sub?: string; children?: React.ReactNode
}) {
  return (
    <section id={id} style={{ scrollMarginTop: 24, paddingTop: 26 }}>
      <div style={{ height: 1, background: 'var(--fomo-hairline)', marginBottom: 48 }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--fomo-font-mono)', fontSize: 11, letterSpacing: '0.2em', color: 'var(--fomo-accent)' }}>{num}</span>
        <h2 style={{ fontSize: 30, fontWeight: 300, letterSpacing: '-0.03em', margin: 0, color: 'var(--fomo-text-primary)' }}>{title}</h2>
      </div>
      {sub && <p style={{ color: 'var(--fomo-text-secondary)', fontSize: 14, fontWeight: 300, lineHeight: 1.6, maxWidth: 620, margin: '12px 0 30px' }}>{sub}</p>}
      {children}
    </section>
  )
}

function SubSection({ id, num, title, sub, children }: {
  id: string; num: string; title: string; sub?: string; children: React.ReactNode
}) {
  return (
    <section id={id} style={{ scrollMarginTop: 24, paddingTop: 26 }}>
      <div style={{ height: 1, background: 'var(--fomo-hairline)', marginBottom: 48 }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--fomo-font-mono)', fontSize: 11, letterSpacing: '0.2em', color: 'var(--fomo-accent)' }}>{num}</span>
        <h3 style={{ fontSize: 30, fontWeight: 300, letterSpacing: '-0.03em', margin: 0, color: 'var(--fomo-text-primary)' }}>{title}</h3>
      </div>
      {sub && <p style={{ color: 'var(--fomo-text-secondary)', fontSize: 14, fontWeight: 300, lineHeight: 1.6, maxWidth: 620, margin: '12px 0 40px' }}>{sub}</p>}
      {children}
    </section>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'var(--fomo-font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fomo-text-muted)', marginBottom: 8 }}>
      {children}
    </div>
  )
}

function Swatch({ token, label }: { token: string; label?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ position: 'relative', width: 56, height: 56, borderRadius: 8, border: '1px solid var(--fomo-hairline)', overflow: 'hidden' }}>
        {/* checkerboard for transparent swatches */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-conic-gradient(#888 0% 25%, #555 0% 50%)', backgroundSize: '10px 10px', opacity: 0.3 }} />
        <div style={{ position: 'absolute', inset: 0, background: `var(${token})` }} />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--fomo-font-mono)', fontSize: 10, color: 'var(--fomo-text-secondary)', letterSpacing: '0.04em' }}>{token}</div>
        {label && <div style={{ fontFamily: 'var(--fomo-font-mono)', fontSize: 10, color: 'var(--fomo-text-muted)', marginTop: 2 }}>{label}</div>}
      </div>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderBottom: '1px solid var(--fomo-hairline)' }}>
      <span style={{ fontFamily: mono ? 'var(--fomo-font-mono)' : undefined, fontSize: 13, color: 'var(--fomo-text-secondary)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--fomo-font-mono)', fontSize: 12, color: 'var(--fomo-accent)', letterSpacing: '0.04em' }}>{value}</span>
    </div>
  )
}

// ── Color groups ──────────────────────────────────────────────────────────────

const SURFACE_SWATCHES = [
  { token: '--fomo-bg',             label: 'Screen background' },
  { token: '--fomo-surface-sheet',  label: 'Add-task sheet' },
  { token: '--fomo-surface-raised', label: 'FAB' },
]
const TEXT_SWATCHES = [
  { token: '--fomo-text-primary'   },
  { token: '--fomo-text-secondary' },
  { token: '--fomo-text-muted'     },
  { token: '--fomo-text-faint'     },
  { token: '--fomo-text-done'      },
]
const ACCENT_SWATCHES = [
  { token: '--fomo-accent',        label: 'The only hue' },
  { token: '--fomo-accent-strong', label: 'Active chip text' },
  { token: '--fomo-on-accent',     label: 'Text on accent' },
  { token: '--fomo-danger',        label: 'Destructive' },
]
const OVERLAY_SWATCHES = [
  { token: '--fomo-divider'  },
  { token: '--fomo-ring'     },
  { token: '--fomo-hairline' },
  { token: '--fomo-border'   },
  { token: '--fomo-scrim'    },
]

// ── Main ──────────────────────────────────────────────────────────────────────

export function DesignSystem() {
  const [checked, setChecked] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const html = document.documentElement
    if (theme === 'light') {
      html.classList.add('theme-light')
    } else {
      html.classList.remove('theme-light')
    }
    return () => html.classList.remove('theme-light')
  }, [theme])

  const tokenLinks  = [
    { href: '#colors',     label: 'Colors' },
    { href: '#typography', label: 'Typography' },
    { href: '#spacing',    label: 'Spacing' },
    { href: '#radius',     label: 'Radius' },
    { href: '#elevation',  label: 'Elevation' },
  ]
  const componentLinks = [
    { href: '#icon',      label: 'Icon' },
    { href: '#checkbox',  label: 'Checkbox' },
    { href: '#chip',      label: 'Chip' },
    { href: '#taskrow',   label: 'TaskRow' },
    { href: '#fab',       label: 'FAB' },
    { href: '#bottomnav', label: 'BottomNav' },
    { href: '#eyebrow',   label: 'Eyebrow + PageTitle' },
    { href: '#button',    label: 'Button' },
    { href: '#input',     label: 'Input' },
  ]
  const pageLinks = [
    { href: '#page-today',    label: 'Today' },
    { href: '#page-upcoming', label: 'Upcoming' },
    { href: '#page-empty',    label: 'Empty State' },
    { href: '#page-detail',   label: 'Task Detail' },
    { href: '#page-addtask',  label: 'Add Task' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh', background: 'var(--fomo-bg)', color: 'var(--fomo-text-primary)', fontFamily: 'var(--fomo-font-sans)', WebkitFontSmoothing: 'antialiased' }}>
      {/* Sidebar */}
      <div style={{ position: 'sticky', top: 0, alignSelf: 'start', height: '100vh', borderRight: '1px solid var(--fomo-hairline)', padding: '40px 0 40px 36px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.04em' }}>
          Fo<span style={{ color: 'var(--fomo-accent)' }}>mo</span>
        </div>
        <div style={{ marginTop: 6, fontFamily: 'var(--fomo-font-mono)', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--fomo-text-muted)' }}>
          Design System
        </div>

        {/* Theme tab switcher */}
        <div style={{ marginTop: 24, display: 'flex', alignSelf: 'flex-start', border: '1px solid var(--fomo-border)', borderRadius: 'var(--fomo-radius-full)', padding: 2, gap: 2 }}>
          {(['dark', 'light'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--fomo-radius-full)',
                border: 'none',
                background: theme === t ? 'var(--fomo-accent)' : 'transparent',
                color: theme === t ? 'var(--fomo-on-accent)' : 'var(--fomo-text-muted)',
                fontFamily: 'var(--fomo-font-sans)',
                fontSize: 11,
                cursor: 'pointer',
                letterSpacing: '0.04em',
                transition: 'background 150ms ease, color 150ms ease',
              }}
            >
              {t === 'dark' ? 'Dark' : 'Paper'}
            </button>
          ))}
        </div>

        <nav style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { label: 'Tokens',     links: tokenLinks },
            { label: 'Components', links: componentLinks },
            { label: 'Pages',      links: pageLinks },
          ].map(group => (
            <div key={group.label}>
              <div style={{ fontFamily: 'var(--fomo-font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fomo-text-faint)', margin: '18px 0 8px' }}>{group.label}</div>
              {group.links.map(l => (
                <a key={l.href} href={l.href} onClick={e => { e.preventDefault(); document.querySelector(l.href)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} style={{ fontSize: 13, color: 'var(--fomo-text-secondary)', padding: '7px 0', textDecoration: 'none', display: 'block', cursor: 'pointer' }}>{l.label}</a>
              ))}
            </div>
          ))}
        </nav>
      </div>

      {/* Main */}
      <div style={{ padding: '64px 56px 120px', maxWidth: 980, boxSizing: 'border-box' }}>

        <Section id="colors" num="01" title="Colors" sub="Near-monochrome. A single warm accent (#c6a47a) is the only hue — used only where it earns its place.">
          <Label>Surfaces</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 40 }}>
            {SURFACE_SWATCHES.map(s => <Swatch key={s.token} {...s} />)}
          </div>
          <Label>Text</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 40 }}>
            {TEXT_SWATCHES.map(s => <Swatch key={s.token} {...s} />)}
          </div>
          <Label>Accent + Semantic</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 40 }}>
            {ACCENT_SWATCHES.map(s => <Swatch key={s.token} {...s} />)}
          </div>
          <Label>Overlays</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {OVERLAY_SWATCHES.map(s => <Swatch key={s.token} {...s} />)}
          </div>
        </Section>

        <Section id="typography" num="02" title="Typography" sub="System font only — San Francisco on Apple platforms. Monospace for uppercase labels.">
          {[
            { label: 'Page Title', sample: 'Today', style: { fontSize: 28, fontWeight: 300, letterSpacing: '-0.025em' } },
            { label: 'Detail Title', sample: 'Call the pharmacy before it closes', style: { fontSize: 23, fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.3 } },
            { label: 'Task Name', sample: 'Sign the apartment lease', style: { fontSize: 15, fontWeight: 300, letterSpacing: '-0.01em', lineHeight: 1.35 } },
            { label: 'Metadata', sample: 'Today · 6:00 PM', style: { fontSize: 13, fontWeight: 400, color: 'var(--fomo-text-secondary)' } },
            { label: 'Eyebrow', sample: 'SAT · 27 JUNE', style: { fontFamily: 'var(--fomo-font-mono)', fontSize: 11, letterSpacing: '0.20em', textTransform: 'uppercase' as const, color: 'var(--fomo-text-muted)' } },
            { label: 'Nav Label', sample: 'Today', style: { fontSize: 11, fontWeight: 500, letterSpacing: '0.04em' } },
            { label: 'Note Body', sample: 'Ask whether the new prescription is ready, and if they can hold it at the front counter until tomorrow morning.', style: { fontSize: 15, fontWeight: 300, lineHeight: 1.6 } },
          ].map(({ label, sample, style }) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', alignItems: 'baseline', gap: 24, padding: '16px 0', borderBottom: '1px solid var(--fomo-hairline)' }}>
              <span style={{ fontFamily: 'var(--fomo-font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fomo-text-muted)' }}>{label}</span>
              <span style={{ color: 'var(--fomo-text-primary)', ...style }}>{sample}</span>
            </div>
          ))}
        </Section>

        <Section id="spacing" num="03" title="Spacing" sub="Screen padding 26 · row padding 14 · header offset 46.">
          {[
            ['--fomo-space-1 / 4px', '4px'],
            ['--fomo-space-2 / 6px', '6px'],
            ['--fomo-space-3 / 8px', '8px'],
            ['--fomo-space-4 / 12px', '12px'],
            ['--fomo-space-5 / 14px', '14px — row pad, checkbox gap'],
            ['--fomo-space-6 / 18px', '18px'],
            ['--fomo-space-7 / 22px', '22px — date group gap'],
            ['--fomo-space-8 / 26px', '26px — screen padding'],
            ['--fomo-space-9 / 46px', '46px — header top'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '10px 0', borderBottom: '1px solid var(--fomo-hairline)' }}>
              <div style={{ width: parseInt(value), height: 8, background: 'var(--fomo-accent)', borderRadius: 2, flex: 'none', minWidth: 4 }} />
              <Row label={label} value={value} mono />
            </div>
          ))}
        </Section>

        <Section id="radius" num="04" title="Radius" sub="Subtle, not playful. Pills and FAB are fully round.">
          {[
            ['--fomo-radius-sm',     '4px',   'Keyboard keys'],
            ['--fomo-radius-md',     '8px'],
            ['--fomo-radius-lg',     '12px',  'Note card'],
            ['--fomo-radius-sheet',  '22px',  'Add-task sheet'],
            ['--fomo-radius-full',   '999px', 'Chips, FAB, Checkbox'],
          ].map(([token, value, note]) => <Row key={token} label={`${token}${note ? ` — ${note}` : ''}`} value={value} mono />)}
        </Section>

        <Section id="elevation" num="05" title="Elevation" sub="Shadows are quiet. Only the FAB floats.">
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', marginTop: 8 }}>
            {[
              { label: 'FAB', shadow: '0 12px 30px -8px rgba(0,0,0,0.70)' },
              { label: 'Screen', shadow: '0 40px 90px -30px rgba(0,0,0,0.70)' },
              { label: 'Key', shadow: '0 1px 0 rgba(0,0,0,0.40)' },
            ].map(({ label, shadow }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 12, background: 'var(--fomo-surface-raised)', boxShadow: shadow }} />
                <div style={{ fontFamily: 'var(--fomo-font-mono)', fontSize: 10, color: 'var(--fomo-text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="icon" num="06" title="Icon" sub="Geometric line icons, no icon font. Stroke ~1.5px; color via stroke prop.">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
            {(['today','chevron','list','plus','back','check','flag','calendar','repeat','note','loading'] as const).map(name => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--fomo-hairline)', borderRadius: 8 }}>
                  <Icon name={name} size={22} stroke="var(--fomo-text-primary)" style={name === 'loading' ? { animation: 'spin 0.8s linear infinite' } : undefined} />
                </div>
                <span style={{ fontFamily: 'var(--fomo-font-mono)', fontSize: 10, color: 'var(--fomo-text-muted)' }}>{name}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="checkbox" num="07" title="Checkbox" sub="Circular. Unfilled ring by default; fills with accent + check on completion. 150ms ease.">
          <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <Checkbox checked={false} />
              <span style={{ fontFamily: 'var(--fomo-font-mono)', fontSize: 10, color: 'var(--fomo-text-muted)' }}>unchecked</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <Checkbox checked={true} />
              <span style={{ fontFamily: 'var(--fomo-font-mono)', fontSize: 10, color: 'var(--fomo-text-muted)' }}>checked</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <Checkbox checked={checked} size={24} onChange={() => setChecked(c => !c)} />
              <span style={{ fontFamily: 'var(--fomo-font-mono)', fontSize: 10, color: 'var(--fomo-text-muted)' }}>interactive (size 24)</span>
            </div>
          </div>
        </Section>

        <Section id="chip" num="08" title="Chip" sub="Pill metadata button. Inactive = hairline outline. Active = accent-tinted.">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <Chip label="Due date" icon={<Icon name="calendar" size={13} stroke="var(--fomo-text-secondary)" />} />
            <Chip label="Priority" icon={<Icon name="flag"     size={13} stroke="var(--fomo-text-secondary)" />} />
            <Chip label="Repeat"   icon={<Icon name="repeat"   size={13} stroke="var(--fomo-text-secondary)" />} />
            <Chip label="Note"     icon={<Icon name="note"     size={13} stroke="var(--fomo-text-secondary)" />} />
            <Chip label="Today · 6:00 PM" active icon={<Icon name="calendar" size={13} stroke="var(--fomo-accent-strong)" />} />
            <Chip label="Flagged"  active icon={<Icon name="flag"     size={13} stroke="var(--fomo-accent-strong)" />} />
          </div>
        </Section>

        <Section id="taskrow" num="09" title="TaskRow" sub="Checkbox + name + metadata + flag. Flagged rows float to top. Completed rows dim + strike.">
          <div style={{ border: '1px solid var(--fomo-hairline)', borderRadius: 12, padding: '0 16px' }}>
            <TaskRow name="Call the pharmacy before it closes" meta="Today · 6:00 PM" priority flagged />
            <TaskRow name="Sign the apartment lease" meta="Today" flagged />
            <TaskRow name="Reply to Mara about the weekend" meta="9:30 AM" />
            <TaskRow name="Water the olive tree" />
            <TaskRow name="Morning walk" done divider={false} />
          </div>
        </Section>

        <Section id="fab" num="10" title="FAB" sub="58px centered circular add button. Floats above the bottom nav.">
          <FAB />
        </Section>

        <Section id="bottomnav" num="11" title="BottomNav" sub="Three tabs: Today / Upcoming / All. Active = primary, inactive = faint. Blurred background.">
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--fomo-hairline)', maxWidth: 390 }}>
            <BottomNav active="today" />
          </div>
        </Section>

        <Section id="eyebrow" num="12" title="Eyebrow + PageTitle" sub="The two typography atoms that open every screen.">
          <div style={{ padding: '24px 0' }}>
            <Eyebrow>SAT · 27 JUNE</Eyebrow>
            <div style={{ height: 8 }} />
            <PageTitle>Today</PageTitle>
          </div>
        </Section>

        <Section id="button" num="13" title="Button" sub="Pill shape, accent fill. Same size/state/icon taxonomy as the design system Button.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

            <Label>All Sizes</Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: -32 }}>
              <FomoButton size="sm">Small</FomoButton>
              <FomoButton size="md">Medium</FomoButton>
              <FomoButton size="lg">Large</FomoButton>
            </div>

            <Label>States</Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: -32 }}>
              <FomoButton size="lg">Default</FomoButton>
              <FomoButton size="lg" disabled>Disabled</FomoButton>
              <FomoButton size="lg" loading>Loading</FomoButton>
            </div>

            <Label>Icon Compositions</Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: -32 }}>
              <FomoButton size="md">Label only</FomoButton>
              <FomoButton size="md" leadingIcon={<FomoLeadingIcon size={16} />}>Leading</FomoButton>
              <FomoButton size="md" trailingIcon={<FomoTrailingIcon size={14} />}>Trailing</FomoButton>
              <FomoButton size="md" leadingIcon={<FomoLeadingIcon size={16} />} trailingIcon={<FomoTrailingIcon size={14} />}>Both</FomoButton>
            </div>

            <Label>All Variants — Sizes × States</Label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: -32 }}>
              {(['lg', 'md', 'sm'] as const).map(size => (
                <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <FomoButton size={size} leadingIcon={<FomoLeadingIcon size={BTN_SIZE[size].iconSize} />} trailingIcon={<FomoTrailingIcon size={BTN_SIZE[size].iconSize - 2} />}>Button</FomoButton>
                  <FomoButton size={size} leadingIcon={<FomoLeadingIcon size={BTN_SIZE[size].iconSize} />} trailingIcon={<FomoTrailingIcon size={BTN_SIZE[size].iconSize - 2} />} disabled>Button</FomoButton>
                </div>
              ))}
            </div>

          </div>
        </Section>

        <Section id="input" num="14" title="Input" sub="Same label / icon / help-text / error / disabled states as the design system Input.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 420 }}>
            <Label>Default</Label>
            <div style={{ marginTop: -20 }}>
              <FomoInput label="Input label" placeholder="Placeholder text" helpText="Help text" icon={<Icon name="note" size={16} stroke="currentColor" />} />
            </div>

            <Label>Active (filled)</Label>
            <div style={{ marginTop: -20 }}>
              <FomoInput label="Input label" defaultValue="Text entered by the user" helpText="Help text" icon={<Icon name="note" size={16} stroke="currentColor" />} />
            </div>

            <Label>Error</Label>
            <div style={{ marginTop: -20 }}>
              <FomoInput label="Input label" placeholder="Placeholder text" errorMessage="Error text" icon={<Icon name="note" size={16} stroke="currentColor" />} />
            </div>

            <Label>Disabled</Label>
            <div style={{ marginTop: -20 }}>
              <FomoInput label="Input label" placeholder="Placeholder text" helpText="Help text" icon={<Icon name="note" size={16} stroke="currentColor" />} disabled />
            </div>

            <Label>No Icon</Label>
            <div style={{ marginTop: -20 }}>
              <FomoInput label="Input label" placeholder="Placeholder text" helpText="Help text" />
            </div>

            <Label>No Help Text</Label>
            <div style={{ marginTop: -20 }}>
              <FomoInput label="Input label" placeholder="Placeholder text" icon={<Icon name="note" size={16} stroke="currentColor" />} />
            </div>

            <Label>Minimal (no icon, no help text)</Label>
            <div style={{ marginTop: -20 }}>
              <FomoInput label="Input label" placeholder="Placeholder text" />
            </div>
          </div>
        </Section>

        {PAGES.map(({ id, num, label, description, node }) => (
          <SubSection key={id} id={id} num={num} title={label} sub={description}>
            <PhoneFrame>{node}</PhoneFrame>
          </SubSection>
        ))}

      </div>
    </div>
  )
}

// ── Fomo-styled Button ────────────────────────────────────────────────────────

const BTN_SIZE = {
  sm: { padding: '7px 14px',  fontSize: 13, gap: 6,  iconSize: 14 },
  md: { padding: '10px 18px', fontSize: 14, gap: 7,  iconSize: 16 },
  lg: { padding: '13px 22px', fontSize: 15, gap: 8,  iconSize: 16 },
}

function FomoButton({ size = 'lg', leadingIcon, trailingIcon, loading = false, disabled, children }: {
  size?: 'sm' | 'md' | 'lg'
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  loading?: boolean
  disabled?: boolean
  children?: React.ReactNode
}) {
  const s = BTN_SIZE[size]
  const isDisabled = disabled || loading
  return (
    <button
      disabled={isDisabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: s.gap,
        padding: s.padding,
        borderRadius: 'var(--fomo-radius-full)',
        background: isDisabled ? 'transparent' : 'var(--fomo-accent)',
        color: isDisabled ? 'var(--fomo-text-faint)' : 'var(--fomo-on-accent)',
        border: isDisabled ? '1px solid var(--fomo-hairline)' : 'none',
        fontFamily: 'var(--fomo-font-sans)',
        fontSize: s.fontSize,
        fontWeight: 400,
        letterSpacing: '-0.01em',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'background 150ms ease',
      }}
    >
      {loading ? (
        <Icon name="loading" size={s.iconSize} stroke="currentColor" style={{ animation: 'spin 0.8s linear infinite' }} />
      ) : leadingIcon ? (
        <span style={{ width: s.iconSize, height: s.iconSize, display: 'flex' }}>{leadingIcon}</span>
      ) : null}
      {children}
      {trailingIcon && !loading && (
        <span style={{ width: s.iconSize, height: s.iconSize, display: 'flex' }}>{trailingIcon}</span>
      )}
    </button>
  )
}

function FomoLeadingIcon({ size }: { size: number }) {
  return <Icon name="plus" size={size} stroke="currentColor" />
}
function FomoTrailingIcon({ size }: { size: number }) {
  return <Icon name="chevron" size={size} stroke="currentColor" />
}

// ── Fomo-styled Input ─────────────────────────────────────────────────────────

function FomoInput({ label, helpText, errorMessage, icon, disabled, defaultValue, placeholder }: {
  label?: string
  helpText?: string
  errorMessage?: string
  icon?: React.ReactNode
  disabled?: boolean
  defaultValue?: string
  placeholder?: string
}) {
  const hasError = Boolean(errorMessage)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 14, fontWeight: 400, color: disabled ? 'var(--fomo-text-faint)' : 'var(--fomo-text-primary)', fontFamily: 'var(--fomo-font-sans)' }}>
          {label}
        </label>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 14px',
        borderRadius: 'var(--fomo-radius-md)',
        background: hasError ? 'rgba(154,107,94,0.06)' : disabled ? 'transparent' : 'var(--fomo-note-fill)',
        border: hasError
          ? '2px solid var(--fomo-danger)'
          : disabled
          ? '1px solid var(--fomo-hairline)'
          : '1px solid var(--fomo-border)',
        opacity: disabled ? 0.5 : 1,
      }}>
        {icon && (
          <span style={{ width: 18, height: 18, flexShrink: 0, color: hasError ? 'var(--fomo-danger)' : disabled ? 'var(--fomo-text-faint)' : 'var(--fomo-text-secondary)', display: 'flex' }}>{icon}</span>
        )}
        <input
          disabled={disabled}
          defaultValue={defaultValue}
          placeholder={placeholder}
          style={{
            flex: 1, minWidth: 0, background: 'none', border: 'none', outline: 'none',
            fontFamily: 'var(--fomo-font-sans)', fontSize: 15, fontWeight: 300,
            color: disabled ? 'var(--fomo-text-faint)' : 'var(--fomo-text-primary)',
            cursor: disabled ? 'not-allowed' : undefined,
          }}
        />
      </div>
      {hasError ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="var(--fomo-danger)" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13A6.5 6.5 0 0 0 8 1.5ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 5Zm0 6.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 300, color: 'var(--fomo-danger)', fontFamily: 'var(--fomo-font-sans)' }}>{errorMessage}</span>
        </div>
      ) : helpText ? (
        <span style={{ fontSize: 13, fontWeight: 300, color: 'var(--fomo-text-muted)', fontFamily: 'var(--fomo-font-sans)' }}>{helpText}</span>
      ) : null}
    </div>
  )
}

const SCALE = 0.5

function PhoneFrame({ children }: { children: React.ReactNode }) {
  const W = 390, H = 844
  return (
    <div style={{ width: W * SCALE, height: H * SCALE, flexShrink: 0 }}>
      <div style={{
        width: W, height: H,
        borderRadius: 46,
        overflow: 'hidden',
        background: 'var(--fomo-bg)',
        border: '1px solid var(--fomo-screen-border)',
        boxShadow: 'var(--fomo-shadow-screen)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transform: `scale(${SCALE})`,
        transformOrigin: 'top left',
        pointerEvents: 'none',
      }}>
        {children}
      </div>
    </div>
  )
}

function NavWithFAB({ active }: { active: 'today' | 'upcoming' | 'all' }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: -29, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
        <FAB />
      </div>
      <BottomNav active={active} />
    </div>
  )
}

const SAMPLE_TASKS = [
  { id: '1', name: 'Call the pharmacy before it closes', done: false, flagged: true,  priority: true,  dueDate: new Date().toISOString().slice(0,10), dueTime: '18:00' },
  { id: '2', name: 'Sign the apartment lease',            done: false, flagged: true,  priority: false, dueDate: new Date().toISOString().slice(0,10) },
  { id: '3', name: 'Reply to Mara about the weekend',    done: false, flagged: false, priority: false, dueDate: new Date().toISOString().slice(0,10), dueTime: '09:30' },
  { id: '4', name: 'Water the olive tree',               done: false, flagged: false, priority: false },
  { id: '5', name: 'Morning walk',                       done: true,  flagged: false, priority: false },
]

const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
const tomorrowStr = tomorrow.toISOString().slice(0,10)
const dayAfter = new Date(); dayAfter.setDate(dayAfter.getDate() + 3)
const dayAfterStr = dayAfter.toISOString().slice(0,10)

const UPCOMING_GROUPED = new Map([
  [tomorrowStr, [
    { id: 'u1', name: 'Dentist appointment', done: false, flagged: false, priority: false, dueDate: tomorrowStr, dueTime: '10:00' },
    { id: 'u2', name: 'Pick up dry cleaning', done: false, flagged: false, priority: false, dueDate: tomorrowStr },
  ]],
  [dayAfterStr, [
    { id: 'u3', name: 'Read chapter 7', done: false, flagged: false, priority: false, dueDate: dayAfterStr },
  ]],
])

const DETAIL_TASK = {
  id: '1', name: 'Call the pharmacy before it closes', done: false, flagged: true, priority: true,
  dueDate: new Date().toISOString().slice(0,10), dueTime: '18:00',
  note: 'Ask whether the new prescription is ready, and if they can hold it at the front counter until tomorrow morning.',
}

const PAGES: { id: string; num: string; label: string; description: string; node: React.ReactNode }[] = [
  {
    id: 'page-today',
    num: '15.1',
    label: 'Today',
    description: 'The default view. Tasks due today surface here, flagged items first. An eyebrow shows the current weekday and date. Empty state replaces the list when nothing is due.',
    node: (
      <>
        <StatusBar />
        <ListScreen eyebrow="SAT · 27 JUNE" title="Today" tasks={SAMPLE_TASKS} onToggle={() => {}} onOpen={() => {}} />
        <NavWithFAB active="today" />
      </>
    ),
  },
  {
    id: 'page-upcoming',
    num: '15.2',
    label: 'Upcoming',
    description: 'Future tasks grouped by day. Day headers use the Eyebrow component — mono, uppercase, muted. Tasks within each group are sorted as usual.',
    node: (
      <>
        <StatusBar />
        <UpcomingScreen grouped={UPCOMING_GROUPED} onToggle={() => {}} onOpen={() => {}} />
        <NavWithFAB active="upcoming" />
      </>
    ),
  },
  {
    id: 'page-empty',
    num: '15.3',
    label: 'Empty State',
    description: 'Shown on the Today view when no tasks are due. Calm, minimal — one sentence and a quiet subline. No illustration, no call-to-action.',
    node: (
      <>
        <StatusBar />
        <EmptyState eyebrow="SAT · 27 JUNE" />
        <NavWithFAB active="today" />
      </>
    ),
  },
  {
    id: 'page-detail',
    num: '15.4',
    label: 'Task Detail',
    description: 'Tapped from any list row. Shows the full task — name, due date chip row, optional note card. The note is inline-editable. Back and flag live in the header.',
    node: (
      <>
        <StatusBar />
        <TaskDetail task={DETAIL_TASK} onBack={() => {}} onToggleDone={() => {}} onToggleFlag={() => {}} onDelete={() => {}} onUpdateNote={() => {}} onUpdate={() => {}} />
      </>
    ),
  },
  {
    id: 'page-addtask',
    num: '15.5',
    label: 'Add Task',
    description: 'A sheet that slides up from the bottom. Scrim dims the list behind it. Grab handle, blinking caret input, chip row for metadata, and the custom keyboard.',
    node: (
      <>
        <StatusBar />
        <ListScreen eyebrow="SAT · 27 JUNE" title="Today" tasks={SAMPLE_TASKS.slice(0,3)} onToggle={() => {}} onOpen={() => {}} />
        <NavWithFAB active="today" />
        <AddTaskSheet onClose={() => {}} onSubmit={() => {}} />
      </>
    ),
  },
]
