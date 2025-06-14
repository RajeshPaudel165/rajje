import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { lightTheme } from "../../theme/theme";
import { globalStyles } from "../../styles/styles";

interface CityPickerProps {
  label: string;
  selectedCity: string;
  showModal: boolean;
  cities: string[];
  onToggleModal: () => void;
  onSelectCity: (city: string) => void;
  error?: string;
  placeholder?: string;
}

const CityPicker: React.FC<CityPickerProps> = ({
  label,
  selectedCity,
  showModal,
  cities,
  onToggleModal,
  onSelectCity,
  error,
  placeholder = "Select a city",
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.cityButton, error ? styles.errorBorder : null]}
        onPress={onToggleModal}
      >
        <Text
          style={[styles.cityText, !selectedCity && styles.placeholderText]}
        >
          {selectedCity || placeholder}
        </Text>
        <Icon name="chevron-down" size={20} color={lightTheme.colors.subText} />
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={onToggleModal}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modernModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Your City</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onToggleModal}
              >
                <Icon name="close" size={20} color={lightTheme.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsContainer}>
              {cities.map((city, index) => (
                <TouchableOpacity
                  key={city}
                  style={[
                    styles.modalOption,
                    {
                      backgroundColor:
                        selectedCity === city
                          ? `${lightTheme.colors.primary}10`
                          : "transparent",
                      borderColor:
                        selectedCity === city
                          ? lightTheme.colors.primary
                          : lightTheme.colors.border,
                    },
                    index !== cities.length - 1 && styles.optionMargin,
                  ]}
                  onPress={() => {
                    onSelectCity(city);
                    onToggleModal();
                  }}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor:
                          selectedCity === city
                            ? lightTheme.colors.primary
                            : lightTheme.colors.surface,
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
                        styles.modalOptionText,
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4, // Reduced from 8 to 4
    color: lightTheme.colors.text,
  },
  cityButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: lightTheme.colors.border,
    borderRadius: 8,
    padding: 15,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cityText: {
    color: lightTheme.colors.text,
    fontSize: 16,
  },
  placeholderText: {
    color: lightTheme.colors.subText,
  },
  errorBorder: {
    borderColor: lightTheme.colors.error,
  },
  errorText: {
    color: lightTheme.colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
  },
  modernModalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxWidth: 380,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: lightTheme.colors.text,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  optionsContainer: {
    padding: 16,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  optionMargin: {
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  modalOptionText: {
    fontSize: 16,
  },
  checkmarkContainer: {
    marginLeft: 8,
  },
});

export default CityPicker;
