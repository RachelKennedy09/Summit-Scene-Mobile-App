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

export default function EditCommunityPostScreen({ route, navigation }) {
  const { post } = route.params; // post passed in from CommunityScreen
  const { token } = useAuth();

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
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Edit Community Post</Text>
        <Text style={styles.subheading}>
          Update the details of your post. Board and town stay the same.
        </Text>

        {/* Show board + town as readonly */}
        <View style={styles.readonlyRow}>
          <Text style={styles.readonlyLabel}>Board:</Text>
          <Text style={styles.readonlyValue}>
            {post.type === "highwayconditions"
              ? "Highway Conditions"
              : post.type === "rideshare"
              ? "Ride Share"
              : "Event Buddy"}
          </Text>
        </View>

        <View style={styles.readonlyRow}>
          <Text style={styles.readonlyLabel}>Town:</Text>
          <Text style={styles.readonlyValue}>{post.town}</Text>
        </View>

        {/* Date */}
        <Text style={styles.label}>Date</Text>
        <Pressable onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text style={{ color: "#ffffff" }}>
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
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Short summary..."
          placeholderTextColor="#66758a"
          value={title}
          onChangeText={setTitle}
        />

        {/* Body */}
        <Text style={styles.label}>Details</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="Update any info, conditions, times, meetup spot, etc."
          placeholderTextColor="#66758a"
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={4}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Pressable
          onPress={handleSave}
          disabled={submitting}
          style={[styles.submitButton, submitting && { opacity: 0.6 }]}
        >
          <Text style={styles.submitButtonText}>
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
  readonlyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  readonlyLabel: {
    fontSize: 14,
    color: "#c0d0f0",
    marginRight: 4,
  },
  readonlyValue: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
  },
  label: {
    fontSize: 14,
    color: "#c0d0f0",
    marginBottom: 6,
    marginTop: 12,
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
