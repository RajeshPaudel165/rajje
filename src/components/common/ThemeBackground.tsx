import React, { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { globalStyles } from "../../styles/styles";
import { useTheme } from "../../contexts/ThemeContext";

interface ThemeBackgroundProps {
  children: ReactNode;
}

const ThemeBackground: React.FC<ThemeBackgroundProps> = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <LinearGradient
      colors={
        isDark
          ? ["#1a1a1a", "#2d2d2d", "#404040"] // Dark gradient
          : ["#87ceeb", "#b0e0e6", "#e0f6ff"] // Light gradient
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={globalStyles.gradient}
    >
      {children}
    </LinearGradient>
  );
};

export default ThemeBackground;
