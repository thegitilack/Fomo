export type Repeat = 'none' | 'daily' | 'weekly' | 'monthly'

export interface Task {
  id: string
  name: string
  done: boolean
  flagged: boolean
  priority: boolean
  dueDate?: string   // YYYY-MM-DD
  dueTime?: string   // HH:MM (24h)
  note?: string
  repeat?: Repeat
}

export interface NewTask {
  name: string
  dueDate?: string
  dueTime?: string
  priority?: boolean
  note?: string
  repeat?: Repeat
}

export type View = 'today' | 'upcoming' | 'all'

export interface AppState {
  tasks: Task[]
  activeView: View
  addSheetOpen: boolean
  editingTaskId: string | null
  theme: 'dark' | 'light'
}

export type Action =
  | { type: 'TOGGLE_DONE';   id: string }
  | { type: 'TOGGLE_FLAG';   id: string }
  | { type: 'ADD_TASK';      task: NewTask }
  | { type: 'DELETE_TASK';   id: string }
  | { type: 'UPDATE_NOTE';   id: string; note: string }
  | { type: 'UPDATE_TASK';   id: string; patch: Partial<Task> }
  | { type: 'SET_VIEW';      view: View }
  | { type: 'OPEN_SHEET' }
  | { type: 'CLOSE_SHEET' }
  | { type: 'OPEN_DETAIL';   id: string }
  | { type: 'CLOSE_DETAIL' }
  | { type: 'TOGGLE_THEME' }

// ── Helpers ───────────────────────────────────────────────────────────────────

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function nextDate(dateStr: string, repeat: Repeat): string {
  const d = new Date(dateStr + 'T12:00:00')
  if (repeat === 'daily') d.setDate(d.getDate() + 1)
  else if (repeat === 'weekly') d.setDate(d.getDate() + 7)
  else if (repeat === 'monthly') d.setMonth(d.getMonth() + 1)
  return d.toISOString().slice(0, 10)
}

export function repeatLabel(repeat?: Repeat): string {
  switch (repeat) {
    case 'daily':   return 'Every day'
    case 'weekly':  return 'Every week'
    case 'monthly': return 'Every month'
    default:        return 'Repeat'
  }
}

// ── Initial seed data (matches design reference) ──────────────────────────────

const TODAY = today()
const TOMORROW = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
const MON = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10)
const TUE = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10)

export const INITIAL_STATE: AppState = {
  activeView: 'today',
  addSheetOpen: false,
  editingTaskId: null,
  theme: 'light',
  tasks: [
    {
      id: uid(), name: 'Call the pharmacy before it closes',
      done: false, flagged: true, priority: true,
      dueDate: TODAY, dueTime: '18:00',
      note: 'Ask whether the new prescription is ready, and if they can hold it at the front counter until tomorrow morning.',
    },
    {
      id: uid(), name: 'Sign the apartment lease',
      done: false, flagged: true, priority: false,
      dueDate: TODAY,
    },
    {
      id: uid(), name: 'Reply to Mara about the weekend',
      done: false, flagged: false, priority: false,
      dueDate: TODAY, dueTime: '09:30',
    },
    {
      id: uid(), name: 'Water the olive tree',
      done: false, flagged: false, priority: false,
    },
    {
      id: uid(), name: 'Finish the last chapter',
      done: false, flagged: false, priority: true,
      dueDate: TODAY,
    },
    {
      id: uid(), name: 'Morning walk',
      done: true, flagged: false, priority: false,
    },
    // Upcoming tasks
    {
      id: uid(), name: 'Dentist appointment',
      done: false, flagged: false, priority: false,
      dueDate: TOMORROW, dueTime: '14:00',
    },
    {
      id: uid(), name: 'Return the library books',
      done: false, flagged: false, priority: false,
      dueDate: TOMORROW,
    },
    {
      id: uid(), name: 'Quarterly review prep',
      done: false, flagged: false, priority: false,
      dueDate: MON,
    },
    {
      id: uid(), name: 'Renew passport',
      done: false, flagged: false, priority: false,
      dueDate: TUE, dueTime: '00:00',
    },
    {
      id: uid(), name: 'Coffee with Theo',
      done: false, flagged: false, priority: false,
      dueDate: TUE, dueTime: '09:00',
    },
  ],
}

