import { useState, useRef } from 'react'
import { Chip } from '../components/Chip'
import { Icon } from '../components/Icon'
import { Keyboard } from './Keyboard'
import { formatMeta, repeatLabel, type Repeat, type NewTask } from '../state/store'
import { ensurePermission } from '../state/reminders'

const REPEAT_CYCLE: Repeat[] = ['none', 'daily', 'weekly', 'monthly']

interface AddTaskSheetProps {
  onClose: () => void
  onSubmit: (task: NewTask) => void
}

function openPicker(el: HTMLInputElement | null) {
  if (!el) return
  const anyEl = el as unknown as { showPicker?: () => void }
  if (typeof anyEl.showPicker === 'function') anyEl.showPicker()
  else el.focus()
}

export function AddTaskSheet({ onClose, onSubmit }: AddTaskSheetProps) {
  const [value, setValue] = useState('')
  const [dueDate, setDueDate] = useState<string | undefined>()
  const [dueTime, setDueTime] = useState<string | undefined>()
  const [priority, setPriority] = useState(false)
  const [repeat, setRepeat] = useState<Repeat>('none')
  const dateRef = useRef<HTMLInputElement>(null)
  const timeRef = useRef<HTMLInputElement>(null)

  function handleKey(char: string) { setValue(v => v + char) }
  function handleBackspace() { setValue(v => v.slice(0, -1)) }
  function handleReturn() {
    if (value.trim()) onSubmit({ name: value.trim(), dueDate, dueTime, priority, repeat })
    else onClose()
  }
  function cycleRepeat() {
    setRepeat(r => REPEAT_CYCLE[(REPEAT_CYCLE.indexOf(r) + 1) % REPEAT_CYCLE.length])
  }

  const dateStroke = dueDate ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'
  const priStroke = priority ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'
  const repStroke = repeat !== 'none' ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
      {/* Scrim */}
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'var(--fomo-scrim)' }}
      />
      {/* Sheet */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <div style={{
          background: 'var(--fomo-surface-sheet)',
          borderRadius: '22px 22px 0 0',
          borderTop: '1px solid var(--fomo-hairline)',
          padding: '0 24px 22px',
        }}>
          {/* Grab handle */}
          <div style={{
            width: '36px',
            height: '4px',
            borderRadius: '2px',
            background: 'var(--fomo-ring)',
            margin: '10px auto 22px',
          }} />

          {/* Input line */}
          <div style={{ paddingBottom: '18px', borderBottom: '1px solid var(--fomo-hairline)' }}>
            <span style={{
              fontFamily: 'var(--fomo-font-sans)',
              fontSize: '17px',
              fontWeight: 300,
              letterSpacing: '-0.01em',
              color: value ? 'var(--fomo-text-primary)' : 'var(--fomo-text-muted)',
            }}>
              {value || 'Task name'}
            </span>
            <span style={{
              display: 'inline-block',
              width: '2px',
              height: '20px',
              background: 'var(--fomo-accent)',
              verticalAlign: '-4px',
              marginLeft: '2px',
              animation: 'fomo-caret 1s steps(1) infinite',
            }} />
          </div>

          {/* Chip row */}
          <div style={{ display: 'flex', gap: '9px', marginTop: '18px', overflowX: 'auto' }}>
            <Chip
              label={dueDate ? (formatMeta(dueDate) ?? 'Due date') : 'Due date'}
              active={!!dueDate}
              icon={<Icon name="calendar" size={13} stroke={dateStroke} />}
              onClick={() => openPicker(dateRef.current)}
            />
            {dueDate && (
              <Chip
                label={dueTime ? (formatMeta(undefined, dueTime) ?? 'Time') : 'Add time'}
                active={!!dueTime}
                onClick={() => openPicker(timeRef.current)}
              />
            )}
            <Chip
              label="Priority"
              active={priority}
              icon={<Icon name="flag" size={13} stroke={priStroke} />}
              onClick={() => setPriority(p => !p)}
            />
            <Chip
              label={repeatLabel(repeat)}
              active={repeat !== 'none'}
              icon={<Icon name="repeat" size={13} stroke={repStroke} />}
              onClick={cycleRepeat}
            />
          </div>

          {/* Hidden native pickers (real date/time UI on mobile) */}
          <input
            ref={dateRef}
            type="date"
            value={dueDate ?? ''}
            onChange={e => setDueDate(e.target.value || undefined)}
            style={{ position: 'absolute', opacity: 0, width: 1, height: 1, border: 0, pointerEvents: 'none' }}
            tabIndex={-1}
            aria-hidden
          />
          <input
            ref={timeRef}
            type="time"
            value={dueTime ?? ''}
            onChange={e => { setDueTime(e.target.value || undefined); if (e.target.value) void ensurePermission() }}
            style={{ position: 'absolute', opacity: 0, width: 1, height: 1, border: 0, pointerEvents: 'none' }}
            tabIndex={-1}
            aria-hidden
          />
        </div>

        <Keyboard onKey={handleKey} onBackspace={handleBackspace} onReturn={handleReturn} />
      </div>
    </div>
  )
}
