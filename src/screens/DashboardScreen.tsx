import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { theme } from "../constants/theme";
import VehicleIcon from "../components/common/VehicleIcon";
import Background from "../components/common/Background";
import { useCurrentLocation } from "../hooks/location";

const DashboardScreen: React.FC = () => {
  const { location, errorMsg } = useCurrentLocation();

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
          <View style={styles.locationContainer}>
            {errorMsg ? (
              <Text style={styles.errorText}>{errorMsg}</Text>
            ) : location ? (
              <>
                <Text style={styles.label}>Your Location:</Text>
                <Text style={styles.locationText}>
                  Latitude: {location.coords.latitude}
                </Text>
                <Text style={styles.locationText}>
                  Longitude: {location.coords.longitude}
                </Text>
              </>
            ) : (
              <Text style={styles.label}>Getting location...</Text>
            )}
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
    position: "relative",
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 80,
  },
  locationContainer: {
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: theme.colors.primary,
  },
  locationText: {
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default DashboardScreen;