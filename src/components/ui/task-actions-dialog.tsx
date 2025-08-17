import React from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Task, TaskState, COUNTDOWN_DURATION_OPTIONS } from '@/lib/task';
import { useAppStore } from '@/store/app-store';
import { Edit, Settings, X, Clock } from 'lucide-react';

interface TaskActionsDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskActionsDialog({ task, isOpen, onClose }: TaskActionsDialogProps) {
  const { renameTask, updateTaskState, setTaskCountdownDuration } = useAppStore();
  const [newName, setNewName] = React.useState(task.name);
  const [newState, setNewState] = React.useState(task.state);

  const handleRename = () => {
    if (newName.trim() && newName !== task.name) {
      renameTask(task.id, newName.trim());
    }
    onClose();
  };

  const handleStateChange = (state: TaskState) => {
    setNewState(state);
    updateTaskState(task.id, state);
    // If setting to finished, stop any running sessions
    if (state === TaskState.finished) {
      const runningSession = task.sessions.find(s => !s.end);
      if (runningSession) {
        // This would be handled by the parent component calling stopTask
      }
    }
  };

  const handleCountdownDuration = (duration?: number) => {
    setTaskCountdownDuration(task.id, duration);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Task Settings
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rename Task */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Task Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task name"
              />
              <Button onClick={handleRename} size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Task Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(TaskState).map((state) => (
                <Button
                  key={state}
                  variant={newState === state ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStateChange(state)}
                  className="capitalize"
                >
                  {state}
                </Button>
              ))}
            </div>
          </div>

          {/* Countdown Duration */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Countdown Duration
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={!task.countdownDuration ? "default" : "outline"}
                size="sm"
                onClick={() => handleCountdownDuration(undefined)}
              >
                No countdown
              </Button>
              {COUNTDOWN_DURATION_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={task.countdownDuration === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCountdownDuration(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            {task.countdownDuration && (
              <p className="text-xs text-gray-600">
                Current: {COUNTDOWN_DURATION_OPTIONS.find(o => o.value === task.countdownDuration)?.label || 'Custom'}
              </p>
            )}
          </div>

          <div className="pt-4 border-t">
            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}