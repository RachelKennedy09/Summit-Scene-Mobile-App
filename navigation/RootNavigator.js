// navigation/RootNavigator.js
import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons"; // 👈 make sure this is imported

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // 👈 use theme
import TabNavigator from "./TabNavigator";

import EventDetailScreen from "../screens/events/EventDetailScreen";
import MyEventsScreen from "../screens/events/MyEventsScreen";
import EditEventScreen from "../screens/events/EditEventScreen";

import CommunityPostScreen from "../screens/community/CommunityPostScreen";
import EditCommunityPostScreen from "../screens/community/EditCommunityPostScreen";

import EditProfileScreen from "../screens/account/EditProfileScreen";

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

import { colors } from "../theme/colors";

const Stack = createNativeStackNavigator();

function AuthLoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.textLight} />
      <Text style={styles.loadingText}>Loading Summit Scene...</Text>
    </View>
  );
}

export default function RootNavigator() {
  const { user, isAuthLoading } = useAuth();
  const { theme } = useTheme();

  if (isAuthLoading) {
    return <AuthLoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        // 🔹 Make the back button icon-only (no "< tabs" text)
        headerBackButtonDisplayMode: "minimal",

        // (optional / legacy, doesn’t hurt to keep)
        headerBackTitleVisible: false,

        // 🔹 Use your theme colors for header text + back icon
        headerTintColor: theme.text,

        // 🔹 Custom Ionicons back icon
        headerBackImage: ({ tintColor }) => (
          <Ionicons
            name="chevron-back"
            size={26}
            color={tintColor || theme.text}
            style={{ marginLeft: 4 }}
          />
        ),
      }}
    >
      {user ? (
        <>
          <Stack.Screen
            name="tabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MyEvents"
            component={MyEventsScreen}
            options={{ title: "My Events" }}
          />
          <Stack.Screen
            name="EditEvent"
            component={EditEventScreen}
            options={{ title: "Edit Event" }}
          />
          <Stack.Screen
            name="EventDetail"
            component={EventDetailScreen}
            options={{ title: "Event Details" }}
          />
          <Stack.Screen
            name="CommunityPost"
            component={CommunityPostScreen}
            options={{ title: "New Community Post" }}
          />
          <Stack.Screen
            name="EditCommunityPost"
            component={EditCommunityPostScreen}
            options={{ title: "Edit Post" }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ title: "Edit Profile" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    color: colors.textMuted,
    fontSize: 14,
  },
});
