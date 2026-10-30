export type AddKind = 'task' | 'goal'

interface KindTabsProps {
  value: AddKind
  onChange: (kind: AddKind) => void
}

/** Task / Goal segmented selector, shared by the Add sheet and the detail views. */
export function KindTabs({ value, onChange }: KindTabsProps) {
  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      {(['task', 'goal'] as AddKind[]).map(k => {
        const on = value === k
        return (
          <button
            key={k}
            type="button"
            onClick={() => onChange(k)}
            aria-pressed={on}
            style={{
              flex: 1,
              height: '36px',
              borderRadius: '999px',
              border: `1px solid ${on ? 'var(--fomo-chip-active-bd)' : 'var(--fomo-border)'}`,
              background: on ? 'var(--fomo-chip-active-bg)' : 'transparent',
              color: on ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)',
              fontFamily: 'var(--fomo-font-sans)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 120ms ease, color 120ms ease, border-color 120ms ease',
            }}
          >
            {k === 'task' ? 'Task' : 'Goal'}
          </button>
        )
      })}
    </div>
  )
}
