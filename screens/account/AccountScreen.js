// screens/AccountScreen.js
// Shows logged-in user's account info + profile fields + logout
// Now also ties into Community / Event posting profile + Edit Profile

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../theme/colors";

function AccountScreen() {
  const { user, logout, isAuthLoading, upgradeToBusiness } = useAuth();
  const navigation = useNavigation();

  const isBusiness = user?.role === "business";
  const isLocal = user?.role === "local";

  const [isUpgrading, setIsUpgrading] = useState(false);

  // Safeguard: in theory AccountScreen is only shown when user != null
  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Account</Text>
          <Text style={styles.subtitle}>
            You are not logged in. Please log in to view your account.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  async function handleUpgradeToBusiness() {
    try {
      setIsUpgrading(true);
      await upgradeToBusiness();

      setTimeout(() => {
        Alert.alert(
          "Account upgraded",
          "Your account is now a business account. You can now post and manage events."
        );
      }, 200);
    } catch (error) {
      Alert.alert(
        "Upgrade failed",
        error.message || "Unable to upgrade account right now."
      );
    } finally {
      setIsUpgrading(false);
    }
  }

  // Format joined date nicely
  let joinedText = "Unknown";
  if (user.createdAt) {
    const date = new Date(user.createdAt);
    joinedText = date.toLocaleDateString();
  }

  const displayName = user.name || user.email;
  const avatarUrl = user.avatarUrl;
  const town = user.town || "Rockies local";
  const roleLabel = isBusiness ? "Business account" : "Local account";

  // 🆕 Role-based copy for profile section
  const profileSectionTitle = isBusiness
    ? "Event posting profile"
    : "Community profile";

  const profileSectionSubtitle = isBusiness
    ? "This is how your profile appears on Hub and Map when you post events."
    : "This is how your profile appears on Community posts and replies.";

  async function handleLogout() {
    await logout();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Text style={styles.title}>Account</Text>

        {/* PROFILE HEADER CARD */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.avatar}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarInitial}>
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>

            <View style={styles.headerTextCol}>
              <Text style={styles.greeting}>Hi, {displayName}</Text>
              <Text style={styles.roleTag}>{roleLabel}</Text>
              <Text style={styles.metaText}>Email: {user.email}</Text>
              <Text style={styles.metaText}>Town: {town}</Text>
              <Text style={styles.metaText}>Member since: {joinedText}</Text>
            </View>
          </View>
        </View>

        {/* COMMUNITY / EVENT PROFILE INFO */}
        <View className="profile-card" style={styles.profileCard}>
          <Text style={styles.sectionTitle}>{profileSectionTitle}</Text>
          <Text style={styles.sectionSubtitle}>{profileSectionSubtitle}</Text>

          {user.bio ? (
            <>
              <Text style={styles.label}>About</Text>
              <Text style={styles.value}>{user.bio}</Text>
            </>
          ) : null}

          {user.lookingFor ? (
            <>
              <Text style={styles.label}>
                {isBusiness ? "Business type" : "What you're looking for"}
              </Text>
              <Text style={styles.value}>{user.lookingFor}</Text>
            </>
          ) : null}

          {user.instagram ? (
            <>
              <Text style={styles.label}>Instagram</Text>
              <Text style={styles.linkValue}>{user.instagram}</Text>
            </>
          ) : null}

          {isBusiness && user.website ? (
            <>
              <Text style={styles.label}>Website</Text>
              <Text style={styles.linkValue}>{user.website}</Text>
            </>
          ) : null}

          {/* EDIT PROFILE BUTTON */}
          <Pressable
            style={styles.editButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={styles.editButtonText}>Edit profile</Text>
          </Pressable>
        </View>

        {/* BUSINESS ONLY: VIEW MY EVENTS */}
        {isBusiness && (
          <Pressable
            style={styles.accountButton}
            onPress={() => navigation.navigate("MyEvents")}
          >
            <Text style={styles.accountButtonText}>View My Events</Text>
          </Pressable>
        )}

        {/* LOCAL ONLY: UPGRADE TO BUSINESS */}
        {isLocal && (
          <Pressable
            style={[
              styles.accountButtonSecondary,
              (isAuthLoading || isUpgrading) && styles.buttonDisabled,
            ]}
            onPress={handleUpgradeToBusiness}
            disabled={isAuthLoading || isUpgrading}
          >
            <Text style={styles.accountButtonSecondaryText}>
              Upgrade to business account
            </Text>
            <Text style={styles.accountButtonSecondarySubtext}>
              Become a verified local business or event organizer and start
              posting your own events.
            </Text>
          </Pressable>
        )}

        {/* LOG OUT */}
        <Pressable
          style={[styles.logoutButton, isAuthLoading && styles.buttonDisabled]}
          onPress={handleLogout}
          disabled={isAuthLoading}
        >
          <Text style={styles.logoutButtonText}>
            {isAuthLoading ? "Logging out..." : "Log Out"}
          </Text>
        </Pressable>

        <Text style={styles.helperText}>
          Logging out will clear your session on this device.{"\n"}
          You can log back in anytime to post and manage events.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AccountScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.textLight,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
  },

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

  profileCard: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
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

  // "View My Events" button (for business accounts)
  accountButton: {
    backgroundColor: colors.cta,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  accountButtonText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 15,
  },

  // "Upgrade to business" button (for locals)
  accountButtonSecondary: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  accountButtonSecondaryText: {
    color: colors.textLight,
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 4,
  },
  accountButtonSecondarySubtext: {
    color: colors.textMuted,
    fontSize: 12,
  },

  // Log out button
  logoutButton: {
    backgroundColor: colors.danger,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  logoutButtonText: {
    color: colors.textLight,
    fontWeight: "700",
    fontSize: 16,
  },
  helperText: {
    marginTop: 12,
    color: colors.textMuted,
    fontSize: 12,
  },
});
