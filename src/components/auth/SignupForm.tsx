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
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import NetInfo from "@react-native-community/netinfo";
import { FirebaseError } from "firebase/app";
import AlertMessage from "../ui/AlertMessage";
import DatePicker from "../ui/DatePicker";
import CityPicker from "../ui/CityPicker";

interface SignupFormProps {
  onSwitchToLogin?: () => void;
}

// Cities list for Nepal
const cities = ["Kathmandu", "Pokhara", "Bharatpur", "Nepalgunj", "Birgunj"];

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  // Form fields state
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Alert state
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

  // Form validation state
  const [errors, setErrors] = useState({
    name: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
  });

  /**
   * Shows a custom alert dialog
   */
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

  /**
   * Form validation utilities
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAge = (birthDate: Date): boolean => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1 >= 13;
    }
    return age >= 13;
  };

  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
      dateOfBirth: "",
      email: "",
      password: "",
      confirmPassword: "",
      city: "",
    };
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // Validate date of birth
    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
      isValid = false;
    } else if (!validateAge(dateOfBirth)) {
      newErrors.dateOfBirth = "You must be at least 13 years old";
      isValid = false;
    }

    // Validate city
    if (!selectedCity) {
      newErrors.city = "City is required";
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Database and auth helpers
   */
  const saveUserToDatabase = async (user: any) => {
    try {
      const userData = {
        uid: user.uid,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        dateOfBirth: dateOfBirth?.toISOString() || null,
        city: selectedCity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        emailVerified: false,
        profile: {
          displayName: name.trim(),
          photoURL: null,
        },
        settings: {
          notifications: true,
          privacy: "public",
        },
        isActive: true,
      };

      await setDoc(doc(db, "users", user.uid), userData);
      console.log("User data saved to Firestore successfully");
      return userData;
    } catch (error) {
      console.error("Error saving user data to Firestore:", error);
      throw error;
    }
  };

  /**
   * UI event handlers
   */
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (selectedDate) {
      setDateOfBirth(selectedDate);
      if (errors.dateOfBirth) {
        setErrors({ ...errors, dateOfBirth: "" });
      }
    }
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setShowCityDropdown(false);
    if (errors.city) {
      setErrors({ ...errors, city: "" });
    }
  };

  /**
   * Main form submission handler
   */
  const handleSignup = async () => {
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

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Update user profile
      await updateProfile(userCredential.user, { displayName: name.trim() });

      // Save user data to Firestore
      await saveUserToDatabase(userCredential.user);

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Show success message
      showAlert(
        "Account Created Successfully!",
        "Your account has been created and your information has been saved. Please check your email to verify your account before logging in.",
        "success",
        [
          {
            text: "OK",
            onPress: () => {
              if (onSwitchToLogin) onSwitchToLogin();
            },
            style: "default",
          },
        ]
      );

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setDateOfBirth(null);
      setSelectedCity("");
    } catch (error) {
      console.error("Signup error:", error);

      if (error instanceof FirebaseError) {
        const errorMessage = getFirebaseErrorMessage(error);

        // Handle specific error cases for the UI
        if (error.code === "auth/email-already-in-use") {
          setErrors({ ...errors, email: "This email is already registered" });
        } else if (error.code === "auth/weak-password") {
          setErrors({ ...errors, password: "Password is too weak" });
        } else if (error.code === "auth/invalid-email") {
          setErrors({ ...errors, email: "Invalid email format" });
        } else {
          showAlert("Signup Failed", errorMessage, "error");
        }
      } else {
        showAlert(
          "Signup Failed",
          "An unexpected error occurred. Please try again later.",
          "error"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get a user-friendly error message for Firebase authentication errors
   */
  const getFirebaseErrorMessage = (error: FirebaseError): string => {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "This email is already registered. Please use a different email or login.";
      case "auth/invalid-email":
        return "The email address is not valid.";
      case "auth/operation-not-allowed":
        return "Email/password accounts are not enabled. Please contact support.";
      case "auth/weak-password":
        return "The password is too weak. Please use a stronger password with at least 6 characters.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection and try again.";
      case "auth/too-many-requests":
        return "Too many requests. Please try again later.";
      case "auth/internal-error":
        return "An internal error occurred. Please try again later.";
      default:
        // Don't show error code or message
        return "Something went wrong. Please try again later.";
    }
  };
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[globalStyles.card, styles.card]}>
        <Text style={styles.formTitle}>Sign Up</Text>
        <View style={styles.separator} />

        {/* Full Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={[
              globalStyles.textInput,
              errors.name ? styles.inputError : null,
            ]}
            placeholder="Enter your full name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors({ ...errors, name: "" });
            }}
            autoCapitalize="words"
            placeholderTextColor={lightTheme.colors.subText}
            editable={!isLoading}
          />
          {errors.name ? (
            <Text style={styles.errorText}>{errors.name}</Text>
          ) : null}
        </View>

        {/* Date of Birth Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Date of Birth</Text>
          <DatePicker
            value={dateOfBirth}
            label=""
            showPicker={showDatePicker}
            onTogglePicker={() => setShowDatePicker(!showDatePicker)}
            onDateChange={handleDateChange}
            error={errors.dateOfBirth}
            placeholder="Select your date of birth"
            maximumDate={new Date()}
            minimumDate={new Date(1950, 0, 1)}
          />
        </View>

        {/* City Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>City</Text>
          <CityPicker
            label=""
            selectedCity={selectedCity}
            showModal={showCityDropdown}
            cities={cities}
            onToggleModal={() =>
              !isLoading && setShowCityDropdown(!showCityDropdown)
            }
            onSelectCity={handleCitySelect}
            error={errors.city}
            placeholder="Select your city"
          />
        </View>

        {/* Email Input */}
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
            editable={!isLoading}
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordInputWrapper}>
            <TextInput
              style={[
                globalStyles.textInput,
                errors.password ? styles.inputError : null,
              ]}
              placeholder="Create a password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              secureTextEntry={!showPassword}
              placeholderTextColor={lightTheme.colors.subText}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.visibilityToggle}
              onPress={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.visibilityToggleText,
                  isLoading && styles.disabledText,
                ]}
              >
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <TextInput
            style={[
              globalStyles.textInput,
              errors.confirmPassword ? styles.inputError : null,
            ]}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword)
                setErrors({ ...errors, confirmPassword: "" });
            }}
            secureTextEntry={!showPassword}
            placeholderTextColor={lightTheme.colors.subText}
            editable={!isLoading}
          />
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          style={[globalStyles.button, isLoading && styles.disabledButton]}
          onPress={handleSignup}
          disabled={isLoading}
        >
          <Text style={globalStyles.buttonText}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        {/* Login Prompt */}
        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>Already have an account?</Text>
          <TouchableOpacity onPress={onSwitchToLogin} disabled={isLoading}>
            <Text style={[styles.loginLink, isLoading && styles.disabledText]}>
              Login
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.copyright}>
          © 2025 @kampanlabs. All rights reserved.
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
  inputError: {
    borderColor: lightTheme.colors.error,
  },
  errorText: {
    color: lightTheme.colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  loginPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  loginPromptText: {
    color: lightTheme.colors.subText,
    fontSize: 14,
  },
  loginLink: {
    color: lightTheme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  copyright: {
    marginTop: 24,
    fontSize: 12,
    color: lightTheme.colors.subText,
    textAlign: "center",
  },
  // Loading states
  disabledInput: {
    backgroundColor: "#f5f5f5",
    opacity: 0.7,
  },
  disabledButton: {
    opacity: 0.7,
  },
  disabledText: {
    opacity: 0.5,
  },
});

export default SignupForm;
