// components/SelectModal.js
import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function SelectModal({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}) {
  const { theme } = useTheme();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.card },
          ]}
        >
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            {title}
          </Text>

          {options.map((opt) => {
            const isSelected = opt === selectedValue;
            return (
              <Pressable
                key={opt}
                style={[
                  styles.optionRow,
                  isSelected && {
                    backgroundColor: theme.accentSoft || theme.accent,
                  },
                ]}
                onPress={() => onSelect(opt)}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: theme.text,
                      fontWeight: isSelected ? "700" : "400",
                    },
                  ]}
                >
                  {opt}
                </Text>
                {isSelected && (
                  <Text
                    style={[
                      styles.check,
                      { color: theme.accent },
                    ]}
                  >
                    ✓
                  </Text>
                )}
              </Pressable>
            );
          })}

          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text
              style={[
                styles.cancelText,
                { color: theme.accent },
              ]}
            >
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 999,
    marginBottom: 6,
  },
  optionText: {
    fontSize: 16,
  },
  check: {
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 12,
    alignSelf: "flex-end",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
