import type { Meta, StoryObj } from '@storybook/react'
import { PageTitle } from './PageTitle'

const meta: Meta<typeof PageTitle> = {
  title: 'Fomo/PageTitle',
  component: PageTitle,
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <div style={{ background: 'var(--fomo-bg)', padding: 40, borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof PageTitle>

export const Today: Story = { args: { children: 'Today' } }

export const Upcoming: Story = { args: { children: 'Upcoming' } }

export const All: Story = { args: { children: 'All' } }
