// Horizontal row of town filter chips (Banff, Canmore, Lake Louise, etc.)

import React from "react";
import { ScrollView, Pressable, Text, StyleSheet, View } from "react-native";

import { colors } from "../../theme/colors";

const TOWNS = ["All", "Banff", "Canmore", "Lake Louise"];

export default function TownChips({ selectedTown, onSelectTown }) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {TOWNS.map((town) => {
          const isActive = selectedTown === town;
          return (
            <Pressable
              key={town}
              onPress={() => onSelectTown(town)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text
                style={[styles.chipText, isActive && styles.chipTextActive]}
              >
                {town}
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
    marginBottom: 8,
  },

  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },

  chip: {
    paddingHorizontal: 14,
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
