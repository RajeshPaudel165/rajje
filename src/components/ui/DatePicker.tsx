import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { lightTheme } from "../../theme/theme";
import { globalStyles } from "../../styles/styles";

interface DatePickerProps {
  label: string;
  value: Date | null;
  showPicker: boolean;
  onTogglePicker: () => void;
  onDateChange: (event: any, selectedDate?: Date) => void;
  error?: string;
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  showPicker,
  onTogglePicker,
  onDateChange,
  error,
  placeholder = "Select a date",
  maximumDate = new Date(),
  minimumDate,
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.dateButton, error ? styles.errorBorder : null]}
        onPress={onTogglePicker}
      >
        <Text style={[styles.dateText, !value && styles.placeholderText]}>
          {value ? formatDate(value) : placeholder}
        </Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {showPicker && (
        <>
          <DateTimePicker
            value={value || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
          />

          {Platform.OS === "ios" && (
            <View style={styles.iosButtonContainer}>
              <TouchableOpacity
                style={styles.iosButton}
                onPress={onTogglePicker}
              >
                <Text style={styles.iosButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
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
  dateButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: lightTheme.colors.border,
    borderRadius: 8,
    padding: 15,
    width: "100%",
  },
  dateText: {
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
  iosButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  iosButton: {
    padding: 8,
    backgroundColor: lightTheme.colors.primary,
    borderRadius: 8,
  },
  iosButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default DatePicker;
