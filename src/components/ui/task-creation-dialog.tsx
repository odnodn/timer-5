import React from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { TaskState, COUNTDOWN_DURATION_OPTIONS } from '@/lib/task';
import { X, Clock } from 'lucide-react';

interface TaskCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, state: TaskState, countdownDuration?: number) => void;
}

export function TaskCreationDialog({ isOpen, onClose, onCreate }: TaskCreationDialogProps) {
  const [name, setName] = React.useState('');
  const [state, setState] = React.useState<TaskState>(TaskState.active);
  const [countdownDuration, setCountdownDuration] = React.useState<number | undefined>(undefined);

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim(), state, countdownDuration);
      setName('');
      setState(TaskState.active);
      setCountdownDuration(undefined);
      onClose();
    }
  };

  const handleCancel = () => {
    setName('');
    setState(TaskState.active);
    setCountdownDuration(undefined);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Create New Task</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Task Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Task Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task name"
              autoFocus
            />
          </div>

          {/* Task Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Initial Status</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(TaskState).map((taskState) => (
                <Button
                  key={taskState}
                  variant={state === taskState ? "default" : "outline"}
                  size="sm"
                  onClick={() => setState(taskState)}
                  className="capitalize"
                >
                  {taskState}
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
                variant={!countdownDuration ? "default" : "outline"}
                size="sm"
                onClick={() => setCountdownDuration(undefined)}
              >
                No countdown
              </Button>
              {COUNTDOWN_DURATION_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={countdownDuration === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCountdownDuration(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" className="flex-1" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              className="flex-1"
              onClick={handleCreate}
              disabled={!name.trim()}
            >
              Create Task
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}