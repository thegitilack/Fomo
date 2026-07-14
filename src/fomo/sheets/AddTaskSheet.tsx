import { useState, useRef, useEffect } from 'react'
import { Chip } from '../components/Chip'
import { Icon } from '../components/Icon'
import { formatMeta, repeatLabel, WEEK_ORDER, weekdayLabel, type Repeat, type NewTask } from '../state/store'
import { ensurePermission } from '../state/reminders'

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

const PRESETS: { key: Repeat; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
]

export function AddTaskSheet({ onClose, onSubmit }: AddTaskSheetProps) {
  const [value, setValue] = useState('')
  const [dueDate, setDueDate] = useState<string | undefined>()
  const [dueTime, setDueTime] = useState<string | undefined>()
  const [priority, setPriority] = useState(false)
  const [repeat, setRepeat] = useState<Repeat>('none')
  const [repeatDays, setRepeatDays] = useState<number[]>([])
  const [endDate, setEndDate] = useState<string | undefined>()
  const [endTime, setEndTime] = useState<string | undefined>()
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

  const isRepeatSet = repeat !== 'none'

  function submit() {
    if (!canSave) return
    onSubmit({
      name: value.trim(),
      // One-off: the Date/Hour are a plain due date + time. Repeating: the
      // Date/Hour become the start date + per-occurrence time (start falls
      // back to today), plus an optional repeat-until date and cutoff time.
      dueDate: isRepeatSet ? undefined : dueDate,
      startDate: isRepeatSet ? dueDate : undefined,
      dueTime,
      endDate: isRepeatSet ? endDate : undefined,
      endTime: isRepeatSet && endDate ? endTime : undefined,
      priority,
      note: note.trim() || undefined,
      repeat,
      // Weekly carries the chosen weekdays (empty = the start-date weekday).
      repeatDays: repeat === 'weekly' ? repeatDays : undefined,
    })
  }
  function setPreset(p: Repeat) {
    setRepeatDays([])
    setRepeat(cur => (cur === p ? 'none' : p))
  }
  // Picking a weekday IS a weekly recurrence — narrow it to the chosen days.
  function toggleDay(day: number) {
    setRepeat('weekly')
    setRepeatDays(days => (days.includes(day) ? days.filter(d => d !== day) : [...days, day]))
  }

  const dateStroke = dueDate ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'
  const timeStroke = dueTime ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'
  const repStroke = isRepeatSet ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'
  const priStroke = priority ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'
  // Weekly with no explicit days defaults to the start-date's weekday.
  const anchorWeekday = new Date((dueDate ?? new Date().toISOString().slice(0, 10)) + 'T12:00:00').getDay()

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
          {/* Task name + confirm button (aligned) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '20px', paddingBottom: '18px', borderBottom: '1px solid var(--fomo-hairline)' }}>
            <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
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
            {/* Confirm — same look as the FAB */}
            <button
              type="button"
              aria-label="Save task"
              onClick={submit}
              style={{
                flex: 'none',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'var(--fomo-surface-raised)',
                border: '1px solid var(--fomo-border)',
                boxShadow: 'var(--fomo-shadow-fab)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                opacity: canSave ? 1 : 0.45,
                cursor: canSave ? 'pointer' : 'default',
                transition: 'opacity 150ms ease',
              }}
            >
              <Icon name="check" size={20} stroke="var(--fomo-text-primary)" strokeWidth={1.6} />
            </button>
          </div>

          {/* Chip row: Date, Hour, Repeat, Priority */}
          <div style={{ display: 'flex', gap: '9px', marginTop: '18px', overflowX: 'auto' }}>
            {/* Date — one-off due date, or the repeating start/anchor date */}
            <span style={{ position: 'relative', display: 'inline-flex', flex: 'none' }}>
              <Chip
                label={dueDate ? (formatMeta(dueDate) ?? 'Date') : 'Date'}
                active={!!dueDate}
                icon={<Icon name="calendar" size={13} stroke={dateStroke} />}
              />
              <input
                type="date"
                aria-label="Date"
                tabIndex={-1}
                value={dueDate ?? ''}
                onChange={e => setDueDate(e.target.value || undefined)}
                onBlur={() => inputRef.current?.focus()}
                style={overlayInput}
              />
            </span>

            {/* Hour — one-off due time, or the per-occurrence time */}
            <span style={{ position: 'relative', display: 'inline-flex', flex: 'none' }}>
              <Chip
                label={dueTime ? (formatMeta(undefined, dueTime) ?? 'Hour') : 'Hour'}
                active={!!dueTime}
                icon={<Icon name="clock" size={13} stroke={timeStroke} />}
              />
              <input
                type="time"
                aria-label="Hour"
                tabIndex={-1}
                value={dueTime ?? ''}
                onChange={e => { setDueTime(e.target.value || undefined); if (e.target.value) void ensurePermission() }}
                onBlur={() => inputRef.current?.focus()}
                style={overlayInput}
              />
            </span>

            <Chip
              label={repeatLabel(repeat, repeatDays)}
              active={isRepeatSet}
              icon={<Icon name="repeat" size={13} stroke={repStroke} />}
              onClick={() => setExpanded(x => !x)}
            />

            <Chip
              label="Priority"
              active={priority}
              icon={<Icon name="flag" size={13} stroke={priStroke} />}
              onClick={() => setPriority(p => !p)}
            />
          </div>

          {/* Expanded options */}
          {expanded && (
            <div style={{ marginTop: '24px' }}>
              {/* Repeat */}
              <div style={sectionLabel}>Repeat</div>
              <div style={{ display: 'flex', gap: '9px', flexWrap: 'wrap' }}>
                {PRESETS.map(p => (
                  <Chip
                    key={p.key}
                    label={p.label}
                    active={repeat === p.key}
                    onClick={() => setPreset(p.key)}
                  />
                ))}
              </div>

              {/* Repeat on — selecting a day makes the task weekly */}
              <div style={{ ...sectionLabel, marginTop: '18px' }}>Repeat on</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {WEEK_ORDER.map((day, i) => {
                  // Weekly with no explicit days defaults to the start-date weekday.
                  const on = repeatDays.length
                    ? repeatDays.includes(day)
                    : repeat === 'weekly' && day === anchorWeekday
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleDay(day)}
                      aria-pressed={on}
                      style={{
                        flex: 1,
                        height: '38px',
                        borderRadius: '999px',
                        border: `1px solid ${on ? 'var(--fomo-chip-active-bd)' : 'var(--fomo-border)'}`,
                        background: on ? 'var(--fomo-chip-active-bg)' : 'transparent',
                        color: on ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)',
                        fontFamily: 'var(--fomo-font-sans)',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'background 120ms ease, color 120ms ease, border-color 120ms ease',
                      }}
                    >
                      {weekdayLabel(day)}
                    </button>
                  )
                })}
              </div>

              {/* Repeat until — end date + occurrence time */}
              <div style={{ ...sectionLabel, marginTop: '24px' }}>Repeat until</div>
              <div style={{ display: 'flex', gap: '9px' }}>
                <span style={{ position: 'relative', display: 'inline-flex', flex: 'none' }}>
                  <Chip
                    label={endDate ? (formatMeta(endDate) ?? 'Date') : 'Date'}
                    active={!!endDate}
                    icon={<Icon name="calendar" size={13} stroke={endDate ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'} />}
                  />
                  <input
                    type="date"
                    aria-label="Repeat until"
                    tabIndex={-1}
                    value={endDate ?? ''}
                    onChange={e => setEndDate(e.target.value || undefined)}
                    onBlur={() => inputRef.current?.focus()}
                    style={overlayInput}
                  />
                </span>
                {endDate && (
                  <span style={{ position: 'relative', display: 'inline-flex', flex: 'none' }}>
                    <Chip
                      label={endTime ? (formatMeta(undefined, endTime) ?? 'Hour') : 'Hour'}
                      active={!!endTime}
                      icon={<Icon name="clock" size={13} stroke={endTime ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'} />}
                    />
                    <input
                      type="time"
                      aria-label="Repeat until time"
                      tabIndex={-1}
                      value={endTime ?? ''}
                      onChange={e => setEndTime(e.target.value || undefined)}
                      onBlur={() => inputRef.current?.focus()}
                      style={overlayInput}
                    />
                  </span>
                )}
              </div>

              {/* Note */}
              <div style={{ ...sectionLabel, marginTop: '24px' }}>Note</div>
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
