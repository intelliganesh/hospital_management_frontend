import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { Theme } from "@/interfaces/systemSettings";
import React, { useState, useEffect, useContext, createContext } from "react";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const localStorageTheme = localStorage.getItem("theme");
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const settingsData = useSelector(
    (state: RootState) => state.systemSettings.settings
  );

  const [theme, setTheme] = useState<Theme>(
    Object.values(Theme).includes(localStorageTheme as Theme)
      ? (localStorageTheme as Theme)
      : Theme.LIGHT
  );

  // Initialize theme from backend settings when available
  useEffect(() => {
    if (settingsData?.theme) {
      setTheme(settingsData.theme);
      localStorage.setItem("theme", settingsData.theme);
    }
  }, [settingsData?.theme]);

  // Function to update theme (only updates local state, not backend)
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // Apply theme to document
  useEffect(() => {
    const html = document.documentElement;

    // Remove both classes first
    html.classList.remove("light", "dark", "system");

    html.classList.add(theme);
    if (theme === Theme.SYSTEM) {
      // Check system preference and apply appropriate class
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      html.classList.add(prefersDark ? "dark" : "light");
      // You can also add system class if needed for tracking
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
