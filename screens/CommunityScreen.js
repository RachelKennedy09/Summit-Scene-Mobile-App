import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// post types (backend values and labels)
const POST_TYPES = [
  { label: "Highway Conditions", value: "highwayconditions" },
  { label: "Ride Share", value: "rideshare" },
  { label: "Event Budyy", value: "eventbuddy" },
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
  const [selectedType, setSelectedType] = useState("eventbuddy")

  // mock data later api
  const [posts] = useState(MOCK_POSTS)
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
