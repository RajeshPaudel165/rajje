import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Modal,
  Dimensions,
  Linking,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { theme } from "../theme";
import { globalStyles } from "../styles/styles";
import VehicleIcon from "../components/common/VehicleIcon";
import ThemeBackground from "../components/common/ThemeBackground";
import Icon from "react-native-vector-icons/Ionicons";

import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

// Define the navigation type
type RootStackParamList = {
  Auth: undefined;
  MainApp: undefined;
  FAQs: undefined;
};

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const SettingsScreen: React.FC = () => {
  const [notifications, setNotifications] = React.useState(true);
  const [locationSharing, setLocationSharing] = React.useState(true);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const { isDark, colors, themeMode, setTheme } = useTheme();
  const { currentLanguage, setLanguage, t, availableLanguages } = useLanguage();
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  // Only keeping light mode option since dark mode is disabled
  const themeOptions = [
    {
      key: "light",
      label: t("light"),
      icon: "sunny",
      description: "Bright and clean",
    },
    /*
    {
      key: "dark",
      label: t("dark"),
      icon: "moon",
      description: "Easy on the eyes",
    },
    {
      key: "auto",
      label: t("auto"),
      icon: "phone-portrait",
      description: "Follows system",
    },
    */
  ];

  const handleThemeChange = (selectedTheme: "light" | "dark" | "auto") => {
    // Always set to light theme regardless of selection
    setTheme("light");
    setThemeModalVisible(false);
  };

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
    setLanguageModalVisible(false);
  };

  const openFAQ = () => {
    // Replace with your FAQ link
    Linking.openURL("https://your-faq-link.com");
  };

  const openContactUs = () => {
    // Replace with your Contact Us link
    Linking.openURL("https://your-contact-link.com");
  };

  return (
    <ThemeBackground>
      <View style={[styles.container, { backgroundColor: "transparent" }]}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <VehicleIcon
              width={theme.logoDashboard.width}
              height={theme.logoDashboard.height}
              color={colors.primary}
            />
          </View>
        </View>

        <ScrollView style={styles.content}>
          <View
            style={[
              styles.settingsSection,
              { backgroundColor: "rgba(255, 255, 255, 0.9)" },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>
              {t("preferences")}
            </Text>

            {/* Theme Selection */}
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setThemeModalVisible(true)}
            >
              <View style={styles.settingInfo}>
                <Icon
                  name="color-palette-outline"
                  size={24}
                  color={colors.primary}
                />
                <Text style={[styles.settingText, { color: colors.text }]}>
                  {t("theme")}
                </Text>
              </View>
              <View style={styles.settingValue}>
                <Text
                  style={[styles.valueText, { color: colors.textSecondary }]}
                >
                  {
                    themeOptions.find((option) => option.key === themeMode)
                      ?.label
                  }
                </Text>
                <Icon
                  name="chevron-forward"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
            </TouchableOpacity>

            {/* Language Selection */}
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setLanguageModalVisible(true)}
            >
              <View style={styles.settingInfo}>
                <Icon
                  name="language-outline"
                  size={24}
                  color={colors.primary}
                />
                <Text style={[styles.settingText, { color: colors.text }]}>
                  {t("language")}
                </Text>
              </View>
              <View style={styles.settingValue}>
                <Text
                  style={[styles.valueText, { color: colors.textSecondary }]}
                >
                  {
                    availableLanguages.find(
                      (lang) => lang.code === currentLanguage
                    )?.name
                  }
                </Text>
                <Icon
                  name="chevron-forward"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
            </TouchableOpacity>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Icon
                  name="notifications-outline"
                  size={24}
                  color={colors.primary}
                />
                <Text style={[styles.settingText, { color: colors.text }]}>
                  {t("notifications")}
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Icon
                  name="location-outline"
                  size={24}
                  color={colors.primary}
                />
                <Text style={[styles.settingText, { color: colors.text }]}>
                  {t("locationServices")}
                </Text>
              </View>
              <Switch
                value={locationSharing}
                onValueChange={setLocationSharing}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
              />
            </View>
          </View>

          <View
            style={[
              styles.settingsSection,
              { backgroundColor: "rgba(255, 255, 255, 0.9)" },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>
              {t("help")}
            </Text>

            {/* FAQs */}
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => {
                // @ts-ignore - Navigate to the FAQs screen
                navigation.navigate("FAQs");
              }}
            >
              <View style={styles.settingInfo}>
                <Icon
                  name="help-circle-outline"
                  size={24}
                  color={colors.primary}
                />
                <Text style={[styles.settingText, { color: colors.text }]}>
                  {t("faqs")}
                </Text>
              </View>
              <View style={styles.settingValue}>
                <Icon
                  name="chevron-forward"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
            </TouchableOpacity>

            {/* Contact Us - Email */}
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => {
                // Open email app with the specified email
                Linking.openURL("mailto:kampanlabs@gmail.com");
              }}
            >
              <View style={styles.settingInfo}>
                <Icon name="mail-outline" size={24} color={colors.primary} />
                <Text style={[styles.settingText, { color: colors.text }]}>
                  {t("email")}
                </Text>
              </View>
              <View style={styles.settingValue}>
                <Text
                  style={[styles.valueText, { color: colors.textSecondary }]}
                >
                  kampanlabs@gmail.com
                </Text>
                <Icon
                  name="chevron-forward"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
            </TouchableOpacity>

            {/* Contact Us - Phone */}
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => {
                // Open phone dialer with the specified number
                Linking.openURL("tel:+9779742539100");
              }}
            >
              <View style={styles.settingInfo}>
                <Icon name="call-outline" size={24} color={colors.primary} />
                <Text style={[styles.settingText, { color: colors.text }]}>
                  {t("phone")}
                </Text>
              </View>
              <View style={styles.settingValue}>
                <Text
                  style={[styles.valueText, { color: colors.textSecondary }]}
                >
                  +977 9742539100
                </Text>
                <Icon
                  name="chevron-forward"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Theme Selection Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={themeModalVisible}
          onRequestClose={() => setThemeModalVisible(false)}
          statusBarTranslucent={true}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modernModalContent,
                { backgroundColor: colors.card },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modernModalTitle, { color: colors.text }]}>
                  {t("selectTheme")}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.closeButton,
                    { backgroundColor: colors.surface },
                  ]}
                  onPress={() => setThemeModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Icon name="close" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.optionsContainer}>
                {themeOptions.map((option, index) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.modernModalOption,
                      {
                        backgroundColor:
                          themeMode === option.key
                            ? colors.primary + "10"
                            : "transparent",
                        borderColor:
                          themeMode === option.key
                            ? colors.primary
                            : colors.border,
                      },
                      index !== themeOptions.length - 1 && styles.optionMargin,
                    ]}
                    onPress={() =>
                      handleThemeChange(option.key as "light" | "dark" | "auto")
                    }
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor:
                            themeMode === option.key
                              ? colors.primary
                              : colors.surface,
                        },
                      ]}
                    >
                      <Icon
                        name={option.icon}
                        size={22}
                        color={
                          themeMode === option.key ? "#FFFFFF" : colors.primary
                        }
                      />
                    </View>
                    <View style={styles.optionTextContainer}>
                      <Text
                        style={[
                          styles.modernModalOptionText,
                          {
                            color:
                              themeMode === option.key
                                ? colors.primary
                                : colors.text,
                            fontWeight:
                              themeMode === option.key ? "600" : "500",
                          },
                        ]}
                      >
                        {option.label}
                      </Text>
                      <Text
                        style={[
                          styles.themeSubtext,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {option.description}
                      </Text>
                    </View>
                    {themeMode === option.key && (
                      <View style={styles.checkmarkContainer}>
                        <Icon
                          name="checkmark-circle"
                          size={24}
                          color={colors.primary}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>

        {/* Language Selection Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={languageModalVisible}
          onRequestClose={() => setLanguageModalVisible(false)}
          statusBarTranslucent={true}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modernModalContent,
                { backgroundColor: colors.card },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modernModalTitle, { color: colors.text }]}>
                  {t("selectLanguage")}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.closeButton,
                    { backgroundColor: colors.surface },
                  ]}
                  onPress={() => setLanguageModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Icon name="close" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.optionsContainer}>
                {availableLanguages.map((language, index) => (
                  <TouchableOpacity
                    key={language.code}
                    style={[
                      styles.modernModalOption,
                      {
                        backgroundColor:
                          currentLanguage === language.code
                            ? colors.primary + "10"
                            : "transparent",
                        borderColor:
                          currentLanguage === language.code
                            ? colors.primary
                            : colors.border,
                      },
                      index !== availableLanguages.length - 1 &&
                        styles.optionMargin,
                    ]}
                    onPress={() => handleLanguageChange(language.code)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor:
                            currentLanguage === language.code
                              ? colors.primary
                              : colors.surface,
                        },
                      ]}
                    >
                      <Icon
                        name="language"
                        size={22}
                        color={
                          currentLanguage === language.code
                            ? "#FFFFFF"
                            : colors.primary
                        }
                      />
                    </View>
                    <View style={styles.optionTextContainer}>
                      <Text
                        style={[
                          styles.modernModalOptionText,
                          {
                            color:
                              currentLanguage === language.code
                                ? colors.primary
                                : colors.text,
                            fontWeight:
                              currentLanguage === language.code ? "600" : "500",
                          },
                        ]}
                      >
                        {language.name}
                      </Text>
                      <Text
                        style={[
                          styles.languageSubtext,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {language.code === "en"
                          ? "English Language"
                          : "नेपाली भाषा"}
                      </Text>
                    </View>
                    {currentLanguage === language.code && (
                      <View style={styles.checkmarkContainer}>
                        <Icon
                          name="checkmark-circle"
                          size={24}
                          color={colors.primary}
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
    </ThemeBackground>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 6,
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  settingsSection: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
    color: theme.colors.text,
  },
  settingValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueText: {
    fontSize: 16,
    marginRight: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
  },
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
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  modernModalTitle: {
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  modernModalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  optionMargin: {
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
  },
  languageSubtext: {
    fontSize: 14,
    marginTop: 2,
    opacity: 0.7,
  },
  themeSubtext: {
    fontSize: 14,
    marginTop: 2,
    opacity: 0.7,
  },
  checkmarkContainer: {
    marginLeft: 12,
  },
  additionalOptions: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
    paddingTop: 16,
  },
  additionalOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  additionalOptionText: {
    fontSize: 16,
    marginLeft: 12,
    color: theme.colors.text,
  },
  // Legacy styles (keeping for backward compatibility)
  modalContent: {
    width: "85%",
    borderRadius: 16,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SettingsScreen;
