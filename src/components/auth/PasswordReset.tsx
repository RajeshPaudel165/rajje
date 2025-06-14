import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { lightTheme } from "../../theme";
import { globalStyles, CARD_WIDTH } from "../../styles/styles";
import { auth } from "../../firebase";
import {
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import NetInfo from "@react-native-community/netinfo";
import AlertMessage from "../ui/AlertMessage";

/**
 * Get a user-friendly error message for Firebase password reset errors
 */
const getFirebaseErrorMessage = (error: FirebaseError): string => {
  switch (error.code) {
    case "auth/invalid-email":
      return "The email address is not valid.";
    case "auth/user-not-found":
      return "No account found with this email. Please check your email or sign up.";
    case "auth/too-many-requests":
      return "Too many password reset attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    case "auth/missing-android-pkg-name":
    case "auth/missing-ios-bundle-id":
    case "auth/missing-continue-uri":
      return "An internal configuration error occurred. Please contact support.";
    default:
      // Don't show error code or message
      return "Something went wrong. Please try again later.";
  }
};

const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    email: "",
  });
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
    };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePasswordReset = async () => {
    // Check network connectivity
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
        // First check if the email exists in the authentication system
        const methods = await fetchSignInMethodsForEmail(auth, email.trim());

        if (methods.length === 0) {
          // No account exists with this email
          showAlert(
            "Account Not Found",
            "No account found with this email address. Please check your email or sign up.",
            "warning"
          );
          return;
        }

        // If the email exists, send the password reset email
        await sendPasswordResetEmail(auth, email.trim());
        showAlert(
          "Password Reset Email Sent",
          "Check your email for instructions to reset your password.",
          "success"
        );
        setEmail(""); // Clear the form
      } catch (error) {
        console.error("Password reset error:", error);

        if (error instanceof FirebaseError) {
          const errorMessage = getFirebaseErrorMessage(error);
          showAlert("Password Reset Failed", errorMessage, "error");
        } else {
          showAlert(
            "Password Reset Failed",
            "An unexpected error occurred. Please try again later.",
            "error"
          );
        }
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={[globalStyles.card, styles.card]}>
        <Text style={styles.formTitle}>Reset Password</Text>
        <View style={styles.separator} />

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={[
              globalStyles.textInput,
              errors.email ? styles.inputError : null,
            ]}
            placeholder="Enter your email address"
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

        <TouchableOpacity
          style={globalStyles.button}
          onPress={handlePasswordReset}
        >
          <Text style={globalStyles.buttonText}>Send Reset Email</Text>
        </TouchableOpacity>

        <Text style={styles.instructionText}>
          Enter your email address and we'll send you a link to reset your
          password.
        </Text>
      </View>

      {/* Custom Alert Message */}
      <AlertMessage
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        buttons={alertConfig.buttons}
        onClose={() => setAlertVisible(false)}
      />
    </ScrollView>
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
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: lightTheme.colors.text,
  },
  inputError: {
    borderColor: lightTheme.colors.error,
  },
  errorText: {
    color: lightTheme.colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  instructionText: {
    marginTop: 16,
    fontSize: 14,
    color: lightTheme.colors.subText,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default PasswordReset;
