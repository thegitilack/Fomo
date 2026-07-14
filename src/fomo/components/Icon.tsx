import type { CSSProperties } from 'react'

type IconName = 'today' | 'chevron' | 'list' | 'plus' | 'back' | 'check' | 'flag' | 'calendar' | 'clock' | 'repeat' | 'note' | 'loading'

interface IconDef {
  vb: string
  el: (c: string, sw: number) => React.ReactNode
}

const ICONS: Record<IconName, IconDef> = {
  today: {
    vb: '0 0 24 24',
    el: (c, sw) => (<>
      <circle cx="12" cy="12" r="6.5" stroke={c} strokeWidth={sw} fill="none" />
      <circle cx="12" cy="12" r="1.7" fill={c} />
    </>),
  },
  chevron: {
    vb: '0 0 24 24',
    el: (c, sw) => <path d="M9 6l6 6-6 6" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  },
  list: {
    vb: '0 0 24 24',
    el: (c, sw) => <path d="M5 8h14M5 12h14M5 16h10" stroke={c} strokeWidth={sw} strokeLinecap="round" />,
  },
  plus: {
    vb: '0 0 24 24',
    el: (c, sw) => <path d="M12 5v14M5 12h14" stroke={c} strokeWidth={sw} strokeLinecap="round" />,
  },
  back: {
    vb: '0 0 24 24',
    el: (c, sw) => <path d="M15 5l-7 7 7 7" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  },
  check: {
    vb: '0 0 12 12',
    el: (c, sw) => <path d="M2.5 6.2l2.3 2.3 4.7-5" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  },
  flag: {
    vb: '0 0 12 14',
    el: (c, sw) => (<>
      <path d="M2 1v12" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <path d="M2.4 1.6l7.6 2.1-7.6 2.1z" fill={c} fillOpacity="0.9" />
    </>),
  },
  calendar: {
    vb: '0 0 14 14',
    el: (c, sw) => (<>
      <rect x="1.5" y="2.5" width="11" height="10" rx="2" stroke={c} strokeWidth={sw} fill="none" />
      <path d="M1.5 5.5h11M4.5 1v2M9.5 1v2" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>),
  },
  clock: {
    vb: '0 0 14 14',
    el: (c, sw) => (<>
      <circle cx="7" cy="7" r="5.5" stroke={c} strokeWidth={sw} fill="none" />
      <path d="M7 4v3.2l2 1.3" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>),
  },
  repeat: {
    vb: '0 0 14 14',
    el: (c, sw) => (<>
      <path d="M2 7a5 5 0 1 1 1.5 3.6" stroke={c} strokeWidth={sw} strokeLinecap="round" fill="none" />
      <path d="M2 11V7.5h3.5" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>),
  },
  note: {
    vb: '0 0 14 14',
    el: (c, sw) => <path d="M3 3.5h8M3 7h8M3 10.5h5" stroke={c} strokeWidth={sw} strokeLinecap="round" />,
  },
  loading: {
    vb: '0 0 24 24',
    el: (c, sw) => (<>
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth={sw} strokeOpacity="0.2" fill="none" />
      <path d="M12 3a9 9 0 0 1 9 9" stroke={c} strokeWidth={sw} strokeLinecap="round" fill="none" />
    </>),
  },
}

interface IconProps {
  name: IconName
  size?: number
  stroke?: string
  strokeWidth?: number
  style?: CSSProperties
}

export function Icon({ name, size = 22, stroke = 'currentColor', strokeWidth, style }: IconProps) {
  const ic = ICONS[name]
  if (!ic) return null
  const isSmall = ic.vb.includes('12') || ic.vb.includes('14')
  const sw = strokeWidth ?? (isSmall ? 1.3 : 1.5)
  return (
    <svg width={size} height={size} viewBox={ic.vb} fill="none" style={{ display: 'block', flex: 'none', ...style }}>
      {ic.el(stroke, sw)}
    </svg>
  )
}
