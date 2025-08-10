import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { Task, TaskState, Session, SessionId, makeTaskId, isTaskRunning, filterTasks, filterTaskSessions, FilterParams, isSessionWithId } from '@/lib/task';
import { fromStoredTasks, toStoredTasks } from '@/lib/storage';
import { deepEquals } from '@/lib/utils';

export type Theme = {
  mode: 'auto' | 'manual';
  variant: 'light' | 'dark';
};

export interface AppState {
  // Tasks
  tasks: Record<string, Task>;
  
  // Theme
  theme: Theme;
  
  // Router state (managed externally but stored here for convenience)
  currentTaskId?: string;
  currentTaskState?: string;
  currentSessionIndex?: number;
  filterParams: FilterParams;
  
  // Dialog state
  dialogTaskId?: string;
  dialogSessionIndex?: number;
}

export interface AppActions {
  // Task actions
  loadTasks: (tasks: Record<string, Task>) => void;
  createTask: (name: string) => string;
  deleteTask: (taskId: string) => void;
  renameTask: (taskId: string, name: string) => void;
  updateTaskState: (taskId: string, state: TaskState) => void;
  
  // Session actions
  startTask: (taskId: string, timestamp: number) => void;
  stopTask: (taskId: string, timestamp: number) => void;
  editSession: (taskId: string, sessionIndex: number, session: Session) => void;
  deleteSession: (taskId: string, sessionId: SessionId) => void;
  splitSession: (taskId: string, sessionIndex: number, sessions: Session[]) => void;
  moveSessionToTask: (fromTaskId: string, toTaskId: string, session: Session) => void;
  
  // Theme actions
  setTheme: (theme: Theme) => void;
  
  // Router actions
  setCurrentTaskId: (taskId?: string) => void;
  setCurrentTaskState: (state?: string) => void;
  setCurrentSessionIndex: (index?: number) => void;
  setFilterParams: (params: FilterParams) => void;
  
  // Dialog actions
  setDialogTaskId: (taskId?: string) => void;
  setDialogSessionIndex: (index?: number) => void;
  
  // Computed getters
  getAllTasks: () => Task[];
  getCurrentTasks: () => Task[];
  getCurrentTask: () => Task | undefined;
  getTaskById: (taskId: string) => Task | undefined;
  getDialogTask: () => Task | undefined;
  getDialogSession: () => Session | undefined;
  getSessionId: (session: Session) => SessionId;
  isAnyTaskActive: () => boolean;
}

export type AppStore = AppState & AppActions;

const initialState: AppState = {
  tasks: {},
  theme: { mode: 'auto', variant: 'light' },
  filterParams: {},
};

