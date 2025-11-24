import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

const POST_TYPES = [
  { label: "Highway Conditions", value: "highwayconditions" },
  { label: "Ride Share", value: "rideshare" },
  { label: "Event Buddy", value: "eventbuddy" },
];

const TOWNS = [
  { label: "Banff", value: "Banff" },
  { label: "Canmore", value: "Canmore" },
  { label: "Lake Louise", value: "Lake Louise" },
];

export default function CreateCommunityPostScreen({ navigation }) {
  const { token } = useAuth();

  const [type, setType] = useState("highwaycondtions");
  const [town, setTown] = useState("Banff");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL || "http://172.28.248.13:4000";

  async function handleSubmit() {
    // basic validation
    if (!title.trim() || !body.trim()) {
      Alert.alert("Missing info", "Please add a title and some details.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/api/community`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          town,
          title: title.trim(),
          body: body.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create post");
      }

      await res.json();

      Alert.alert("Post shared!", "Your community post has been created.");
      setTitle("");
      setBody("");
      navigation.goBack();
    } catch (error) {
      console.log("Error creating community post:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>New Community Post</Text>
        <Text style={styles.subheading}>
          Share highway conditions, rides, or find an event buddy.
        </Text>

        {/* Type selector (very simple pills) */}
        <Text style={styles.label}>Board</Text>
        <View style={styles.row}>
          {POST_TYPES.map((option) => {
            const isActive = option.value === type;
            return (
              <Pressable
                key={option.value}
                onPress={() => setType(option.value)}
                style={[styles.pill, isActive && styles.pillActive]}
              >
                <Text
                  style={[styles.pillText, isActive && styles.pillTextActive]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Town selector */}
        <Text style={styles.label}>Town</Text>
        <View style={styles.row}>
          {TOWNS.map((option) => {
            const isActive = option.value === town;
            return (
              <Pressable
                key={option.value}
                onPress={() => setTown(option.value)}
                style={[styles.pill, isActive && styles.pillActive]}
              >
                <Text
                  style={[styles.pillText, isActive && styles.pillTextActive]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Title input */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Short summary..."
          placeholderTextColor="#66758a"
          value={title}
          onChangeText={setTitle}
        />

        {/* Body input */}
        <Text style={styles.label}>Details</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="Add helpful info (conditions, times, meetup spot, etc.)"
          placeholderTextColor="#66758a"
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={4}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          style={[styles.submitButton, submitting && { opacity: 0.6 }]}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? "Posting..." : "Share Post"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050b12",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: "#b0c4de",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#c0d0f0",
    marginBottom: 6,
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#243b53",
    backgroundColor: "#050b12",
  },
  pillActive: {
    backgroundColor: "#1b3a57",
    borderColor: "#4a90e2",
  },
  pillText: {
    fontSize: 13,
    color: "#c0d0f0",
  },
  pillTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#243b53",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#ffffff",
    backgroundColor: "#0c1624",
    fontSize: 14,
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: "top",
  },
  errorText: {
    marginTop: 8,
    color: "#ff8a8a",
    fontSize: 13,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: "#4a90e2",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
