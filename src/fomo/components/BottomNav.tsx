import { Icon } from './Icon'

type View = 'today' | 'upcoming' | 'all'

const TABS: { id: View; label: string; icon: 'today' | 'chevron' | 'list' }[] = [
  { id: 'today',    label: 'Today',    icon: 'today'   },
  { id: 'upcoming', label: 'Upcoming', icon: 'chevron' },
  { id: 'all',      label: 'All',      icon: 'list'    },
]

interface BottomNavProps {
  active?: View
  onChange?: (view: View) => void
}

export function BottomNav({ active = 'today', onChange }: BottomNavProps) {
  return (
    <div style={{ position: 'relative' }}>
      <nav style={{
        background: 'var(--fomo-nav-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--fomo-nav-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: '12px',
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
      }}>
        {TABS.map((t) => {
          const on = t.id === active
          const color = on ? 'var(--fomo-text-primary)' : 'var(--fomo-text-faint)'
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange?.(t.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: 0,
                flex: 1,
              }}
            >
              <Icon name={t.icon} size={22} stroke={color} />
              <span style={{
                fontFamily: 'var(--fomo-font-sans)',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.04em',
                color,
              }}>
                {t.label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
