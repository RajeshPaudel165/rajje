import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { LoadingScreen } from "./components";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading process
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}
