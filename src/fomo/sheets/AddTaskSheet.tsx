import { useState, useRef, useEffect } from 'react'
import { Chip } from '../components/Chip'
import { Icon } from '../components/Icon'
import { formatMeta, repeatLabel, type Repeat, type NewTask } from '../state/store'
import { ensurePermission } from '../state/reminders'

const REPEAT_CYCLE: Repeat[] = ['none', 'daily', 'weekly', 'monthly']

interface AddTaskSheetProps {
  onClose: () => void
  onSubmit: (task: NewTask) => void
}

const overlayInput: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
  border: 0,
  padding: 0,
  margin: 0,
  cursor: 'pointer',
  colorScheme: 'dark',
}

export function AddTaskSheet({ onClose, onSubmit }: AddTaskSheetProps) {
  const [value, setValue] = useState('')
  const [dueDate, setDueDate] = useState<string | undefined>()
  const [dueTime, setDueTime] = useState<string | undefined>()
  const [priority, setPriority] = useState(false)
  const [repeat, setRepeat] = useState<Repeat>('none')
  const [kbOffset, setKbOffset] = useState(0)
  const inputRef = useRef<HTMLDivElement>(null)

  // Open the native keyboard, and keep the sheet lifted above it.
  useEffect(() => {
    inputRef.current?.setAttribute('autocorrect', 'off')
    inputRef.current?.focus()
    const vv = window.visualViewport
    if (!vv) return
    const onResize = () => {
      const overlap = window.innerHeight - vv.height - vv.offsetTop
      setKbOffset(Math.max(0, overlap))
    }
    vv.addEventListener('resize', onResize)
    vv.addEventListener('scroll', onResize)
    onResize()
    return () => {
      vv.removeEventListener('resize', onResize)
      vv.removeEventListener('scroll', onResize)
    }
  }, [])

  function submit() {
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
      {/* Sheet — lifts above the keyboard via kbOffset */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: kbOffset }}>
        <div style={{
          background: 'var(--fomo-surface-sheet)',
          borderRadius: '22px 22px 0 0',
          borderTop: '1px solid var(--fomo-hairline)',
          padding: '0 24px calc(22px + env(safe-area-inset-bottom))',
        }}>
          {/* Grab handle */}
          <div style={{
            width: '36px',
            height: '4px',
            borderRadius: '2px',
            background: 'var(--fomo-ring)',
            margin: '10px auto 22px',
          }} />

          {/* Task name — contentEditable (not a form field) so iOS shows the
              native keyboard without the form-assistant accessory bar. */}
          <div style={{ position: 'relative', paddingBottom: '18px', borderBottom: '1px solid var(--fomo-hairline)' }}>
            {!value && (
              <span style={{
                position: 'absolute',
                left: 0,
                top: 0,
                pointerEvents: 'none',
                fontFamily: 'var(--fomo-font-sans)',
                fontSize: '17px',
                fontWeight: 300,
                letterSpacing: '-0.01em',
                lineHeight: '24px',
                color: 'var(--fomo-text-muted)',
              }}>
                Task name
              </span>
            )}
            <div
              ref={inputRef}
              className="fomo-task-input"
              contentEditable
              role="textbox"
              aria-label="Task name"
              suppressContentEditableWarning
              inputMode="text"
              enterKeyHint="done"
              autoCapitalize="sentences"
              spellCheck={false}
              onInput={e => setValue((e.currentTarget.textContent || '').replace(/\n/g, ''))}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); submit() } }}
              style={{
                minHeight: '24px',
                whiteSpace: 'nowrap',
                overflowX: 'auto',
                fontFamily: 'var(--fomo-font-sans)',
                fontSize: '17px',
                fontWeight: 300,
                letterSpacing: '-0.01em',
                lineHeight: '24px',
                color: 'var(--fomo-text-primary)',
                caretColor: 'var(--fomo-accent)',
                outline: 'none',
              }}
            />
          </div>

          {/* Chip row */}
          <div style={{ display: 'flex', gap: '9px', marginTop: '18px', overflowX: 'auto' }}>
            <span style={{ position: 'relative', display: 'inline-flex', flex: 'none' }}>
              <Chip
                label={dueDate ? (formatMeta(dueDate) ?? 'Due date') : 'Due date'}
                active={!!dueDate}
                icon={<Icon name="calendar" size={13} stroke={dateStroke} />}
              />
              <input
                type="date"
                aria-label="Due date"
                tabIndex={-1}
                value={dueDate ?? ''}
                onChange={e => setDueDate(e.target.value || undefined)}
                style={overlayInput}
              />
            </span>

            {dueDate && (
              <span style={{ position: 'relative', display: 'inline-flex', flex: 'none' }}>
                <Chip
                  label={dueTime ? (formatMeta(undefined, dueTime) ?? 'Time') : 'Add time'}
                  active={!!dueTime}
                />
                <input
                  type="time"
                  aria-label="Due time"
                  tabIndex={-1}
                  value={dueTime ?? ''}
                  onChange={e => { setDueTime(e.target.value || undefined); if (e.target.value) void ensurePermission() }}
                  style={overlayInput}
                />
              </span>
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
        </div>
      </div>
    </div>
  )
}
