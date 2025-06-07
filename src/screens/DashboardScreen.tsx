import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { theme } from "../constants/theme";
import VehicleIcon from "../components/common/VehicleIcon";
import Background from "../components/common/Background";
import Icon from "react-native-vector-icons/Ionicons";
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
          <View style={styles.mapContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/350x200?text=Map" }}
              style={styles.mapImage}
              resizeMode="cover"
            />
            <View style={styles.mapOverlay}>
              <TouchableOpacity style={styles.searchBar}>
                <Icon name="search" size={18} color="#666666" />
                <Text style={styles.searchText}>From?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.searchBar}>
                <Icon name="search" size={18} color="#666666" />
                <Text style={styles.searchText}>Where To?</Text>
              </TouchableOpacity>
            </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 6,
    color: theme.colors.primary,
    fontFamily: "System-Bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 80,
  },
  mapContainer: {
    borderRadius: theme.borderRadius.medium,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
  },
  mapImage: {
    width: "100%",
    height: 200,
  },
  mapOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  searchBar: {
    marginBottom: 12,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: theme.borderRadius.medium,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchText: {
    marginLeft: 8,
    color: "#666666",
    fontSize: 16,
  },
});

export default DashboardScreen;
