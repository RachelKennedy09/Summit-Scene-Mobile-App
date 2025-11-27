// Reusable card for displaying a single event on the Hub

import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "../../theme/colors";

export default function EventCard({ event, onPress }) {
  if (!event) return null;

  const hasDate = Boolean(event.date);
  const hasTime = Boolean(event.time);

  // Build a friendlier date/time label, but keep same data
  let dateTimeLabel = "Date & time TBA";

  if (hasDate && hasTime) {
    dateTimeLabel = `${event.date} • ${event.time}`;
  } else if (hasDate) {
    dateTimeLabel = event.date;
  } else if (hasTime) {
    dateTimeLabel = event.time;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardWrapper,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.card}>
        {/* Category pill */}
        {event.category ? (
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
        ) : null}

        {/* Title */}
        <Text style={styles.title}>{event.title || "Untitled event"}</Text>

        {/* Location */}
        {event.location ? (
          <Text style={styles.location}>{event.location}</Text>
        ) : null}

        {/* Date + Time */}
        <Text style={styles.datetime}>{dateTimeLabel}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 16,
    marginBottom: 12,
  },

  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  card: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },

  categoryPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginBottom: 6,
  },

  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textLight,
    marginBottom: 6,
  },

  location: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },

  datetime: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
