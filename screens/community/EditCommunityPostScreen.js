// screens/EditCommunityPostScreen.js
// Edit an existing community post: title, body, date

import React, { useState } from "react";
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
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function EditCommunityPostScreen({ route, navigation }) {
  const { post } = route.params; // post passed in from CommunityScreen
  const { token } = useAuth();
  const { theme } = useTheme();

  const [title, setTitle] = useState(post.title || "");
  const [body, setBody] = useState(post.body || "");
  const [targetDate, setTargetDate] = useState(
    post.targetDate ? new Date(post.targetDate) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL || "http://172.28.248.13:4000";

  async function handleSave() {
    if (!title.trim() || !body.trim()) {
      Alert.alert("Missing info", "Please fill in title and details.");
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
        title: title.trim(),
        body: body.trim(),
        targetDate: targetDate.toISOString(),
      };

      const res = await fetch(`${API_BASE_URL}/api/community/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update post");
      }

      await res.json();

      Alert.alert("Post updated", "Your community post has been updated.");
      navigation.goBack(); // CommunityScreen will refetch on focus
    } catch (err) {
      console.error("Error updating community post:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.heading, { color: theme.text }]}>
          Edit Community Post
        </Text>
        <Text style={[styles.subheading, { color: theme.textMuted }]}>
          Update the details of your post. Board and town stay the same.
        </Text>

        {/* Show board + town as readonly */}
        <View style={styles.readonlyRow}>
          <Text style={[styles.readonlyLabel, { color: theme.textMuted }]}>
            Board:
          </Text>
          <Text style={[styles.readonlyValue, { color: theme.text }]}>
            {post.type === "highwayconditions"
              ? "Highway Conditions"
              : post.type === "rideshare"
              ? "Ride Share"
              : "Event Buddy"}
          </Text>
        </View>

        <View style={styles.readonlyRow}>
          <Text style={[styles.readonlyLabel, { color: theme.textMuted }]}>
            Town:
          </Text>
          <Text style={[styles.readonlyValue, { color: theme.text }]}>
            {post.town}
          </Text>
        </View>

        {/* Date */}
        <Text style={[styles.label, { color: theme.textMuted }]}>Date</Text>
        <Pressable
          onPress={() => setShowDatePicker(true)}
          style={[
            styles.input,
            {
              borderColor: theme.border,
              backgroundColor: theme.card,
            },
          ]}
        >
          <Text style={{ color: theme.text }}>
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
              if (selectedDate) setTargetDate(selectedDate);
            }}
          />
        )}

        {/* Title */}
        <Text style={[styles.label, { color: theme.textMuted }]}>Title</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: theme.border,
              backgroundColor: theme.card,
              color: theme.text,
            },
          ]}
          placeholder="Short summary..."
          placeholderTextColor={theme.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        {/* Body */}
        <Text style={[styles.label, { color: theme.textMuted }]}>Details</Text>
        <TextInput
          style={[
            styles.input,
            styles.inputMultiline,
            {
              borderColor: theme.border,
              backgroundColor: theme.card,
              color: theme.text,
            },
          ]}
          placeholder="Update any info, conditions, times, meetup spot, etc."
          placeholderTextColor={theme.textMuted}
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={4}
        />

        {error && (
          <Text
            style={[
              styles.errorText,
              { color: theme.error || "#ff4d4f" },
            ]}
          >
            {error}
          </Text>
        )}

        <Pressable
          onPress={handleSave}
          disabled={submitting}
          style={[
            styles.submitButton,
            {
              backgroundColor: theme.accent,
            },
            submitting && { opacity: 0.6 },
          ]}
        >
          <Text
            style={[
              styles.submitButtonText,
              { color: theme.background },
            ]}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },

  subheading: {
    fontSize: 14,
    marginBottom: 16,
  },

  /* ---- READONLY FIELDS ---- */
  readonlyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  readonlyLabel: {
    fontSize: 14,
    marginRight: 4,
  },

  readonlyValue: {
    fontSize: 14,
    fontWeight: "600",
  },

  /* ---- INPUT LABEL ---- */
  label: {
    fontSize: 14,
    marginBottom: 6,
    marginTop: 12,
  },

  /* ---- INPUTS ---- */
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },

  inputMultiline: {
    height: 100,
    textAlignVertical: "top",
  },

  /* ---- ERRORS ---- */
  errorText: {
    marginTop: 8,
    fontSize: 13,
  },

  /* ---- SUBMIT BUTTON ---- */
  submitButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },

  submitButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
