// Reusable card for displaying a single event on the Hub

import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "../../theme/colors";

export default function EventCard({ event, onPress }) {
  const hasDate = Boolean(event.date);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardWrapper,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.card}>
        {/* Category */}
        {event.category ? (
          <Text style={styles.category}>{event.category}</Text>
        ) : null}

        {/* Title */}
        <Text style={styles.title}>{event.title}</Text>

        {/* Location */}
        {event.location ? (
          <Text style={styles.location}>{event.location}</Text>
        ) : null}

        {/* Date + Time */}
        <Text style={styles.datetime}>
          {hasDate ? event.date : ""}
          {hasDate && event.time ? ` • ${event.time}` : ""}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 12,
    marginBottom: 12,
  },

  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },

  card: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  category: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textLight,
    marginBottom: 4,
  },

  location: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 2,
  },

  datetime: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
