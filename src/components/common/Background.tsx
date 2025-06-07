import React, { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { globalStyles } from "../../styles/styles";
import { View } from "react-native";

interface BackgroundProps {
  children: ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#87ceeb", "#b0e0e6", "#e0f6ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={globalStyles.gradient}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

export default Background;
