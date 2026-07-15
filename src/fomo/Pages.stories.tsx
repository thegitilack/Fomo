import type { Meta, StoryObj } from '@storybook/react'
import { StatusBar } from './components/StatusBar'
import { BottomNav } from './components/BottomNav'
import { FAB } from './components/FAB'
import { ListScreen } from './screens/ListScreen'
import { UpcomingScreen } from './screens/UpcomingScreen'
import { EmptyState } from './screens/EmptyState'
import { TaskDetail } from './screens/TaskDetail'
import { AddTaskSheet } from './sheets/AddTaskSheet'

// ─── Phone frame ─────────────────────────────────────────────────────────────

const SCALE = 0.6
const W = 390
const H = 844

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: W * SCALE, height: H * SCALE, flexShrink: 0 }}>
      <div
        style={{
          width: W,
          height: H,
          borderRadius: 46,
          overflow: 'hidden',
          background: 'var(--fomo-bg)',
          border: '1px solid var(--fomo-screen-border)',
          boxShadow: 'var(--fomo-shadow-screen)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transform: `scale(${SCALE})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function NavWithFAB({ active }: { active: 'today' | 'upcoming' | 'all' }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', right: 24, bottom: 104, zIndex: 2 }}>
        <FAB />
      </div>
      <BottomNav active={active} />
    </div>
  )
}

// ─── Sample data ─────────────────────────────────────────────────────────────

const today = new Date().toISOString().slice(0, 10)

const SAMPLE_TASKS = [
  { id: '1', name: 'Call the pharmacy before it closes', done: false, flagged: true,  priority: true,  dueDate: today, dueTime: '18:00' },
  { id: '2', name: 'Sign the apartment lease',           done: false, flagged: true,  priority: false, dueDate: today },
  { id: '3', name: 'Reply to Mara about the weekend',   done: false, flagged: false, priority: false, dueDate: today, dueTime: '09:30' },
  { id: '4', name: 'Water the olive tree',              done: false, flagged: false, priority: false },
  { id: '5', name: 'Morning walk',                      done: true,  flagged: false, priority: false },
]

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const tomorrowStr = tomorrow.toISOString().slice(0, 10)

const dayAfter = new Date()
dayAfter.setDate(dayAfter.getDate() + 3)
const dayAfterStr = dayAfter.toISOString().slice(0, 10)

const UPCOMING_GROUPED = new Map([
  [tomorrowStr, [
    { id: 'u1', name: 'Dentist appointment', done: false, flagged: false, priority: false, dueDate: tomorrowStr, dueTime: '10:00' },
    { id: 'u2', name: 'Pick up dry cleaning', done: false, flagged: false, priority: false, dueDate: tomorrowStr },
  ]],
  [dayAfterStr, [
    { id: 'u3', name: 'Read chapter 7', done: false, flagged: false, priority: false, dueDate: dayAfterStr },
  ]],
])

const DETAIL_TASK = {
  id: '1', name: 'Call the pharmacy before it closes', done: false, flagged: true, priority: true,
  dueDate: today, dueTime: '18:00',
  note: 'Ask whether the new prescription is ready, and if they can hold it at the front counter until tomorrow morning.',
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Fomo/Pages',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div style={{ background: '#ffffff', padding: 40 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Today: StoryObj = {
  render: () => (
    <PhoneFrame>
      <StatusBar />
      <ListScreen eyebrow="SAT · 27 JUNE" title="Today" tasks={SAMPLE_TASKS} onToggle={() => {}} onOpen={() => {}} />
      <NavWithFAB active="today" />
    </PhoneFrame>
  ),
}

export const Upcoming: StoryObj = {
  render: () => (
    <PhoneFrame>
      <StatusBar />
      <UpcomingScreen grouped={UPCOMING_GROUPED} onToggle={() => {}} onOpen={() => {}} />
      <NavWithFAB active="upcoming" />
    </PhoneFrame>
  ),
}

export const EmptyStateStory: StoryObj = {
  name: 'Empty State',
  render: () => (
    <PhoneFrame>
      <StatusBar />
      <EmptyState eyebrow="SAT · 27 JUNE" />
      <NavWithFAB active="today" />
    </PhoneFrame>
  ),
}

export const TaskDetailStory: StoryObj = {
  name: 'Task Detail',
  render: () => (
    <PhoneFrame>
      <StatusBar />
      <TaskDetail
        task={DETAIL_TASK}
        onBack={() => {}}
        onToggleDone={() => {}}
        onDelete={() => {}}
        onUpdateNote={() => {}}
        onUpdate={() => {}}
      />
    </PhoneFrame>
  ),
}

export const AddTask: StoryObj = {
  name: 'Add Task',
  render: () => (
    <PhoneFrame>
      <StatusBar />
      <ListScreen eyebrow="SAT · 27 JUNE" title="Today" tasks={SAMPLE_TASKS.slice(0, 3)} onToggle={() => {}} onOpen={() => {}} />
      <NavWithFAB active="today" />
      <AddTaskSheet onClose={() => {}} onSubmit={() => {}} />
    </PhoneFrame>
  ),
}

export const AllPages: StoryObj = {
  name: 'All Pages',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ background: '#ffffff', minHeight: '100vh', padding: '48px 40px', display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start' }}>
      {[
        {
          label: 'Today',
          node: (
            <PhoneFrame>
              <StatusBar />
              <ListScreen eyebrow="SAT · 27 JUNE" title="Today" tasks={SAMPLE_TASKS} onToggle={() => {}} onOpen={() => {}} />
              <NavWithFAB active="today" />
            </PhoneFrame>
          ),
        },
        {
          label: 'Upcoming',
          node: (
            <PhoneFrame>
              <StatusBar />
              <UpcomingScreen grouped={UPCOMING_GROUPED} onToggle={() => {}} onOpen={() => {}} />
              <NavWithFAB active="upcoming" />
            </PhoneFrame>
          ),
        },
        {
          label: 'Empty State',
          node: (
            <PhoneFrame>
              <StatusBar />
              <EmptyState eyebrow="SAT · 27 JUNE" />
              <NavWithFAB active="today" />
            </PhoneFrame>
          ),
        },
        {
          label: 'Task Detail',
          node: (
            <PhoneFrame>
              <StatusBar />
              <TaskDetail task={DETAIL_TASK} onBack={() => {}} onToggleDone={() => {}} onDelete={() => {}} onUpdateNote={() => {}} onUpdate={() => {}} />
            </PhoneFrame>
          ),
        },
        {
          label: 'Add Task',
          node: (
            <PhoneFrame>
              <StatusBar />
              <ListScreen eyebrow="SAT · 27 JUNE" title="Today" tasks={SAMPLE_TASKS.slice(0, 3)} onToggle={() => {}} onOpen={() => {}} />
              <NavWithFAB active="today" />
              <AddTaskSheet onClose={() => {}} onSubmit={() => {}} />
            </PhoneFrame>
          ),
        },
      ].map(({ label, node }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          {node}
          <span style={{
            fontFamily: 'ui-monospace, monospace',
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#aaa',
          }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  ),
}
