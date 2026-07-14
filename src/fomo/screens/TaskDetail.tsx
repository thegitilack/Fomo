import { useState } from 'react'
import type { Task, Repeat } from '../state/store'
import { formatMeta, repeatLabel, isDoneToday } from '../state/store'
import { ensurePermission } from '../state/reminders'
import { Checkbox } from '../components/Checkbox'
import { Chip } from '../components/Chip'
import { Icon } from '../components/Icon'

const REPEAT_CYCLE: Repeat[] = ['none', 'daily', 'weekly', 'monthly']

interface TaskDetailProps {
  task: Task
  onBack: () => void
  onToggleDone: () => void
  onToggleFlag: () => void
  onDelete: () => void
  onUpdateNote: (note: string) => void
  onUpdate: (patch: Partial<Task>) => void
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

export function TaskDetail({ task, onBack, onToggleDone, onToggleFlag, onDelete, onUpdateNote, onUpdate }: TaskDetailProps) {
  const [editingNote, setEditingNote] = useState(false)
  const [noteValue, setNoteValue] = useState(task.note ?? '')
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(task.name)

  const meta = formatMeta(task.dueDate, task.dueTime)
  const repeat = task.repeat ?? 'none'

  function saveNote() {
    onUpdateNote(noteValue)
    setEditingNote(false)
  }
  function saveTitle() {
    const name = titleValue.trim()
    if (name) onUpdate({ name })
    else setTitleValue(task.name)
    setEditingTitle(false)
  }
  function cycleRepeat() {
    onUpdate({ repeat: REPEAT_CYCLE[(REPEAT_CYCLE.indexOf(repeat) + 1) % REPEAT_CYCLE.length] })
  }

  const dateStroke = task.dueDate ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'
  const repStroke = repeat !== 'none' ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px 0' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Icon name="back" size={24} stroke="var(--fomo-text-primary)" />
        </button>
        <button onClick={onToggleFlag} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Icon name="flag" size={16} stroke={task.flagged ? 'var(--fomo-accent)' : 'var(--fomo-text-faint)'} />
        </button>
      </div>

      {/* Title + checkbox */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '0 26px', marginTop: '26px' }}>
        <div style={{ marginTop: '4px' }}>
          <Checkbox checked={isDoneToday(task)} size={24} onChange={onToggleDone} />
        </div>
        {editingTitle ? (
          <textarea
            autoFocus
            value={titleValue}
            onChange={e => setTitleValue(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveTitle() } }}
            rows={1}
            style={{
              flex: 1,
              fontFamily: 'var(--fomo-font-sans)',
              fontSize: '23px',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
              color: 'var(--fomo-text-primary)',
              background: 'none',
              border: 'none',
              outline: 'none',
              resize: 'none',
              padding: 0,
            }}
          />
        ) : (
          <div
            onClick={() => { setTitleValue(task.name); setEditingTitle(true) }}
            style={{
              flex: 1,
              cursor: 'text',
              fontFamily: 'var(--fomo-font-sans)',
              fontSize: '23px',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
              color: isDoneToday(task) ? 'var(--fomo-text-done)' : 'var(--fomo-text-primary)',
              textDecorationLine: isDoneToday(task) ? 'line-through' : 'none',
              textDecorationColor: 'var(--fomo-ring)',
            }}
          >
            {task.name}
          </div>
        )}
      </div>

      {/* Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', padding: '0 26px', marginTop: '28px' }}>
        <span style={{ position: 'relative', display: 'inline-flex' }}>
          <Chip
            label={meta ?? 'Add date'}
            active={!!task.dueDate}
            icon={<Icon name="calendar" size={13} stroke={dateStroke} />}
          />
          <input
            type="date"
            aria-label="Due date"
            value={task.dueDate ?? ''}
            onChange={e => onUpdate({ dueDate: e.target.value || undefined })}
            style={overlayInput}
          />
        </span>
        {task.dueDate && !meta?.includes(':') && (
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <Chip label="Add time" />
            <input
              type="time"
              aria-label="Due time"
              value={task.dueTime ?? ''}
              onChange={e => { onUpdate({ dueTime: e.target.value || undefined }); if (e.target.value) void ensurePermission() }}
              style={overlayInput}
            />
          </span>
        )}
        <Chip
          label="Priority"
          active={task.priority}
          onClick={() => onUpdate({ priority: !task.priority })}
        />
        <Chip
          label={task.flagged ? 'Flagged' : 'Flag'}
          active={task.flagged}
          icon={<Icon name="flag" size={13} stroke={task.flagged ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'} />}
          onClick={onToggleFlag}
        />
        <Chip
          label={repeatLabel(repeat)}
          active={repeat !== 'none'}
          icon={<Icon name="repeat" size={13} stroke={repStroke} />}
          onClick={cycleRepeat}
        />
      </div>

      {/* Note card */}
      <div
        onClick={() => !editingNote && setEditingNote(true)}
        style={{
          margin: '26px 26px 0',
          borderRadius: '12px',
          background: 'var(--fomo-note-fill)',
          border: '1px solid var(--fomo-hairline)',
          padding: '16px',
          cursor: editingNote ? 'default' : 'text',
        }}
      >
        <div style={{
          fontFamily: 'var(--fomo-font-mono)',
          fontSize: '11px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--fomo-text-muted)',
          marginBottom: '12px',
        }}>
          Note
        </div>
        {editingNote ? (
          <textarea
            autoFocus
            value={noteValue}
            onChange={e => setNoteValue(e.target.value)}
            onBlur={saveNote}
            style={{
              width: '100%',
              minHeight: '80px',
              fontFamily: 'var(--fomo-font-sans)',
              fontSize: '15px',
              fontWeight: 300,
              lineHeight: 1.6,
              color: 'var(--fomo-text-primary)',
              background: 'none',
              border: 'none',
              outline: 'none',
              resize: 'none',
              padding: 0,
            }}
          />
        ) : (
          <div style={{
            fontFamily: 'var(--fomo-font-sans)',
            fontSize: '15px',
            fontWeight: 300,
            lineHeight: 1.6,
            color: noteValue ? 'var(--fomo-text-primary)' : 'var(--fomo-text-muted)',
            opacity: noteValue ? 0.85 : 1,
          }}>
            {noteValue || 'Add a note…'}
          </div>
        )}
      </div>

      {/* Delete */}
      <div style={{ position: 'absolute', bottom: '40px', left: '26px' }}>
        <button
          onClick={onDelete}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--fomo-font-sans)',
            fontSize: '15px',
            fontWeight: 300,
            color: 'var(--fomo-danger)',
            padding: 0,
          }}
        >
          Delete task
        </button>
      </div>
    </div>
  )
}
