import React from 'react';
import Button from '@/components/button';
import { Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/interfaces/systemSettings';
import { useSystemSettings } from '@/actions/calls/systemSettings';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();
  const {editOrAddSystemSetting} = useSystemSettings();

  const toggleTheme = () => {
    if (theme === Theme.LIGHT) {
      setTheme(Theme.DARK);
    } else if (theme === Theme.DARK) {
      setTheme(Theme.SYSTEM);
    } else {
      setTheme(Theme.LIGHT);
    }

    editOrAddSystemSetting({'theme': theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT});
  };

  return (
    <Button
      variant="outline"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`p-2 border border-border rounded-md bg-card text-card-foreground hover:bg-muted transition-colors duration-200 ${className}`}
    >
      {theme === Theme.LIGHT && <Sun className="h-5 w-5" />}
      {theme === Theme.DARK && <Moon className="h-5 w-5" />}
      {theme === Theme.SYSTEM && <Laptop className="h-5 w-5" />}
    </Button>
  );
};

export default ThemeToggle;
