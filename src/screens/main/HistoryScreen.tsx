import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@contexts/ThemeContext";
import { useLanguage } from "@contexts/LanguageContext";
import ThemeBackground from "@components/common/ThemeBackground";

const HistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <ThemeBackground>
      <View style={styles.container}>
        <View
          style={[styles.card, { backgroundColor: "rgba(255, 255, 255, 0.9)" }]}
        >
          <Text style={[styles.title, { color: colors.primary }]}>
            {t("history")}
          </Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            {t("Your trip history will appear here")}
          </Text>
        </View>
      </View>
    </ThemeBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});

export default HistoryScreen;
