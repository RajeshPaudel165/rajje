import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface StaticLightBackgroundProps {
  children: React.ReactNode;
}

const StaticLightBackground: React.FC<StaticLightBackgroundProps> = ({
  children,
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#87ceeb", "#b0e0e6", "#e0f6ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

export default StaticLightBackground;
