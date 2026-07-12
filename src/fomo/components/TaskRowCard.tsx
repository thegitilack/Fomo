import type { ReactNode } from 'react'
import { Checkbox } from './Checkbox'
import { Icon } from './Icon'

// ─── Design iterations: card-style task rows ──────────────────────────────────
// Instead of rows separated by a hairline divider, each row is a fully
// outlined "card" with spacing between them. Kept in a separate file so the
// live TaskRow stays untouched while we compare directions.
//
// Variants:
//   'outlined' — transparent card with a full border
//   'soft'     — filled note-like surface + hairline border, roomier padding
//   'filled'   — filled surface, no border

export type TaskCardVariant = 'outlined' | 'soft' | 'filled'

export interface TaskCardProps {
  name: string
  meta?: string
  priority?: boolean
  flagged?: boolean
  done?: boolean
  variant?: TaskCardVariant
  onToggle?: () => void
  onOpen?: () => void
}

function Body({ name, meta, priority, flagged, done, onToggle, onOpen }: TaskCardProps) {
  return (
    <>
      <Checkbox checked={done} onChange={onToggle} />
      <div
        onClick={onOpen}
        style={{ flex: 1, minWidth: 0, cursor: onOpen ? 'pointer' : 'default' }}
      >
        <div style={{
          fontFamily: 'var(--fomo-font-sans)',
          fontSize: '15px',
          fontWeight: 300,
          letterSpacing: '-0.01em',
          lineHeight: 1.35,
          color: done ? 'var(--fomo-text-done)' : 'var(--fomo-text-primary)',
          textDecorationLine: done ? 'line-through' : 'none',
          textDecorationColor: 'var(--fomo-ring)',
        }}>
          {name}
        </div>
        {meta && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            {priority && (
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--fomo-accent)', flex: 'none' }} />
            )}
            <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--fomo-text-secondary)' }}>
              {meta}
            </span>
          </div>
        )}
      </div>
      {flagged && (
        <div style={{ flex: 'none' }}>
          <Icon name="flag" size={14} stroke="var(--fomo-accent)" />
        </div>
      )}
    </>
  )
}

const CARD_BASE = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
} as const

function cardStyle(variant: TaskCardVariant): React.CSSProperties {
  switch (variant) {
    case 'soft':
      return {
        ...CARD_BASE,
        padding: '18px 18px',
        background: 'var(--fomo-note-fill)',
        border: '1px solid var(--fomo-hairline)',
      }
    case 'filled':
      return {
        ...CARD_BASE,
        padding: '18px 18px',
        background: 'var(--fomo-note-fill)',
        border: 'none',
      }
    case 'outlined':
    default:
      return {
        ...CARD_BASE,
        padding: '15px 16px',
        border: '1px solid var(--fomo-border)',
        background: 'transparent',
      }
  }
}

export function TaskRowCard(props: TaskCardProps) {
  const { variant = 'outlined' } = props
  return (
    <div style={cardStyle(variant)}>
      <Body {...props} />
    </div>
  )
}

// Container that stacks cards with padding between them (replaces the
// divider-separated list).
export function TaskCardList({ gap = 10, children }: { gap?: number; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
      {children}
    </div>
  )
}
