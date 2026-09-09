"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "midnight" | "truedark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = (localStorage.getItem("money-vriksh-theme") || localStorage.getItem("money-vraksh-theme")) as Theme;
      if (savedTheme && ["midnight", "truedark", "light"].includes(savedTheme)) {
        return savedTheme;
      }
    }
    return "midnight";
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("money-vriksh-theme", newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    // Remove old classes
    root.classList.remove("theme-midnight", "theme-truedark", "theme-light", "dark");
    
    // Add current class
    root.classList.add(`theme-${theme}`);
    
    // Standard dark mode supports
    if (theme !== "light") {
      root.classList.add("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
