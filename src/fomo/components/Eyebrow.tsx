import type { ReactNode } from 'react'

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--fomo-font-mono)',
      fontSize: '11px',
      fontWeight: 400,
      letterSpacing: '0.20em',
      textTransform: 'uppercase',
      color: 'var(--fomo-text-muted)',
    }}>
      {children}
    </div>
  )
}
