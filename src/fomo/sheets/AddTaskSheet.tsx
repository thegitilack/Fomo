import { useState, useRef, useEffect } from 'react'
import { Chip } from '../components/Chip'
import { Icon } from '../components/Icon'
import { formatMeta, repeatLabel, WEEK_ORDER, weekdayLabel, type Repeat, type NewTask } from '../state/store'
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

const sectionLabel: React.CSSProperties = {
  fontFamily: 'var(--fomo-font-mono)',
  fontSize: '11px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'var(--fomo-text-muted)',
  marginBottom: '10px',
}

export function AddTaskSheet({ onClose, onSubmit }: AddTaskSheetProps) {
  const [value, setValue] = useState('')
  const [dueDate, setDueDate] = useState<string | undefined>()
  const [dueTime, setDueTime] = useState<string | undefined>()
  const [priority, setPriority] = useState(false)
  const [repeat, setRepeat] = useState<Repeat>('none')
  const [repeatDays, setRepeatDays] = useState<number[]>([])
  const [note, setNote] = useState('')
  const [expanded, setExpanded] = useState(false)
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

  const canSave = !!value.trim()

  function submit() {
    if (!canSave) return
    onSubmit({
      name: value.trim(),
      dueDate,
      dueTime,
      priority,
      note: note.trim() || undefined,
      repeat: repeatDays.length ? 'custom' : repeat,
      repeatDays: repeatDays.length ? repeatDays : undefined,
    })
  }
  function cycleRepeat() {
    setRepeatDays([])
    setRepeat(r => REPEAT_CYCLE[(REPEAT_CYCLE.indexOf(r === 'custom' ? 'none' : r) + 1) % REPEAT_CYCLE.length])
  }
  function toggleDay(day: number) {
    setRepeatDays(days => {
      const next = days.includes(day) ? days.filter(d => d !== day) : [...days, day]
      setRepeat(next.length ? 'custom' : 'none')
      return next
    })
  }

  const effectiveRepeat: Repeat = repeatDays.length ? 'custom' : repeat
  const dateStroke = dueDate ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'
  const priStroke = priority ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'
  const repStroke = effectiveRepeat !== 'none' ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'
  const expStroke = expanded ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'

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
          padding: '0 24px calc(20px + env(safe-area-inset-bottom))',
          maxHeight: '84dvh',
          overflowY: 'auto',
        }}>
          {/* Header — confirm button top-right */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingTop: '14px', height: '52px' }}>
            <button
              type="button"
              aria-label="Save task"
              onClick={submit}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: 'none',
                background: 'var(--fomo-accent)',
                opacity: canSave ? 1 : 0.4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: canSave ? 'pointer' : 'default',
                transition: 'opacity 150ms ease',
              }}
            >
              <Icon name="check" size={20} stroke="var(--fomo-on-accent)" strokeWidth={1.8} />
            </button>
          </div>

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
                onBlur={() => inputRef.current?.focus()}
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
                  onBlur={() => inputRef.current?.focus()}
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
              label={repeatLabel(effectiveRepeat, repeatDays)}
              active={effectiveRepeat !== 'none'}
              icon={<Icon name="repeat" size={13} stroke={repStroke} />}
              onClick={cycleRepeat}
            />
            <Chip
              label={expanded ? 'Less' : 'More'}
              active={expanded}
              icon={<Icon name="note" size={13} stroke={expStroke} />}
              onClick={() => setExpanded(x => !x)}
            />
          </div>

          {/* Expanded panel: notes + custom repeat days */}
          {expanded && (
            <div style={{ marginTop: '24px' }}>
              <div style={sectionLabel}>Note</div>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add details…"
                rows={3}
                style={{
                  width: '100%',
                  resize: 'none',
                  fontFamily: 'var(--fomo-font-sans)',
                  fontSize: '15px',
                  fontWeight: 300,
                  lineHeight: 1.5,
                  color: 'var(--fomo-text-primary)',
                  caretColor: 'var(--fomo-accent)',
                  background: 'var(--fomo-note-fill)',
                  border: '1px solid var(--fomo-hairline)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  outline: 'none',
                }}
              />

              <div style={{ ...sectionLabel, marginTop: '24px' }}>Repeat on</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {WEEK_ORDER.map((day, i) => {
                  const on = repeatDays.includes(day)
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleDay(day)}
                      aria-pressed={on}
                      style={{
                        flex: 1,
                        height: '40px',
                        borderRadius: '10px',
                        border: 'none',
                        background: on ? 'var(--fomo-accent)' : 'var(--fomo-surface-raised)',
                        color: on ? 'var(--fomo-on-accent)' : 'var(--fomo-text-secondary)',
                        fontFamily: 'var(--fomo-font-sans)',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'background 120ms ease, color 120ms ease',
                      }}
                    >
                      {weekdayLabel(day)}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
