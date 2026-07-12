import type { Task } from '../state/store'
import { formatMeta, formatDayHeader } from '../state/store'
import { Eyebrow } from '../components/Eyebrow'
import { PageTitle } from '../components/PageTitle'
import { TaskRowCard, TaskCardList } from '../components/TaskRowCard'

interface UpcomingScreenProps {
  grouped: Map<string, Task[]>
  onToggle: (id: string) => void
  onOpen: (id: string) => void
}

export function UpcomingScreen({ grouped, onToggle, onOpen }: UpcomingScreenProps) {
  const entries = [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b))

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Fixed header */}
      <div style={{ flex: 'none', padding: '46px 26px 20px' }}>
        <Eyebrow>Next 7 days</Eyebrow>
        <div style={{ height: '8px' }} />
        <PageTitle>Upcoming</PageTitle>
      </div>

      {entries.length === 0 ? (
        <div style={{ padding: '60px 26px 0', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--fomo-font-sans)',
            fontSize: '19px',
            fontWeight: 300,
            letterSpacing: '-0.01em',
            color: 'var(--fomo-text-secondary)',
          }}>
            Nothing coming up.
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', padding: '10px 26px 16px' }}>
          {entries.map(([date, tasks], gi) => (
            <div key={date} style={{ marginTop: gi > 0 ? '22px' : 0 }}>
              <div style={{ marginBottom: '12px' }}>
                <Eyebrow>{formatDayHeader(date)}</Eyebrow>
              </div>
              <TaskCardList>
                {tasks.map(t => (
                  <TaskRowCard
                    key={t.id}
                    variant="filled"
                    name={t.name}
                    meta={formatMeta(undefined, t.dueTime)}
                    priority={t.priority}
                    flagged={t.flagged}
                    done={t.done}
                    onToggle={() => onToggle(t.id)}
                    onOpen={() => onOpen(t.id)}
                  />
                ))}
              </TaskCardList>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
