// screens/AccountScreen.js
// Shows logged-in user's account info + profile fields + logout
// Ties into Community / Event posting profile + Edit Profile + full theme picker

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Image,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../theme/colors";
import { useTheme } from "../../context/ThemeContext";

function AccountScreen() {
  const { user, logout, isAuthLoading, upgradeToBusiness } = useAuth();
  const navigation = useNavigation();

  // get theme + themeName + changer + light/dark toggle
  const { theme, themeName, setThemeName, toggleLightDark } = useTheme();
  const isDark = theme.isDark;

  const isBusiness = user?.role === "business";
  const isLocal = user?.role === "local";

  const [isUpgrading, setIsUpgrading] = useState(false);

  // Safeguard: AccountScreen should only show when user != null
  if (!user) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: theme.background }]}
      >
        <View style={styles.container}>
          <Text style={[styles.title, { color: theme.text }]}>Account</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
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

  // Role-based copy for profile section
  const profileSectionTitle = isBusiness
    ? "Event posting profile"
    : "Community profile";

  const profileSectionSubtitle = isBusiness
    ? "This is how your profile appears on Hub and Map when you post events."
    : "This is how your profile appears on Community posts and replies.";

  // Do we have *any* extra profile info to show?
  const hasProfileDetails = Boolean(
    user.bio ||
      user.lookingFor ||
      user.instagram ||
      (isBusiness && user.website)
  );

  async function handleLogout() {
    await logout();
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Text style={[styles.title, { color: theme.text }]}>Account</Text>

        {/* PROFILE HEADER CARD */}
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
                Email: {user.email}
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

        {/* COMMUNITY / EVENT PROFILE INFO */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {profileSectionTitle}
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>
            {profileSectionSubtitle}
          </Text>

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
            // 🔹 When there are no details yet, still show a friendly "shell"
            <Text style={[styles.value, { color: theme.textMuted }]}>
              This is where your {isBusiness ? "event posting" : "community"}{" "}
              profile details will show. Tap “Edit profile” to add more
              information.
            </Text>
          )}

          {/* EDIT PROFILE BUTTON */}
          <Pressable
            style={[styles.editButton, { backgroundColor: theme.accent }]}
            onPress={() => navigation.navigate("EditProfile")}
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

        {/* MULTI THEME BUTTONS */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            marginTop: 24,
            marginBottom: 8,
            color: theme.text,
          }}
        >
          App Theme
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {/* Light */}
          <Pressable
            onPress={() => setThemeName("light")}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: themeName === "light" ? theme.accent : theme.border,
              backgroundColor:
                themeName === "light" ? theme.accent : theme.card,
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                color:
                  themeName === "light" ? theme.onAccent || "#000" : theme.text,
              }}
            >
              Light
            </Text>
          </Pressable>

          {/* Dark */}
          <Pressable
            onPress={() => setThemeName("dark")}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: themeName === "dark" ? theme.accent : theme.border,
              backgroundColor: themeName === "dark" ? theme.accent : theme.card,
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                color:
                  themeName === "dark" ? theme.onAccent || "#000" : theme.text,
              }}
            >
              Dark
            </Text>
          </Pressable>

          {/* Feminine */}
          <Pressable
            onPress={() => setThemeName("feminine")}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1,
              borderColor:
                themeName === "feminine" ? theme.accent : theme.border,
              backgroundColor:
                themeName === "feminine" ? theme.accent : theme.card,
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                color:
                  themeName === "feminine"
                    ? theme.onAccent || "#000"
                    : theme.text,
              }}
            >
              Feminine
            </Text>
          </Pressable>

          {/* Masculine */}
          <Pressable
            onPress={() => setThemeName("masculine")}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1,
              borderColor:
                themeName === "masculine" ? theme.accent : theme.border,
              backgroundColor:
                themeName === "masculine" ? theme.accent : theme.card,
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                color:
                  themeName === "masculine"
                    ? theme.onAccent || "#000"
                    : theme.text,
              }}
            >
              Masculine
            </Text>
          </Pressable>
          {/* Rainbow */}
          <Pressable
            onPress={() => setThemeName("rainbow")}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1,
              borderColor:
                themeName === "rainbow" ? theme.accent : theme.border,
              backgroundColor:
                themeName === "rainbow" ? theme.accent : theme.card,
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                color:
                  themeName === "rainbow"
                    ? theme.onAccent || "#000"
                    : theme.text,
              }}
            >
              Rainbow
            </Text>
          </Pressable>
        </View>

        {/* APPEARANCE TOGGLE (QUICK LIGHT/DARK) */}
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
              <Text
                style={[styles.sectionSubtitle, { color: theme.textMuted }]}
              >
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

        {/* BUSINESS ONLY: VIEW MY EVENTS */}
        {isBusiness && (
          <Pressable
            style={[styles.accountButton, { backgroundColor: colors.cta }]}
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
              {
                backgroundColor: theme.card,
                borderColor: theme.accent,
              },
              (isAuthLoading || isUpgrading) && styles.buttonDisabled,
            ]}
            onPress={handleUpgradeToBusiness}
            disabled={isAuthLoading || isUpgrading}
          >
            <Text
              style={[styles.accountButtonSecondaryText, { color: theme.text }]}
            >
              Upgrade to business account
            </Text>
            <Text
              style={[
                styles.accountButtonSecondarySubtext,
                { color: theme.textMuted },
              ]}
            >
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

        <Text style={[styles.helperText, { color: theme.textMuted }]}>
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
    backgroundColor: colors.primary, // overridden by theme
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.textLight, // overridden by theme
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
    marginTop: 4,
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

  // Theme card + row
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
});
