import { useRef } from "react";
import { Animated, Dimensions } from "react-native";

export const useLoginAnimation = () => {
  const logoPosition = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoPositionY = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const animateLoginSuccess = (onComplete: () => void) => {
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(logoPositionY, {
        toValue: windowHeight / 2 - 85,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(logoPosition, {
        toValue: -(windowWidth / 2 + 100),
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(onComplete, 500);
    });
  };

  return {
    logoPosition,
    logoScale,
    logoPositionY,
    animateLoginSuccess,
  };
};
