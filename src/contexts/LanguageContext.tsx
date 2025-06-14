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
    faqs: "FAQs",
    contactUs: "Contact Us",
    help: "Help & Support",
    comingSoon: "Coming Soon!",
    phone: "Phone",
    faq1Question: "How do I change my city?",
    faq1Answer:
      "You can change your city by going to Profile > Edit > City and selecting a new city from the dropdown list.",
    faq2Question: "How do I change my date of birth?",
    faq2Answer:
      "To change your date of birth, go to Profile > Edit > Date of Birth and select your new date from the calendar picker.",
    faq3Question: "How do I change my name?",
    faq3Answer:
      "You can update your name by navigating to Profile > Edit > Name and entering your new name in the text field.",
    faq4Question: "How do I turn off notifications?",
    faq4Answer:
      "To turn off notifications, go to Settings > Notifications and toggle the switch to off position.",
    more: "More",
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
    faqs: "प्रायः सोधिने प्रश्नहरू",
    contactUs: "सम्पर्क गर्नुहोस्",
    help: "सहायता र समर्थन",
    comingSoon: "चाँडै आउँदैछ!",
    phone: "फोन",
    faq1Question: "म आफ्नो शहर कसरी परिवर्तन गर्न सक्छु?",
    faq1Answer:
      "तपाईं प्रोफाइल > सम्पादन > शहर मा गएर र ड्रपडाउन सूचीबाट नयाँ शहर चयन गरेर आफ्नो शहर परिवर्तन गर्न सक्नुहुन्छ।",
    faq2Question: "म आफ्नो जन्म मिति कसरी परिवर्तन गर्न सक्छु?",
    faq2Answer:
      "आफ्नो जन्म मिति परिवर्तन गर्न, प्रोफाइल > सम्पादन > जन्म मिति मा जानुहोस् र क्यालेन्डर पिकरबाट आफ्नो नयाँ मिति चयन गर्नुहोस्।",
    faq3Question: "म आफ्नो नाम कसरी परिवर्तन गर्न सक्छु?",
    faq3Answer:
      "तपाईं प्रोफाइल > सम्पादन > नाम मा नेभिगेट गरेर र पाठ फिल्डमा आफ्नो नयाँ नाम प्रविष्ट गरेर आफ्नो नाम अपडेट गर्न सक्नुहुन्छ।",
    faq4Question: "म सूचनाहरू कसरी बन्द गर्न सक्छु?",
    faq4Answer:
      "सूचनाहरू बन्द गर्न, सेटिङहरू > सूचनाहरू मा जानुहोस् र स्विच बन्द स्थितिमा टगल गर्नुहोस्।",
    more: "थप",
    
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
