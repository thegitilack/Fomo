import { useState } from 'react'
import type { Task } from '../state/store'
import { taskMeta, isDoneToday } from '../state/store'
import { Eyebrow } from '../components/Eyebrow'
import { PageTitle } from '../components/PageTitle'
import { TaskRowCard, TaskCardList } from '../components/TaskRowCard'

interface ListScreenProps {
  eyebrow: string
  title: string
  tasks: Task[]
  onToggle: (id: string) => void
  onOpen: (id: string) => void
}

export function ListScreen({ eyebrow, title, tasks, onToggle, onOpen }: ListScreenProps) {
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
        <Eyebrow>{eyebrow}</Eyebrow>
        <div style={{ height: '8px' }} />
        <PageTitle>{title}</PageTitle>
      </div>
      {/* Scrolling list */}
      <div
        onScroll={e => setScrolled(e.currentTarget.scrollTop > 4)}
        style={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', padding: '10px 26px 16px' }}
      >
        <TaskCardList>
          {tasks.map(t => (
            <TaskRowCard
              key={t.id}
              variant="filled"
              name={t.name}
              meta={taskMeta(t)}
              priority={t.priority}
              flagged={t.flagged}
              done={isDoneToday(t)}
              onToggle={() => onToggle(t.id)}
              onOpen={() => onOpen(t.id)}
            />
          ))}
        </TaskCardList>
      </div>
    </div>
  )
}