// ── Reducer ───────────────────────────────────────────────────────────────────

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'TOGGLE_DONE': {
      const target = state.tasks.find(t => t.id === action.id)
      const toggled = state.tasks.map(t => t.id === action.id ? { ...t, done: !t.done } : t)
      // Completing a recurring task spawns its next occurrence.
      if (target && !target.done && target.repeat && target.repeat !== 'none' && target.dueDate) {
        const next: Task = { ...target, id: uid(), done: false, dueDate: nextDate(target.dueDate, target.repeat) }
        return { ...state, tasks: [next, ...toggled] }
      }
      return { ...state, tasks: toggled }
    }
    case 'TOGGLE_FLAG':
      return { ...state, tasks: state.tasks.map(t => t.id === action.id ? { ...t, flagged: !t.flagged } : t) }
    case 'ADD_TASK': {
      const name = action.task.name.trim()
      if (!name) return state
      const task: Task = {
        id: uid(),
        name,
        done: false,
        flagged: false,
        priority: action.task.priority ?? false,
        dueDate: action.task.dueDate,
        dueTime: action.task.dueTime,
        note: action.task.note?.trim() || undefined,
        repeat: action.task.repeat ?? 'none',
      }
      return { ...state, tasks: [task, ...state.tasks], addSheetOpen: false }
    }
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.id), editingTaskId: null }
    case 'UPDATE_NOTE':
      return { ...state, tasks: state.tasks.map(t => t.id === action.id ? { ...t, note: action.note } : t) }
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.id ? { ...t, ...action.patch } : t) }
    case 'SET_VIEW':
      return { ...state, activeView: action.view }
    case 'OPEN_SHEET':
      return { ...state, addSheetOpen: true }
    case 'CLOSE_SHEET':
      return { ...state, addSheetOpen: false }
    case 'OPEN_DETAIL':
      return { ...state, editingTaskId: action.id }
    case 'CLOSE_DETAIL':
      return { ...state, editingTaskId: null }
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' }
    default:
      return state
  }
}

// ── Derived views ─────────────────────────────────────────────────────────────

export function todayTasks(tasks: Task[]): Task[] {
  const t = today()
  return tasks
    .filter(task => !task.dueDate || task.dueDate === t)
    .sort((a, b) => (b.flagged ? 1 : 0) - (a.flagged ? 1 : 0))
}

export function upcomingTasks(tasks: Task[]): Map<string, Task[]> {
  const t = today()
  const future = tasks.filter(task => task.dueDate && task.dueDate > t && !task.done)
  const grouped = new Map<string, Task[]>()
  for (const task of future) {
    const key = task.dueDate!
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(task)
  }
  return grouped
}

export function allTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => (b.flagged ? 1 : 0) - (a.flagged ? 1 : 0))
}

// ── Meta label formatter ──────────────────────────────────────────────────────

export function formatMeta(dueDate?: string, dueTime?: string): string | undefined {
  const todayStr = today()
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

  let dateLabel: string | undefined
  if (dueDate) {
    if (dueDate === todayStr) dateLabel = 'Today'
    else if (dueDate === tomorrow) dateLabel = 'Tomorrow'
    else {
      const d = new Date(dueDate + 'T12:00:00')
      dateLabel = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
    }
  }

  let timeLabel: string | undefined
  if (dueTime && dueTime !== '00:00') {
    const [h, m] = dueTime.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 || 12
    timeLabel = m === 0 ? `${hour}:00 ${ampm}` : `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
  }

  if (dateLabel && timeLabel) return `${dateLabel} · ${timeLabel}`
  return dateLabel ?? timeLabel
}

export function formatDayHeader(dateStr: string): string {
  const today_ = today()
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  const d = new Date(dateStr + 'T12:00:00')
  const dayNum = d.getDate()
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
  const short = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }).toUpperCase()

  if (dateStr === today_) return `TODAY · ${short}`
  if (dateStr === tomorrow) return `TOMORROW · ${short}`
  return `${weekday} ${dayNum}`
}

// ── localStorage persistence ──────────────────────────────────────────────────

const KEY = 'fomo-tasks-v1'

export function loadTasks(): Task[] | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveTasks(tasks: Task[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(tasks))
  } catch {}
}
