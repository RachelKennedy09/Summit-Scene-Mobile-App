// screens/EditEventScreen.js
// Edit an existing event
// Let business users update events they've already created

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
import { updateEvent } from "../../services/eventsApi.js";

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

const FORM_CATEGORIES = CATEGORIES.filter((cat) => cat !== "All");

export default function EditEventScreen({ route, navigation }) {
  const { token } = useAuth();
  const { event } = route.params; // event passed from EventDetailScreen

  // ----- INITIAL STATE FROM EXISTING EVENT -----
  const [title, setTitle] = useState(event.title || "");
  const [description, setDescription] = useState(event.description || "");
  const [town, setTown] = useState(event.town || TOWNS[0]);
  const [category, setCategory] = useState(
    FORM_CATEGORIES.includes(event.category)
      ? event.category
      : FORM_CATEGORIES[0]
  );

  // Date and Time state
  const initialDateObj = event.date ? new Date(event.date) : new Date();
  const [dateObj, setDateObj] = useState(initialDateObj);
  const [date, setDate] = useState(event.date || ""); // "YYYY-MM-DD"

  const [timeObj, setTimeObj] = useState(new Date());
  const [time, setTime] = useState(event.time || ""); // "7:00 PM" or ""

  const [location, setLocation] = useState(event.location || "");
  const [loading, setLoading] = useState(false);

  // Picker visibility toggles
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTownModal, setShowTownModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const handleDateChange = (e, selectedDate) => {
    setShowDatePicker(false);
    if (!selectedDate) return;

    setDateObj(selectedDate);

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const formatted = `${year}-${month}-${day}`;
    setDate(formatted);
  };

  const handleTimeChange = (e, selectedTime) => {
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
      Alert.alert("Not logged in", "Please log in before editing an event.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title,
        description,
        town,
        category,
        date,
        time,
        location,
      };

      // call shared API helper to update
      const updatedEvent = await updateEvent(event._id, payload, token);
      console.log("Event updated:", updatedEvent);

      Alert.alert("Updated", "Your event has been updated.", [
        {
          text: "OK",
          onPress: () => {
            // Go back to MyEvents so they can see the updated info
            navigation.navigate("MyEvents");
          },
        },
      ]);
    } catch (error) {
      console.error("Error updating event:", error);
      Alert.alert("Error", error.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Edit Event</Text>

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

        {/* Save button */}
        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Saving..." : "Save Changes"}
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
    backgroundColor: "#0B1520",
  },
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#FFFFFF",
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: "#C4D0E0",
  },
  input: {
    backgroundColor: "#1B2532",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    color: "#FFFFFF",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  selectButton: {
    backgroundColor: "#1B2532",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  selectButtonText: {
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#FF8A3D",
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
    color: "#0B1520",
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
    backgroundColor: "#0B1520",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  modalOption: {
    paddingVertical: 10,
  },
  modalOptionText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  modalCancel: {
    marginTop: 12,
    alignSelf: "flex-end",
  },
  modalCancelText: {
    color: "#FF8A3D",
    fontSize: 14,
  },
  pickerModalContent: {
    backgroundColor: "#0B1520",
    borderRadius: 12,
    padding: 16,
  },
});
