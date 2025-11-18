// App.js at root
// entry point o fapp
// chooses which staack to show based on auth state.

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

import TabNavigator from "./navigation/TabNavigator";
import EventDetailScreen from "./screens/EventDetailScreen";
import LoginScreen from "./screens/LoginScreen.js";
import RegisterScreen from "./screens/RegisterScreen.js";

// AuthProver and useAuth for context
import { AuthProvider, useAuth } from "./context/AuthContext";

const Stack = createNativeStackNavigator();

// loading screen while we restore session / do auth work
function AuthLoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" />
      <Text style={styles.loadingText}>Loading Summit Scene...</Text>
    </View>
  );
}

function RootNavigator() {
  // Read auth state from context
  const { user, isAuthLoading } = useAuth();

  //show loading screen while checking AsyncStorage
  if (isAuthLoading) {
    return <AuthLoadingScreen />;
  }

  return (
    <Stack.Navigator>
      {user ? (
        // APP STACK: user is logged in -> show tabs and event details
        <>
          {/* This screen holds bottom tabs (Hub, Map, Post, Community, Account) */}
          <Stack.Screen
            name="tabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />

          {/* Screen to navigate to from HubScreen when tapping an event
           */}

          <Stack.Screen
            name="EventDetail"
            component={EventDetailScreen}
            options={{ title: "Event details" }}
          />
        </>
      ) : (
        // AUTH STACK: no user -> show login and REgister screens
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

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

// Simple styles for the loading screen
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
