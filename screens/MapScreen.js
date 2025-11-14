import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TOWNS = ["All", "Banff", "Canmore", "Lake Louise"];

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.heading}>Explore by Map</Text>
      <Text style={styles.subheading}>
        {" "}
        Soon you’ll see events pinned across Banff, Canmore & Lake Louise..
      </Text>

      {/* Filter chips (static for now) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {TOWNS.map((town) => (
          <Pressable key={town} style={styles.chip}>
            <Text style={styles.chipText}>{town}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Map of placeholder box */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapTitle}>Map coming soon</Text>
        <Text style={styles.mapText}>
          This area will show interactive map with event pins and clusters.
        </Text>
        <Text style={styles.mapHint}>
          Backend + map integration happens in later sprints.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050b12", // slightly darker than Hub
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
  chipRow: {
    paddingVertical: 4,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  chip: {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 999,
  borderWidth: 1,
  borderColor: "#2c3e57",
  backgroundColor: "#121f33",
  marginRight: 8,
  alignSelf: "flex-start",
},
  chipText: {
    color: "#d1e0ff",
    fontSize: 13,
    fontWeight: "500",
  },
  mapPlaceholder: {
    flex: 1,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2c3e57",
    backgroundColor: "#0c1624",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
  },
  mapText: {
    fontSize: 14,
    color: "#c0d0f0",
    textAlign: "center",
    marginBottom: 8,
  },
  mapHint: {
    fontSize: 12,
    color: "#7e8fa8",
    textAlign: "center",
  },
});
