// Lets users enter email/password to request a JWT from the backend

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

function LoginScreen() {
  const { login, isAuthLoading } = useAuth();
  const navigation = useNavigation();
  // STATE: keep track of form fields and loading state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // HANDLER: runs when user tabs "Log in"
  async function handleLogin() {
    //gaurd so it doesnt send empty requests
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email, password });
    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert("Login failed", error.message || "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    // KeyboardAvoidingView stops the keyboard from covering inputs
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* dismiss keyboard when tapping outside inputs */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>
            Log in to see and post local events in Banff, Canmore and Lake
            Louise.
          </Text>

          {/* Email Field */}
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

          {/* Password Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
            />
          </View>

          {/* Login Button */}
          <Pressable
            style={[
              styles.button,
              (isSubmitting || isAuthLoading) && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isSubmitting || isAuthLoading}
          >
            <Text style={styles.buttonText}>
              {isSubmitting || isAuthLoading ? "Loggin in..." : "Log In"}
            </Text>
          </Pressable>

          {/* Nav link...later will wire to registerscreen */}
          <Pressable onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>Don’t have an account? Sign up</Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1522", // placeholder dark background for now
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
    backgroundColor: "#38bdf8",
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
