import { Task, TaskState } from './task';

export type StoredTask = {
  id: string;
  name: string;
  state: TaskState;
  sessions: Array<{
    start: number;
    end?: number;
  }>;
};

export const toStoredTasks = (tasks: Record<string, Task>): StoredTask[] => {
  return Object.values(tasks);
};

export const fromStoredTasks = (storedTasks: StoredTask[]): Record<string, Task> => {
  const tasks: Record<string, Task> = {};
  
  for (const storedTask of storedTasks) {
    if (storedTask && typeof storedTask === 'object' && storedTask.id) {
      tasks[storedTask.id] = {
        id: storedTask.id,
        name: storedTask.name || 'Untitled Task',
        state: storedTask.state || TaskState.active,
        sessions: Array.isArray(storedTask.sessions) ? storedTask.sessions : [],
      };
    }
  }
  
  return tasks;
};