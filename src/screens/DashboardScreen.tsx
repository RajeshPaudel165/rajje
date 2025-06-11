import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { theme } from "../theme";
import VehicleIcon from "../components/common/VehicleIcon";
import ThemeBackground from "../components/common/ThemeBackground";
import { useCurrentLocation } from "../hooks/location";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

const { width, height } = Dimensions.get("window");

const DashboardScreen: React.FC = () => {
  const { location, errorMsg } = useCurrentLocation();
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <ThemeBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <VehicleIcon
              width={theme.logoDashboard.width}
              height={theme.logoDashboard.height}
              color={colors.primary}
            />
          </View>
        </View>

        <View style={styles.coordinatesContainer}>
          {location ? (
            <View
              style={[
                styles.coordinatesCard,
                { backgroundColor: "rgba(255, 255, 255, 0.9)" },
              ]}
            >
              <Text
                style={[styles.coordinatesTitle, { color: colors.primary }]}
              >
                {t("currentLocation")}
              </Text>
              <View style={styles.coordinateRow}>
                <Text style={[styles.coordinateLabel, { color: colors.text }]}>
                  {t("latitude")}:
                </Text>
                <Text
                  style={[
                    styles.coordinateValue,
                    { color: colors.textSecondary },
                  ]}
                >
                  {location.coords.latitude.toFixed(6)}
                </Text>
              </View>
              <View style={styles.coordinateRow}>
                <Text style={[styles.coordinateLabel, { color: colors.text }]}>
                  {t("longitude")}:
                </Text>
                <Text
                  style={[
                    styles.coordinateValue,
                    { color: colors.textSecondary },
                  ]}
                >
                  {location.coords.longitude.toFixed(6)}
                </Text>
              </View>
              <View style={styles.coordinateRow}>
                <Text style={[styles.coordinateLabel, { color: colors.text }]}>
                  {t("accuracy")}:
                </Text>
                <Text
                  style={[
                    styles.coordinateValue,
                    { color: colors.textSecondary },
                  ]}
                >
                  ±{location.coords.accuracy?.toFixed(1)}m
                </Text>
              </View>
              {location.coords.altitude && (
                <View style={styles.coordinateRow}>
                  <Text
                    style={[styles.coordinateLabel, { color: colors.text }]}
                  >
                    {t("altitude")}:
                  </Text>
                  <Text
                    style={[
                      styles.coordinateValue,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {location.coords.altitude.toFixed(1)}m
                  </Text>
                </View>
              )}
            </View>
          ) : errorMsg ? (
            <View
              style={[
                styles.errorCard,
                { backgroundColor: "rgba(255, 255, 255, 0.9)" },
              ]}
            >
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errorMsg}
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.loadingCard,
                { backgroundColor: "rgba(255, 255, 255, 0.9)" },
              ]}
            >
              <Text style={[styles.loadingText, { color: colors.text }]}>
                {t("fetchingLocation")}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ThemeBackground>
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
  coordinatesContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  coordinatesCard: {
    width: "100%",
    maxWidth: 350,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  coordinatesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  coordinateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  coordinateLabel: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  coordinateValue: {
    fontSize: 16,
    fontFamily: "monospace",
    textAlign: "right",
  },
  errorCard: {
    width: "100%",
    maxWidth: 350,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
  loadingCard: {
    width: "100%",
    maxWidth: 350,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default DashboardScreen;
