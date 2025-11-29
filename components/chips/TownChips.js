// Horizontal row of town filter chips (Banff, Canmore, Lake Louise, etc.)

import React from "react";
import { ScrollView, Pressable, Text, StyleSheet, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const TOWNS = ["All", "Banff", "Canmore", "Lake Louise"];

export default function TownChips({ selectedTown, onSelectTown }) {
  const { theme } = useTheme();

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
              style={[
                styles.chip,
                {
                  backgroundColor: isActive ? theme.accent : theme.card,
                  borderColor: isActive ? theme.accent : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isActive ? theme.background : theme.textMuted,
                    fontWeight: isActive ? "700" : "500",
                  },
                ]}
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
    marginRight: 10,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
  },

  chipText: {
    fontSize: 14,
  },
});
