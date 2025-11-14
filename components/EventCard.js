// Reusable card for dsplaying a single event on the Hub (taken from hubscreen)
// visual component

import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function EventCard({ event, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardWrapper,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.card}>
        {event.category ? (
          <Text style={styles.category}>{event.category}</Text>
        ) : null}
        <Text style={styles.title}>{event.title}</Text>

        {event.location ? (
          <Text style={styles.location}>{event.location}</Text>
        ) : null}

        <Text style={styles.datetime}>
          {event.date} {event.date ? `• ${event.time}` : ""}
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
    backgroundColor: "#152238",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#243b53",
  },
  category: {
    fontSize: 12,
    fontWeight: "600",
    color: "#a5d6ff",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#d1e0ff",
    marginBottom: 2,
  },
  datetime: {
    fontSize: 12,
    color: "#9fb3c8",
  },
});
