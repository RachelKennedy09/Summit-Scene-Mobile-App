// Show full details for a single event

import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

export default function EventDetailScreen({ route }) {
  const { event } = route.params; // event was passed in navigate(..., {event})
  return (
    <ScrollView style={styles.container}>
      {/* hero image */}
      {event.imageUrl ? (
        <Image source={{ uri: event.imageUrl }} style={styles.heroImage} />
      ) : null}
      <View style={styles.content}>
        <Text style={styles.category}>{event.category}</Text>
        <Text style={styles.title}>{event.title}</Text>

        <Text style={styles.meta}>
          {event.town} • {event.date}
          {event.time ? ` • ${event.time}` : ""}
        </Text>

        {event.location ? (
          <Text style={styles.location}>📍 {event.location}</Text>
        ) : null}

        {event.description ? (
          <>
            <Text style={styles.sectionHeading}>About this event</Text>
            <Text style={styles.description}>{event.description}</Text>
          </>
        ) : (
          <Text style={styles.description}>
            No detailed description added yet. Check back soon!
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1724",
  },
  heroImage: {
    width: "100%",
    height: 220,
  },
  content: {
    padding: 16,
  },
  category: {
    fontSize: 13,
    fontWeight: "600",
    color: "#a5d6ff",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 6,
  },
  meta: {
    fontSize: 14,
    color: "#c2d0e8",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#d1e0ff",
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 6,
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: "#c2d0e8",
    lineHeight: 20,
  },
});
