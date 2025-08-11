import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app-store';
import { TaskState } from '@/lib/task';
import { 
  PlayCircle, 
  CheckCircle, 
  XCircle, 
  Download, 
  Upload, 
  Sun, 
  Moon, 
  Timer 
} from 'lucide-react';

const taskStateIcons = {
  [TaskState.active]: PlayCircle,
  [TaskState.finished]: CheckCircle,
  [TaskState.dropped]: XCircle,
};

export function Sidebar() {
  const { theme, setTheme, getAllTasks } = useAppStore();

  const handleThemeToggle = () => {
    if (theme.mode === 'auto') {
      setTheme({ mode: 'manual', variant: theme.variant === 'light' ? 'dark' : 'light' });
    } else {
      setTheme({ mode: 'manual', variant: theme.variant === 'light' ? 'dark' : 'light' });
    }
  };

  const handleExport = () => {
    const tasks = getAllTasks();
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'timer-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        // TODO: Implement import logic
        console.log('Import data:', data);
      } catch (error) {
        console.error('Failed to import data:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <NavLink 
          to="/all" 
          className="flex items-center gap-2 text-lg font-semibold hover:text-primary transition-colors"
        >
          <Timer className="h-6 w-6" />
          Timer
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          {Object.values(TaskState).map((state) => {
            const Icon = taskStateIcons[state];
            return (
              <NavLink
                key={state}
                to={`/${state}`}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {state.charAt(0).toUpperCase() + state.slice(1)} tasks
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          
          <Button variant="outline" size="sm" className="flex-1 relative overflow-hidden">
            <Upload className="h-4 w-4 mr-1" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleThemeToggle}
          className="w-full"
        >
          {theme.variant === 'light' ? (
            <>
              <Moon className="h-4 w-4 mr-1" />
              Dark
            </>
          ) : (
            <>
              <Sun className="h-4 w-4 mr-1" />
              Light
            </>
          )}
        </Button>
      </div>
    </div>
  );
}