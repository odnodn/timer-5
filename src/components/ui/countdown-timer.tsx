import React from 'react';
import { Task, getCountdownProgress, getCountdownColor } from '@/lib/task';
import { formatDuration } from '@/lib/format';
import { cn } from '@/lib/cn';

interface CountdownTimerProps {
  task: Task;
  className?: string;
}

export function CountdownTimer({ task, className }: CountdownTimerProps) {
  const [now, setNow] = React.useState(Date.now());

  React.useEffect(() => {
    if (!task.countdownDuration) return;
    
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [task.countdownDuration]);

  if (!task.countdownDuration) return null;

  const progress = getCountdownProgress(task, now);
  const color = getCountdownColor(progress);
  const remaining = Math.max(0, task.countdownDuration - (now - (task.sessions.find(s => !s.end)?.start || now)));
  const isExpired = remaining === 0;

  const colorClasses: Record<string, string> = {
    green: 'text-green-600 border-green-600',
    yellow: 'text-yellow-600 border-yellow-600',
    orange: 'text-orange-600 border-orange-600',
    red: 'text-red-600 border-red-600',
  };

  const progressColorClasses: Record<string, string> = {
    green: 'stroke-green-600',
    yellow: 'stroke-yellow-600', 
    orange: 'stroke-orange-600',
    red: 'stroke-red-600',
  };

  const circumference = 2 * Math.PI * 12; // radius = 12 (smaller)
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Progress Circle */}
      <div className="relative w-6 h-6">
        <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 28 28">
          <circle
            cx="14"
            cy="14"
            r="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-gray-200"
          />
          <circle
            cx="14"
            cy="14"
            r="12"
            fill="none"
            strokeWidth="3"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={progressColorClasses[color]}
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out',
            }}
          />
        </svg>
      </div>

      {/* Time Display */}
      <div className={cn(
        'text-sm font-mono border rounded px-2 py-1',
        colorClasses[color],
        isExpired && 'animate-pulse'
      )}>
        {isExpired ? 'EXPIRED' : formatDuration(remaining)}
      </div>
    </div>
  );
}