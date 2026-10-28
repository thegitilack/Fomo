import { useState } from 'react'
import type { Goal } from '../state/store'
import { Eyebrow } from '../components/Eyebrow'
import { PageTitle } from '../components/PageTitle'
import { TaskRowCard, TaskCardList } from '../components/TaskRowCard'

interface GoalsScreenProps {
  goals: Goal[]
  onToggle: (id: string) => void
  onOpen: (id: string) => void
}

export function GoalsScreen({ goals, onToggle, onOpen }: GoalsScreenProps) {
  const [scrolled, setScrolled] = useState(false)

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Fixed header */}
      <div style={{
        flex: 'none',
        padding: '46px 26px 20px',
        borderBottom: `1px solid ${scrolled ? 'var(--fomo-hairline)' : 'transparent'}`,
        boxShadow: scrolled ? '0 8px 18px -14px rgba(0,0,0,0.45)' : 'none',
        transition: 'border-color 160ms ease, box-shadow 160ms ease',
        zIndex: 1,
      }}>
        <Eyebrow>Long term</Eyebrow>
        <div style={{ height: '8px' }} />
        <PageTitle>Goals</PageTitle>
      </div>

      {goals.length === 0 ? (
        <div style={{ padding: '60px 26px 0', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--fomo-font-sans)',
            fontSize: '19px',
            fontWeight: 300,
            letterSpacing: '-0.01em',
            color: 'var(--fomo-text-secondary)',
          }}>
            Nothing here yet — add something you want to do.
          </div>
        </div>
      ) : (
        <div
          onScroll={e => setScrolled(e.currentTarget.scrollTop > 4)}
          style={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', padding: '10px 26px 16px' }}
        >
          <TaskCardList>
            {goals.map(g => (
              <TaskRowCard
                key={g.id}
                variant="filled"
                name={g.name}
                meta={g.note ? g.note : undefined}
                done={g.done}
                onToggle={() => onToggle(g.id)}
                onOpen={() => onOpen(g.id)}
              />
            ))}
          </TaskCardList>
        </div>
      )}
    </div>
  )
}
