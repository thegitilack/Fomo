import type { ReactNode } from 'react'

interface ChipProps {
  label: string
  icon?: ReactNode
  active?: boolean
  onClick?: () => void
}

export function Chip({ label, icon, active = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        padding: '9px 14px',
        borderRadius: 'var(--fomo-radius-full)',
        border: `1px solid ${active ? 'var(--fomo-chip-active-bd)' : 'var(--fomo-border)'}`,
        background: active ? 'var(--fomo-chip-active-bg)' : 'transparent',
        color: active ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)',
        fontFamily: 'var(--fomo-font-sans)',
        fontSize: '13px',
        fontWeight: 400,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
