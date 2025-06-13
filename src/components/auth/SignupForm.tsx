import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { lightTheme } from "../../theme"; // Always use light theme
import { globalStyles, CARD_WIDTH } from "../../styles/styles";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import NetInfo from "@react-native-community/netinfo";
import Icon from "react-native-vector-icons/Ionicons";

interface SignupFormProps {
  onSwitchToLogin?: () => void;
}

const cities = ["Kathmandu", "Pokhara", "Bharatpur", "Nepalgunj", "Birgunj"];

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAge = (birthDate: Date) => {
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

  const validateForm = () => {
    const newErrors = {
      name: "",
      dateOfBirth: "",
      email: "",
      password: "",
      confirmPassword: "",
      city: "",
    };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
      isValid = false;
    } else if (!validateAge(dateOfBirth)) {
      newErrors.dateOfBirth = "You must be at least 13 years old";
      isValid = false;
    }

    if (!selectedCity) {
      newErrors.city = "City is required";
      isValid = false;
    }

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
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Function to save user data to Firestore
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

      // Save to Firestore using the user's UID as document ID
      await setDoc(doc(db, "users", user.uid), userData);
      console.log("User data saved to Firestore successfully");

      return userData;
    } catch (error) {
      console.error("Error saving user data to Firestore:", error);
      throw error;
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setDateOfBirth(selectedDate);
      if (errors.dateOfBirth) {
        setErrors({ ...errors, dateOfBirth: "" });
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setShowCityDropdown(false);
    if (errors.city) {
      setErrors({ ...errors, city: "" });
    }
  };

  const handleSignup = async () => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      Alert.alert(
        "Connection Error",
        "No internet connection. Please check your connection and try again."
      );
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update user profile
      await updateProfile(userCredential.user, { displayName: name });

      // Save user data to Firestore
      await saveUserToDatabase(userCredential.user);

      // Send email verification
      await sendEmailVerification(userCredential.user);

      Alert.alert(
        "Account Created Successfully!",
        "Your account has been created and your information has been saved. Please check your email to verify your account before logging in.",
        [{ text: "OK", onPress: onSwitchToLogin }]
      );

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setDateOfBirth(null);
      setSelectedCity("");
    } catch (error: any) {
      console.log("Signup error:", error);
      let message = "Something went wrong while creating your account.";

      if (error.code === "auth/email-already-in-use") {
        message =
          "This email is already registered. Please use a different email or login.";
      } else if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (error.code === "auth/weak-password") {
        message = "Password must be at least 6 characters long.";
      } else if (error.code === "auth/network-request-failed") {
        message =
          "Network error. Please check your internet connection and try again.";
      } else if (error.message?.includes("Firestore")) {
        message =
          "Account created but there was an issue saving your profile. Please contact support.";
      }

      Alert.alert("Signup Failed", message);
    } finally {
      setIsLoading(false);
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

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Date of Birth</Text>
          <TouchableOpacity
            style={[
              styles.datePickerButton,
              errors.dateOfBirth ? styles.inputError : null,
              isLoading ? styles.disabledInput : null,
            ]}
            onPress={() => !isLoading && setShowDatePicker(true)}
            disabled={isLoading}
          >
            <Text
              style={[
                styles.datePickerText,
                !dateOfBirth && styles.placeholderText,
              ]}
            >
              {dateOfBirth
                ? formatDate(dateOfBirth)
                : "Select your date of birth"}
            </Text>
          </TouchableOpacity>
          {errors.dateOfBirth ? (
            <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
          ) : null}

          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth || new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1950, 0, 1)}
            />
          )}

          {Platform.OS === "ios" && showDatePicker && (
            <View style={styles.iosDatePickerActions}>
              <TouchableOpacity
                style={styles.datePickerAction}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.datePickerActionText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>City</Text>
          <TouchableOpacity
            style={[
              styles.dropdownButton,
              errors.city ? styles.inputError : null,
              isLoading ? styles.disabledInput : null,
            ]}
            onPress={() => !isLoading && setShowCityDropdown(true)}
            disabled={isLoading}
          >
            <Text
              style={[
                styles.dropdownText,
                !selectedCity && styles.placeholderText,
              ]}
            >
              {selectedCity || "Select your city"}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
          {errors.city ? (
            <Text style={styles.errorText}>{errors.city}</Text>
          ) : null}
        </View>

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

        <TouchableOpacity
          style={[globalStyles.button, isLoading && styles.disabledButton]}
          onPress={handleSignup}
          disabled={isLoading}
        >
          <Text style={globalStyles.buttonText}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

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

      {/* City Dropdown Modal */}
      <Modal
        visible={showCityDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCityDropdown(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modernModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modernModalTitle}>Select City</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCityDropdown(false)}
                activeOpacity={0.7}
              >
                <Icon
                  name="close"
                  size={20}
                  color={lightTheme.colors.subText}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsContainer}>
              {cities.map((city, index) => (
                <TouchableOpacity
                  key={city}
                  style={[
                    styles.modernModalOption,
                    {
                      backgroundColor:
                        selectedCity === city
                          ? lightTheme.colors.primary + "10"
                          : "transparent",
                      borderColor:
                        selectedCity === city
                          ? lightTheme.colors.primary
                          : "rgba(0, 56, 147, 0.3)",
                    },
                  ]}
                  onPress={() => handleCitySelect(city)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor:
                          selectedCity === city
                            ? lightTheme.colors.primary
                            : "#f5f5f5",
                      },
                    ]}
                  >
                    <Icon
                      name="location"
                      size={22}
                      color={
                        selectedCity === city
                          ? "#FFFFFF"
                          : lightTheme.colors.primary
                      }
                    />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text
                      style={[
                        styles.modernModalOptionText,
                        {
                          color:
                            selectedCity === city
                              ? lightTheme.colors.primary
                              : lightTheme.colors.text,
                          fontWeight: selectedCity === city ? "600" : "500",
                        },
                      ]}
                    >
                      {city}
                    </Text>
                    <Text style={styles.citySubtext}>City in Nepal</Text>
                  </View>
                  {selectedCity === city && (
                    <View style={styles.checkmarkContainer}>
                      <Icon
                        name="checkmark-circle"
                        size={24}
                        color={lightTheme.colors.primary}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
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
  datePickerButton: {
    borderWidth: 1,
    borderColor: "rgba(0, 56, 147, 0.3)",
    borderRadius: lightTheme.borderRadius.small,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    minHeight: 48,
    justifyContent: "center",
  },
  datePickerText: {
    fontSize: 16,
    color: lightTheme.colors.text,
  },
  placeholderText: {
    color: lightTheme.colors.subText,
  },
  iosDatePickerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 8,
  },
  datePickerAction: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  datePickerActionText: {
    color: lightTheme.colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  // City Dropdown Styles
  dropdownButton: {
    borderWidth: 1,
    borderColor: "rgba(0, 56, 147, 0.3)",
    borderRadius: lightTheme.borderRadius.small,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    minHeight: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: lightTheme.colors.text,
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: lightTheme.colors.subText,
  },
  // Modern City Dropdown Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modernModalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 56, 147, 0.1)",
  },
  modernModalTitle: {
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
    color: lightTheme.colors.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  optionsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
  },
  modernModalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: "transparent",
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  modernModalOptionText: {
    fontSize: 17,
    lineHeight: 22,
    color: lightTheme.colors.text,
    fontWeight: "500",
  },
  citySubtext: {
    fontSize: 14,
    marginTop: 2,
    opacity: 0.7,
    color: lightTheme.colors.subText,
  },
  checkmarkContainer: {
    marginLeft: 12,
  },
  // Old City Dropdown Styles (can be removed after testing)
  dropdownModal: {
    backgroundColor: "white",
    borderRadius: lightTheme.borderRadius.medium,
    width: "80%",
    maxHeight: "60%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 56, 147, 0.2)",
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: lightTheme.colors.primary,
  },
  buttonClose: {
    fontSize: 18,
    color: lightTheme.colors.subText,
    fontWeight: "600",
  },
  dropdownList: {
    maxHeight: 250,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 56, 147, 0.1)",
  },
  dropdownItemText: {
    fontSize: 16,
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
