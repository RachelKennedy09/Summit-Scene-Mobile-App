// Horizontal row of category filter chips ( taken from hubscreen)

import React from "react";
import { ScrollView, Pressable, Text, StyleSheet, View } from "react-native";

const CATEGORIES = [
  "All",
  "Market",
  "Wellness",
  "Music",
  "Workshop",
  "Family",
  "Retail",
  "Outdoors",
  "Food",
  "Art",
];

export default function CategoryChips({ selectedCategory, onSelectCategory }) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <Pressable
              key={category}
              onPress={() => onSelectCategory(category)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text
                style={[styles.chipText, isActive && styles.chipTextActive]}
              >
                {category}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2c3e57",
    backgroundColor: "#121f33",
    marginRight: 10,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: "#1c3250",
    borderColor: "#a5d6ff",
  },
  chipText: {
    color: "#d1e0ff",
    fontSize: 14,
    fontWeight: "500",
  },
  chipTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
