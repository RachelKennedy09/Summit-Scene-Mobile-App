import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";

import { colors } from "../../theme/colors";

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

export default function CommunityPostScreen({ navigation }) {
  const { token, user } = useAuth();

  const [type, setType] = useState("highwayconditions");
  const [town, setTown] = useState("Banff");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetDate, setTargetDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL || "http://172.28.248.13:4000";

  // Pre-fill name from logged-in user if available
  useEffect(() => {
    if (!name && user) {
      const inferredName = user.name || user.email || "";
      if (inferredName) {
        setName(inferredName);
      }
    }
  }, [user, name]);

  const detailsPlaceholder = useMemo(() => {
    if (type === "highwayconditions") {
      return "Road, pass, or parking lot conditions. Add time, direction, and any hazards.";
    }
    if (type === "rideshare") {
      return "Where you're leaving from, time, number of seats, gear space, and cost split if any.";
    }
    if (type === "eventbuddy") {
      return "Which event, date, meetup spot, vibe you're looking for (chill night, dancing, etc.).";
    }
    return "Add helpful info (conditions, times, meetup spot, etc.)";
  }, [type]);

  async function handleSubmit() {
    // basic validation
    if (!name.trim()) {
      Alert.alert("Missing info", "Please enter your name.");
      return;
    }
    if (!title.trim() || !body.trim()) {
      Alert.alert("Missing info", "Please add a title and some details.");
      return;
    }
    if (!targetDate) {
      Alert.alert("Missing info", "Please select a date for this post.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        type,
        town,
        name: name.trim(),
        title: title.trim(),
        body: body.trim(),
        targetDate: targetDate.toISOString(),
      };

      const res = await fetch(`${API_BASE_URL}/api/community`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create post");
      }

      await res.json();

      Alert.alert(
        "Post shared!",
        "Your community post has been created. Other members can now reply under your post."
      );
      setTitle("");
      setBody("");
      setTargetDate(new Date());
      // keep name as-is so next post is easier
      navigation.goBack();
    } catch (error) {
      console.error("Error creating community post:", error);
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
          Share highway conditions, rides, or find an event buddy. Your name
          will show on this post so neighbours know who they’re connecting with.
        </Text>

        {/* Type selector (board) */}
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

        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor="#66758a"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.helperText}>
          This name appears on your post and replies thread.
        </Text>

        {/* Date */}
        <Text style={styles.label}>Date</Text>
        <Pressable onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text style={{ color: colors.textLight }}>
            {targetDate.toLocaleDateString()}
          </Text>
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            value={targetDate}
            mode="date"
            display={Platform.OS === "android" ? "calendar" : "spinner"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);

              if (event.type === "dismissed") return;

              if (selectedDate) {
                setTargetDate(selectedDate);
              }
            }}
          />
        )}

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
          placeholder={detailsPlaceholder}
          placeholderTextColor="#66758a"
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={4}
        />
        <Text style={styles.helperText}>
          Replies are public. Avoid sharing phone numbers or emails unless
          you’re comfortable doing so.
        </Text>

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
    backgroundColor: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textLight,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 6,
    marginTop: 12,
  },
  helperText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
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
    borderColor: colors.border,
    backgroundColor: colors.primary,
  },
  pillActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.accent,
  },
  pillText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  pillTextActive: {
    color: colors.textLight,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.textLight,
    backgroundColor: colors.secondary,
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: "top",
  },
  errorText: {
    marginTop: 8,
    color: colors.error,
    fontSize: 13,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: colors.accent,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  submitButtonText: {
    color: colors.textLight,
    fontSize: 15,
    fontWeight: "600",
  },
});
