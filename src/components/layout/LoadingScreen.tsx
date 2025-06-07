import React, { useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Text,
  Dimensions,
  Easing,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import VehicleIcon from "../common/VehicleIcon";
import Background from "../common/Background";
import { theme } from "../../constants/theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const COPYRIGHT = "© 2025 @kompanlabs. All rights reserved.";

const LoadingScreen = () => {
  const vehicleBounce = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const cloudAnim1 = useRef(new Animated.Value(-100)).current;
  const cloudAnim2 = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(vehicleBounce, {
          toValue: -15,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(vehicleBounce, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(vehicleBounce, {
          toValue: -8,
          duration: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(vehicleBounce, {
          toValue: 0,
          duration: 150,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // clouds
    Animated.loop(
      Animated.timing(cloudAnim1, {
        toValue: SCREEN_WIDTH + 100,
        duration: 12000,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(cloudAnim2, {
        toValue: SCREEN_WIDTH + 120,
        duration: 15000,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const Cloud = ({ style }: { style: any }) => (
    <Animated.View style={[styles.cloud, style]}>
      <Svg width="80" height="40" viewBox="0 0 80 40">
        <Path
          d="M10 25 Q10 15 20 15 Q25 10 35 15 Q45 10 55 15 Q65 15 65 25 Q65 30 60 30 L15 30 Q10 30 10 25 Z"
          fill="white"
          opacity={0.8}
        />
      </Svg>
    </Animated.View>
  );

  return (
    <Background>
      <Cloud style={{ transform: [{ translateX: cloudAnim1 }], top: "20%" }} />
      <Cloud style={{ transform: [{ translateX: cloudAnim2 }], top: "15%" }} />

      <Animated.View
        style={[
          styles.vehicleContainer,
          {
            transform: [{ translateY: vehicleBounce }, { scale: scaleAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <VehicleIcon
          width={theme.logo.width}
          height={theme.logo.height}
          color={theme.colors.primary}
        />
      </Animated.View>

      <Animated.View style={[styles.titleContainer, { opacity: fadeAnim }]}>
        <Text style={styles.appTitle}>सवारी</Text>
        <Text style={styles.appSubtitle}>तपाईंको यात्रा, तपाईंको तरिका</Text>
      </Animated.View>

      <Animated.View style={[styles.copyrightContainer, { opacity: fadeAnim }]}>
        <Text style={styles.copyright}>{COPYRIGHT}</Text>
      </Animated.View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },

  vehicleContainer: {
    position: "absolute",
    top: "50%", // Change from 45% to 40%
    width: "100%", // Add this line
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  cloud: { position: "absolute" },

  titleContainer: {
    position: "absolute",
    top: "30%",
    alignItems: "center",
    width: "100%",
  },
  appTitle: {
    fontSize: 42, // Increased size for better visibility
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 12, // Increased spacing
    textShadowColor: "rgba(255,255,255,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign: "center",
  },
  appSubtitle: {
    fontSize: 18, // Increased from 16 for better readability
    color: theme.colors.text,
    fontStyle: "italic",
    textShadowColor: "rgba(255,255,255,0.6)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
    textAlign: "center",
    paddingHorizontal: 20, // Add padding to prevent text cutoff on smaller screens
  },

  copyrightContainer: {
    position: "absolute",
    bottom: 40, // Increased from 30 for better spacing
    alignItems: "center",
    width: "100%", // Ensure full width for proper centering
  },
  copyright: {
    textAlign: "center",
    color: theme.colors.subText,
    fontSize: 12,
    paddingHorizontal: 20, // Add padding for smaller screens
  },
});

export default LoadingScreen;
