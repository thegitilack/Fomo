import { useReducer, useEffect } from 'react'
import {
  reducer, INITIAL_STATE,
  todayTasks, upcomingTasks, allTasks, goalsList,
  loadTasks, saveTasks, loadGoals, saveGoals,
} from './state/store'
import { syncReminders } from './state/reminders'
import { BottomNav } from './components/BottomNav'
import { FAB } from './components/FAB'
import { ListScreen } from './screens/ListScreen'
import { UpcomingScreen } from './screens/UpcomingScreen'
import { GoalsScreen } from './screens/GoalsScreen'
import { EmptyState } from './screens/EmptyState'
import { TaskDetail } from './screens/TaskDetail'
import { GoalDetail } from './screens/GoalDetail'
import { AddTaskSheet } from './sheets/AddTaskSheet'
import { AddGoalSheet } from './sheets/AddGoalSheet'

function todayEyebrow(): string {
  const now = new Date()
  const weekday = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
  const day = now.getDate()
  const month = now.toLocaleDateString('en-US', { month: 'long' }).toUpperCase()
  return `${weekday} · ${day} ${month}`
}

export function App() {
  const saved = loadTasks()
  const savedGoals = loadGoals()
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    tasks: saved ?? INITIAL_STATE.tasks,
    goals: savedGoals ?? INITIAL_STATE.goals,
  })

  useEffect(() => {
    saveTasks(state.tasks)
    void syncReminders(state.tasks)
  }, [state.tasks])

  useEffect(() => {
    saveGoals(state.goals)
  }, [state.goals])

  const today = todayTasks(state.tasks)
  const upcoming = upcomingTasks(state.tasks)
  const all = allTasks(state.tasks)
  const goals = goalsList(state.goals)
  const editingTask = state.editingTaskId ? state.tasks.find(t => t.id === state.editingTaskId) : null
  const editingGoal = state.editingGoalId ? state.goals.find(g => g.id === state.editingGoalId) : null

  return (
    <div
      className={state.theme === 'light' ? 'theme-light' : ''}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--fomo-bg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      {/* Task Detail (pushed screen) */}
      {editingTask ? (
        <TaskDetail
          task={editingTask}
          onBack={() => dispatch({ type: 'CLOSE_DETAIL' })}
          onToggleDone={() => dispatch({ type: 'TOGGLE_DONE', id: editingTask.id })}
          onDelete={() => dispatch({ type: 'DELETE_TASK', id: editingTask.id })}
          onUpdateNote={note => dispatch({ type: 'UPDATE_NOTE', id: editingTask.id, note })}
          onUpdate={patch => dispatch({ type: 'UPDATE_TASK', id: editingTask.id, patch })}
        />
      ) : editingGoal ? (
        <GoalDetail
          goal={editingGoal}
          onBack={() => dispatch({ type: 'CLOSE_GOAL' })}
          onToggleDone={() => dispatch({ type: 'TOGGLE_GOAL', id: editingGoal.id })}
          onDelete={() => dispatch({ type: 'DELETE_GOAL', id: editingGoal.id })}
          onUpdate={patch => dispatch({ type: 'UPDATE_GOAL', id: editingGoal.id, patch })}
        />
      ) : (
        <>
          {/* Theme toggle (top-right) */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
            aria-label="Toggle theme"
            title="Toggle theme"
            style={{
              position: 'absolute',
              top: '50px',
              right: '22px',
              zIndex: 20,
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              color: 'var(--fomo-text-faint)',
            }}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" />
            </svg>
          </button>

          {/* Main content */}
          {state.activeView === 'today' && (
            today.length === 0
              ? <EmptyState eyebrow={todayEyebrow()} />
              : (
                <ListScreen
                  eyebrow={todayEyebrow()}
                  title="Today"
                  tasks={today}
                  onToggle={id => dispatch({ type: 'TOGGLE_DONE', id })}
                  onOpen={id => dispatch({ type: 'OPEN_DETAIL', id })}
                />
              )
          )}

          {state.activeView === 'upcoming' && (
            <UpcomingScreen
              grouped={upcoming}
              onToggle={id => dispatch({ type: 'TOGGLE_DONE', id })}
              onOpen={id => dispatch({ type: 'OPEN_DETAIL', id })}
            />
          )}

          {state.activeView === 'all' && (
            <ListScreen
              eyebrow="Everything"
              title="All"
              tasks={all}
              onToggle={id => dispatch({ type: 'TOGGLE_DONE', id })}
              onOpen={id => dispatch({ type: 'OPEN_DETAIL', id })}
              goals={goals}
              onToggleGoal={id => dispatch({ type: 'TOGGLE_GOAL', id })}
              onOpenGoal={id => dispatch({ type: 'OPEN_GOAL', id })}
            />
          )}

          {state.activeView === 'goals' && (
            <GoalsScreen
              goals={goals}
              onToggle={id => dispatch({ type: 'TOGGLE_GOAL', id })}
              onOpen={id => dispatch({ type: 'OPEN_GOAL', id })}
            />
          )}

          {/* FAB + Bottom nav */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', right: 24, bottom: 'calc(76px + env(safe-area-inset-bottom))', zIndex: 2 }}>
              <FAB onClick={() => dispatch({ type: state.activeView === 'goals' ? 'OPEN_GOAL_SHEET' : 'OPEN_SHEET' })} />
            </div>
            <BottomNav
              active={state.activeView}
              onChange={view => dispatch({ type: 'SET_VIEW', view })}
            />
          </div>

          {/* Add task sheet */}
          {state.addSheetOpen && (
            <AddTaskSheet
              onClose={() => dispatch({ type: 'CLOSE_SHEET' })}
              onSubmit={task => dispatch({ type: 'ADD_TASK', task })}
            />
          )}

          {/* Add goal sheet */}
          {state.addGoalSheetOpen && (
            <AddGoalSheet
              onClose={() => dispatch({ type: 'CLOSE_GOAL_SHEET' })}
              onSubmit={goal => dispatch({ type: 'ADD_GOAL', goal })}
            />
          )}
        </>
      )}
    </div>
  )
}
