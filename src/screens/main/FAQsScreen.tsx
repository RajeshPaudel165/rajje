import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useTheme } from "@contexts/ThemeContext";
import { useLanguage } from "@contexts/LanguageContext";
import ThemeBackground from "@components/common/ThemeBackground";
import Icon from "react-native-vector-icons/Ionicons";

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface FAQItem {
  question: string;
  answer: string;
}

const FAQsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // FAQ data
  const faqs: FAQItem[] = [
    {
      question: t("faq1Question"),
      answer: t("faq1Answer"),
    },
    {
      question: t("faq2Question"),
      answer: t("faq2Answer"),
    },
    {
      question: t("faq3Question"),
      answer: t("faq3Answer"),
    },
    {
      question: t("faq4Question"),
      answer: t("faq4Answer"),
    },
  ];

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <ThemeBackground>
      <View style={[styles.container, { backgroundColor: "transparent" }]}>
        <ScrollView style={styles.content}>
          <View
            style={[
              styles.faqSection,
              { backgroundColor: "rgba(255, 255, 255, 0.9)" },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>
              {t("faqs")}
            </Text>

            {faqs.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.questionContainer}
                  onPress={() => toggleExpand(index)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.questionText, { color: colors.text }]}>
                    {faq.question}
                  </Text>
                  <Icon
                    name={
                      expandedIndex === index ? "chevron-up" : "chevron-down"
                    }
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>

                {expandedIndex === index && (
                  <View style={styles.answerContainer}>
                    <Text
                      style={[
                        styles.answerText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ThemeBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  faqSection: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  faqItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
    paddingBottom: 15,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    paddingRight: 10,
  },
  answerContainer: {
    marginTop: 12,
    paddingLeft: 5,
  },
  answerText: {
    fontSize: 15,
    lineHeight: 22,
  },
});

export default FAQsScreen;
