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
import { theme } from "../../constants/theme";
import { globalStyles, CARD_WIDTH } from "../../styles/styles";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../firebase";

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
    if (validateForm()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userCredential.user, { displayName: name });
        await sendEmailVerification(userCredential.user);

        Alert.alert(
          "Verify Your Email",
          "Account created successfully! Please check your email to verify your account before logging in.",
          [{ text: "OK", onPress: onSwitchToLogin }]
        );
      } catch (error: any) {
        console.log("Signup error:", error);
        let message = "Something went wrong";
        if (error.code === "auth/email-already-in-use") {
          message = "This email is already in use.";
        } else if (error.code === "auth/invalid-email") {
          message = "Please enter a valid email address.";
        } else if (error.code === "auth/weak-password") {
          message = "Password must be at least 6 characters long.";
        }
        Alert.alert("Signup Failed", message);
      }
    }
  };

  const renderCityItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleCitySelect(item)}
    >
      <Text style={styles.dropdownItemText}>{item}</Text>
    </TouchableOpacity>
  );

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
            placeholderTextColor={theme.colors.subText}
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
            ]}
            onPress={() => setShowDatePicker(true)}
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
            ]}
            onPress={() => setShowCityDropdown(true)}
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
              placeholder="Create a password"
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
            placeholderTextColor={theme.colors.subText}
          />
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}
        </View>

        <TouchableOpacity style={globalStyles.button} onPress={handleSignup}>
          <Text style={globalStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>Already have an account?</Text>
          <TouchableOpacity onPress={onSwitchToLogin}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.copyright}>
          © 2025 @kompanlabs. All rights reserved.
        </Text>
      </View>

      {/* City Dropdown Modal */}
      <Modal
        visible={showCityDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCityDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCityDropdown(false)}
        >
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Select City</Text>
              <TouchableOpacity onPress={() => setShowCityDropdown(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={cities}
              renderItem={renderCityItem}
              keyExtractor={(item) => item}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
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
  datePickerButton: {
    borderWidth: 1,
    borderColor: "rgba(0, 56, 147, 0.3)",
    borderRadius: theme.borderRadius.small,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    minHeight: 48,
    justifyContent: "center",
  },
  datePickerText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  placeholderText: {
    color: theme.colors.subText,
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
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  // City Dropdown Styles
  dropdownButton: {
    borderWidth: 1,
    borderColor: "rgba(0, 56, 147, 0.3)",
    borderRadius: theme.borderRadius.small,
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
    color: theme.colors.text,
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: theme.colors.subText,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownModal: {
    backgroundColor: "white",
    borderRadius: theme.borderRadius.medium,
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
    color: theme.colors.primary,
  },
  closeButton: {
    fontSize: 18,
    color: theme.colors.subText,
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
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
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
    color: theme.colors.subText,
    fontSize: 14,
  },
  loginLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  copyright: {
    marginTop: 24,
    fontSize: 12,
    color: theme.colors.subText,
    textAlign: "center",
  },
});

export default SignupForm;
