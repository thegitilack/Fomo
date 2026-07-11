import type { ReactNode } from 'react'

export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--fomo-font-sans)',
      fontSize: '28px',
      fontWeight: 300,
      letterSpacing: '-0.025em',
      color: 'var(--fomo-text-primary)',
      lineHeight: 1.1,
    }}>
      {children}
    </div>
  )
}
