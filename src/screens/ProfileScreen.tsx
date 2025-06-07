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
  useColorScheme,
  StatusBar,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { theme } from "../constants/theme";
import VehicleIcon from "../components/common/VehicleIcon";
import Background from "../components/common/Background";
import { auth, db } from "../firebase";
import { signOut, User, updateProfile, reload } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const cities = ["Kathmandu", "Pokhara", "Bharatpur", "Nepalgunj", "Birgunj"];

interface UserProfile {
  dateOfBirth: Date | null;
  city: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    dateOfBirth: null,
    city: "",
  });
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigation = useNavigation();
  const colorScheme = useColorScheme;

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Reload user to get latest email verification status
        await reload(user);
        setUser(user);
        await loadUserProfile(user.uid);
      } else {
        setUser(null);
        setUserProfile({ dateOfBirth: null, city: "" });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log("Loading profile for user:", userId); // Debug log
      setLoading(true);

      const userDocRef = doc(db, "users", userId);
      console.log("Document reference created"); // Debug log

      const userDoc = await getDoc(userDocRef);
      console.log("Document fetched, exists:", userDoc.exists()); // Debug log

      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log("User data:", data); // Debug log

        // Handle different date formats from database
        let dateOfBirth = null;
        if (data.dateOfBirth) {
          if (typeof data.dateOfBirth.toDate === "function") {
            // Firestore Timestamp
            dateOfBirth = data.dateOfBirth.toDate();
          } else if (data.dateOfBirth instanceof Date) {
            // JavaScript Date object
            dateOfBirth = data.dateOfBirth;
          } else if (typeof data.dateOfBirth === "string") {
            // String date
            dateOfBirth = new Date(data.dateOfBirth);
          } else {
            console.log(
              "Unknown date format:",
              typeof data.dateOfBirth,
              data.dateOfBirth
            );
          }
        }

        setUserProfile({
          dateOfBirth: dateOfBirth,
          city: data.city || data.address || "", // Handle both field names
        });
      } else {
        console.log("Document doesn't exist, creating new profile"); // Debug log

        // Create a new user profile document if it doesn't exist
        const newProfile = {
          dateOfBirth: null,
          city: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await setDoc(userDocRef, newProfile);
        console.log("New profile created"); // Debug log

        setUserProfile({
          dateOfBirth: null,
          city: "",
        });
      }
    } catch (error: any) {
      console.error("Detailed error loading user profile:", error);

      // More specific error handling
      if (error.code === "permission-denied") {
        Alert.alert(
          "Permission Error",
          "You don't have permission to access this data. Please check your Firestore security rules."
        );
      } else if (error.code === "unavailable") {
        Alert.alert(
          "Connection Error",
          "Unable to connect to the database. Please check your internet connection."
        );
      } else {
        Alert.alert("Error", `Failed to load profile data: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      const updateData = {
        ...updates,
        updatedAt: new Date(),
      };

      // Convert Date to Firestore Timestamp if dateOfBirth is being updated
      if (updates.dateOfBirth) {
        updateData.dateOfBirth = updates.dateOfBirth;
      }

      await updateDoc(userDocRef, updateData);

      // Update local state
      setUserProfile((prev) => ({ ...prev, ...updates }));
      setRefreshKey((prev) => prev + 1);

      return true;
    } catch (error: any) {
      console.error("Error updating user profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
      return false;
    }
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

  const refreshEmailVerification = async () => {
    if (user) {
      try {
        await reload(user);
        // Force a re-render by updating the refresh key
        setRefreshKey((prev) => prev + 1);
        Alert.alert("Success", "Email verification status refreshed!");
      } catch (error) {
        console.error("Error refreshing user:", error);
        Alert.alert("Error", "Failed to refresh email verification status.");
      }
    }
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
        text: "Edit City",
        onPress: () => editCity(),
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

              // Force state update with new object
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

  const editCity = () => {
    setShowCityDropdown(true);
  };

  const handleDateChange = async (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      const success = await updateUserProfile({ dateOfBirth: selectedDate });
      if (success) {
        Alert.alert("Success", "Date of birth updated successfully!");
      }
    }
  };

  const handleCitySelect = async (city: string) => {
    const success = await updateUserProfile({ city: city });

    if (success) {
      setShowCityDropdown(false);
      Alert.alert("Success", `City updated to ${city} successfully!`);
    }
  };

  const renderCityItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleCitySelect(item)}
    >
      <Text style={styles.dropdownItemText}>{item}</Text>
      {userProfile.city === item && (
        <Text style={styles.selectedIndicator}>✓</Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <Background>
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={styles.subtitle}>Loading profile...</Text>
        </View>
      </Background>
    );
  }

  return (
    <Background>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
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
                  <Text style={styles.label}>City:</Text>
                  <Text style={styles.value} key={`city-${refreshKey}`}>
                    {userProfile.city || "Not set"}
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

                {/* Debug info - remove this later */}
                <View style={styles.userInfo}>
                  <Text style={styles.label}>Debug - Auth emailVerified:</Text>
                  <Text style={styles.value}>{String(user.emailVerified)}</Text>
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

              {!user?.emailVerified && (
                <TouchableOpacity
                  style={[styles.button, styles.refreshButton]}
                  onPress={refreshEmailVerification}
                >
                  <Text style={styles.refreshButtonText}>
                    Refresh Email Status
                  </Text>
                </TouchableOpacity>
              )}

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
            display="spinner"
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1950, 0, 1)}
            style={styles.iosDatePicker}
            textColor="#000000"
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
                  textColor="#000000"
                  accentColor={theme.colors.primary}
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
    backgroundColor: "#FFFFFF", // Solid white background instead of transparent
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
    color: "#333333", // Explicit dark color instead of theme color
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
    color: "#2C3E50", // Explicit dark color for better visibility
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#5A6C7D", // Explicit color instead of theme
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
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  refreshButton: {
    backgroundColor: "#28a745",
    borderWidth: 1,
    borderColor: "#28a745",
  },
  refreshButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  signOutButton: {
    backgroundColor: "#dc3545",
    borderWidth: 1,
    borderColor: "#dc3545",
  },
  signOutButtonText: {
    color: "#FFFFFF",
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
    backgroundColor: "#FFFFFF", // Solid white background
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
    backgroundColor: "#FFFFFF", // Ensure solid background
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
    backgroundColor: "#FFFFFF",
    color: "#000000",
  },
  // City Dropdown Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  dropdownModal: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
    maxHeight: "60%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    color: "#000000",
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 56, 147, 0.2)",
    backgroundColor: "#FFFFFF", // Ensure solid background
  },
  dropdownTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  closeButton: {
    fontSize: 20,
    color: "#666666", // Explicit color for better visibility
    fontWeight: "600",
    paddingHorizontal: 8,
  },
  dropdownList: {
    maxHeight: 300,
    backgroundColor: "#FFFFFF", // Solid background
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 56, 147, 0.1)",
    backgroundColor: "#FFFFFF", // Ensure each item has solid background
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#2C3E50", // Explicit dark color for better visibility
    flex: 1,
  },
  selectedIndicator: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: "600",
  },
});

export default ProfileScreen;
