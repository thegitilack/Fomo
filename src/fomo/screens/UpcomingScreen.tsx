import type { Task } from '../state/store'
import { formatMeta, formatDayHeader } from '../state/store'
import { Eyebrow } from '../components/Eyebrow'
import { PageTitle } from '../components/PageTitle'
import { TaskRow } from '../components/TaskRow'

interface UpcomingScreenProps {
  grouped: Map<string, Task[]>
  onToggle: (id: string) => void
  onOpen: (id: string) => void
}

export function UpcomingScreen({ grouped, onToggle, onOpen }: UpcomingScreenProps) {
  const entries = [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b))

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '16px' }}>
      <div style={{ padding: '46px 26px 0' }}>
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
        <div style={{ padding: '30px 26px 0' }}>
          {entries.map(([date, tasks], gi) => (
            <div key={date} style={{ marginTop: gi > 0 ? '22px' : 0 }}>
              <div style={{ marginBottom: '12px' }}>
                <Eyebrow>{formatDayHeader(date)}</Eyebrow>
              </div>
              {tasks.map((t, i) => (
                <TaskRow
                  key={t.id}
                  name={t.name}
                  meta={formatMeta(undefined, t.dueTime)}
                  priority={t.priority}
                  flagged={t.flagged}
                  done={t.done}
                  divider={i < tasks.length - 1}
                  onToggle={() => onToggle(t.id)}
                  onOpen={() => onOpen(t.id)}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
