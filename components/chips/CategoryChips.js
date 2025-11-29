import React from "react";
import { ScrollView, Pressable, Text, StyleSheet, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

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

export default function CategoryChips({
  selectedCategory,
  onSelectCategory,
}) {
  const { theme } = useTheme();

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
    marginRight: 10,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: {
    fontSize: 14,
  },
});
