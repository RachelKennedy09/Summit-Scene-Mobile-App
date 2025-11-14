import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CommunityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.heading}>Community</Text>
      <Text style={styles.subheading}>
        A space for locals to share tips, updates, questions, and community
        news.
      </Text>

      {/* Section List *static for now) */}
      <ScrollView
        contentContainerStyle={styles.sectionsContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>General Chat</Text>
          <Text style={styles.sectionText}>
            Discuss snow conditions, trail updates, cafe recommendations, and
            more
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Local Questions</Text>
          <Text style={styles.sectionText}>
            "Best place for breakfast in Canmore?" - "How icy is the Lake Louise
            trail"
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Ride Share / Carpool</Text>
          <Text style={styles.sectionText}>
            Connect with others heading to Banff, Canmore, LL, or Sunshine. Or
            click here for Roam Transit information.
          </Text>
        </View>

        <Pressable style={styles.button} disabled>
          <Text style={styles.buttonText}>
            Community Features Locked (sprint 4+)
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
  sectionsContainer: {
    paddingBottom: 32,
    gap: 16,
  },
  sectionCard: {
    backgroundColor: "#0c1624",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#243b53",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 14,
    color: "#c0d0f0",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#243b53",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    opacity: 0.7,
  },
  buttonText: {
    color: "#c0d0f0",
    fontSize: 14,
    fontWeight: "600",
  },
});
