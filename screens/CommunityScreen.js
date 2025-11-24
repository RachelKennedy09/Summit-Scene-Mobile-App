import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// post types (backend values and labels)
const POST_TYPES = [
  { label: "Highway Conditions", value: "highwayconditions" },
  { label: "Ride Share", value: "rideshare" },
  { label: "Event Buddy", value: "eventbuddy" },
];

// Mock posts to shape UI
const MOCK_POSTS = [
  {
    id: "1",
    type: "highwayconditions",
    town: "Banff",
    title: "Snowy on Highway 1 near Banff",
    body: "Expect compact snow and low visibility this morning. Drive slow!",
  },
  {
    id: "2",
    type: "rideshare",
    town: "Canmore",
    title: "Ride to Lake Louise Saturday 7am",
    body: "Leaving from Canmore downtown, 2 spots available. Gas split.",
  },
  {
    id: "3",
    type: "eventbuddy",
    town: "Lake Louise",
    title: "Looking for buddy for night skiing at Norquay",
    body: "Anyone want to go Thursday night? Intermediate level.",
  },
];

export default function CommunityScreen() {
  const [selectedType, setSelectedType] = useState("eventbuddy");

  // mock data later api
  const [posts] = useState(MOCK_POSTS);

  const filteredPosts = useMemo(
    () => posts.filter((post) => post.type === selectedType),
    [posts, selectedType]
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.heading}>Community</Text>
      <Text style={styles.subheading}>
        A space for locals to share road conditions, rides, and event buddies.
      </Text>

      {/* Type selector pills */}
      <View style={styles.typeRow}>
        {POST_TYPES.map((type) => {
          const isActive = type.value === selectedType;
          return (
            <Pressable
              key={type.value}
              onPress={() => setSelectedType(type.value)}
              style={[styles.typePill, isActive && styles.typePillActive]}
            >
              <Text
                style={[
                  styles.typePillText,
                  isActive && styles.typePillTextActive,
                ]}
              >
                {type.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/*  Posts list for the selected board  */}
      <ScrollView
        contentContainerStyle={styles.sectionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredPosts.map((post) => (
          <View key={post.id} style={styles.sectionCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.sectionTitle}>{post.title}</Text>
            </View>
            <Text style={styles.sectionText}>{post.body}</Text>
          </View>
        ))}

        {/* Simple empty state for now */}
        {filteredPosts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptyText}>
              Be the first to share something in this board.
            </Text>
          </View>
        )}
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

  // Row of type pills
  typeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  typePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#243b53",
    backgroundColor: "#050b12",
  },
  typePillActive: {
    backgroundColor: "#1b3a57",
    borderColor: "#4a90e2",
  },
  typePillText: {
    color: "#c0d0f0",
    fontSize: 13,
  },
  typePillTextActive: {
    color: "#ffffff",
    fontWeight: "600",
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
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    flex: 1,
    marginRight: 8,
  },
  townTag: {
    fontSize: 12,
    color: "#c0d0f0",
    opacity: 0.9,
  },
  sectionText: {
    fontSize: 14,
    color: "#c0d0f0",
  },

  emptyState: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#08101c",
    borderWidth: 1,
    borderColor: "#243b53",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: "#b0c4de",
  },
});
