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
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

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

          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
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

          <Pressable style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Create Account</Text>
          </Pressable>

          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>Already have an account? Log in</Text>
          </Pressable>

          {/* will wire navigation later */}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  sectionLabel: {
    marginTop: 8,
    marginBottom: 8,
    fontWeight: "500",
  },
  roleColumn: {
    gap: 10,
    marginBottom: 16,
  },
  roleOption: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
  },
  roleOptionSelected: {
    borderColor: "#1B4D3E", // mountain-y deep green vibe (roughly)
    backgroundColor: "#E6F2ED",
  },
  roleTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },
  roleTitleSelected: {
    color: "#1B4D3E",
  },
  roleSubtitle: {
    fontSize: 12,
    color: "#555",
  },
  button: {
    backgroundColor: "#1B4D3E",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  linkText: {
    textAlign: "center",
    marginTop: 8,
  },
});
