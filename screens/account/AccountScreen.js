// screens/AccountScreen.js
// Shows logged-in user's account info + logout
// Gives users a clear place to see who is logged in and to sign out

import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
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

  // Safeguard: in theory AccountScreen is only shown when user != null,
  // but we handle the "just in case" situation gracefully.
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

      // timeout before showing alert so UI doesnt unmount instantly
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

  async function handleLogout() {
    await logout();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Account</Text>

        <View style={styles.card}>
          <Text style={styles.greeting}>Hi, {displayName}</Text>
          <Text style={styles.roleTag}>
            You’re logged in as a{" "}
            {user.role === "business" ? "Business" : "Local"} account
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Member since:</Text>
            <Text style={styles.value}>{joinedText}</Text>
          </View>
        </View>

        {isBusiness && (
          <Pressable
            style={styles.accountButton}
            onPress={() => navigation.navigate("MyEvents")}
          >
            <Text style={styles.accountButtonText}>View My Events</Text>
          </Pressable>
        )}

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

        <Pressable
          style={[styles.button, isAuthLoading && styles.buttonDisabled]}
          onPress={handleLogout}
          disabled={isAuthLoading}
        >
          <Text style={styles.buttonText}>
            {isAuthLoading ? "Logging out..." : "Log Out"}
          </Text>
        </Pressable>

        <Text style={styles.helperText}>
          Logging out will clear your session on this device.{"\n"}
          You can log back in anytime to post and manage events.
        </Text>
      </View>
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
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textLight,
    marginBottom: 12,
  },
  roleTag: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textMuted,
    marginBottom: 14,
    marginTop: -6,
  },

  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    width: 110,
    color: colors.textMuted,
    fontSize: 14,
  },
  value: {
    flex: 1,
    color: colors.textLight,
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
    color: colors.primary, // matches how you use cta on other screens
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
  button: {
    backgroundColor: colors.danger,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
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
