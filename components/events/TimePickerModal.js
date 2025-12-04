// components/TimePickerModal.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
} from "react-native";

import { useTheme } from "../../context/ThemeContext";

function TimePickerModal({
  visible,
  initialTime,
  onConfirm,
  onCancel,
  title = "Select time",
}) {
  const { theme } = useTheme();

  // ---- derive initial time pieces ----
  const baseDate = initialTime || new Date();
  const initialHours24 = baseDate.getHours();
  const initialMinutes = baseDate.getMinutes();

  const initialAmPm = initialHours24 >= 12 ? "PM" : "AM";
  const initialHour12 = ((initialHours24 + 11) % 12) + 1;
  const roundTo5 = Math.round(initialMinutes / 5) * 5;
  const clampedMinutes = Math.min(55, roundTo5);
  const initialMinute = String(clampedMinutes).padStart(2, "0");

  const [hour, setHour] = useState(initialHour12);
  const [minute, setMinute] = useState(initialMinute);
  const [ampm, setAmpm] = useState(initialAmPm);

  // ❗ Hooks are all above this line now – safe
  if (!visible) return null;

  const textColor = theme.text || theme.textMain || "#111";
  const textMuted = theme.textMuted || "#777";
  const accent = theme.accent || "#2f7cff";
  const onAccent = theme.textOnAccent || theme.background || "#fff";

  const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
  const MINUTES = [
    "00",
    "05",
    "10",
    "15",
    "20",
    "25",
    "30",
    "35",
    "40",
    "45",
    "50",
    "55",
  ];
  const AMPM = ["AM", "PM"];

  function handleConfirm() {
    const base = new Date(baseDate.getTime());
    let h24 = hour % 12;
    if (ampm === "PM") h24 += 12;
    base.setHours(h24, parseInt(minute, 10), 0, 0);
    onConfirm && onConfirm(base);
  }

  const optionBase = {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginVertical: 2,
    alignItems: "center",
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.pickerModalContent,
            {
              backgroundColor: theme.card || "#fff",
              borderColor: theme.border || "rgba(0,0,0,0.08)",
              borderWidth: 1,
            },
          ]}
        >
          <Text style={[styles.modalTitle, { color: textColor }]}>{title}</Text>

          <View style={styles.timePickerRow}>
            {/* Hours */}
            <View style={styles.timeColumn}>
              <Text style={[styles.timeColumnLabel, { color: textMuted }]}>
                Hour
              </Text>
              <ScrollView style={{ maxHeight: 170 }}>
                {HOURS.map((h) => {
                  const selected = h === hour;
                  return (
                    <Pressable
                      key={h}
                      onPress={() => setHour(h)}
                      style={[
                        optionBase,
                        selected && { backgroundColor: accent },
                      ]}
                    >
                      <Text
                        style={{
                          color: selected ? onAccent : textColor,
                          fontWeight: selected ? "700" : "400",
                        }}
                      >
                        {h}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Minutes */}
            <View style={styles.timeColumn}>
              <Text style={[styles.timeColumnLabel, { color: textMuted }]}>
                Min
              </Text>
              <ScrollView style={{ maxHeight: 170 }}>
                {MINUTES.map((m) => {
                  const selected = m === minute;
                  return (
                    <Pressable
                      key={m}
                      onPress={() => setMinute(m)}
                      style={[
                        optionBase,
                        selected && { backgroundColor: accent },
                      ]}
                    >
                      <Text
                        style={{
                          color: selected ? onAccent : textColor,
                          fontWeight: selected ? "700" : "400",
                        }}
                      >
                        {m}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* AM / PM */}
            <View style={styles.timeColumn}>
              <Text style={[styles.timeColumnLabel, { color: textMuted }]}>
                AM / PM
              </Text>
              <ScrollView style={{ maxHeight: 170 }}>
                {AMPM.map((val) => {
                  const selected = val === ampm;
                  return (
                    <Pressable
                      key={val}
                      onPress={() => setAmpm(val)}
                      style={[
                        optionBase,
                        selected && { backgroundColor: accent },
                      ]}
                    >
                      <Text
                        style={{
                          color: selected ? onAccent : textColor,
                          fontWeight: selected ? "700" : "400",
                        }}
                      >
                        {val}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          <View style={styles.pickerButtonsRow}>
            <Pressable style={styles.pickerSecondaryButton} onPress={onCancel}>
              <Text style={[styles.pickerSecondaryText, { color: textMuted }]}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              style={[styles.pickerPrimaryButton, { backgroundColor: accent }]}
              onPress={handleConfirm}
            >
              <Text style={[styles.pickerPrimaryText, { color: onAccent }]}>
                Use this time
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default TimePickerModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  pickerModalContent: {
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  timePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
  },
  timeColumn: {
    flex: 1,
    alignItems: "center",
  },
  timeColumnLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  pickerButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 8,
  },
  pickerSecondaryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pickerSecondaryText: {
    fontSize: 14,
  },
  pickerPrimaryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pickerPrimaryText: {
    fontWeight: "600",
    fontSize: 14,
  },
});
