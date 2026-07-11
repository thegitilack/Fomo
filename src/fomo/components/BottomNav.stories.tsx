import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { BottomNav } from './BottomNav'

const meta: Meta<typeof BottomNav> = {
  title: 'Fomo/BottomNav',
  component: BottomNav,
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <div style={{ background: 'var(--fomo-bg)', width: 390, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--fomo-hairline)' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    active: { control: 'select', options: ['today', 'upcoming', 'all'] },
  },
  args: { active: 'today' },
}
export default meta

type Story = StoryObj<typeof BottomNav>

export const TodayActive: Story = { args: { active: 'today' } }

export const UpcomingActive: Story = { args: { active: 'upcoming' } }

export const AllActive: Story = { args: { active: 'all' } }

export const Interactive: Story = {
  render: () => {
    const [active, setActive] = useState<'today' | 'upcoming' | 'all'>('today')
    return <BottomNav active={active} onChange={setActive} />
  },
}
