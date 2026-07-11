import { Eyebrow } from '../components/Eyebrow'
import { PageTitle } from '../components/PageTitle'

interface EmptyStateProps {
  eyebrow: string
}

export function EmptyState({ eyebrow }: EmptyStateProps) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ padding: '46px 26px 0' }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <div style={{ height: '8px' }} />
        <PageTitle>Today</PageTitle>
      </div>
      <div style={{ padding: '0 26px', marginTop: '80px' }}>
        <div style={{
          fontFamily: 'var(--fomo-font-sans)',
          fontSize: '19px',
          fontWeight: 300,
          letterSpacing: '-0.01em',
          color: 'var(--fomo-text-secondary)',
          marginBottom: '12px',
        }}>
          Nothing due today.
        </div>
        <div style={{
          fontFamily: 'var(--fomo-font-sans)',
          fontSize: '15px',
          fontWeight: 300,
          lineHeight: 1.6,
          color: 'var(--fomo-text-muted)',
        }}>
          A good day to rest. Add something only if it matters.
        </div>
      </div>
    </div>
  )
}
