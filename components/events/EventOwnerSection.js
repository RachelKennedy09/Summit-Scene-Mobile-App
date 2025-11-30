// components/events/EventOwnerSection.js
// Owner-only controls for an event (badge + edit/delete buttons)

import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function EventOwnerSection({ onEdit, onDelete }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.ownerSection, { backgroundColor: theme.card }]}>
      <Text
        style={[
          styles.ownerBadge,
          {
            backgroundColor: theme.accent,
            color: theme.onAccent || theme.background,
          },
        ]}
      >
        This is your event
      </Text>

      <View style={styles.ownerButtonsRow}>
        <Pressable
          style={[
            styles.ownerButton,
            styles.editButton,
            { backgroundColor: theme.accent },
          ]}
          onPress={onEdit}
        >
          <Text
            style={[
              styles.ownerButtonText,
              { color: theme.onAccent || theme.background },
            ]}
          >
            Edit Event
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.ownerButton,
            styles.deleteButton,
            {
              backgroundColor: theme.danger || "#ff4d4f",
            },
          ]}
          onPress={onDelete}
        >
          <Text
            style={[
              styles.ownerButtonText,
              { color: theme.onDanger || theme.background },
            ]}
          >
            Delete Event
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ownerSection: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
  },

  ownerBadge: {
    alignSelf: "flex-start",
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  ownerButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },

  ownerButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  editButton: {},
  deleteButton: {},

  ownerButtonText: {
    fontWeight: "600",
    fontSize: 14,
  },
});
