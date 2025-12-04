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
  Image,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import Logo from "../../assets/logo.png";

function LoginScreen() {
  const { login, isAuthLoading } = useAuth();
  const navigation = useNavigation();
  const { theme } = useTheme();

  // STATE: keep track of form fields and loading state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // HANDLER: runs when user taps "Log in"
  async function handleLogin() {
    // guard so it doesnt send empty requests
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
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* dismiss keyboard when tapping outside inputs */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.logoContainer}>
            <Image source={Logo} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>
            Welcome To Summit Scene Hub!
          </Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Log in to see and post local events in Banff, Canmore and Lake
            Louise.
          </Text>

          {/* Email Field */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={theme.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
          </View>

          {/* Password Field */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Password</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={theme.textMuted}
              secureTextEntry
            />
          </View>

          {/* Login Button */}
          <Pressable
            style={[
              styles.button,
              {
                backgroundColor: theme.accent,
              },
              (isSubmitting || isAuthLoading) && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isSubmitting || isAuthLoading}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  // text on accent background
                  color: theme.background,
                },
              ]}
            >
              {isSubmitting || isAuthLoading ? "Logging in..." : "Log In"}
            </Text>
          </Pressable>

          {/* Nav link to RegisterScreen */}
          <Pressable onPress={() => navigation.navigate("Register")}>
            <Text
              style={[
                styles.linkText,
                {
                  color: theme.accent,
                },
              ]}
            >
              Don’t have an account? Sign up
            </Text>
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
  },

  inner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    marginBottom: 6,
    fontSize: 14,
  },

  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },

  button: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    fontWeight: "700",
    fontSize: 16,
  },

  linkText: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 14,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 28,
    padding: 18,
  },

  logo: {
    width: 160,
    height: 180,
    opacity: 0.95,
  },
});
