import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, Edit, Trash2 } from 'lucide-react';
import { formatDuration, formatDate } from '@/lib/format';

export function TaskScreen() {
  const params = useParams();
  const navigate = useNavigate();
  const { 
    setCurrentTaskId,
    getCurrentTask,
    startTask,
    stopTask,
    deleteSession,
    getSessionId
  } = useAppStore();

  const { state, taskId } = params;

  useEffect(() => {
    setCurrentTaskId(taskId);
  }, [taskId, setCurrentTaskId]);

  const task = getCurrentTask();

  const handleBack = () => {
    navigate(`/${state}`);
  };

  const handleStartTask = () => {
    if (task) {
      startTask(task.id, Date.now());
    }
  };

  const handleStopTask = () => {
    if (task) {
      stopTask(task.id, Date.now());
    }
  };

  const handleDeleteSession = (session: any) => {
    if (task && confirm('Are you sure you want to delete this session?')) {
      const sessionId = getSessionId(session);
      deleteSession(task.id, sessionId);
    }
  };

  if (!task) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <p>Task not found</p>
          <Button onClick={handleBack} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to tasks
          </Button>
        </div>
      </div>
    );
  }

  const isRunning = task.sessions.some(s => !s.end);
  const totalDuration = task.sessions.reduce((total, session) => {
    if (session.end) {
      return total + (session.end - session.start);
    } else {
      return total + (Date.now() - session.start);
    }
  }, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{task.name}</h1>
              <p className="text-muted-foreground">
                Total: {formatDuration(totalDuration)}
                {isRunning && <span className="ml-2 text-green-600 font-medium">• Running</span>}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isRunning ? (
              <Button onClick={handleStopTask}>
                <Pause className="h-4 w-4 mr-1" />
                Stop
              </Button>
            ) : (
              <Button onClick={handleStartTask}>
                <Play className="h-4 w-4 mr-1" />
                Start
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-auto p-4">
        {task.sessions.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p className="text-lg">No sessions yet</p>
              <p className="text-sm">Start the timer to create your first session</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Sessions ({task.sessions.length})
            </h2>
            
            {task.sessions.map((session, index) => {
              const duration = session.end 
                ? session.end - session.start 
                : Date.now() - session.start;
              const isRunning = !session.end;

              return (
                <Card key={`${session.start}-${index}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {formatDuration(duration)}
                          </span>
                          {isRunning && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Running
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Started: {formatDate(new Date(session.start))}
                          {session.end && (
                            <span className="ml-2">
                              Ended: {formatDate(new Date(session.end))}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSession(session)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}