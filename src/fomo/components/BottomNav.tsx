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
        height: '88px',
        background: 'var(--fomo-nav-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--fomo-nav-border)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        paddingTop: '13px',
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

      {/* Home indicator */}
      <div style={{ height: '0px', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '134px',
          height: '5px',
          borderRadius: '3px',
          background: 'var(--fomo-home-indicator)',
        }} />
      </div>
    </div>
  )
}
