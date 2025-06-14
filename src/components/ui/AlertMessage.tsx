import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { lightTheme } from "../../theme";

const { width } = Dimensions.get("window");

interface AlertMessageProps {
  visible: boolean;
  title: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onClose: () => void;
  buttons?: Array<{
    text: string;
    onPress: () => void;
    style?: "default" | "cancel" | "destructive";
  }>;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  visible,
  title,
  message,
  type = "info",
  onClose,
  buttons = [{ text: "OK", onPress: () => {}, style: "default" }],
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(100));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, slideAnim]);

  const getIconName = () => {
    switch (type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "alert-circle";
      case "warning":
        return "warning";
      case "info":
      default:
        return "information-circle";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "success":
        return "#28a745";
      case "error":
        return lightTheme.colors.error;
      case "warning":
        return "#ffc107";
      case "info":
      default:
        return lightTheme.colors.primary;
    }
  };

  const handleButtonPress = (button: (typeof buttons)[0]) => {
    if (typeof button.onPress === "function") {
      button.onPress();
    }
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.alertContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${getIconColor()}15` },
              ]}
            >
              <Icon name={getIconName()} size={32} color={getIconColor()} />
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <View
              style={[
                styles.buttonContainer,
                buttons.length > 1 && styles.multipleButtons,
              ]}
            >
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    button.style === "cancel" && styles.cancelButton,
                    button.style === "destructive" && styles.destructiveButton,
                    buttons.length > 1 && { flex: 1, marginHorizontal: 6 },
                  ]}
                  onPress={() => handleButtonPress(button)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      button.style === "cancel" && styles.cancelButtonText,
                      button.style === "destructive" &&
                        styles.destructiveButtonText,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  alertContainer: {
    width: width - 40,
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: lightTheme.colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: lightTheme.colors.subText,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  buttonContainer: {
    width: "100%",
  },
  multipleButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: lightTheme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    color: lightTheme.colors.text,
  },
  destructiveButton: {
    backgroundColor: lightTheme.colors.error,
  },
  destructiveButtonText: {
    color: "white",
  },
});

export default AlertMessage;
