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

  // START TIME: update temp object only
  const handleTimeChange = (_, selectedTime) => {
    if (selectedTime) {
      setTimeObj(selectedTime);
    }
  };

  const handleConfirmTime = () => {
    setTime(formatTime(timeObj));
    setShowTimePicker(false);
  };

  // END TIME: update temp object only
  const handleEndTimeChange = (_, selectedTime) => {
    if (selectedTime) {
      setEndTimeObj(selectedTime);
    }
  };

  const handleConfirmEndTime = () => {
    setEndTime(formatTime(endTimeObj));
    setShowEndTimePicker(false);
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
          <Text style={[styles.label, { color: theme.textMuted }]}>
            Town *
          </Text>
          <Pressable
            style={[
              styles.selectButton,
              { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 },
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
              { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 },
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
              <Text
                style={[
                  styles.modalTitle,
                  { color: theme.text },
                ]}
              >
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
                  <Text
                    style={[
                      styles.modalOptionText,
                      { color: theme.text },
                    ]}
                  >
                    {t}
                  </Text>
                </Pressable>
              ))}
              <Pressable
                style={styles.modalCancel}
                onPress={() => setShowTownModal(false)}
              >
                <Text
                  style={[
                    styles.modalCancelText,
                    { color: theme.accent },
                  ]}
                >
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
              <Text
                style={[
                  styles.modalTitle,
                  { color: theme.text },
                ]}
              >
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
                  <Text
                    style={[
                      styles.modalOptionText,
                      { color: theme.text },
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
              <Pressable
                style={styles.modalCancel}
                onPress={() => setShowCategoryModal(false)}
              >
                <Text
                  style={[
                    styles.modalCancelText,
                    { color: theme.accent },
                  ]}
                >
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Date Picker Modal */}
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

        {/* Time Picker Modal */}
        {showTimePicker && (
          <Modal
            transparent
            animationType="fade"
            onRequestClose={() => setShowTimePicker(false)}
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
                  value={timeObj}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "clock"}
                  onChange={handleTimeChange}
                />
                <View style={styles.pickerButtonsRow}>
                  <Pressable
                    style={styles.pickerSecondaryButton}
                    onPress={() => setShowTimePicker(false)}
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
                    onPress={handleConfirmTime}
                  >
                    <Text
                      style={[
                        styles.pickerPrimaryText,
                        { color: theme.onAccent || theme.background },
                      ]}
                    >
                      Use this time
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        )}

        {/* End Time Picker Modal */}
        {showEndTimePicker && (
          <Modal
            transparent
            animationType="fade"
            onRequestClose={() => setShowEndTimePicker(false)}
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
                  value={endTimeObj}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "clock"}
                  onChange={handleEndTimeChange}
                />
                <View style={styles.pickerButtonsRow}>
                  <Pressable
                    style={styles.pickerSecondaryButton}
                    onPress={() => setShowEndTimePicker(false)}
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
                    onPress={handleConfirmEndTime}
                  >
                    <Text
                      style={[
                        styles.pickerPrimaryText,
                        { color: theme.onAccent || theme.background },
                      ]}
                    >
                      Use this time
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        )}
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
});
