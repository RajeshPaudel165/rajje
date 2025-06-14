import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import { lightTheme } from "../../theme/theme"; // Always use light theme
import { globalStyles, CARD_WIDTH } from "../../styles/styles";
import { auth } from "../../services/firebase";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import PasswordReset from "./PasswordReset";
import NetInfo from "@react-native-community/netinfo";
import { FirebaseError } from "firebase/app";
import AlertMessage from "../ui/AlertMessage";

interface LoginFormProps {
  onSubmit: Function;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "info" as "success" | "error" | "warning" | "info",
    buttons: [
      {
        text: "OK",
        onPress: () => {},
        style: "default" as "default" | "cancel" | "destructive",
      },
    ],
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" | "warning" | "info" = "info",
    buttons = [
      {
        text: "OK",
        onPress: () => {},
        style: "default" as "default" | "cancel" | "destructive",
      },
    ]
  ) => {
    setAlertConfig({ title, message, type, buttons });
    setAlertVisible(true);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const getFirebaseErrorMessage = (error: FirebaseError): string => {
    switch (error.code) {
      case "auth/invalid-email":
        return "The email address is not valid.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
      case "auth/user-not-found":
        return "No account found with this email. Please check your email or sign up.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again or reset your password.";
      case "auth/too-many-requests":
        return "Too many failed login attempts. Please try again later or reset your password.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection and try again.";
      case "auth/invalid-login-credentials":
        return "Invalid login credentials. Please check your email and password.";
      case "auth/internal-error":
        return "An internal error occurred. Please try again later.";
      default:
        // Don't show error code or message
        return "Something went wrong. Please try again later.";
    }
  };

  const handleLogin = async () => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      showAlert(
        "Connection Error",
        "No internet connection. Please check your connection and try again.",
        "error"
      );
      return;
    }

    if (validateForm()) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        console.log("Login successful:", userCredential.user);
        if (!userCredential.user.emailVerified) {
          await auth.signOut();
          try {
            await sendEmailVerification(userCredential.user);
            showAlert(
              "Email Verification Required",
              "A verification email has been sent. Please verify your email before logging in.",
              "warning"
            );
          } catch (verificationError) {
            console.error(
              "Error sending verification email:",
              verificationError
            );
            showAlert(
              "Verification Required",
              "Your email is not verified. Please check your inbox for a verification email or request a new one.",
              "warning"
            );
          }
          return;
        }

        onSubmit();
      } catch (error) {
        console.error("Login error:", error);

        if (error instanceof FirebaseError) {
          const errorMessage = getFirebaseErrorMessage(error);

          // Handle specific error cases for the UI
          if (
            error.code === "auth/user-not-found" ||
            error.code === "auth/wrong-password" ||
            error.code === "auth/invalid-login-credentials"
          ) {
            setErrors({
              email: "",
              password: errorMessage,
            });
          } else if (error.code === "auth/invalid-email") {
            setErrors({
              ...errors,
              email: errorMessage,
            });
          } else if (error.code === "auth/too-many-requests") {
            showAlert("Too Many Attempts", errorMessage, "error");
          } else {
            showAlert("Login Failed", errorMessage, "error");
          }
        } else {
          showAlert(
            "Login Failed",
            "An unexpected error occurred. Please try again later.",
            "error"
          );
        }
      }
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[globalStyles.card, styles.card]}>
          <Text style={styles.formTitle}>Sign In</Text>
          <View style={styles.separator} />

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[
                globalStyles.textInput,
                errors.email ? styles.inputError : null,
              ]}
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={lightTheme.colors.subText}
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordInputWrapper}>
              <TextInput
                style={[
                  globalStyles.textInput,
                  errors.password ? styles.inputError : null,
                ]}
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                secureTextEntry={!showPassword}
                placeholderTextColor={lightTheme.colors.subText}
              />
              <TouchableOpacity
                style={styles.visibilityToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.visibilityToggleText}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={() => setShowPasswordReset(true)}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
            <Text style={globalStyles.buttonText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.copyright}>
            © 2025 @kampanlabs. All rights reserved.
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={showPasswordReset}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPasswordReset(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPasswordReset(false)}
            >
              <Text style={styles.closeButtonText}>✕ Close</Text>
            </TouchableOpacity>
          </View>
          <PasswordReset />
        </View>
      </Modal>

      {/* Custom Alert Message */}
      <AlertMessage
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        buttons={alertConfig.buttons}
        onClose={() => setAlertVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 30,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: lightTheme.colors.primary,
    marginBottom: 24,
    textAlign: "center",
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(0, 56, 147, 0.2)",
    marginBottom: 24,
    marginTop: -10,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: lightTheme.colors.text,
  },
  passwordInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  visibilityToggle: {
    position: "absolute",
    right: 16,
  },
  visibilityToggleText: {
    color: lightTheme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginTop: 4,
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: lightTheme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  inputError: {
    borderColor: lightTheme.colors.error,
  },
  errorText: {
    color: lightTheme.colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  copyright: {
    marginTop: 24,
    fontSize: 12,
    color: lightTheme.colors.subText,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 56, 147, 0.2)",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: lightTheme.colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LoginForm;
