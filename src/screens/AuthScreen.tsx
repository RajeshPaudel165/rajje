import React, { useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import VehicleIcon from "../components/common/VehicleIcon";
import AuthToggle from "../components/auth/AuthToggle";
import StaticLightBackground from "../components/common/StaticLightBackground";
import { useLoginAnimation } from "../hooks/useLoginAnimation";
import { globalStyles } from "../styles/styles";
import { lightTheme } from "../theme"; // Always use light theme
import { useLanguage } from "../contexts/LanguageContext";

const AuthScreen: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const navigation = useNavigation();
  const { t } = useLanguage();

  const { logoPosition, logoScale, logoPositionY, animateLoginSuccess } =
    useLoginAnimation();

  const handleLogin = () => {
    setShowForm(false);
    animateLoginSuccess(() => {
      navigation.navigate("MainApp" as never);
    });
  };

  const handleAuthToggle = (signup: boolean) => {
    setIsSignup(signup);
  };

  return (
    <StaticLightBackground>
      <View style={styles.header}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [
                { translateY: logoPositionY },
                { translateX: logoPosition },
                { scale: logoScale },
              ],
            },
          ]}
        >
          <VehicleIcon
            width={lightTheme.logoForm.width}
            height={lightTheme.logoForm.height}
            color={lightTheme.colors.primary}
          />
        </Animated.View>
      </View>

      {showForm && (
        <>
          <AuthToggle isSignup={isSignup} onToggle={handleAuthToggle} />

          <View style={globalStyles.container}>
            {isSignup ? (
              <SignupForm onSwitchToLogin={() => setIsSignup(false)} />
            ) : (
              <LoginForm onSubmit={handleLogin} />
            )}
          </View>
        </>
      )}
    </StaticLightBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 150,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginTop: 10,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AuthScreen;
