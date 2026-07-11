// Design tokens — mirroring src/index.css @theme block (Fomo DS palette)
// Do not edit manually; run: /sync-tokens

export const tokens = {
  color: {
    /* Surfaces */
    bg:            '#0b0b0a',
    surfaceSheet:  '#141413',
    surfaceRaised: '#1a1a16',

    /* Component-compat aliases */
    bgPrimary:     '#0b0b0a',
    bgSecondary:   '#141413',
    bgTertiary:    '#1a1a16',
    bgAccent:      '#c6a47a',
    bgAccentHover: '#d8c3a1',
    bgError:       'rgba(154,107,94,0.10)',

    /* Text */
    textPrimary:   '#eceae6',
    textSecondary: '#86837c',
    textMuted:     '#6f6c66',
    textFaint:     '#66645e',
    textDone:      '#5f5d57',
    textTertiary:  '#6f6c66',
    textInverse:   '#1a140b',
    textError:     '#9a6b5e',
    textOnAccent:  '#1a140b',

    /* Accent */
    accent:       '#c6a47a',
    accentStrong: '#d8c3a1',
    onAccent:     '#1a140b',
    danger:       '#9a6b5e',

    /* Lines & Overlays */
    divider:       'rgba(255,255,255,0.055)',
    ring:          'rgba(255,255,255,0.30)',
    hairline:      'rgba(255,255,255,0.07)',
    scrim:         'rgba(0,0,0,0.50)',
    borderDefault: 'rgba(255,255,255,0.13)',
    borderSubtle:  'rgba(255,255,255,0.07)',
    borderAccent:  '#c6a47a',
    borderError:   '#9a6b5e',
  },

  typography: {
    fontSans: '-apple-system, "Segoe UI", system-ui, sans-serif',
    fontMono: 'ui-monospace, "SF Mono", "Segoe UI Mono", Menlo, monospace',
    sizeXs:   '11px',
    sizeSm:   '13px',
    sizeBase:  '15px',
    sizeLg:   '18px',
    sizeXl:   '22px',
    size2xl:  '28px',
    size3xl:  '30px',
  },

  spacing: {
    '000': '0px',
    '100': '4px',
    '150': '6px',
    '200': '8px',
    '300': '12px',
    '400': '14px',
    '500': '18px',
    '600': '22px',
    '700': '26px',
    '800': '32px',
    '900': '46px',
  },

  radius: {
    none: '0px',
    sm:   '4px',
    md:   '8px',
    lg:   '12px',
    xl:   '22px',
    full: '999px',
  },

  shadow: {
    fab:    '0 12px 30px -8px rgba(0,0,0,0.70)',
    screen: '0 40px 90px -30px rgba(0,0,0,0.70)',
    key:    '0 1px 0 rgba(0,0,0,0.40)',
  },
} as const

export type Tokens = typeof tokens
