import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    dashboard: "Dashboard",
    settings: "Settings",
    profile: "Profile",
    logout: "Logout",
    theme: "Theme",
    language: "Language",
    notifications: "Notifications",
    privacy: "Privacy",
    account: "Account",
    preferences: "Preferences",
    light: "Light",
    dark: "Dark",
    auto: "Auto",
    english: "English",
    nepali: "Nepali",
    cancel: "Cancel",
    save: "Save",
    signin: "Sign In",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    name: "Name",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    pushNotifications: "Push Notifications",
    emailNotifications: "Email Notifications",
    locationServices: "Location Services",
    appSettings: "App Settings",
    selectTheme: "Select Theme",
    selectLanguage: "Select Language",
    currentLocation: "Current Location",
    latitude: "Latitude",
    longitude: "Longitude",
    accuracy: "Accuracy",
    altitude: "Altitude",
    fetchingLocation: "Fetching location...",
    // Added new translations
    dateOfBirth: "Date of Birth",
    age: "Age",
    city: "City",
    emailVerified: "Email Verified",
    memberSince: "Member Since",
    edit: "Edit",
    signOut: "Sign Out",
    history: "History",
    years: "years",
    yes: "Yes",
    no: "No",
    notSet: "Not set",
    loadingUserInfo: "Loading user information...",
    connectionError: "Connection Error",
    databaseConnectionError:
      "Unable to connect to the database. Please check your internet connection.",
    errorLoadingProfile: "Failed to load profile data",
    selectCity: "Select City",
  },
  ne: {
    dashboard: "ड्यासबोर्ड",
    settings: "सेटिङहरू",
    profile: "प्रोफाइल",
    logout: "लगआउट",
    theme: "थिम",
    language: "भाषा",
    notifications: "सूचनाहरू",
    privacy: "गोपनीयता",
    account: "खाता",
    preferences: "प्राथमिकताहरू",
    light: "उज्यालो",
    dark: "अँध्यारो",
    auto: "स्वचालित",
    english: "अंग्रेजी",
    nepali: "नेपाली",
    cancel: "रद्द गर्नुहोस्",
    save: "सेभ गर्नुहोस्",
    signin: "साइन इन",
    signup: "साइन अप",
    email: "इमेल",
    password: "पासवर्ड",
    name: "नाम",
    confirmPassword: "पासवर्ड पुष्टि गर्नुहोस्",
    forgotPassword: "पासवर्ड बिर्सनुभयो?",
    dontHaveAccount: "खाता छैन?",
    alreadyHaveAccount: "पहिले नै खाता छ?",
    pushNotifications: "पुश सूचनाहरू",
    emailNotifications: "इमेल सूचनाहरू",
    locationServices: "स्थान सेवाहरू",
    appSettings: "एप सेटिङहरू",
    selectTheme: "थिम छान्नुहोस्",
    selectLanguage: "भाषा छान्नुहोस्",
    currentLocation: "हालको स्थान",
    latitude: "अक्षांश",
    longitude: "देशान्तर",
    accuracy: "शुद्धता",
    altitude: "उचाइ",
    fetchingLocation: "स्थान खोज्दै...",
    // Added new translations
    dateOfBirth: "जन्म मिति",
    age: "उमेर",
    city: "शहर",
    emailVerified: "इमेल प्रमाणित",
    memberSince: "सदस्यता मिति",
    edit: "सम्पादन",
    signOut: "साइन आउट",
    history: "इतिहास",
    years: "वर्ष",
    yes: "हो",
    no: "होइन",
    notSet: "सेट गरिएको छैन",
    loadingUserInfo: "प्रयोगकर्ता जानकारी लोड हुँदैछ...",
    connectionError: "कनेक्सन त्रुटि",
    databaseConnectionError:
      "डाटाबेससँग जडान गर्न असमर्थ। कृपया आफ्नो इन्टरनेट जडान जाँच गर्नुहोस्।",
    errorLoadingProfile: "प्रोफाइल डाटा लोड गर्न असफल",
    selectCity: "शहर छान्नुहोस्",
  },
};

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  availableLanguages: { code: string; name: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const availableLanguages = [
    { code: "en", name: "English" },
    { code: "ne", name: "नेपाली" },
  ];

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem("language");
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
      }
    } catch (error) {
      console.error("Error loading language:", error);
    }
  };

  const saveLanguage = async (language: string) => {
    try {
      await AsyncStorage.setItem("language", language);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
    saveLanguage(language);
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{ currentLanguage, setLanguage, t, availableLanguages }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
