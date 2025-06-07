import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { LoadingScreen } from "./src/components";
import AppNavigator from "./src/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "./src/theme/ThemeContext";
import { LightTheme } from "./src/theme/themes";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading process
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <NavigationContainer theme={LightTheme}>
          <AppNavigator />
        </NavigationContainer>
      )}
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
