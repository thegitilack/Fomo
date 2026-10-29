import { useState } from 'react'
import type { Task, Goal } from '../state/store'
import { taskMeta, isDoneToday } from '../state/store'
import { Eyebrow } from '../components/Eyebrow'
import { PageTitle } from '../components/PageTitle'
import { TaskRowCard, TaskCardList } from '../components/TaskRowCard'

interface TodayScreenProps {
  eyebrow: string
  tasks: Task[]
  goals: Goal[]
  onToggleTask: (id: string) => void
  onOpenTask: (id: string) => void
  onToggleGoal: (id: string) => void
  onOpenGoal: (id: string) => void
}

export function TodayScreen({ eyebrow, tasks, goals, onToggleTask, onOpenTask, onToggleGoal, onOpenGoal }: TodayScreenProps) {
  const [scrolled, setScrolled] = useState(false)
  const empty = tasks.length === 0 && goals.length === 0

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
        <PageTitle>Today</PageTitle>
      </div>

      {empty ? (
        <div style={{ padding: '60px 26px 0', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--fomo-font-sans)',
            fontSize: '19px',
            fontWeight: 300,
            letterSpacing: '-0.01em',
            color: 'var(--fomo-text-secondary)',
          }}>
            Nothing for today.
          </div>
        </div>
      ) : (
        <div
          onScroll={e => setScrolled(e.currentTarget.scrollTop > 4)}
          style={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', padding: '10px 26px 16px' }}
        >
          {tasks.length > 0 && (
            <div>
              <div style={{ marginBottom: '12px' }}><Eyebrow>Daily tasks</Eyebrow></div>
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
                    onToggle={() => onToggleTask(t.id)}
                    onOpen={() => onOpenTask(t.id)}
                  />
                ))}
              </TaskCardList>
            </div>
          )}

          {goals.length > 0 && (
            <div style={{ marginTop: tasks.length > 0 ? '26px' : 0 }}>
              <div style={{ marginBottom: '12px' }}><Eyebrow>Goals</Eyebrow></div>
              <TaskCardList>
                {goals.map(g => (
                  <TaskRowCard
                    key={g.id}
                    variant="filled"
                    name={g.name}
                    meta={g.note || undefined}
                    done={g.done}
                    onToggle={() => onToggleGoal(g.id)}
                    onOpen={() => onOpenGoal(g.id)}
                  />
                ))}
              </TaskCardList>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
