import React, { createContext, ReactNode } from "react";

export type AppTheme = "light";

interface ThemeContextProps {
  theme: AppTheme;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme: AppTheme = "light";

  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  );
};
