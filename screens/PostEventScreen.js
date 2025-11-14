import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostEventScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Add a New Event</Text>
      <Text style={styles.subheading}>
        Soon we will be able to post markets, live music, workshops, and more
        happening around Banff, Canmore and Lake Louise
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Event posting is coming soon</Text>
        <Text style={styles.cardText}>
          In a later sprint, this screen will include a full event form with:
        </Text>
        <Text style={styles.bullet}>Title and description</Text>
        <Text style={styles.bullet}>Date and Time</Text>
        <Text style={styles.bullet}>Town and exact location </Text>
        <Text style={styles.bullet}>Category and price</Text>

        <Pressable style={styles.button} disable>
          <Text style={styles.buttonText}> Event Form Locked (Sprint 3-4)</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050b12",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: "#b0c4de",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#0c1624",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#243b53",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#c0d0f0",
    marginBottom: 8,
  },
  bullet: {
    fontSize: 14,
    color: "#d1e0ff",
    marginBottom: 2,
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#243b53",
    opacity: 0.7,
    alignItems: "center",
  },
  buttonText: {
    color: "#c0d0f0",
    fontSize: 14,
    fontWeight: "600",
  },
});
