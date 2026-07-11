import type { Meta, StoryObj } from '@storybook/react'
import { FAB } from './FAB'

const meta: Meta<typeof FAB> = {
  title: 'Fomo/FAB',
  component: FAB,
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <div style={{ background: 'var(--fomo-bg)', padding: 60, borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof FAB>

export const Default: Story = {}

export const InContext: Story = {
  render: () => (
    <div style={{ position: 'relative', width: 390, height: 88, background: 'var(--fomo-nav-bg)', borderTop: '1px solid var(--fomo-nav-border)' }}>
      <div style={{ position: 'absolute', top: -29, left: '50%', transform: 'translateX(-50%)' }}>
        <FAB />
      </div>
    </div>
  ),
}
