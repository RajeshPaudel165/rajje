import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { theme } from "../constants/theme";
import VehicleIcon from "../components/common/VehicleIcon";
import Background from "../components/common/Background"; // Uncomment this
import { useCurrentLocation } from "../hooks/location";
// import MapboxGL from "@rnmapbox/maps";

// MapboxGL.setAccessToken(process.env.MAPBOX_ACCESS_TOKEN);

const { width, height } = Dimensions.get("window");

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
              color="#003893"
            />
          </View>
        </View>
        <Text style={styles.sectionTitle}>Dashboard Screen</Text>
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#003893",
  },
  mapContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  map: {
    width: width - 32,
    height: height * 0.6,
    borderRadius: 12,
    overflow: "hidden",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#FFFFFF", // Keep white
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  errorText: {
    color: "#FFE6E6", // Light red for better contrast on gradient
    fontSize: 16,
  },
});

export default DashboardScreen;
