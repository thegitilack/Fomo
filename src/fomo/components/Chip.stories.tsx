import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Chip } from './Chip'
import { Icon } from './Icon'

const meta: Meta<typeof Chip> = {
  title: 'Fomo/Chip',
  component: Chip,
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <div style={{ background: 'var(--fomo-bg)', padding: 40, borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label:  { control: 'text' },
    active: { control: 'boolean' },
  },
  args: { label: 'Due date', active: false },
}
export default meta

type Story = StoryObj<typeof Chip>

export const Default: Story = {
  args: {
    label: 'Due date',
    icon: <Icon name="calendar" size={13} stroke="var(--fomo-text-secondary)" />,
  },
}

export const Active: Story = {
  args: {
    label: 'Today · 6:00 PM',
    active: true,
    icon: <Icon name="calendar" size={13} stroke="var(--fomo-accent-strong)" />,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      <Chip label="Due date" icon={<Icon name="calendar" size={13} stroke="var(--fomo-text-secondary)" />} />
      <Chip label="Priority"  icon={<Icon name="flag"     size={13} stroke="var(--fomo-text-secondary)" />} />
      <Chip label="Repeat"    icon={<Icon name="repeat"   size={13} stroke="var(--fomo-text-secondary)" />} />
      <Chip label="Note"      icon={<Icon name="note"     size={13} stroke="var(--fomo-text-secondary)" />} />
      <Chip label="Today · 6:00 PM" active icon={<Icon name="calendar" size={13} stroke="var(--fomo-accent-strong)" />} />
      <Chip label="Flagged"   active icon={<Icon name="flag"     size={13} stroke="var(--fomo-accent-strong)" />} />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [active, setActive] = useState(false)
    return (
      <Chip
        label="Due date"
        active={active}
        icon={<Icon name="calendar" size={13} stroke={active ? 'var(--fomo-accent-strong)' : 'var(--fomo-text-secondary)'} />}
        onClick={() => setActive(a => !a)}
      />
    )
  },
}

export const LabelOnly: Story = {
  args: { label: 'Category' },
}
