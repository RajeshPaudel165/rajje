import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { theme } from "../../constants/theme";
import { globalStyles, CARD_WIDTH } from "../../styles/styles";
import { auth } from "../../firebase";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import PasswordRecoveryWrapper from "./PasswordRecoveryWrapper";

interface FormProps {
  onSubmit: Function;
}

const Form: React.FC<FormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

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

  const handlePasswordRecovery = () => {
    setShowPasswordRecovery(true);
  };

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("Login successful:", userCredential.user);
        if (!userCredential.user.emailVerified) {
          await auth.signOut();
          sendEmailVerification(userCredential.user);
          Alert.alert(
            "Email Verification",
            "Please verify your email before logging in."
          );
          return;
        }
        onSubmit();
      } catch (error) {
        console.log("Login error:", error);
        Alert.alert(
          "Login Failed",
          "Please check your credentials and try again."
        );
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
              placeholderTextColor={theme.colors.subText}
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
                placeholderTextColor={theme.colors.subText}
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
            onPress={handlePasswordRecovery}
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
        visible={showPasswordRecovery}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPasswordRecovery(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPasswordRecovery(false)}
            >
              <Text style={styles.closeButtonText}>✕ Close</Text>
            </TouchableOpacity>
          </View>
          <PasswordRecoveryWrapper />
        </View>
      </Modal>
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
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: theme.colors.text,
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
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginTop: 4,
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  copyright: {
    marginTop: 24,
    fontSize: 12,
    color: theme.colors.subText,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Form;
