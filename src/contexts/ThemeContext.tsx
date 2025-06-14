import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, Theme } from "../theme/theme";

interface ThemeContextType {
  isDark: boolean;
  colors: Theme["colors"];
  theme: Theme;
  themeMode: "light";
  setTheme: (theme: "light") => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Force light mode by always setting isDark to false
  const [isDark, setIsDark] = useState(false);
  const [themeMode, setThemeMode] = useState<"light">("light");

  useEffect(() => {
    // Always use light theme regardless of saved preference
    setIsDark(false);
    setThemeMode("light");
    saveTheme("light");
  }, []);

  const loadTheme = async () => {
    // Comment out theme loading - always use light theme
    /* 
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
    */
    // Always set light theme
    setIsDark(false);
    setThemeMode("light");
  };

  const saveTheme = async (theme: "light" | "dark" | "auto") => {
    try {
      // Always save "light" theme regardless of parameter
      await AsyncStorage.setItem("theme", "light");
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const toggleTheme = () => {
    // Disable toggle functionality - always use light theme
    /* 
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    setThemeMode(newTheme);
    saveTheme(newTheme);
    */
    // Always set to light
    setIsDark(false);
    setThemeMode("light");
    saveTheme("light");
  };

  const setTheme = (theme: "light" | "dark" | "auto") => {
    // Always set to light theme regardless of parameter
    setThemeMode("light");
    setIsDark(false);
    saveTheme("light");
  };

  // Always use light theme colors
  const colors = lightTheme.colors;
  const currentTheme = lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        isDark: false, // Always false
        colors,
        toggleTheme,
        setTheme,
        themeMode: "light", // Always light
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
