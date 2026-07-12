import type { Meta, StoryObj } from '@storybook/react'
import { TaskRowCard, TaskCardList, type TaskCardVariant } from './TaskRowCard'

const meta: Meta<typeof TaskRowCard> = {
  title: 'Fomo/Iterations/TaskRowCard',
  component: TaskRowCard,
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <div style={{ background: 'var(--fomo-bg)', width: 360, padding: '26px', borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof TaskRowCard>

const SAMPLE = [
  { name: 'Call the pharmacy before it closes', meta: 'Today · 6:00 PM', priority: true, flagged: true },
  { name: 'Sign the apartment lease', meta: 'Today', flagged: true },
  { name: 'Reply to Mara about the weekend', meta: 'Today · 9:30 AM', priority: true },
  { name: 'Water the olive tree' },
  { name: 'Morning walk', done: true },
]

function Sample({ variant }: { variant: TaskCardVariant }) {
  return (
    <TaskCardList>
      {SAMPLE.map((t, i) => (
        <TaskRowCard key={i} variant={variant} {...t} onToggle={() => {}} onOpen={() => {}} />
      ))}
    </TaskCardList>
  )
}

export const Outlined: Story = { render: () => <Sample variant="outlined" /> }
export const Soft: Story = { render: () => <Sample variant="soft" /> }
export const Filled: Story = { name: 'Soft Filled (no outline)', render: () => <Sample variant="filled" /> }

const VARIANTS: TaskCardVariant[] = ['outlined', 'soft', 'filled']

function Column({ variant, theme }: { variant: TaskCardVariant; theme: 'dark' | 'light' }) {
  return (
    <div className={theme === 'light' ? 'theme-light' : ''} style={{ width: 320 }}>
      <div style={{
        fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: '#888', marginBottom: 14,
      }}>
        {variant} · {theme}
      </div>
      <div style={{ background: 'var(--fomo-bg)', padding: 22 }}>
        <Sample variant={variant} />
      </div>
    </div>
  )
}

export const AllVariants: Story = {
  name: 'All Variants — Dark & Light',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ display: 'flex', gap: 32, padding: 40, flexWrap: 'wrap', background: '#242424' }}>
      {(['dark', 'light'] as const).flatMap(theme =>
        VARIANTS.map(v => <Column key={`${theme}-${v}`} variant={v} theme={theme} />)
      )}
    </div>
  ),
}
