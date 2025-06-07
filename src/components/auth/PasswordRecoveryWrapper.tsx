import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { theme } from "../../constants/theme";
import { globalStyles, CARD_WIDTH } from "../../styles/styles";
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const PasswordRecoveryWrapper: React.FC = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    email: "",
  });

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

  const handlePasswordRecovery = async () => {
    if (validateForm()) {
      try {
        await sendPasswordResetEmail(auth, email);
        Alert.alert(
          "Success",
          "Password reset email sent to your email address."
        );
        setEmail(""); // Clear the form
      } catch (error: any) {
        Alert.alert(
          "Error",
          error.message || "Failed to send password reset email"
        );
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
            placeholderTextColor={theme.colors.subText}
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={globalStyles.button}
          onPress={handlePasswordRecovery}
        >
          <Text style={globalStyles.buttonText}>Send Reset Email</Text>
        </TouchableOpacity>

        <Text style={styles.instructionText}>
          Enter your email address and we'll send you a link to reset your
          password.
        </Text>
      </View>
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
    color: theme.colors.primary,
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
    color: theme.colors.text,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  instructionText: {
    marginTop: 16,
    fontSize: 14,
    color: theme.colors.subText,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default PasswordRecoveryWrapper;
