import type { Meta, StoryObj } from '@storybook/react'
import { TaskRow } from './TaskRow'

const meta: Meta<typeof TaskRow> = {
  title: 'Fomo/TaskRow',
  component: TaskRow,
  parameters: { layout: 'padded' },
  decorators: [
    Story => (
      <div style={{ background: 'var(--fomo-bg)', padding: '0 24px', borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    name:     { control: 'text' },
    meta:     { control: 'text' },
    flagged:  { control: 'boolean' },
    priority: { control: 'boolean' },
    done:     { control: 'boolean' },
    divider:  { control: 'boolean' },
  },
  args: {
    name:    'Sign the apartment lease',
    divider: true,
  },
}
export default meta

type Story = StoryObj<typeof TaskRow>

export const Default: Story = {}

export const WithMeta: Story = {
  args: { name: 'Call the pharmacy before it closes', meta: 'Today · 6:00 PM' },
}

export const Priority: Story = {
  args: { name: 'Call the pharmacy before it closes', meta: 'Today · 6:00 PM', priority: true },
}

export const Flagged: Story = {
  args: { name: 'Sign the apartment lease', meta: 'Today', flagged: true },
}

export const FlaggedPriority: Story = {
  args: { name: 'Call the pharmacy before it closes', meta: 'Today · 6:00 PM', priority: true, flagged: true },
}

export const Done: Story = {
  args: { name: 'Morning walk', done: true, divider: false },
}

export const FullList: Story = {
  render: () => (
    <div style={{ padding: '0 0px' }}>
      <TaskRow name="Call the pharmacy before it closes" meta="Today · 6:00 PM" priority flagged />
      <TaskRow name="Sign the apartment lease"           meta="Today"           flagged />
      <TaskRow name="Reply to Mara about the weekend"   meta="9:30 AM" />
      <TaskRow name="Water the olive tree" />
      <TaskRow name="Morning walk" done divider={false} />
    </div>
  ),
}
