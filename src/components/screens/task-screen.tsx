import React from 'react';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CommentSelectionDialog } from '@/components/ui/comment-selection-dialog';
import { TaskActionsDialog } from '@/components/ui/task-actions-dialog';
import { SessionEditDialog } from '@/components/ui/session-edit-dialog';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { ArrowLeft, Play, Pause, Edit, Trash2, Settings, CalendarDays, Clock } from 'lucide-react';
import { formatDuration, formatCompactDate, formatCompactTime } from '@/lib/format';
import { Session, TaskState } from '@/lib/task';

export function TaskScreen() {
  const params = useParams();
  const navigate = useNavigate();
  const { 
    setCurrentTaskId,
    getCurrentTask,
    startTask,
    stopTask,
    deleteSession,
    getSessionId,
    updateTaskState
  } = useAppStore();

  const { state, taskId } = params;

  // Dialog states
  const [showCommentDialog, setShowCommentDialog] = React.useState(false);
  const [showTaskActions, setShowTaskActions] = React.useState(false);
  const [editingSession, setEditingSession] = React.useState<{
    session: Session;
    index: number;
  } | null>(null);
  const [pendingComment, setPendingComment] = React.useState<string>('');
  const [now, setNow] = React.useState(Date.now());

  useEffect(() => {
    setCurrentTaskId(taskId);
  }, [taskId, setCurrentTaskId]);

  const task = getCurrentTask();

  // Update time every second when there's a running session
  React.useEffect(() => {
    if (!task) return;
    
    const isRunning = task.sessions.some(s => !s.end);
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [task?.sessions]);

  const handleBack = () => {
    navigate(`/${state}`);
  };

  const handleStartTask = () => {
    if (task) {
      setShowCommentDialog(true);
    }
  };

  const handleStartWithComment = (comment: string) => {
    if (task) {
      startTask(task.id, Date.now(), comment);
    }
  };

  const handleStopTask = () => {
    if (task) {
      stopTask(task.id, Date.now());
    }
  };

  const handleTaskStatusFinished = () => {
    if (task) {
      // Stop any running sessions first
      const runningSession = task.sessions.find(s => !s.end);
      if (runningSession) {
        stopTask(task.id, Date.now());
      }
      updateTaskState(task.id, TaskState.finished);
    }
  };

  const handleDeleteSession = (session: Session) => {
    if (task && confirm('Are you sure you want to delete this session?')) {
      const sessionId = getSessionId(session);
      deleteSession(task.id, sessionId);
    }
  };

  const handleEditSession = (session: Session, index: number) => {
    setEditingSession({ session, index });
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
      return total + (now - session.start);
    }
  }, 0);

  return (
    <div className="flex h-full">
      {/* Left Panel - Task Info */}
      <div className="w-1/3 border-r border-border flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{task.name}</h1>
              <p className="text-sm text-muted-foreground capitalize">
                Status: {task.state}
              </p>
            </div>
            <Button variant="outline" onClick={() => setShowTaskActions(true)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Task Controls */}
          <div className="flex items-center gap-2 mb-4">
            {isRunning ? (
              <Button onClick={handleStopTask} className="flex-1">
                <Pause className="h-4 w-4 mr-1" />
                Stop
              </Button>
            ) : (
              <Button onClick={handleStartTask} className="flex-1">
                <Play className="h-4 w-4 mr-1" />
                Start
              </Button>
            )}
            {task.state !== 'finished' && (
              <Button variant="outline" onClick={handleTaskStatusFinished}>
                Finish
              </Button>
            )}
          </div>

          {/* Countdown Timer */}
          {isRunning && task.countdownDuration && (
            <div className="mb-4">
              <CountdownTimer task={task} />
            </div>
          )}

          {/* Task Stats */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Duration:</span>
              <span className="font-mono">{formatDuration(totalDuration)}</span>
            </div>
            <div className="flex justify-between">
              <span>Sessions:</span>
              <span>{task.sessions.length}</span>
            </div>
            {isRunning && (
              <div className="flex justify-between text-green-600">
                <span>Status:</span>
                <span className="font-medium">Running</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Sessions */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Sessions ({task.sessions.length})
            </h2>
            <div className="text-sm">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  Total: <span className="font-mono">{formatDuration(totalDuration)}</span>
                </span>
                {task.countdownDuration && isRunning && (() => {
                  const runningSession = task.sessions.find(s => !s.end);
                  if (runningSession) {
                    const elapsed = now - runningSession.start;
                    const exceeded = Math.max(0, elapsed - task.countdownDuration);
                    const isExceeding = exceeded > 0;
                    return (
                      <span className={`font-mono ${isExceeding ? 'text-red-600' : 'text-green-600'}`}>
                        {isExceeding ? 'Exceeded: ' : 'Remaining: '}
                        {formatDuration(isExceeding ? exceeded : task.countdownDuration - elapsed)}
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {task.sessions.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <p className="text-lg">No sessions yet</p>
                <p className="text-sm">Start the timer to create your first session</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {task.sessions.map((session, index) => {
                const duration = session.end 
                  ? session.end - session.start 
                  : now - session.start;
                const isSessionRunning = !session.end;

                return (
                  <Card key={`${session.start}-${index}`}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {/* Duration */}
                          <div className="flex items-center gap-1">
                            <span className="font-medium font-mono">
                              {formatDuration(duration)}
                            </span>
                            {isSessionRunning && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Running
                              </span>
                            )}
                          </div>
                          
                          {/* Start Date/Time */}
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <CalendarDays className="h-3 w-3" />
                            <span>{formatCompactDate(new Date(session.start))}</span>
                            <Clock className="h-3 w-3 ml-1" />
                            <span>{formatCompactTime(new Date(session.start))}</span>
                          </div>
                          
                          {/* End Date/Time */}
                          {session.end && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <span>→</span>
                              <span>{formatCompactDate(new Date(session.end))}</span>
                              <span>{formatCompactTime(new Date(session.end))}</span>
                            </div>
                          )}
                          
                          {/* Comment */}
                          {session.comment && (
                            <div className="text-sm text-blue-600 font-medium truncate">
                              {session.comment}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 ml-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditSession(session, index)}
                          >
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

      {/* Dialogs */}
      <CommentSelectionDialog
        isOpen={showCommentDialog}
        onClose={() => setShowCommentDialog(false)}
        onSelect={setPendingComment}
        onStart={() => handleStartWithComment(pendingComment)}
      />

      <TaskActionsDialog
        task={task}
        isOpen={showTaskActions}
        onClose={() => setShowTaskActions(false)}
      />

      {editingSession && (
        <SessionEditDialog
          session={editingSession.session}
          sessionIndex={editingSession.index}
          taskId={task.id}
          isOpen={true}
          onClose={() => setEditingSession(null)}
        />
      )}
    </div>
  );
}