// navigation/RootNavigator.js
// Decides which staack to show based on auth state (logged in vs logged out)

import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../context/AuthContext";
import TabNavigator from "./TabNavigator";

// Events screens

import EventDetailScreen from "../screens/events/EventDetailScreen";
import MyEventsScreen from "../screens/events/MyEventsScreen";
import EditEventScreen from "../screens/events/EditEventScreen";

// Community Screens
import CommunityPostScreen from "../screens/community/CommunityPostScreen";
import EditCommunityPostScreen from "../screens/community/EditCommunityPostScreen";

// Auth screens
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
const Stack = createNativeStackNavigator();

// Simple loading screen while restoring auth session
function AuthLoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" />
      <Text style={styles.loadingText}>Loading Summit Scene...</Text>
    </View>
  );
}

export default function RootNavigator() {
  // Read auth state from context
  const { user, isAuthLoading } = useAuth();

  // Show loading screen while checking AsyncStorage / restoring session
  if (isAuthLoading) {
    return <AuthLoadingScreen />;
  }

  return (
    <Stack.Navigator>
      {user ? (
        // APP STACK: user is logged in -> show tabs and app screens
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
            options={{ title: "Event details" }}
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
        </>
      ) : (
        // AUTH STACK: no user -> show login and register screens
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
    backgroundColor: "#0b1522",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#e2e8f0",
    fontSize: 14,
  },
});