export const useAppStore = create<AppStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      ...initialState,
      
      // Task actions
      loadTasks: (tasks) => set((state) => {
        state.tasks = tasks;
      }),
      
      createTask: (name) => {
        const taskId = makeTaskId();
        set((state) => {
          state.tasks[taskId] = {
            id: taskId,
            name,
            state: TaskState.active,
            sessions: [],
          };
        });
        return taskId;
      },
      
      deleteTask: (taskId) => set((state) => {
        delete state.tasks[taskId];
      }),
      
      renameTask: (taskId, name) => set((state) => {
        const task = state.tasks[taskId];
        if (task) {
          task.name = name;
        }
      }),
      
      updateTaskState: (taskId, newState) => set((state) => {
        const task = state.tasks[taskId];
        if (task) {
          task.state = newState;
        }
      }),
      
      // Session actions
      startTask: (taskId, timestamp) => set((state) => {
        const task = state.tasks[taskId];
        if (task) {
          task.state = TaskState.active;
          task.sessions.push({ start: timestamp, end: undefined });
        }
      }),
      
      stopTask: (taskId, timestamp) => set((state) => {
        const task = state.tasks[taskId];
        if (task) {
          const runningSession = task.sessions.find(s => s.end === undefined);
          if (runningSession) {
            runningSession.end = timestamp;
          }
        }
      }),
      
      editSession: (taskId, sessionIndex, session) => set((state) => {
        const task = state.tasks[taskId];
        if (task && task.sessions[sessionIndex]) {
          task.sessions[sessionIndex] = session;
        }
      }),
      
      deleteSession: (taskId, sessionId) => set((state) => {
        const task = state.tasks[taskId];
        if (task) {
          const sessionIndex = task.sessions.findIndex(s => isSessionWithId(sessionId)(s));
          if (sessionIndex >= 0) {
            task.sessions.splice(sessionIndex, 1);
          }
        }
      }),
      
      splitSession: (taskId, sessionIndex, sessions) => set((state) => {
        const task = state.tasks[taskId];
        if (task && task.sessions[sessionIndex]) {
          task.sessions.splice(sessionIndex, 1, ...sessions);
        }
      }),
      
      moveSessionToTask: (fromTaskId, toTaskId, session) => set((state) => {
        const fromTask = state.tasks[fromTaskId];
        const toTask = state.tasks[toTaskId];
        
        if (fromTask && toTask) {
          const sessionIndex = fromTask.sessions.findIndex(s => deepEquals(s, session));
          if (sessionIndex >= 0) {
            fromTask.sessions.splice(sessionIndex, 1);
            toTask.sessions.push(session);
            if (isTaskRunning(toTask)) {
              toTask.state = TaskState.active;
            }
          }
        }
      }),
      
      // Theme actions
      setTheme: (theme) => set((state) => {
        state.theme = theme;
      }),
      
      // Router actions
      setCurrentTaskId: (taskId) => set((state) => {
        state.currentTaskId = taskId;
      }),
      
      setCurrentTaskState: (taskState) => set((state) => {
        state.currentTaskState = taskState;
      }),
      
      setCurrentSessionIndex: (index) => set((state) => {
        state.currentSessionIndex = index;
      }),
      
      setFilterParams: (params) => set((state) => {
        state.filterParams = params;
      }),
      
      // Dialog actions
      setDialogTaskId: (taskId) => set((state) => {
        state.dialogTaskId = taskId;
      }),
      
      setDialogSessionIndex: (index) => set((state) => {
        state.dialogSessionIndex = index;
      }),
      
      // Computed getters
      getAllTasks: () => Object.values(get().tasks),
      
      getCurrentTasks: () => {
        const state = get();
        const filterParams = {
          ...state.filterParams,
          state: state.currentTaskState as any,
        };
        return filterTasks(filterParams, Object.values(state.tasks));
      },
      
      getCurrentTask: () => {
        const state = get();
        if (!state.currentTaskId) return undefined;
        
        const task = state.tasks[state.currentTaskId];
        if (!task) return undefined;
        
        return filterTaskSessions(task, {
          from: state.filterParams.from,
          to: state.filterParams.to,
        });
      },
      
      getTaskById: (taskId) => get().tasks[taskId],
      
      getDialogTask: () => {
        const state = get();
        if (!state.dialogTaskId) return undefined;
        return state.tasks[state.dialogTaskId];
      },
      
      getDialogSession: () => {
        const state = get();
        const task = get().getDialogTask();
        if (!task || state.dialogSessionIndex === undefined) return undefined;
        return task.sessions[state.dialogSessionIndex];
      },
      
      getSessionId: (session) => [session.start, session.end],
      
      isAnyTaskActive: () => {
        const tasks = Object.values(get().tasks);
        return tasks.some(isTaskRunning);
      },
    }))
  )
);

// Initialize from localStorage
const storedTasks = localStorage.getItem('tasks');
if (storedTasks) {
  try {
    const parsedTasks = JSON.parse(storedTasks);
    const tasks = fromStoredTasks(parsedTasks);
    useAppStore.getState().loadTasks(tasks);
  } catch (e) {
    console.error('Failed to load tasks from localStorage:', e);
  }
}

// Initialize theme from localStorage
const storedTheme = localStorage.getItem('theme');
if (storedTheme) {
  try {
    const theme = JSON.parse(storedTheme);
    useAppStore.getState().setTheme(theme);
  } catch (e) {
    console.error('Failed to load theme from localStorage:', e);
  }
}

// Subscribe to changes and save to localStorage
useAppStore.subscribe(
  (state) => state.tasks,
  (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(toStoredTasks(tasks)));
  },
  { equalityFn: (a, b) => deepEquals(a, b) }
);

useAppStore.subscribe(
  (state) => state.theme,
  (theme) => {
    localStorage.setItem('theme', JSON.stringify(theme));
  },
  { equalityFn: (a, b) => deepEquals(a, b) }
);