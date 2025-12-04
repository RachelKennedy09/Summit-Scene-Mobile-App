// components/account/ProfileCard.js
import React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { colors } from "../../theme/colors";
import { AVATARS } from "../../assets/avatars/avatarConfig";

export default function ProfileCard({
  theme,
  user,
  isBusiness,
  onEditProfile,
}) {
  const profileSectionTitle = isBusiness
    ? "Event posting profile"
    : "Community profile";

  const profileSectionSubtitle = isBusiness
    ? "This is how your profile appears on Hub and Map when you post events."
    : "This is how your profile appears on Community posts and replies.";

  const hasProfileDetails = Boolean(
    user.bio ||
      user.lookingFor ||
      user.instagram ||
      (isBusiness && user.website)
  );

  // --- Avatar logic: prefer avatarKey -> avatarUrl -> initials ---
  const avatarSource =
    user?.avatarKey && AVATARS[user.avatarKey]
      ? AVATARS[user.avatarKey]
      : user?.avatarUrl
      ? { uri: user.avatarUrl }
      : null;

  const displayName = user?.name || "SummitScene member";
  const initial = (displayName && displayName.charAt(0).toUpperCase()) || "?";
  const town = user?.town || "Rockies local";

  return (
    <View
      style={[
        styles.profileCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      {/* Header row with avatar + name/town */}
      <View style={styles.headerRow}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: theme.pill || colors.cardDark },
          ]}
        >
          {avatarSource ? (
            <Image source={avatarSource} style={styles.avatarImage} />
          ) : (
            <Text
              style={[
                styles.avatarInitial,
                { color: theme.onAccent || theme.text },
              ]}
            >
              {initial}
            </Text>
          )}
        </View>

        <View style={styles.headerTextCol}>
          <Text style={[styles.headerName, { color: theme.text }]}>
            {displayName}
          </Text>
          <Text style={[styles.headerTown, { color: theme.textMuted }]}>
            {town}
          </Text>
        </View>
      </View>

      {/* Section title + subtitle */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        {profileSectionTitle}
      </Text>
      <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>
        {profileSectionSubtitle}
      </Text>

      {/* Profile details */}
      {hasProfileDetails ? (
        <>
          {user.bio ? (
            <>
              <Text style={[styles.label, { color: theme.textMuted }]}>
                About
              </Text>
              <Text style={[styles.value, { color: theme.text }]}>
                {user.bio}
              </Text>
            </>
          ) : null}

          {user.lookingFor ? (
            <>
              <Text style={[styles.label, { color: theme.textMuted }]}>
                {isBusiness ? "Business type" : "What you're looking for"}
              </Text>
              <Text style={[styles.value, { color: theme.text }]}>
                {user.lookingFor}
              </Text>
            </>
          ) : null}

          {user.instagram ? (
            <>
              <Text style={[styles.label, { color: theme.textMuted }]}>
                Instagram
              </Text>
              <Text style={[styles.linkValue, { color: theme.accent }]}>
                {user.instagram}
              </Text>
            </>
          ) : null}

          {isBusiness && user.website ? (
            <>
              <Text style={[styles.label, { color: theme.textMuted }]}>
                Website
              </Text>
              <Text style={[styles.linkValue, { color: theme.accent }]}>
                {user.website}
              </Text>
            </>
          ) : null}
        </>
      ) : (
        <Text style={[styles.value, { color: theme.textMuted }]}>
          This is where your {isBusiness ? "event posting" : "community"}{" "}
          profile details will show. Tap “Edit profile” to add more information.
        </Text>
      )}

      {/* Edit profile button */}
      <Pressable
        style={[styles.editButton, { backgroundColor: theme.accent }]}
        onPress={onEditProfile}
      >
        <Text
          style={[
            styles.editButtonText,
            { color: theme.onAccent || theme.background },
          ]}
        >
          Edit profile
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // header row with avatar + name/town
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.cardDark,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarInitial: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textLight,
  },
  headerTextCol: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerTown: {
    fontSize: 13,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textLight,
    marginBottom: 4,
    marginTop: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 8,
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    color: colors.textLight,
  },
  linkValue: {
    fontSize: 13,
    color: colors.accent,
  },
  editButton: {
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: "center",
  },
  editButtonText: {
    color: colors.textLight,
    fontWeight: "600",
    fontSize: 14,
  },
});
