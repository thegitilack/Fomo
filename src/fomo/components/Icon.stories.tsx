import type { Meta, StoryObj } from '@storybook/react'
import { Icon } from './Icon'

const meta: Meta<typeof Icon> = {
  title: 'Fomo/Icon',
  component: Icon,
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <div style={{ background: 'var(--fomo-bg)', padding: 40, borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    name: {
      control: 'select',
      options: ['today','chevron','list','plus','back','check','flag','calendar','repeat','note','loading'],
    },
    size: { control: { type: 'range', min: 12, max: 48, step: 2 } },
    stroke: { control: 'color' },
    strokeWidth: { control: { type: 'range', min: 0.5, max: 3, step: 0.25 } },
  },
  args: {
    name: 'today',
    size: 22,
    stroke: 'var(--fomo-text-primary)',
  },
}
export default meta

type Story = StoryObj<typeof Icon>

const ICON_NAMES = ['today','chevron','list','plus','back','check','flag','calendar','repeat','note','loading'] as const

export const Default: Story = {}

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {ICON_NAMES.map(name => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 48, height: 48,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--fomo-hairline)', borderRadius: 8,
          }}>
            <Icon
              name={name}
              size={22}
              stroke="var(--fomo-text-primary)"
              style={name === 'loading' ? { animation: 'spin 0.8s linear infinite' } : undefined}
            />
          </div>
          <span style={{
            fontFamily: 'var(--fomo-font-mono)', fontSize: 10,
            color: 'var(--fomo-text-muted)', letterSpacing: '0.06em',
          }}>
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {[14, 18, 22, 28, 36].map(size => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <Icon name="today" size={size} stroke="var(--fomo-text-primary)" />
          <span style={{ fontFamily: 'var(--fomo-font-mono)', fontSize: 10, color: 'var(--fomo-text-muted)' }}>{size}px</span>
        </div>
      ))}
    </div>
  ),
}

export const StrokeColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 20 }}>
      {[
        { label: 'primary',   color: 'var(--fomo-text-primary)'   },
        { label: 'secondary', color: 'var(--fomo-text-secondary)' },
        { label: 'muted',     color: 'var(--fomo-text-muted)'     },
        { label: 'accent',    color: 'var(--fomo-accent)'         },
        { label: 'danger',    color: 'var(--fomo-danger)'         },
      ].map(({ label, color }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <Icon name="flag" size={22} stroke={color} />
          <span style={{ fontFamily: 'var(--fomo-font-mono)', fontSize: 10, color: 'var(--fomo-text-muted)' }}>{label}</span>
        </div>
      ))}
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <Icon name="loading" size={28} stroke="var(--fomo-accent)" style={{ animation: 'spin 0.8s linear infinite' }} />
      <span style={{ fontFamily: 'var(--fomo-font-mono)', fontSize: 10, color: 'var(--fomo-text-muted)' }}>loading</span>
    </div>
  ),
}
