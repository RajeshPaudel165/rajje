import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { LoadingScreen } from "./src/components";
import AppNavigator from "./src/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { LanguageProvider } from "./src/contexts/LanguageContext";
import { LightTheme } from "./src/theme/themes";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./src/services/firebase";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Show loading screen for at least 3 seconds for better UX
    const loadingTimer = setTimeout(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setIsLoading(false);
      });

      return () => unsubscribe();
    }, 3000);

    return () => clearTimeout(loadingTimer);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <NavigationContainer theme={LightTheme}>
            <AppNavigator user={user} />
          </NavigationContainer>
        )}
        <StatusBar style="dark" />
      </LanguageProvider>
    </ThemeProvider>
  );
}
