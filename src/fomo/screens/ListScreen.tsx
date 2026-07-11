import type { Task } from '../state/store'
import { formatMeta } from '../state/store'
import { Eyebrow } from '../components/Eyebrow'
import { PageTitle } from '../components/PageTitle'
import { TaskRow } from '../components/TaskRow'

interface ListScreenProps {
  eyebrow: string
  title: string
  tasks: Task[]
  onToggle: (id: string) => void
  onOpen: (id: string) => void
}

export function ListScreen({ eyebrow, title, tasks, onToggle, onOpen }: ListScreenProps) {
  const sorted = [...tasks].sort((a, b) => (b.flagged ? 1 : 0) - (a.flagged ? 1 : 0))

  return (
    <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', paddingBottom: '16px' }}>
      <div style={{ padding: '46px 26px 0' }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <div style={{ height: '8px' }} />
        <PageTitle>{title}</PageTitle>
      </div>
      <div style={{ padding: '30px 26px 0' }}>
        {sorted.map((t, i) => (
          <TaskRow
            key={t.id}
            name={t.name}
            meta={formatMeta(t.dueDate, t.dueTime)}
            priority={t.priority}
            flagged={t.flagged}
            done={t.done}
            divider={i < sorted.length - 1}
            onToggle={() => onToggle(t.id)}
            onOpen={() => onOpen(t.id)}
          />
        ))}
      </div>
    </div>
  )
}
