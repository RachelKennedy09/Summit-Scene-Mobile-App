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

  async function handleRegister() {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter at least email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ name, email, password });
      //after successful registration, user is logged in automatically/
      // navigation will switch based on user later
    } catch (error) {
      console.error("Register failed:", error);
      Alert.alert("Registration failed", error.message || "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.title}>Create your account </Text>
          <Text style={styles.subtitle}>
            Sign up to post, save and explore local events in your mountain
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
                : "Sign Up"}
            </Text>
          </Pressable>

          {/* will wire navigation later */}
          <Pressable
            onPress={() => {
              Alert.alert(
                "Go to Login",
                "This will navigate back to Login once AuthStack is configured."
              );
            }}
          >
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
    backgroundColor: "#0b1522",
  },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#cbd5e1",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: "#e2e8f0",
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#1e293b",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#e2e8f0",
    borderWidth: 1,
    borderColor: "#334155",
  },
  button: {
    marginTop: 8,
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#0f172a",
    fontWeight: "700",
    fontSize: 16,
  },
  linkText: {
    marginTop: 16,
    color: "#38bdf8",
    textAlign: "center",
    fontSize: 14,
  },
});
