// components/account/AccountHeaderCard.js
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export default function AccountHeaderCard({
  theme,
  displayName,
  roleLabel,
  email,
  town,
  joinedText,
  avatarUrl,
}) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: theme.pill || colors.cardDark },
          ]}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <Text
              style={[
                styles.avatarInitial,
                { color: theme.onAccent || theme.text },
              ]}
            >
              {displayName.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>

        <View style={styles.headerTextCol}>
          <Text style={[styles.greeting, { color: theme.text }]}>
            Hi, {displayName}
          </Text>
          <Text style={[styles.roleTag, { color: theme.textMuted }]}>
            {roleLabel}
          </Text>
          <Text style={[styles.metaText, { color: theme.textMuted }]}>
            Email: {email}
          </Text>
          <Text style={[styles.metaText, { color: theme.textMuted }]}>
            Town: {town}
          </Text>
          <Text style={[styles.metaText, { color: theme.textMuted }]}>
            Member since: {joinedText}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.cardDark,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textLight,
  },
  headerTextCol: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textLight,
    marginBottom: 2,
  },
  roleTag: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textMuted,
    marginBottom: 6,
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
