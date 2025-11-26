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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useAuth } from "../../context/AuthContext.js";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../theme/colors";

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
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [town, setTown] = useState(TOWNS[0]); // default to Banff
  const [category, setCategory] = useState(FORM_CATEGORIES[0]); // default to first category

  // Date + Time state
  const [dateObj, setDateObj] = useState(new Date()); // Date object for picker
  const [date, setDate] = useState(""); // "YYYY-MM-DD"
  const [timeObj, setTimeObj] = useState(new Date());
  const [time, setTime] = useState(""); // "7:00 PM"

  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  // Picker visibility toggles
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTownModal, setShowTownModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const handleDateChange = (_, selectedDate) => {
    setShowDatePicker(false);
    if (!selectedDate) return;

    setDateObj(selectedDate);

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const formatted = `${year}-${month}-${day}`;
    setDate(formatted);
  };

  const handleTimeChange = (_, selectedTime) => {
    setShowTimePicker(false);
    if (!selectedTime) return;

    setTimeObj(selectedTime);

    let hours = selectedTime.getHours();
    const minutes = String(selectedTime.getMinutes()).padStart(2, "0");
    const isPM = hours >= 12;
    const displayHours = ((hours + 11) % 12) + 1; // 0–23 -> 1–12
    const suffix = isPM ? "PM" : "AM";

    const formatted = `${displayHours}:${minutes} ${suffix}`;
    setTime(formatted);
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
      const response = await fetch("http://172.28.248.13:4000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // send JWT
        },
        body: JSON.stringify({
          title,
          description,
          town,
          category,
          date, // "YYYY-MM-DD"
          time, // "7:00 PM" or ""
          location,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.error("Create event error response:", data);
        throw new Error(data.message || "Failed to create event");
      }

      const createdEvent = await response.json();
      console.info("Event created:", createdEvent);

      //  Show success alert, then go to "MyEvents" screen instead of goBack
      Alert.alert("Success", "Your event has been posted!", [
        {
          text: "OK",
          onPress: () => {
            // clear the form BEFORE navigating
            setTitle("");
            setDescription("");
            setLocation("");
            setDate("");
            setTime("");
            setTown(TOWNS[0]);
            setCategory(FORM_CATEGORIES[0]);
            setDateObj(new Date());
            setTimeObj(new Date());

            // Navigate to MyEvents so the user can confirm it's listed
            navigation.navigate("MyEvents");
          },
        },
      ]);
    } catch (error) {
      console.error("Error posting event:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Post a New Event</Text>

        {/* Title */}
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Event title"
          value={title}
          onChangeText={setTitle}
        />

        {/* Town */}
        <Text style={styles.label}>Town *</Text>
        <Pressable
          style={styles.selectButton}
          onPress={() => setShowTownModal(true)}
        >
          <Text style={styles.selectButtonText}>{town}</Text>
        </Pressable>

        {/* Category */}
        <Text style={styles.label}>Category *</Text>
        <Pressable
          style={styles.selectButton}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={styles.selectButtonText}>{category}</Text>
        </Pressable>

        {/* Date */}
        <Text style={styles.label}>Date (YYYY-MM-DD) *</Text>
        <Pressable onPress={() => setShowDatePicker(true)}>
          <View pointerEvents="none">
            <TextInput
              style={styles.input}
              placeholder="Select a date"
              value={date}
              editable={false}
            />
          </View>
        </Pressable>

        {/* Time */}
        <Text style={styles.label}>Time</Text>
        <Pressable onPress={() => setShowTimePicker(true)}>
          <View pointerEvents="none">
            <TextInput
              style={styles.input}
              placeholder="Select time (optional)"
              value={time}
              editable={false}
            />
          </View>
        </Pressable>

        {/* Location */}
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Venue or address"
          value={location}
          onChangeText={setLocation}
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Tell people what to expect"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Submit button */}
        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Town</Text>
            {TOWNS.map((t) => (
              <Pressable
                key={t}
                style={styles.modalOption}
                onPress={() => {
                  setTown(t);
                  setShowTownModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{t}</Text>
              </Pressable>
            ))}
            <Pressable
              style={styles.modalCancel}
              onPress={() => setShowTownModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            {FORM_CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                style={styles.modalOption}
                onPress={() => {
                  setCategory(cat);
                  setShowCategoryModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{cat}</Text>
              </Pressable>
            ))}
            <Pressable
              style={styles.modalCancel}
              onPress={() => setShowCategoryModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
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
            <View style={styles.pickerModalContent}>
              <DateTimePicker
                value={dateObj}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "calendar"}
                onChange={handleDateChange}
              />
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
            <View style={styles.pickerModalContent}>
              <DateTimePicker
                value={timeObj}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "clock"}
                onChange={handleTimeChange}
              />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },

  container: {
    padding: 16,
  },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: colors.textLight,
  },

  label: {
    fontSize: 14,
    marginBottom: 4,
    color: colors.textMuted,
  },

  input: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    color: colors.textLight,
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  selectButton: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },

  selectButtonText: {
    color: colors.textLight,
  },

  button: {
    backgroundColor: colors.cta,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 40,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: colors.primary,
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
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
  },

  modalTitle: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  modalOption: {
    paddingVertical: 10,
  },

  modalOptionText: {
    color: colors.textLight,
    fontSize: 16,
  },

  modalCancel: {
    marginTop: 12,
    alignSelf: "flex-end",
  },

  modalCancelText: {
    color: colors.cta,
    fontSize: 14,
  },

  pickerModalContent: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
  },
});
