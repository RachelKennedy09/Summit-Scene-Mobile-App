// components/account/ThemeSection.js
import React from "react";
import { View, Text, Pressable, Switch, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export default function ThemeSection({
  theme,
  themeName,
  setThemeName,
  isDark,
  toggleLightDark,
}) {
  const themes = [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
    { id: "feminine", label: "Feminine" },
    { id: "masculine", label: "Masculine" },
    { id: "rainbow", label: "Rainbow" },
  ];

  return (
    <>
      {/* App Theme Pills */}
      <Text
        style={[
          styles.appThemeTitle,
          {
            color: theme.text,
          },
        ]}
      >
        App Theme
      </Text>

      <View style={styles.pillRow}>
        {themes.map((item) => {
          const isActive = themeName === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setThemeName(item.id)}
              style={[
                styles.themePill,
                {
                  borderColor: isActive ? theme.accent : theme.border,
                  backgroundColor: isActive ? theme.accent : theme.card,
                },
              ]}
            >
              <Text
                style={{
                  color: isActive ? theme.onAccent || "#000" : theme.text,
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Appearance: Light / Dark toggle */}
      <View
        style={[
          styles.themeCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.themeRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Appearance
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>
              Switch quickly between light and dark mode.
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleLightDark}
            trackColor={{
              false: theme.border,
              true: theme.accent,
            }}
            thumbColor={isDark ? theme.accent : "#f4f3f4"}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  appThemeTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 8,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  themePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 8,
  },
  themeCard: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textLight,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 10,
  },
});
