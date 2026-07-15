import { useState, useRef, useEffect } from 'react'
import { Icon } from '../components/Icon'
import { type Repeat, type NewTask } from '../state/store'
import { TaskOptions, optionSectionLabel, type TaskOptionsValue } from './TaskOptions'

interface AddTaskSheetProps {
  onClose: () => void
  onSubmit: (task: NewTask) => void
}

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
  function applyPatch(p: Partial<TaskOptionsValue>) {
    if ('date' in p) setDueDate(p.date)
    if ('time' in p) setDueTime(p.time)
    if ('repeat' in p) setRepeat(p.repeat!)
    if ('repeatDays' in p) setRepeatDays(p.repeatDays!)
    if ('endDate' in p) setEndDate(p.endDate)
    if ('endTime' in p) setEndTime(p.endTime)
    if ('priority' in p) setPriority(p.priority!)
  }

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

          {/* Chip row + repeat panel (shared with Task detail) */}
          <div style={{ marginTop: '18px' }}>
            <TaskOptions
              value={{ date: dueDate, time: dueTime, repeat, repeatDays, endDate, endTime, priority }}
              onChange={applyPatch}
              expanded={expanded}
              onToggleExpanded={() => setExpanded(x => !x)}
              onPickerBlur={() => inputRef.current?.focus()}
            >
              {/* Note */}
              <div style={{ ...optionSectionLabel, marginTop: '24px' }}>Note</div>
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
            </TaskOptions>
          </div>
        </div>
      </div>
    </div>
  )
}
