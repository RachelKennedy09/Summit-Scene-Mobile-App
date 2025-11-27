// Reusable card for displaying a single event on the Hub

import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "../../theme/colors";

export default function EventCard({ event, onPress }) {
  if (!event) return null;
  const hasDate = Boolean(event.date);
  const hasStartTime = Boolean(event.time);
  const hasEndTime = Boolean(event.endTime);

  let dateTimeLabel = "Date & time TBA";

  if (hasDate && hasStartTime && hasEndTime) {
    dateTimeLabel = `${event.date} • ${event.time} – ${event.endTime}`;
  } else if (hasDate && hasStartTime) {
    dateTimeLabel = `${event.date} • ${event.time}`;
  } else if (hasDate) {
    dateTimeLabel = event.date;
  } else if (hasStartTime && hasEndTime) {
    dateTimeLabel = `${event.time} – ${event.endTime}`;
  } else if (hasStartTime) {
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
        {/* Category + town row */}
        <View style={styles.topRow}>
          {event.category ? (
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
          ) : (
            <View />
          )}

          {event.town ? (
            <Text style={styles.townText}>{event.town}</Text>
          ) : null}
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {event.title || "Untitled event"}
        </Text>

        {/* Location */}
        {event.location ? (
          <Text style={styles.location} numberOfLines={1}>
            📍 {event.location}
          </Text>
        ) : null}

        {/* Date + time */}
        <Text style={styles.datetime}>{dateTimeLabel}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 14,
    marginBottom: 12,
  },

  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  card: {
    backgroundColor: colors.secondary,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.tealTint,
  },

  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  townText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "500",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textLight,
    marginBottom: 4,
  },

  location: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 2,
  },

  datetime: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
