import type { Meta, StoryObj } from '@storybook/react'
import { Eyebrow } from './Eyebrow'
import { PageTitle } from './PageTitle'

const meta: Meta<typeof Eyebrow> = {
  title: 'Fomo/Eyebrow',
  component: Eyebrow,
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

type Story = StoryObj<typeof Eyebrow>

export const Default: Story = {
  args: { children: 'SAT · 27 JUNE' },
}

export const WithPageTitle: Story = {
  render: () => (
    <div>
      <Eyebrow>SAT · 27 JUNE</Eyebrow>
      <div style={{ height: 8 }} />
      <PageTitle>Today</PageTitle>
    </div>
  ),
}

export const Upcoming: Story = {
  render: () => (
    <div>
      <Eyebrow>UPCOMING</Eyebrow>
      <div style={{ height: 8 }} />
      <PageTitle>Upcoming</PageTitle>
    </div>
  ),
}

export const DayGroup: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Eyebrow>SUN · 28 JUNE</Eyebrow>
      <Eyebrow>TUE · 30 JUNE</Eyebrow>
      <Eyebrow>FRI · 3 JULY</Eyebrow>
    </div>
  ),
}
