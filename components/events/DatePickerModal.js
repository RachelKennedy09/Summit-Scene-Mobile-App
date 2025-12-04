// components/events/DatePickerModal.js
// Reusable date picker modal for selecting event dates

import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../../context/ThemeContext";

export default function DatePickerModal({
  visible,
  initialDate,
  onConfirm,
  onCancel,
  title = "Select date",
}) {
  const { theme } = useTheme();

  const baseDate = initialDate || new Date();
  const [selectedDate, setSelectedDate] = useState(baseDate);

  // ❗ hooks are above this line – now safe
  if (!visible) return null;

  const handleChange = (_event, date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleConfirm = () => {
    onConfirm && onConfirm(selectedDate);
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };

  const bg = theme.card || "#fff";
  const textMain = theme.text || "#222";
  const textMuted = theme.textMuted || "#777";
  const accent = theme.accent || "#2f7cff";
  const onAccent = theme.onAccent || "#fff";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.backdrop}>
        <View style={[styles.modalContainer, { backgroundColor: bg }]}>
          <Text style={[styles.title, { color: textMain }]}>{title}</Text>

          <View style={styles.pickerWrapper}>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleChange}
            />
          </View>

          <View style={styles.buttonRow}>
            <Pressable style={styles.cancelButton} onPress={handleCancel}>
              <Text style={[styles.cancelText, { color: textMuted }]}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              style={[styles.confirmButton, { backgroundColor: accent }]}
              onPress={handleConfirm}
            >
              <Text style={[styles.confirmText, { color: onAccent }]}>
                Confirm
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    borderRadius: 16,
    padding: 16,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  pickerWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelText: {
    fontSize: 16,
  },
  confirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
