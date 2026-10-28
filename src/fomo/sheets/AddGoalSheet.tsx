import { useState, useRef, useEffect } from 'react'
import { Icon } from '../components/Icon'
import type { NewGoal } from '../state/store'

interface AddGoalSheetProps {
  onClose: () => void
  onSubmit: (goal: NewGoal) => void
}

export function AddGoalSheet({ onClose, onSubmit }: AddGoalSheetProps) {
  const [value, setValue] = useState('')
  const [note, setNote] = useState('')
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
    onSubmit({ name: value.trim(), note: note.trim() || undefined })
  }

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
          {/* Goal name + confirm button */}
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
                  What do you want to do?
                </span>
              )}
              <div
                ref={inputRef}
                className="fomo-task-input"
                contentEditable
                role="textbox"
                aria-label="Goal name"
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
              aria-label="Save goal"
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

          {/* Note */}
          <div style={{
            fontFamily: 'var(--fomo-font-mono)',
            fontSize: '11px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--fomo-text-muted)',
            margin: '18px 0 10px',
          }}>
            Note
          </div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Why it matters, or a first step…"
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
      </div>
    </div>
  )
}
