import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../../context/AuthContext.js";
import { createEvent } from "../../services/eventsApi.js";
import { useTheme } from "../../context/ThemeContext";

function TimePickerModal({
  visible,
  initialTime,
  onConfirm,
  onCancel,
  title = "Select time",
}) {
  const { theme } = useTheme();

  // ❌ REMOVE this, it breaks hook ordering:
  // if (!visible) return null;

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

  const textColor = theme.text || theme.textMain;
  const textMuted = theme.textMuted;
  const accent = theme.accent;
  const onAccent = theme.textOnAccent || theme.background;

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
    onConfirm(base);
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
              backgroundColor: theme.card,
              borderColor: theme.border,
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

const TOWNS = ["Banff", "Canmore", "Lake Louise"];
const CATEGORIES = [
  "All",
  "Market",
  "Wellness",
  "Music",
  "Workshop",
  "Family",
  "Retail",
  "Outdoors",
  "Food & Drink",
  "Art",
];

// All will not be in the categories dropdown menu
const FORM_CATEGORIES = CATEGORIES.filter((cat) => cat !== "All");

export default function PostEventScreen() {
  const navigation = useNavigation();
  const { token, logout } = useAuth();
  const { theme } = useTheme();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [town, setTown] = useState(TOWNS[0]); // default to Banff
  const [category, setCategory] = useState(FORM_CATEGORIES[0]); // default to first category

  // Date + Time state
  const [dateObj, setDateObj] = useState(new Date()); // Date object for picker
  const [date, setDate] = useState(""); // "YYYY-MM-DD"

  const [timeObj, setTimeObj] = useState(new Date());
  const [time, setTime] = useState(""); // "7:00 PM"

  const [endTimeObj, setEndTimeObj] = useState(new Date()); // end time object
  const [endTime, setEndTime] = useState(""); // "9:00 PM"

  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  // Picker visibility toggles
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showTownModal, setShowTownModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // --- Helpers for formatting dates/times ---

  const applyDateFromDateObj = (jsDate) => {
    const year = jsDate.getFullYear();
    const month = String(jsDate.getMonth() + 1).padStart(2, "0");
    const day = String(jsDate.getDate()).padStart(2, "0");
    setDate(`${year}-${month}-${day}`);
  };

  // DATE: only update temp date; confirmation button will commit it
  const handleDateChange = (_, selectedDate) => {
    if (selectedDate) {
      setDateObj(selectedDate);
    }
  };

  const handleConfirmDate = () => {
    applyDateFromDateObj(dateObj);
    setShowDatePicker(false);
  };

  const formatTime = (selectedTime) => {
    let hours = selectedTime.getHours();
    const minutes = String(selectedTime.getMinutes()).padStart(2, "0");
    const isPM = hours >= 12;
    const displayHours = ((hours + 11) % 12) + 1; // 0–23 -> 1–12
    const suffix = isPM ? "PM" : "AM";

    return `${displayHours}:${minutes} ${suffix}`;
  };

  const handleSubmit = async () => {
    if (!title || !date) {
      Alert.alert("Missing info", "Please add at least a title and a date.");
      return;
    }

    if (!token) {
      Alert.alert("Not logged in", "Please log in before posting an event.");
      return;
    }

    setLoading(true);

    try {
      // Use your improved eventsApi.js function instead of raw fetch
      const { ok, status, data } = await createEvent(
        {
          title,
          description,
          town,
          category,
          date,
          time,
          endTime,
          location,
        },
        token
      );

      /* -----------------------------
       🔴 401 — invalid or deleted token
      ------------------------------*/
      if (status === 401) {
        Alert.alert(
          "Session expired",
          "Your account no longer exists or your login expired. Please log in again.",
          [
            {
              text: "OK",
              onPress: () => logout(),
            },
          ]
        );
        return;
      }

      /* -----------------------------
       🔴 403 — not a business
      ------------------------------*/
      if (status === 403) {
        Alert.alert(
          "Not allowed",
          data?.message || "You must be a business account to post events."
        );
        return;
      }

      /* -----------------------------
       🔴 Other errors
      ------------------------------*/
      if (!ok) {
        Alert.alert("Error", data?.message || "Failed to create event.");
        return;
      }

      /* -----------------------------
       🟢 Success!
      ------------------------------*/
      Alert.alert("Success", "Your event has been posted!", [
        {
          text: "OK",
          onPress: () => {
            // clear form fields
            setTitle("");
            setDescription("");
            setLocation("");
            setDate("");
            setTime("");
            setEndTime("");
            setTown(TOWNS[0]);
            setCategory(FORM_CATEGORIES[0]);
            setDateObj(new Date());
            setTimeObj(new Date());
            setEndTimeObj(new Date());

            navigation.navigate("MyEvents");
          },
        },
      ]);
    } catch (error) {
      console.error("Error posting event:", error);
      Alert.alert("Error", error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={[styles.heading, { color: theme.text }]}>
            Post a New Event
          </Text>

          {/* Title */}
          <Text style={[styles.label, { color: theme.textMuted }]}>
            Title *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border,
                borderWidth: 1,
              },
            ]}
            placeholder="Event title"
            placeholderTextColor={theme.textMuted}
            value={title}
            onChangeText={setTitle}
          />

          {/* Town */}
          <Text style={[styles.label, { color: theme.textMuted }]}>Town *</Text>
          <Pressable
            style={[
              styles.selectButton,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderWidth: 1,
              },
            ]}
            onPress={() => setShowTownModal(true)}
          >
            <Text style={{ color: theme.text }}>{town}</Text>
          </Pressable>

          {/* Category */}
          <Text style={[styles.label, { color: theme.textMuted }]}>
            Category *
          </Text>
          <Pressable
            style={[
              styles.selectButton,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderWidth: 1,
              },
            ]}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={{ color: theme.text }}>{category}</Text>
          </Pressable>

          {/* Date */}
          <Text style={[styles.label, { color: theme.textMuted }]}>
            Date (YYYY-MM-DD) *
          </Text>
          <Pressable onPress={() => setShowDatePicker(true)}>
            <View pointerEvents="none">
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.card,
                    color: theme.text,
                    borderColor: theme.border,
                    borderWidth: 1,
                  },
                ]}
                placeholder="Select a date"
                placeholderTextColor={theme.textMuted}
                value={date}
                editable={false}
              />
            </View>
          </Pressable>

          {/* Start Time */}
          <Text style={[styles.label, { color: theme.textMuted }]}>
            Start time (optional)
          </Text>
          <Pressable onPress={() => setShowTimePicker(true)}>
            <View pointerEvents="none">
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.card,
                    color: theme.text,
                    borderColor: theme.border,
                    borderWidth: 1,
                  },
                ]}
                placeholder="Select start time"
                placeholderTextColor={theme.textMuted}
                value={time}
                editable={false}
              />
            </View>
          </Pressable>

          {/* End Time */}
          <Text style={[styles.label, { color: theme.textMuted }]}>
            End time (optional)
          </Text>
          <Pressable onPress={() => setShowEndTimePicker(true)}>
            <View pointerEvents="none">
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.card,
                    color: theme.text,
                    borderColor: theme.border,
                    borderWidth: 1,
                  },
                ]}
                placeholder="Select end time"
                placeholderTextColor={theme.textMuted}
                value={endTime}
                editable={false}
              />
            </View>
          </Pressable>

          {/* Location */}
          <Text style={[styles.label, { color: theme.textMuted }]}>
            Location
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border,
                borderWidth: 1,
              },
            ]}
            placeholder="Venue or address"
            placeholderTextColor={theme.textMuted}
            value={location}
            onChangeText={setLocation}
          />

          {/* Description */}
          <Text style={[styles.label, { color: theme.textMuted }]}>
            Description
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border,
                borderWidth: 1,
              },
            ]}
            placeholder="Tell people what to expect"
            placeholderTextColor={theme.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          {/* Submit button */}
          <Pressable
            style={[
              styles.button,
              {
                backgroundColor: theme.accent,
                opacity: loading ? 0.6 : 1,
              },
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text
              style={[
                styles.buttonText,
                { color: theme.onAccent || theme.background },
              ]}
            >
              {loading ? "Posting..." : "Post Event"}
            </Text>
          </Pressable>
        </ScrollView>

        {/* Town Modal */}
        <Modal
          visible={showTownModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowTownModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Select Town
              </Text>
              {TOWNS.map((t) => (
                <Pressable
                  key={t}
                  style={styles.modalOption}
                  onPress={() => {
                    setTown(t);
                    setShowTownModal(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, { color: theme.text }]}>
                    {t}
                  </Text>
                </Pressable>
              ))}
              <Pressable
                style={styles.modalCancel}
                onPress={() => setShowTownModal(false)}
              >
                <Text style={[styles.modalCancelText, { color: theme.accent }]}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Category Modal */}
        <Modal
          visible={showCategoryModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Select Category
              </Text>
              {FORM_CATEGORIES.map((cat) => (
                <Pressable
                  key={cat}
                  style={styles.modalOption}
                  onPress={() => {
                    setCategory(cat);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, { color: theme.text }]}>
                    {cat}
                  </Text>
                </Pressable>
              ))}
              <Pressable
                style={styles.modalCancel}
                onPress={() => setShowCategoryModal(false)}
              >
                <Text style={[styles.modalCancelText, { color: theme.accent }]}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {showDatePicker && (
          <Modal
            transparent
            animationType="fade"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View
                style={[
                  styles.pickerModalContent,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    borderWidth: 1,
                  },
                ]}
              >
                <DateTimePicker
                  value={dateObj}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "calendar"}
                  onChange={handleDateChange}
                  themeVariant={theme.isDark ? "dark" : "light"}
                />
                <View style={styles.pickerButtonsRow}>
                  <Pressable
                    style={styles.pickerSecondaryButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text
                      style={[
                        styles.pickerSecondaryText,
                        { color: theme.textMuted },
                      ]}
                    >
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.pickerPrimaryButton,
                      { backgroundColor: theme.accent },
                    ]}
                    onPress={handleConfirmDate}
                  >
                    <Text
                      style={[
                        styles.pickerPrimaryText,
                        { color: theme.onAccent || theme.background },
                      ]}
                    >
                      Use this date
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        )}
        {/* Custom Time Picker – Start time */}
        <TimePickerModal
          visible={showTimePicker}
          initialTime={timeObj}
          title="Select start time"
          onCancel={() => setShowTimePicker(false)}
          onConfirm={(pickedDate) => {
            setTimeObj(pickedDate);
            setTime(formatTime(pickedDate));
            setShowTimePicker(false);
          }}
        />

        {/* Custom Time Picker – End time */}
        <TimePickerModal
          visible={showEndTimePicker}
          initialTime={endTimeObj}
          title="Select end time"
          onCancel={() => setShowEndTimePicker(false)}
          onConfirm={(pickedDate) => {
            setEndTimeObj(pickedDate);
            setEndTime(formatTime(pickedDate));
            setShowEndTimePicker(false);
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 4,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  selectButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 40,
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 16,
  },
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
  modalOption: {
    paddingVertical: 10,
  },
  modalOptionText: {
    fontSize: 16,
  },
  modalCancel: {
    marginTop: 12,
    alignSelf: "flex-end",
  },
  modalCancelText: {
    fontSize: 14,
  },
  pickerModalContent: {
    borderRadius: 12,
    padding: 16,
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
});
