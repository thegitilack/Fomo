export type Repeat = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom'

export interface Task {
  id: string
  name: string
  done: boolean          // completion for non-repeating tasks
  flagged: boolean
  priority: boolean
  dueDate?: string       // YYYY-MM-DD — for non-repeating tasks
  dueTime?: string       // HH:MM (24h)
  note?: string
  repeat?: Repeat
  repeatDays?: number[]  // for 'custom': weekday numbers, 0=Sun … 6=Sat
  startDate?: string     // repeating: when the recurrence begins (anchor)
  endDate?: string       // repeating: repeat-until date (inclusive); undefined = forever
  endTime?: string       // repeating: HH:MM cutoff on the repeat-until date
  lastCompleted?: string // repeating: the day (YYYY-MM-DD) it was last ticked off
}

export interface NewTask {
  name: string
  dueDate?: string       // non-repeating due date
  startDate?: string     // repeating: start/anchor date (falls back to today)
  endDate?: string       // repeating: repeat-until date
  endTime?: string       // repeating: HH:MM cutoff on the repeat-until date
  dueTime?: string
  priority?: boolean
  note?: string
  repeat?: Repeat
  repeatDays?: number[]
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

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] // index = getDay(), 0=Sun
const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
// Monday-first display order (getDay values)
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]

export function weekdayLabel(day: number): string {
  return WEEKDAY_LABELS[day] ?? '?'
}

export function nextDate(dateStr: string, repeat: Repeat, repeatDays?: number[]): string {
  const d = new Date(dateStr + 'T12:00:00')
  if (repeat === 'daily') d.setDate(d.getDate() + 1)
  else if (repeat === 'weekly') d.setDate(d.getDate() + 7)
  else if (repeat === 'monthly') d.setMonth(d.getMonth() + 1)
  else if (repeat === 'custom' && repeatDays && repeatDays.length) {
    // advance to the next day whose weekday is in the set
    do { d.setDate(d.getDate() + 1) } while (!repeatDays.includes(d.getDay()))
  }
  return d.toISOString().slice(0, 10)
}

export function repeatLabel(repeat?: Repeat, repeatDays?: number[]): string {
  switch (repeat) {
    case 'daily':   return 'Daily'
    case 'weekly':
      // Weekly on specific weekdays reads as the day list; otherwise "Weekly".
      if (repeatDays && repeatDays.length && repeatDays.length < 7)
        return WEEK_ORDER.filter(d => repeatDays.includes(d)).map(d => WEEKDAY_SHORT[d]).join(', ')
      return 'Weekly'
    case 'monthly': return 'Monthly'
    case 'custom': {
      if (!repeatDays || !repeatDays.length) return 'Repeat'
      if (repeatDays.length === 7) return 'Daily'
      return WEEK_ORDER.filter(d => repeatDays.includes(d)).map(d => WEEKDAY_SHORT[d]).join(', ')
    }
    default:        return 'Repeat'
  }
}

// ── Recurrence ────────────────────────────────────────────────────────────────

export function isRepeating(task: Task): boolean {
  return !!task.repeat && task.repeat !== 'none'
}

/** Does a repeating task occur on the given date (respecting start/end)? */
export function occursOn(task: Task, dateStr: string): boolean {
  if (!isRepeating(task)) return false
  if (task.startDate && dateStr < task.startDate) return false
  if (task.endDate && dateStr > task.endDate) return false
  const d = new Date(dateStr + 'T12:00:00')
  const anchor = new Date((task.startDate ?? dateStr) + 'T12:00:00')
  switch (task.repeat) {
    case 'daily':   return true
    case 'custom':  return !!task.repeatDays?.includes(d.getDay())
    // Weekly: on the chosen weekdays, or the start-date weekday if none chosen.
    case 'weekly': {
      const days = task.repeatDays?.length ? task.repeatDays : [anchor.getDay()]
      return days.includes(d.getDay())
    }
    case 'monthly': return d.getDate() === anchor.getDate()
    default:        return false
  }
}

/** Completion state as shown today (per-day for repeating tasks). */
export function isDoneToday(task: Task): boolean {
  return isRepeating(task) ? task.lastCompleted === today() : task.done
}

/** Meta line for a task row: recurrence + time, or due date + time. */
export function taskMeta(task: Task): string | undefined {
  if (isRepeating(task)) {
    const label = repeatLabel(task.repeat, task.repeatDays)
    const time = formatMeta(undefined, task.dueTime)
    return time ? `${label} · ${time}` : label
  }
  return formatMeta(task.dueDate, task.dueTime)
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
      const t = today()
      return {
        ...state,
        tasks: state.tasks.map(task => {
          if (task.id !== action.id) return task
          if (isRepeating(task)) {
            // per-day completion: toggle today in/out of "done"
            return { ...task, lastCompleted: task.lastCompleted === t ? undefined : t }
          }
          return { ...task, done: !task.done }
        }),
      }
    }
    case 'TOGGLE_FLAG':
      return { ...state, tasks: state.tasks.map(t => t.id === action.id ? { ...t, flagged: !t.flagged } : t) }
    case 'ADD_TASK': {
      const name = action.task.name.trim()
      if (!name) return state
      const repeat = action.task.repeat ?? 'none'
      const repeating = repeat !== 'none'
      const task: Task = {
        id: uid(),
        name,
        done: false,
        flagged: false,
        priority: action.task.priority ?? false,
        dueTime: action.task.dueTime,
        note: action.task.note?.trim() || undefined,
        repeat,
        repeatDays: (repeat === 'weekly' || repeat === 'custom') ? action.task.repeatDays : undefined,
        // Non-repeating → a due date; repeating → a start date (the picked
        // date, or today if none) and an optional end (repeat-until) date+time.
        dueDate: repeating ? undefined : action.task.dueDate,
        startDate: repeating ? (action.task.startDate ?? today()) : undefined,
        endDate: repeating ? action.task.endDate : undefined,
        endTime: repeating ? action.task.endTime : undefined,
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
    .filter(task => (isRepeating(task) ? occursOn(task, t) : (!task.dueDate || task.dueDate === t)))
    .sort((a, b) => (b.flagged ? 1 : 0) - (a.flagged ? 1 : 0))
}

/** The next date strictly after `afterDateStr` that a repeating task occurs,
 *  respecting start/end — or null if it never occurs again. */
export function nextOccurrence(task: Task, afterDateStr: string): string | null {
  if (!isRepeating(task)) return null
  const [y, m, d] = afterDateStr.split('-').map(Number)
  for (let i = 1; i <= 366; i++) {
    const ds = new Date(Date.UTC(y, m - 1, d + i)).toISOString().slice(0, 10)
    if (task.endDate && ds > task.endDate) return null
    if (occursOn(task, ds)) return ds
  }
  return null
}

export function upcomingTasks(tasks: Task[]): Map<string, Task[]> {
  const t = today()
  const grouped = new Map<string, Task[]>()
  const add = (key: string, task: Task) => {
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(task)
  }
  for (const task of tasks) {
    if (isRepeating(task)) {
      // Repeating tasks appear once, at their next upcoming occurrence.
      const next = nextOccurrence(task, t)
      if (next) add(next, task)
    } else if (task.dueDate && task.dueDate > t && !task.done) {
      add(task.dueDate, task)
    }
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
