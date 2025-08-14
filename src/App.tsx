import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAppStore } from '@/store/app-store';
import { Layout } from '@/components/layout';
import { TasksScreen } from '@/components/screens/tasks-screen';
import { TaskScreen } from '@/components/screens/task-screen';
import './index.css';

// modify
function App() {
  const { theme, setTheme } = useAppStore();

  useEffect(() => {
    // Apply theme to body
    if (theme.variant === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme.variant]);

  useEffect(() => {
    // Handle auto theme mode
    if (theme.mode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme({
          mode: 'auto',
          variant: e.matches ? 'dark' : 'light'
        });
      };

      // Set initial theme
      setTheme({
        mode: 'auto',
        variant: mediaQuery.matches ? 'dark' : 'light'
      });

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme.mode, setTheme]);

  return (
    <Router basename="/timer-5">
      <Layout>
        <Routes>
          <Route path="/" element={<TasksScreen />} />
          <Route path="/:state" element={<TasksScreen />} />
          <Route path="/:state/:taskId" element={<TaskScreen />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
