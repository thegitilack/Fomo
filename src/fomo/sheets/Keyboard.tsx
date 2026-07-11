const R1 = 'QWERTYUIOP'.split('')
const R2 = 'ASDFGHJKL'.split('')
const R3 = 'ZXCVBNM'.split('')

interface KeyProps {
  children: React.ReactNode
  flex?: number
  special?: boolean
  accent?: boolean
  wide?: boolean
  onClick?: () => void
}

function Key({ children, flex = 1, special, accent, wide, onClick }: KeyProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex,
        height: '42px',
        border: 'none',
        borderRadius: '5px',
        background: accent ? 'var(--fomo-accent)' : special ? 'var(--fomo-key-special)' : 'var(--fomo-key)',
        color: accent ? 'var(--fomo-on-accent)' : 'var(--fomo-text-primary)',
        fontFamily: 'var(--fomo-font-sans)',
        fontSize: wide ? '14px' : '18px',
        fontWeight: accent ? 500 : 400,
        cursor: 'pointer',
        boxShadow: accent ? 'none' : 'var(--fomo-shadow-key)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      }}
    >
      {children}
    </button>
  )
}

interface KeyboardProps {
  onKey?: (char: string) => void
  onBackspace?: () => void
  onReturn?: () => void
}

export function Keyboard({ onKey, onBackspace, onReturn }: KeyboardProps) {
  const k = (s: string) => () => onKey?.(s)
  return (
    <div style={{ background: 'var(--fomo-keyboard-bg)', padding: '8px 3px 4px' }}>
      <div style={{ display: 'flex', gap: '6px', padding: '0 3px', marginBottom: '8px' }}>
        {R1.map(c => <Key key={c} onClick={k(c.toLowerCase())}>{c}</Key>)}
      </div>
      <div style={{ display: 'flex', gap: '6px', padding: '0 22px', marginBottom: '8px' }}>
        {R2.map(c => <Key key={c} onClick={k(c.toLowerCase())}>{c}</Key>)}
      </div>
      <div style={{ display: 'flex', gap: '6px', padding: '0 3px', marginBottom: '8px' }}>
        <Key flex={1.5} special>⇧</Key>
        {R3.map(c => <Key key={c} onClick={k(c.toLowerCase())}>{c}</Key>)}
        <Key flex={1.5} special onClick={onBackspace}>⌫</Key>
      </div>
      <div style={{ display: 'flex', gap: '6px', padding: '0 3px' }}>
        <Key flex={1.6} special wide>123</Key>
        <Key flex={5} wide onClick={k(' ')}>space</Key>
        <Key flex={2.4} wide accent onClick={onReturn}>return</Key>
      </div>
      <div style={{ height: '22px' }} />
    </div>
  )
}
