import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { theme } from "../constants/theme";
import { globalStyles } from "../styles/styles";
import VehicleIcon from "../components/common/VehicleIcon";
import Background from "../components/common/Background";

const ProfileScreen: React.FC = () => {
  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <VehicleIcon
              width={theme.logoDashboard.width}
              height={theme.logoDashboard.height}
              color={theme.colors.primary}
            />
          </View>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.profileSection}>
            <Text style={styles.title}>User Profile</Text>
            <Text style={styles.subtitle}>
              This screen will show user profile information and settings.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    paddingTop: 22,
  },
  logoContainer: {
    transform: [{ scale: 1.05 }],
    marginLeft: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 6,
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: theme.borderRadius.medium,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
  },
});

export default ProfileScreen;
