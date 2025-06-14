import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";

interface ThemeBackgroundProps {
  children: React.ReactNode;
}

const ThemeBackground: React.FC<ThemeBackgroundProps> = ({ children }) => {
  const { colors } = useTheme();

  // Helper function to recursively wrap text strings in Text components
  const renderSafeChildren = (child: React.ReactNode): React.ReactNode => {
    // Handle string or number
    if (typeof child === "string" || typeof child === "number") {
      return <Text>{child}</Text>;
    }

    // Handle arrays (multiple children)
    if (Array.isArray(child)) {
      return child.map((c, i) => (
        <React.Fragment key={i}>{renderSafeChildren(c)}</React.Fragment>
      ));
    }

    // Handle React elements
    if (React.isValidElement(child)) {
      // If it already has children, process them recursively
      if (child.props && child.props.children) {
        return React.cloneElement(
          child,
          { ...child.props },
          renderSafeChildren(child.props.children)
        );
      }
    }

    // Return as is for other cases
    return child;
  };

  return (
    <LinearGradient colors={["#E8F0FE", "#D4E4FA"]} style={styles.container}>
      <View style={styles.contentContainer}>
        {renderSafeChildren(children)}
      </View>
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
