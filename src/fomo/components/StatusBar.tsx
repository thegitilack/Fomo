export function StatusBar() {
  const now = new Date()
  const h = now.getHours()
  const m = now.getMinutes().toString().padStart(2, '0')
  const time = `${h}:${m}`

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 26px 0',
      height: '44px',
    }}>
      <span style={{
        fontFamily: 'var(--fomo-font-sans)',
        fontSize: '16px',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        color: 'var(--fomo-text-primary)',
      }}>
        {time}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Signal */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          {[2, 5, 8, 11, 14].map((x, i) => (
            <rect key={x} x={x} y={12 - (i + 1) * 2.2} width="2" height={(i + 1) * 2.2} rx="0.5" fill="var(--fomo-text-primary)" opacity={i < 3 ? 1 : 0.3} />
          ))}
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="var(--fomo-text-primary)" strokeOpacity="0.35" />
          <rect x="22" y="3.5" width="2.5" height="5" rx="1.25" fill="var(--fomo-text-primary)" fillOpacity="0.4" />
          <rect x="2" y="2" width="12" height="8" rx="2" fill="var(--fomo-text-primary)" />
        </svg>
      </div>
    </div>
  )
}
