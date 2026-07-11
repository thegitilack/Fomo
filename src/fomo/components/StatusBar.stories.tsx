import type { Meta, StoryObj } from '@storybook/react'
import { StatusBar } from './StatusBar'

const meta: Meta<typeof StatusBar> = {
  title: 'Fomo/StatusBar',
  component: StatusBar,
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <div style={{ background: 'var(--fomo-bg)', width: 390, borderRadius: 12, overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof StatusBar>

export const Default: Story = {}
