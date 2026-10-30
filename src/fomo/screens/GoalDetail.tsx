import { useState } from 'react'
import type { Goal } from '../state/store'
import { Checkbox } from '../components/Checkbox'
import { Icon } from '../components/Icon'
import { KindTabs } from '../components/KindTabs'

interface GoalDetailProps {
  goal: Goal
  onBack: () => void
  onToggleDone: () => void
  onDelete: () => void
  onUpdate: (patch: Partial<Goal>) => void
  onConvertToTask: () => void
}

export function GoalDetail({ goal, onBack, onToggleDone, onDelete, onUpdate, onConvertToTask }: GoalDetailProps) {
  const [editingNote, setEditingNote] = useState(false)
  const [noteValue, setNoteValue] = useState(goal.note ?? '')
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(goal.name)

  function saveNote() {
    onUpdate({ note: noteValue.trim() || undefined })
    setEditingNote(false)
  }
  function saveTitle() {
    const name = titleValue.trim()
    if (name) onUpdate({ name })
    else setTitleValue(goal.name)
    setEditingTitle(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 22px 0' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Icon name="back" size={24} stroke="var(--fomo-text-primary)" />
        </button>
      </div>

      {/* Task / Goal — switching converts this item */}
      <div style={{ padding: '14px 26px 0' }}>
        <KindTabs value="goal" onChange={k => { if (k === 'task') onConvertToTask() }} />
      </div>

      {/* Title + checkbox */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '0 26px', marginTop: '26px' }}>
        <div style={{ marginTop: '4px' }}>
          <Checkbox checked={goal.done} size={24} onChange={onToggleDone} />
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
            onClick={() => { setTitleValue(goal.name); setEditingTitle(true) }}
            style={{
              flex: 1,
              cursor: 'text',
              fontFamily: 'var(--fomo-font-sans)',
              fontSize: '23px',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
              color: goal.done ? 'var(--fomo-text-done)' : 'var(--fomo-text-primary)',
              textDecorationLine: goal.done ? 'line-through' : 'none',
              textDecorationColor: 'var(--fomo-ring)',
            }}
          >
            {goal.name}
          </div>
        )}
      </div>

      {/* Note card */}
      <div
        onClick={() => !editingNote && setEditingNote(true)}
        style={{
          margin: '28px 26px 0',
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
          Delete goal
        </button>
      </div>
    </div>
  )
}
