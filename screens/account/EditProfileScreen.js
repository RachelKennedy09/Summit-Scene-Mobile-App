// screens/account/EditProfileScreen.js
// Lets logged-in users edit their profile fields (not email/password yet)

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/colors";

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile, isAuthLoading } = useAuth();

  // Safeguard – if somehow no user
  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.heading}>Edit profile</Text>
          <Text style={styles.helperText}>
            You need to be logged in to edit your profile.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isBusiness = user.role === "business";
  const isLocal = user.role === "local";

  // Role-based heading + helper text
  const titleText = isBusiness ? "Event posting profile" : "Edit profile";
  const helperText = isBusiness
    ? "This is how your profile appears when you make an event."
    : "This info shows on your Account screen and on Community posts.";

  // Pre-fill fields from current user
  const [name, setName] = useState(user.name || "");
  const [town, setTown] = useState(user.town || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [bio, setBio] = useState(user.bio || "");
  const [lookingFor, setLookingFor] = useState(user.lookingFor || "");
  const [instagram, setInstagram] = useState(user.instagram || "");
  const [website, setWebsite] = useState(user.website || "");

  async function handleSave() {
    try {
      const updates = {
        name,
        town,
        avatarUrl,
        bio,
        lookingFor,
        instagram,
      };

      if (isBusiness) {
        updates.website = website;
      }

      await updateProfile(updates);

      Alert.alert("Profile updated", "Your changes have been saved.");
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Update failed",
        error.message || "Could not save your profile."
      );
    }
  }

  function handleCancel() {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Role-based heading + helper */}
        <Text style={styles.heading}>{titleText}</Text>

        <Text style={styles.helperText}>{helperText}</Text>

        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={colors.textMuted}
        />

        {/* Town */}
        <Text style={styles.label}>
          {isBusiness
            ? "Where is your business located?"
            : "Where do you live?"}
        </Text>
        <TextInput
          style={styles.input}
          value={town}
          onChangeText={setTown}
          placeholder={
            isBusiness
              ? "Banff, Canmore, Lake Louise..."
              : "Banff, Canmore, Lake Louise... or visiting?"
          }
          placeholderTextColor={colors.textMuted}
        />

        {/* Avatar URL */}
        <Text style={styles.label}>
          {isBusiness ? "Photo of your business (URL)" : "Profile photo URL"}
        </Text>
        <TextInput
          style={styles.input}
          value={avatarUrl}
          onChangeText={setAvatarUrl}
          placeholder="https://example.com/your-photo.jpg"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
        />

        {/* Looking for / business type */}
        <Text style={styles.label}>
          {isBusiness ? "Business type" : "What are you looking for?"}
        </Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={lookingFor}
          onChangeText={setLookingFor}
          multiline
          numberOfLines={3}
          placeholder={
            isBusiness
              ? "Cafe, yoga studio, music venue..."
              : "Markets, yoga buddies, music nights, hiking friends..."
          }
          placeholderTextColor={colors.textMuted}
        />

        {/* Bio */}
        <Text style={styles.label}>Short bio</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          placeholder={
            isBusiness
              ? "Tell people about your business, vibe, and what you host."
              : "Tell locals who you are and what you love..."
          }
          placeholderTextColor={colors.textMuted}
        />

        {/* Instagram */}
        <Text style={styles.label}>Instagram (optional)</Text>
        <TextInput
          style={styles.input}
          value={instagram}
          onChangeText={setInstagram}
          placeholder="@yourhandle"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
        />

        {/* Website – business only */}
        {isBusiness && (
          <>
            <Text style={styles.label}>Website (optional)</Text>
            <TextInput
              style={styles.input}
              value={website}
              onChangeText={setWebsite}
              placeholder="https://your-business.com"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
            />
          </>
        )}

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.secondaryButton]}
            onPress={handleCancel}
            disabled={isAuthLoading}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={[
              styles.primaryButton,
              isAuthLoading && styles.buttonDisabled,
            ]}
            onPress={handleSave}
            disabled={isAuthLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isAuthLoading ? "Saving..." : "Save changes"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textLight,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 4,
    marginTop: 10,
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
  multiline: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.accent,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: colors.textLight,
    fontWeight: "700",
    fontSize: 15,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: colors.textLight,
    fontWeight: "600",
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
