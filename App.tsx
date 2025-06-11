import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { LoadingScreen } from "./src/components";
import AppNavigator from "./src/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { LanguageProvider } from "./src/contexts/LanguageContext";

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
      <LanguageProvider>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        )}
        <StatusBar style="dark" />
      </LanguageProvider>
    </ThemeProvider>
  );
}
