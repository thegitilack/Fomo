import { Chip } from '../components/Chip'
import { Icon } from '../components/Icon'
import { formatMeta, repeatLabel, WEEK_ORDER, weekdayLabel, type Repeat } from '../state/store'
import { ensurePermission } from '../state/reminders'

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

export const optionSectionLabel: React.CSSProperties = {
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

/** The task fields edited by the chip row + repeat panel. `date`/`time` are the
 *  due date+time for a one-off, or the start date + per-occurrence time when
 *  repeating. */
export interface TaskOptionsValue {
  date?: string
  time?: string
  repeat: Repeat
  repeatDays: number[]
  endDate?: string
  endTime?: string
  priority: boolean
}

interface TaskOptionsProps {
  value: TaskOptionsValue
  onChange: (patch: Partial<TaskOptionsValue>) => void
  expanded: boolean
  onToggleExpanded: () => void
  /** Called when a native picker closes — used to refocus the name field. */
  onPickerBlur?: () => void
  /** Rendered at the end of the expanded panel (e.g. a Note field). */
  children?: React.ReactNode
}

/** Shared Add/Edit task controls: Date · Hour · Repeat · Priority, plus the
 *  expandable Repeat / Repeat on / Repeat until panel. */
export function TaskOptions({ value, onChange, expanded, onToggleExpanded, onPickerBlur, children }: TaskOptionsProps) {
  const { date, time, repeat, repeatDays, endDate, endTime, priority } = value
  const isRepeatSet = repeat !== 'none'

  const dateStroke = date ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'
  const timeStroke = time ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'
  const repStroke = isRepeatSet ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'
  const priStroke = priority ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'

  const setPreset = (p: Repeat) => onChange({ repeat: repeat === p ? 'none' : p, repeatDays: [] })
  // Picking a weekday IS a weekly recurrence — narrow it to the chosen days.
  const toggleDay = (day: number) =>
    onChange({
      repeat: 'weekly',
      repeatDays: repeatDays.includes(day) ? repeatDays.filter(d => d !== day) : [...repeatDays, day],
    })

  return (
    <>
      {/* Chip row: Date, Hour, Repeat, Priority */}
      <div style={{ display: 'flex', gap: '9px', overflowX: 'auto' }}>
        {/* Date — one-off due date, or the repeating start/anchor date */}
        <span style={{ position: 'relative', display: 'inline-flex', flex: 'none' }}>
          <Chip
            label={date ? (formatMeta(date) ?? 'Date') : 'Date'}
            active={!!date}
            icon={<Icon name="calendar" size={13} stroke={dateStroke} />}
          />
          <input
            type="date"
            aria-label="Date"
            tabIndex={-1}
            value={date ?? ''}
            onChange={e => onChange({ date: e.target.value || undefined })}
            onBlur={onPickerBlur}
            style={overlayInput}
          />
        </span>

        {/* Hour — one-off due time, or the per-occurrence time */}
        <span style={{ position: 'relative', display: 'inline-flex', flex: 'none' }}>
          <Chip
            label={time ? (formatMeta(undefined, time) ?? 'Hour') : 'Hour'}
            active={!!time}
            icon={<Icon name="clock" size={13} stroke={timeStroke} />}
          />
          <input
            type="time"
            aria-label="Hour"
            tabIndex={-1}
            value={time ?? ''}
            onChange={e => { onChange({ time: e.target.value || undefined }); if (e.target.value) void ensurePermission() }}
            onBlur={onPickerBlur}
            style={overlayInput}
          />
        </span>

        <Chip
          label={repeatLabel(repeat, repeatDays)}
          active={isRepeatSet}
          icon={<Icon name="repeat" size={13} stroke={repStroke} />}
          onClick={onToggleExpanded}
        />

        <Chip
          label="Priority"
          active={priority}
          icon={<Icon name="flag" size={13} stroke={priStroke} />}
          onClick={() => onChange({ priority: !priority })}
        />
      </div>

      {/* Expanded options */}
      {expanded && (
        <div style={{ marginTop: '24px' }}>
          {/* Repeat */}
          <div style={optionSectionLabel}>Repeat</div>
          <div style={{ display: 'flex', gap: '9px', flexWrap: 'wrap' }}>
            {PRESETS.map(p => (
              <Chip key={p.key} label={p.label} active={repeat === p.key} onClick={() => setPreset(p.key)} />
            ))}
          </div>

          {/* Repeat on — selecting a day makes the task weekly */}
          <div style={{ ...optionSectionLabel, marginTop: '18px' }}>Repeat on</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {WEEK_ORDER.map((day, i) => {
              // Pills reflect only explicitly chosen days — never auto-filled.
              const on = repeatDays.includes(day)
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

          {/* Repeat until — end date + cutoff time */}
          <div style={{ ...optionSectionLabel, marginTop: '24px' }}>Repeat until</div>
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
                onChange={e => onChange({ endDate: e.target.value || undefined })}
                onBlur={onPickerBlur}
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
                  onChange={e => onChange({ endTime: e.target.value || undefined })}
                  onBlur={onPickerBlur}
                  style={overlayInput}
                />
              </span>
            )}
          </div>

          {children}
        </div>
      )}
    </>
  )
}
