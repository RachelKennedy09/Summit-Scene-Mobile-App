// Horizontal row of category filter chips ( taken from hubscreen)

import React from "react";
import { ScrollView, Pressable, Text, StyleSheet, View } from "react-native";

import { colors } from "../../theme/colors";


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
    borderColor: colors.border,              
    backgroundColor: colors.secondary,      
    marginRight: 10,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
  },

  chipActive: {
    backgroundColor: colors.primary,         
    borderColor: colors.accent,             
  },

  chipText: {
    color: colors.textLight,                
    fontSize: 14,
    fontWeight: "500",
  },

  chipTextActive: {
    color: colors.textLight,                
    fontWeight: "700",
  },
});
