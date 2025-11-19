import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../context/AuthContext.js";
import { useNavigation } from "@react-navigation/native";

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

export default function PostEventScreen() {
  const navigation = useNavigation();
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [town, setTown] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

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
          Authorization: `Bearer ${token}`, //send JWT
        },
        body: JSON.stringify({
          title,
          description,
          town,
          category,
          date,
          time,
          location,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.log("Create event error:", data);
        throw new Error(data.message || "Failed to create event");
      }

      const createdEvent = await response.json();
      console.log("Event created:", createdEvent);

      Alert.alert("Success", "Your event has been posted!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(), // back to "MyEvents"
        },
      ]);

      // Clear form
      setTitle("");
      setDescription("");
      setLocation("");
      setDate("");
      setTime("");
      setTown("");
      setCategory("");
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

        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Event title"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Town *</Text>
        <TextInput
          style={styles.input}
          placeholder="Banff / Canmore / Lake Louise"
          value={town}
          onChangeText={setTown}
        />

        <Text style={styles.label}>Category *</Text>
        <TextInput
          style={styles.input}
          placeholder="Music, Food & Drink..."
          value={category}
          onChangeText={setCategory}
        />

        <Text style={styles.label}>Date (YYY-MM-DD) * </Text>
        <TextInput
          style={styles.input}
          placeholder="2025-12-01"
          value={date}
          onChangeText={setDate}
        />

        <Text style={styles.label}>Time</Text>
        <TextInput
          style={styles.input}
          placeholder="7:00 PM"
          value={time}
          onChangeText={setTime}
        />
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Venue or address"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Tell people what to expect"
          value={description}
          onChangeText={setDescription}
          multiline
        />

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B1520", // or your app background; adjust
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
});
