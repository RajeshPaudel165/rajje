import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme, Theme } from "../theme";

interface ThemeContextType {
  isDark: boolean;
  colors: Theme["colors"];
  theme: Theme;
  themeMode: "light" | "dark" | "auto";
  setTheme: (theme: "light" | "dark" | "auto") => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDark, setIsDark] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "auto">(
    "light"
  );

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) {
        const theme = savedTheme as "light" | "dark" | "auto";
        setThemeMode(theme);
        if (theme === "auto") {
          // You can implement system theme detection here
          setIsDark(false); // Default to light for now
        } else {
          setIsDark(theme === "dark");
        }
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const saveTheme = async (theme: "light" | "dark" | "auto") => {
    try {
      await AsyncStorage.setItem("theme", theme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    setThemeMode(newTheme);
    saveTheme(newTheme);
  };

  const setTheme = (theme: "light" | "dark" | "auto") => {
    setThemeMode(theme);
    if (theme === "auto") {
      setIsDark(false); // Default to light for auto
    } else {
      setIsDark(theme === "dark");
    }
    saveTheme(theme);
  };

  const colors = isDark ? darkTheme.colors : lightTheme.colors;
  const currentTheme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        colors,
        toggleTheme,
        setTheme,
        themeMode,
        theme: currentTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
