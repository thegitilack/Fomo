import { useState, useRef, useEffect } from 'react'
import { Icon } from '../components/Icon'
import { type Repeat, type NewTask, type NewGoal } from '../state/store'
import { TaskOptions, optionSectionLabel, type TaskOptionsValue } from './TaskOptions'

export type AddKind = 'task' | 'goal'

interface AddSheetProps {
  initialKind?: AddKind
  onClose: () => void
  onSubmitTask: (task: NewTask) => void
  onSubmitGoal: (goal: NewGoal) => void
}

const noteLabel: React.CSSProperties = { ...optionSectionLabel, marginTop: '24px' }

const noteStyle: React.CSSProperties = {
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
}

export function AddSheet({ initialKind = 'task', onClose, onSubmitTask, onSubmitGoal }: AddSheetProps) {
  const [kind, setKind] = useState<AddKind>(initialKind)
  const [value, setValue] = useState('')
  const [note, setNote] = useState('')
  // Task-only fields
  const [dueDate, setDueDate] = useState<string | undefined>()
  const [dueTime, setDueTime] = useState<string | undefined>()
  const [flagged, setFlagged] = useState(false)
  const [repeat, setRepeat] = useState<Repeat>('none')
  const [repeatDays, setRepeatDays] = useState<number[]>([])
  const [endDate, setEndDate] = useState<string | undefined>()
  const [endTime, setEndTime] = useState<string | undefined>()
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
    if (kind === 'goal') {
      onSubmitGoal({ name: value.trim(), note: note.trim() || undefined })
      return
    }
    onSubmitTask({
      name: value.trim(),
      dueDate: isRepeatSet ? undefined : dueDate,
      startDate: isRepeatSet ? dueDate : undefined,
      dueTime,
      endDate: isRepeatSet ? endDate : undefined,
      endTime: isRepeatSet && endDate ? endTime : undefined,
      flagged,
      note: note.trim() || undefined,
      repeat,
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
    if ('flagged' in p) setFlagged(p.flagged!)
  }

  const placeholder = kind === 'goal' ? 'What do you want to do?' : 'Task name'

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
      {/* Scrim */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'var(--fomo-scrim)' }} />
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
          {/* Task / Goal selector */}
          <div style={{ display: 'flex', gap: '6px', paddingTop: '18px' }}>
            {(['task', 'goal'] as AddKind[]).map(k => {
              const on = kind === k
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  aria-pressed={on}
                  style={{
                    flex: 1,
                    height: '36px',
                    borderRadius: '999px',
                    border: `1px solid ${on ? 'var(--fomo-chip-active-bd)' : 'var(--fomo-border)'}`,
                    background: on ? 'var(--fomo-chip-active-bg)' : 'transparent',
                    color: on ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)',
                    fontFamily: 'var(--fomo-font-sans)',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'background 120ms ease, color 120ms ease, border-color 120ms ease',
                  }}
                >
                  {k === 'task' ? 'Task' : 'Goal'}
                </button>
              )
            })}
          </div>

          {/* Name + confirm button (aligned) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '18px', paddingBottom: '18px', borderBottom: '1px solid var(--fomo-hairline)' }}>
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
                  {placeholder}
                </span>
              )}
              <div
                ref={inputRef}
                className="fomo-task-input"
                contentEditable
                role="textbox"
                aria-label={kind === 'goal' ? 'Goal name' : 'Task name'}
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
              aria-label={kind === 'goal' ? 'Save goal' : 'Save task'}
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

          {kind === 'task' ? (
            <div style={{ marginTop: '18px' }}>
              <TaskOptions
                value={{ date: dueDate, time: dueTime, repeat, repeatDays, endDate, endTime, flagged }}
                onChange={applyPatch}
                expanded={expanded}
                onToggleExpanded={() => setExpanded(x => !x)}
                onPickerBlur={() => inputRef.current?.focus()}
              >
                <div style={noteLabel}>Note</div>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Add details…"
                  rows={3}
                  style={noteStyle}
                />
              </TaskOptions>
            </div>
          ) : (
            <div style={{ marginTop: '18px' }}>
              <div style={optionSectionLabel}>Note</div>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Why it matters, or a first step…"
                rows={3}
                style={noteStyle}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
