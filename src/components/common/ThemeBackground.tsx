import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";

interface ThemeBackgroundProps {
  children: React.ReactNode;
}

const ThemeBackground: React.FC<ThemeBackgroundProps> = ({ children }) => {
  const { colors } = useTheme();
  // isDark is removed since we're always using light mode

  return (
    <LinearGradient
      colors={["#E8F0FE", "#D4E4FA"]} // Always use light mode colors
      style={styles.container}
    >
      <View style={styles.contentContainer}>{children}</View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});

export default ThemeBackground;
