import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/app-store';
import { TaskState } from '@/lib/task';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Play, Pause, Trash2 } from 'lucide-react';
import { formatDuration } from '@/lib/format';

export function TasksScreen() {
  const params = useParams();
  const navigate = useNavigate();
  const { 
    setCurrentTaskState,
    getCurrentTasks,
    createTask,
    startTask,
    stopTask,
    deleteTask
  } = useAppStore();

  const state = params.state || 'active';

  useEffect(() => {
    setCurrentTaskState(state);
  }, [state, setCurrentTaskState]);

  const tasks = getCurrentTasks();

  const handleCreateTask = async () => {
    const name = prompt('Enter task name:');
    if (name?.trim()) {
      const taskId = createTask(name.trim());
      navigate(`/${state}/${taskId}`);
    }
  };

  const handleStartTask = (taskId: string) => {
    startTask(taskId, Date.now());
  };

  const handleStopTask = (taskId: string) => {
    stopTask(taskId, Date.now());
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  const isValidState = Object.values(TaskState).includes(state as TaskState) || state === 'all';

  if (!isValidState) {
    return <div>Invalid task state</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {state.charAt(0).toUpperCase() + state.slice(1)} Tasks
          </h1>
          <Button onClick={handleCreateTask}>
            <Plus className="h-4 w-4 mr-1" />
            New Task
          </Button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-auto p-4">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p className="text-lg">No {state} tasks</p>
              <p className="text-sm">Create a new task to get started</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => {
              const isRunning = task.sessions.some(s => !s.end);
              const totalDuration = task.sessions.reduce((total, session) => {
                if (session.end) {
                  return total + (session.end - session.start);
                } else {
                  return total + (Date.now() - session.start);
                }
              }, 0);

              return (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle 
                        className="text-lg cursor-pointer hover:text-primary transition-colors"
                        onClick={() => navigate(`/${state}/${task.id}`)}
                      >
                        {task.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {formatDuration(totalDuration)}
                        </span>
                        {isRunning ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStopTask(task.id)}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartTask(task.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {task.sessions.length > 0 && (
                    <CardContent className="pt-0">
                      <div className="text-sm text-muted-foreground">
                        {task.sessions.length} session{task.sessions.length !== 1 ? 's' : ''}
                        {isRunning && (
                          <span className="ml-2 text-green-600 font-medium">• Running</span>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}