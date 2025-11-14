import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.heading}>Account</Text>
      <Text style={styles.subheading}>
        Manage your profile, preferences, and saved events in future sprints.
      </Text>

      {/* Profile summary placeholder */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Signed in as Guest</Text>
        <Text style={styles.cardText}>
          Authentication and user profiles aret implemented yet. For now, Summit
          Scene runs in guest mode.
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Saved events</Text>
          <Text style={styles.infoValue}>Coming Soon</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoValue}>Banff / Canmore / Lake Louise</Text>
        </View>
      </View>

      {/* Settings placeholder */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Settings</Text>
        <Text style={styles.cardText}>In a later sprint, ill be able to:</Text>
        <Text style={styles.bullet}>Turn on/off notifications</Text>
        <Text style={styles.bullet}>Choose my home town</Text>
        <Text style={styles.bullet}>Manage saved events</Text>

        <Pressable style={styles.button} disabled>
          <Text style={styles.buttonText}>
            Account Features Locked (Future Sprint)
          </Text>
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
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#0c1624",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#243b53",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: "#c0d0f0",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: "#9fb3c8",
  },
  infoValue: {
    fontSize: 14,
    color: "#d1e0ff",
    fontWeight: "500",
  },
  bullet: {
    fontSize: 14,
    color: "#bfc9dbff",
    marginBottom: 2,
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#243b53",
    alignItems: "center",
    opacity: 0.7,
  },
  buttonText: {
    color: "#c0d0f0",
    fontSize: 14,
    fontWeight: "600",
  },
});
