import { StyleSheet, Dimensions } from "react-native";
import { lightTheme } from "../theme/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
export const CARD_WIDTH = Math.min(SCREEN_WIDTH - 32, 380);

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 15,
    paddingTop: 0,
    width: "100%",
    backgroundColor: "transparent",
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: lightTheme.borderRadius.large,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  textInput: {
    width: "100%",
    height: 48,
    backgroundColor: "#f8f9fa",
    borderRadius: lightTheme.borderRadius.medium,
    paddingHorizontal: 16,
    fontSize: 16,
    color: lightTheme.colors.text,
    borderWidth: 1,
    borderColor: "#e1e4e8",
  },
  button: {
    width: "100%",
    height: 48,
    backgroundColor: lightTheme.colors.primary,
    borderRadius: lightTheme.borderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 16,
  },
  headerContainer: {
    width: "100%",
    height: 150, // Increased from 120 to give more space
    marginTop: 50, // Already has a good top margin
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  gradient: {
    flex: 1,
    width: "100%",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40, // Increased from 30 to push the logo down more
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
