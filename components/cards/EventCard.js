// Reusable card for displaying a single event on the Hub

import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function EventCard({ event, onPress }) {
  const { theme } = useTheme();

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
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        {/* Category + town row */}
        <View style={styles.topRow}>
          {event.category ? (
            <View
              style={[
                styles.categoryPill,
                {
                  
                  backgroundColor: theme.accentSoft || theme.card,
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: theme.accent,
                  },
                ]}
              >
                {event.category}
              </Text>
            </View>
          ) : (
            <View />
          )}

          {event.town ? (
            <Text
              style={[
                styles.townText,
                {
                  color: theme.textMuted,
                },
              ]}
            >
              {event.town}
            </Text>
          ) : null}
        </View>

        {/* Title */}
        <Text
          style={[
            styles.title,
            {
              color: theme.text,
            },
          ]}
          numberOfLines={2}
        >
          {event.title || "Untitled event"}
        </Text>

        {/* Location */}
        {event.location ? (
          <Text
            style={[
              styles.location,
              {
                color: theme.text,
              },
            ]}
            numberOfLines={1}
          >
            📍 {event.location}
          </Text>
        ) : null}

        {/* Date + time */}
        <Text
          style={[
            styles.datetime,
            {
              color: theme.textMuted,
            },
          ]}
        >
          {dateTimeLabel}
        </Text>
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
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
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
  },

  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  townText: {
    fontSize: 12,
    fontWeight: "500",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  location: {
    fontSize: 13,
    marginBottom: 2,
  },

  datetime: {
    fontSize: 12,
    marginTop: 2,
  },
});
