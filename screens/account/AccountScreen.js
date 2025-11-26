// screens/AccountScreen.js
// Shows logged-in user's account info + logout
// Gives users a clear place to see who is logged in and to sign out

import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

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
      const updated = await upgradeToBusiness();

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
    backgroundColor: "#0b1522", // match screen background
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#cbd5e1",
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e7eb",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    width: 110,
    color: "#9ca3af",
    fontSize: 14,
  },
  value: {
    flex: 1,
    color: "#e5e7eb",
    fontSize: 14,
  },

  // styles for "View My Events" button
  accountButton: {
    backgroundColor: "#e2a59bff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  accountButtonText: {
    color: "#0f172a",
    fontWeight: "700",
    fontSize: 15,
  },
  accountButtonSecondary: {
    backgroundColor: "#1f2933",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#38bdf8",
  },
  accountButtonSecondaryText: {
    color: "#e5e7eb",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 4,
  },
  accountButtonSecondarySubtext: {
    color: "#9ca3af",
    fontSize: 12,
  },

  button: {
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#f9fafb",
    fontWeight: "700",
    fontSize: 16,
  },
  helperText: {
    marginTop: 12,
    color: "#9ca3af",
    fontSize: 12,
  },
});
