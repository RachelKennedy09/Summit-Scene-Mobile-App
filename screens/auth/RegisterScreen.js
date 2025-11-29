// screens/RegisterScreen.js
//  Registration screen UI
//  Lets new users create an account that we store via the /register API

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
  ScrollView,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";

function RegisterScreen() {
  const { register, isAuthLoading } = useAuth();
  const navigation = useNavigation();
  const { theme } = useTheme();

  const [name, setName] = useState(""); // optional display name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // account type/role
  // local = here to find events
  // business = posting/managing events
  const [role, setRole] = useState("local");

  const [avatarUrl, setAvatarUrl] = useState("");
  const [town, setTown] = useState("");
  const [bio, setBio] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");

  async function handleRegister() {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter at least email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name,
        email,
        password,
        role,
        avatarUrl,
        town,
        bio,
        lookingFor,
        instagram,
        website,
      });
      // after successful registration, user is logged in automatically
      // navigation will switch based on user later
    } catch (error) {
      console.error("Error in /register:", error);
      Alert.alert(
        "Registration failed",
        error.message || "Please check your details and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLocal = role === "local";
  const isBusiness = role === "business";

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.inner}>
              <Text style={[styles.title, { color: theme.text }]}>
                Create your Summit Scene account{" "}
              </Text>
              <Text style={[styles.subtitle, { color: theme.textMuted }]}>
                Sign up to post, save, and/or explore local events in your
                mountain town.
              </Text>

              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      color: theme.text,
                    },
                  ]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={theme.textMuted}
                />
              </View>

              {/* Email */}
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
                />
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Password
                </Text>
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
                  placeholder="Create a password"
                  placeholderTextColor={theme.textMuted}
                  secureTextEntry
                />
              </View>

              {/* Account type selection */}
              <Text style={[styles.sectionLabel, { color: theme.text }]}>
                What type of account is this?
              </Text>

              <View style={styles.roleColumn}>
                {/* Local / Visitor */}
                <Pressable
                  style={[
                    styles.roleOption,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.card,
                    },
                    isLocal && {
                      borderColor: theme.accent,
                      backgroundColor: theme.accentSoft || theme.card,
                    },
                  ]}
                  onPress={() => setRole("local")}
                >
                  <Text style={[styles.roleTitle, { color: theme.text }]}>
                    I'm here to find things to do!
                  </Text>
                  <Text
                    style={[styles.roleSubtitle, { color: theme.textMuted }]}
                  >
                    Discover what's happening in Banff, Canmore, and Lake
                    Louise.
                  </Text>
                </Pressable>

                {/* Business / organizer */}
                <Pressable
                  style={[
                    styles.roleOption,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.card,
                    },
                    isBusiness && {
                      borderColor: theme.accent,
                      backgroundColor: theme.accentSoft || theme.card,
                    },
                  ]}
                  onPress={() => setRole("business")}
                >
                  <Text style={[styles.roleTitle, { color: theme.text }]}>
                    I'm a registered business / organizer
                  </Text>
                  <Text
                    style={[styles.roleSubtitle, { color: theme.textMuted }]}
                  >
                    Post and manage events for your venue, shop, or
                    organization.
                  </Text>
                </Pressable>
              </View>

              {/* LOCAL FIELDS */}
              {isLocal && (
                <>
                  <Text style={[styles.sectionLabel, { color: theme.text }]}>
                    Tell visitors and locals a bit about you
                  </Text>

                  {/* TOWN / PLACE OF RESIDENCE */}
                  <Text style={[styles.label, { color: theme.text }]}>
                    Where do you live?
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        color: theme.text,
                      },
                    ]}
                    placeholder="Banff, Canmore, Lake Louise... Visiting?"
                    placeholderTextColor={theme.textMuted}
                    value={town}
                    onChangeText={setTown}
                  />

                  {/* AVATAR URL */}
                  <Text style={[styles.label, { color: theme.text }]}>
                    Profile photo URL (optional)
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        color: theme.text,
                      },
                    ]}
                    placeholder="https://example.com/your-photo.jpg"
                    placeholderTextColor={theme.textMuted}
                    value={avatarUrl}
                    onChangeText={setAvatarUrl}
                  />

                  {/* SHORT BIO */}
                  <Text style={[styles.label, { color: theme.text }]}>
                    Short bio
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { height: 80, textAlignVertical: "top" },
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        color: theme.text,
                      },
                    ]}
                    placeholder="Tell locals who you are and what you love..."
                    placeholderTextColor={theme.textMuted}
                    multiline
                    numberOfLines={3}
                    value={bio}
                    onChangeText={setBio}
                  />

                  {/* LOOKING FOR */}
                  <Text style={[styles.label, { color: theme.text }]}>
                    What are you looking for?
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { height: 60, textAlignVertical: "top" },
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        color: theme.text,
                      },
                    ]}
                    placeholder="Markets, yoga buddies, music nights, hiking friends..."
                    placeholderTextColor={theme.textMuted}
                    multiline
                    numberOfLines={2}
                    value={lookingFor}
                    onChangeText={setLookingFor}
                  />

                  {/* SOCIAL LINKS */}
                  <Text style={[styles.label, { color: theme.text }]}>
                    Instagram (optional)
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        color: theme.text,
                      },
                    ]}
                    placeholder="@yourhandle"
                    placeholderTextColor={theme.textMuted}
                    value={instagram}
                    onChangeText={setInstagram}
                  />
                </>
              )}

              {/* BUSINESS FIELDS */}
              {isBusiness && (
                <>
                  <Text style={[styles.sectionLabel, { color: theme.text }]}>
                    Tell visitors and locals about your business
                  </Text>

                  {/* BUSINESS LOCATION */}
                  <Text style={[styles.label, { color: theme.text }]}>
                    Where is your business located?
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        color: theme.text,
                      },
                    ]}
                    placeholder="Banff, Canmore, Lake Louise..."
                    placeholderTextColor={theme.textMuted}
                    value={town}
                    onChangeText={setTown}
                  />

                  {/* BUSINESS TYPE */}
                  <Text style={[styles.label, { color: theme.text }]}>
                    What type of business is this?
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { height: 60, textAlignVertical: "top" },
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        color: theme.text,
                      },
                    ]}
                    placeholder="Cafe, yoga studio, live music venue, shop..."
                    placeholderTextColor={theme.textMuted}
                    multiline
                    numberOfLines={2}
                    value={lookingFor} // reused field, just different meaning for business
                    onChangeText={setLookingFor}
                  />

                  {/* WEBSITE */}
                  <Text style={[styles.label, { color: theme.text }]}>
                    Website
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        color: theme.text,
                      },
                    ]}
                    placeholder="https://your-business.com"
                    placeholderTextColor={theme.textMuted}
                    value={website}
                    onChangeText={setWebsite}
                  />

                  {/* BUSINESS PHOTO */}
                  <Text style={[styles.label, { color: theme.text }]}>
                    Photo of your business (URL)
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        color: theme.text,
                      },
                    ]}
                    placeholder="https://example.com/your-shop-front.jpg"
                    placeholderTextColor={theme.textMuted}
                    value={avatarUrl} // reuse avatarUrl as 'business photo'
                    onChangeText={setAvatarUrl}
                  />

                  {/* SOCIAL LINKS (OPTIONAL) */}
                  <Text style={[styles.label, { color: theme.text }]}>
                    Instagram (optional)
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        color: theme.text,
                      },
                    ]}
                    placeholder="@yourbusiness"
                    placeholderTextColor={theme.textMuted}
                    value={instagram}
                    onChangeText={setInstagram}
                  />
                </>
              )}

              {/* Sign up button*/}
              <Pressable
                style={[
                  styles.button,
                  {
                    backgroundColor: theme.accent,
                  },
                  (isSubmitting || isAuthLoading) && styles.buttonDisabled,
                ]}
                onPress={handleRegister}
                disabled={isSubmitting || isAuthLoading}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: theme.background,
                    },
                  ]}
                >
                  {isSubmitting || isAuthLoading
                    ? "Creating account..."
                    : "Create Account"}
                </Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text
                  style={[
                    styles.linkText,
                    {
                      color: theme.accent,
                    },
                  ]}
                >
                  Already have an account? Log in
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  inner: {
    // optional
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
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
  },
  roleTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },
  roleSubtitle: {
    fontSize: 12,
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
});
