// lets new users create an account that we store via the /register API

// screens/RegisterScreen.js
// WHAT: Registration screen UI
// WHY: Lets new users create an account that we store via the /register API

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../theme/colors";

function RegisterScreen() {
  const { register, isAuthLoading } = useAuth();
  const navigation = useNavigation();

  const [name, setName] = useState(""); // optional display name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // account type/role
  // local = here to find events
  // business = posting/managing events
  const [role, setRole] = useState("local");

  async function handleRegister() {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter at least email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ name, email, password, role });
      //after successful registration, user is logged in automatically/
      // navigation will switch based on user later
    } catch (error) {
      console.error("Register failed:", error);
      Alert.alert("Registration failed", error.message || "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLocal = role === "local";
  const isBusiness = role === "business";

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.title}>Create your Summit Scene account </Text>
          <Text style={styles.subtitle}>
            Sign up to post, save, and/or explore local events in your mountain
            town.
          </Text>

          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#64748b"
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#64748b"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              placeholderTextColor="#64748b"
              secureTextEntry
            />
          </View>

          {/* Account type selection */}
          <Text style={styles.sectionLabel}>What type of account is this?</Text>

          <View style={styles.roleColumn}>
            {/* Local / Visitor */}
            <Pressable
              style={[styles.roleOption, isLocal && styles.roleOptionSelected]}
              onPress={() => setRole("local")}
            >
              <Text
                style={[styles.roleTitle, isLocal && styles.roleTitleSelected]}
              >
                I'm here to find things to do!
              </Text>
              <Text style={styles.roleSubtitle}>
                Discover what's happening in Banff, Canmore, and Lake Louise.
              </Text>
            </Pressable>

            {/* Business / organizer */}
            <Pressable
              style={[
                styles.roleOption,
                isBusiness && styles.roleOptionSelected,
              ]}
              onPress={() => setRole("business")}
            >
              <Text
                style={[
                  styles.roleTitle,
                  isBusiness && styles.roleTitleSelected,
                ]}
              >
                I'm a registered business / organizer
              </Text>
              <Text style={styles.roleSubtitle}>
                Post and manage events for your venue, shop, or organization.
              </Text>
            </Pressable>
          </View>

          {/* Sign up button*/}

          <Pressable
            style={[
              styles.button,
              (isSubmitting || isAuthLoading) && styles.buttonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isSubmitting || isAuthLoading}
          >
            <Text style={styles.buttonText}>
              {isSubmitting || isAuthLoading
                ? "Creating account..."
                : "Create Account"}
            </Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>Already have an account? Log in</Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textLight,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: colors.textLight,
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionLabel: {
    marginTop: 8,
    marginBottom: 8,
    fontWeight: "500",
    color: colors.textLight,
  },
  roleColumn: {
    gap: 10,
    marginBottom: 16,
  },
  roleOption: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.primary,
  },
  roleOptionSelected: {
    borderColor: colors.success,
    backgroundColor: "#022c22",
  },
  roleTitle: {
    fontWeight: "600",
    marginBottom: 4,
    color: colors.textLight,
  },
  roleTitleSelected: {
    color: colors.textLight,
  },
  roleSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
  button: {
    marginTop: 8,
    backgroundColor: colors.success,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.textDark,
    fontWeight: "700",
    fontSize: 16,
  },
  linkText: {
    marginTop: 16,
    color: colors.accent,
    textAlign: "center",
    fontSize: 14,
  },
});
