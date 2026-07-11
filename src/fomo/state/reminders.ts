import type { Task } from './store'

// ── Local reminders ───────────────────────────────────────────────────────────
// Fires a notification at a task's due date+time.
//
// Honest limitation: without a push server, delivery when the app is fully
// closed depends on the platform. We use the experimental Notification Triggers
// API (`showTrigger`) when available (schedules even when closed, Chromium only),
// and fall back to in-session `setTimeout` (fires while the app is open). On iOS
// this requires the app to be installed to the Home Screen (PWA).

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function notificationPermission(): NotificationPermission {
  return notificationsSupported() ? Notification.permission : 'denied'
}

/** Must be called from a user gesture (tap). Returns true if granted. */
export async function ensurePermission(): Promise<boolean> {
  if (!notificationsSupported()) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  try {
    return (await Notification.requestPermission()) === 'granted'
  } catch {
    return false
  }
}

const MAX_TIMEOUT = 2_147_483_647 // ~24.8 days — setTimeout ceiling
const timers = new Map<string, number>()

function dueTimestamp(task: Task): number | null {
  if (!task.dueDate || !task.dueTime) return null
  const ts = new Date(`${task.dueDate}T${task.dueTime}:00`).getTime()
  return Number.isNaN(ts) ? null : ts
}

async function supportsTriggers(): Promise<boolean> {
  return 'showTrigger' in Notification.prototype
}

async function scheduleViaTrigger(task: Task, ts: number): Promise<boolean> {
  try {
    const reg = await navigator.serviceWorker?.getRegistration()
    if (!reg) return false
    // TimestampTrigger is experimental and not in TS lib types.
    const Trigger = (window as unknown as { TimestampTrigger?: new (t: number) => unknown }).TimestampTrigger
    if (!Trigger) return false
    await reg.showNotification(task.name, {
      body: 'Due now',
      tag: `fomo-${task.id}`,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      // @ts-expect-error experimental showTrigger option
      showTrigger: new Trigger(ts),
    })
    return true
  } catch {
    return false
  }
}

function fireNow(task: Task) {
  try {
    const opts: NotificationOptions = {
      body: 'Due now',
      tag: `fomo-${task.id}`,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
    }
    navigator.serviceWorker?.getRegistration().then(reg => {
      if (reg) reg.showNotification(task.name, opts)
      else new Notification(task.name, opts)
    })
  } catch {
    /* ignore */
  }
}

/** Reconcile scheduled reminders with the current task list. */
export async function syncReminders(tasks: Task[]): Promise<void> {
  if (notificationPermission() !== 'granted') return
  const now = Date.now()

  const wanted = new Map<string, number>()
  for (const t of tasks) {
    if (t.done) continue
    const ts = dueTimestamp(t)
    if (ts != null && ts > now) wanted.set(t.id, ts)
  }

  const useTriggers = await supportsTriggers()

  // Drop timers that are no longer wanted.
  for (const [id, timer] of timers) {
    if (!wanted.has(id)) {
      clearTimeout(timer)
      timers.delete(id)
    }
  }

  for (const [id, ts] of wanted) {
    const task = tasks.find(t => t.id === id)!
    if (useTriggers) {
      // Triggers persist across app closes; (re)register is idempotent by tag.
      await scheduleViaTrigger(task, ts)
      continue
    }
    if (timers.has(id)) continue
    const delay = ts - now
    if (delay > MAX_TIMEOUT) continue // too far out; will be picked up on a later sync
    const timer = window.setTimeout(() => {
      fireNow(task)
      timers.delete(id)
    }, delay)
    timers.set(id, timer)
  }
}
