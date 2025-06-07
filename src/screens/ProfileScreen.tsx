import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { theme } from "../constants/theme";
import { globalStyles } from "../styles/styles";
import VehicleIcon from "../components/common/VehicleIcon";
import Background from "../components/common/Background";
import { auth } from "../firebase";
import { signOut, User, updateProfile, reload } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const cities = ["Kathmandu", "Pokhara", "Bharatpur", "Nepalgunj", "Birgunj"];

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState({
    dateOfBirth: null as Date | null,
    address: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key for forced updates
  const navigation = useNavigation();

  useEffect(() => {
    // Get current user when component mounts
    const currentUser = auth.currentUser;
    setUser(currentUser);

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Load additional user profile data
    loadUserProfile();

    return () => unsubscribe();
  }, []);

  const loadUserProfile = () => {
    // This would typically load from a database
    // For now, using placeholder data
    setUserProfile({
      dateOfBirth: new Date(1995, 5, 15), // Placeholder date
      address: "Kathmandu", // Placeholder address
    });
  };

  const calculateAge = (birthDate: Date | null) => {
    if (!birthDate) return "Not set";

    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return `${age} years`;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Not set";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            navigation.navigate("Auth" as never);
          } catch (error) {
            console.error("Sign out error:", error);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Choose what you want to edit:", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Edit Name",
        onPress: () => editName(),
      },
      {
        text: "Edit Date of Birth",
        onPress: () => editDateOfBirth(),
      },
      {
        text: "Edit Address",
        onPress: () => editAddress(),
      },
    ]);
  };

  const editName = () => {
    Alert.prompt(
      "Edit Name",
      "Enter your new name:",
      async (newName) => {
        if (newName && newName.trim()) {
          try {
            if (user) {
              // Update Firebase Auth profile
              await updateProfile(user, { displayName: newName.trim() });

              // Method 1: Force state update with new object
              setUser((prevUser) => ({
                ...prevUser!,
                displayName: newName.trim(),
              }));

              // Force refresh
              setRefreshKey((prev) => prev + 1);

              Alert.alert("Success", "Name updated successfully!");
            }
          } catch (error) {
            console.error("Error updating name:", error);
            Alert.alert("Error", "Failed to update name. Please try again.");
          }
        }
      },
      "plain-text",
      user?.displayName || ""
    );
  };

  const editDateOfBirth = () => {
    setShowDatePicker(true);
  };

  const editAddress = () => {
    setShowCityDropdown(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      // Update userProfile state with new date
      setUserProfile((prev) => ({
        ...prev,
        dateOfBirth: selectedDate,
      }));

      // Force refresh to update age calculation
      setRefreshKey((prev) => prev + 1);

      Alert.alert("Success", "Date of birth updated successfully!");
    }
  };

  const handleCitySelect = (city: string) => {
    // Update userProfile state with new city
    setUserProfile((prev) => ({
      ...prev,
      address: city,
    }));

    // Close dropdown
    setShowCityDropdown(false);

    // Force refresh
    setRefreshKey((prev) => prev + 1);

    Alert.alert("Success", `Address updated to ${city} successfully!`);
  };

  const renderCityItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleCitySelect(item)}
    >
      <Text style={styles.dropdownItemText}>{item}</Text>
      {userProfile.address === item && (
        <Text style={styles.selectedIndicator}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Background>
      <View style={styles.container} key={refreshKey}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <VehicleIcon
              width={theme.logoDashboard.width}
              height={theme.logoDashboard.height}
              color={theme.colors.primary}
            />
          </View>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.profileSection}>
            <Text style={styles.title}>User Profile</Text>

            {user ? (
              <View style={styles.userInfoContainer}>
                <View style={styles.userInfo}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>
                    {user.displayName || "Not set"}
                  </Text>
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.value}>{user.email}</Text>
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.label}>Date of Birth:</Text>
                  <Text style={styles.value} key={`dob-${refreshKey}`}>
                    {formatDate(userProfile.dateOfBirth)}
                  </Text>
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.label}>Age:</Text>
                  <Text style={styles.value} key={`age-${refreshKey}`}>
                    {calculateAge(userProfile.dateOfBirth)}
                  </Text>
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.label}>Address:</Text>
                  <Text style={styles.value} key={`address-${refreshKey}`}>
                    {userProfile.address || "Not set"}
                  </Text>
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.label}>Email Verified:</Text>
                  <Text
                    style={[
                      styles.value,
                      user.emailVerified ? styles.verified : styles.unverified,
                    ]}
                  >
                    {user.emailVerified ? "✓ Verified" : "✗ Not Verified"}
                  </Text>
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.label}>Member Since:</Text>
                  <Text style={styles.value}>
                    {user.metadata.creationTime
                      ? new Date(
                          user.metadata.creationTime
                        ).toLocaleDateString()
                      : "Unknown"}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.subtitle}>Loading user information...</Text>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={handleEditProfile}
              >
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.signOutButton]}
                onPress={handleSignOut}
              >
                <Text style={styles.signOutButtonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Date Picker for Date of Birth */}
        {showDatePicker && Platform.OS === "android" && (
          <DateTimePicker
            value={userProfile.dateOfBirth || new Date(2000, 0, 1)}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1950, 0, 1)}
          />
        )}

        {/* iOS Date Picker Modal */}
        {Platform.OS === "ios" && showDatePicker && (
          <Modal transparent={true} animationType="slide">
            <View style={styles.iosDatePickerOverlay}>
              <View style={styles.iosDatePickerContainer}>
                <View style={styles.iosDatePickerHeader}>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.iosDatePickerButton}>Cancel</Text>
                  </TouchableOpacity>
                  <Text style={styles.iosDatePickerTitle}>Select Date</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text
                      style={[styles.iosDatePickerButton, styles.doneButton]}
                    >
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={userProfile.dateOfBirth || new Date(2000, 0, 1)}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1950, 0, 1)}
                  style={styles.iosDatePicker}
                />
              </View>
            </View>
          </Modal>
        )}

        {/* City Selection Modal */}
        <Modal
          visible={showCityDropdown}
          transparent={true}
          animationType="slide"
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
                showsVerticalScrollIndicator={false}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    paddingTop: 22,
  },
  logoContainer: {
    transform: [{ scale: 1.05 }],
    marginLeft: 2,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: theme.borderRadius.medium,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
  },
  userInfoContainer: {
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 56, 147, 0.1)",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: theme.colors.subText,
    flex: 2,
    textAlign: "right",
  },
  verified: {
    color: "#28a745",
    fontWeight: "600",
  },
  unverified: {
    color: "#dc3545",
    fontWeight: "600",
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.small,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: theme.colors.primary,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signOutButton: {
    backgroundColor: "#dc3545",
    borderWidth: 1,
    borderColor: "#dc3545",
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // iOS Date Picker Styles
  iosDatePickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  iosDatePickerContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
    paddingBottom: 20,
  },
  iosDatePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 56, 147, 0.2)",
  },
  iosDatePickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  iosDatePickerButton: {
    fontSize: 16,
    color: theme.colors.primary,
  },
  doneButton: {
    fontWeight: "600",
  },
  iosDatePicker: {
    height: 200,
    backgroundColor: "white",
  },
  // City Dropdown Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  dropdownModal: {
    backgroundColor: "white",
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
    maxHeight: "60%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 56, 147, 0.2)",
  },
  dropdownTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  closeButton: {
    fontSize: 20,
    color: theme.colors.subText,
    fontWeight: "600",
    paddingHorizontal: 8,
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 56, 147, 0.1)",
  },
  dropdownItemText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  selectedIndicator: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: "600",
  },
});

export default ProfileScreen;
