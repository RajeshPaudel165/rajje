import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../../theme/theme";

interface AuthToggleProps {
  isSignup: boolean;
  onToggle: (isSignup: boolean) => void;
}

const AuthToggle: React.FC<AuthToggleProps> = ({ isSignup, onToggle }) => {
  return (
    <View style={styles.formToggleContainer}>
      <TouchableOpacity
        style={[styles.toggleTab, !isSignup && styles.activeToggleTab]}
        onPress={() => onToggle(false)}
      >
        <Text
          style={[
            styles.toggleTabText,
            !isSignup && styles.activeToggleTabText,
          ]}
        >
          {"signin"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toggleTab, isSignup && styles.activeToggleTab]}
        onPress={() => onToggle(true)}
      >
        <Text
          style={[styles.toggleTabText, isSignup && styles.activeToggleTabText]}
        >
          {"signup"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formToggleContainer: {
    flexDirection: "row",
    marginTop: -45,
    borderRadius: theme.borderRadius.medium,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignSelf: "center",
    width: 240,
  },
  toggleTab: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: theme.colors.cardBg,
    flex: 1,
    alignItems: "center",
  },
  activeToggleTab: {
    backgroundColor: theme.colors.primary,
  },
  toggleTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  activeToggleTabText: {
    color: "white",
  },
});

export default AuthToggle;
