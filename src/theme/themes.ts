import { DefaultTheme, Theme as NavTheme } from "@react-navigation/native";

export const LightTheme: NavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFFFFF",
    text: "#111111",
    primary: "#1E90FF",
    card: "#F8F9FA",
    border: "#E0E0E0",
    notification: "#FF3B30",
  },
};
