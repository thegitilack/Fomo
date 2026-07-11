import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Fomo/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <div style={{ background: 'var(--fomo-bg)', padding: 40, borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    checked: { control: 'boolean' },
    size: { control: { type: 'range', min: 16, max: 36, step: 2 } },
  },
  args: { checked: false, size: 20 },
}
export default meta

type Story = StoryObj<typeof Checkbox>

export const Unchecked: Story = { args: { checked: false } }

export const Checked: Story = { args: { checked: true } }

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <Checkbox checked={checked} onChange={() => setChecked(c => !c)} size={24} />
        <span style={{ fontFamily: 'var(--fomo-font-mono)', fontSize: 10, color: 'var(--fomo-text-muted)' }}>
          {checked ? 'checked' : 'unchecked'}
        </span>
      </div>
    )
  },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {[16, 20, 24, 28, 32].map(size => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <Checkbox checked={false} size={size} />
          <span style={{ fontFamily: 'var(--fomo-font-mono)', fontSize: 10, color: 'var(--fomo-text-muted)' }}>{size}px</span>
        </div>
      ))}
    </div>
  ),
}

export const AllSizesChecked: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {[16, 20, 24, 28, 32].map(size => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <Checkbox checked size={size} />
          <span style={{ fontFamily: 'var(--fomo-font-mono)', fontSize: 10, color: 'var(--fomo-text-muted)' }}>{size}px</span>
        </div>
      ))}
    </div>
  ),
}
