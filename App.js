// App.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";

const Tab = createBottomTabNavigator();

// 🏔 Hub Screen
function HubScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SummitScene Hub</Text>
      <Text style={styles.subtitle}>
        Browse local events by town, category, and date.
      </Text>
    </View>
  );
}

// 🗺 Map Screen
function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map</Text>
      <Text style={styles.subtitle}>Events on the map will go here.</Text>
    </View>
  );
}

// 📣 Post Event Screen
function PostEventScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post Event</Text>
      <Text style={styles.subtitle}>
        Business owners can post and manage events here.
      </Text>
    </View>
  );
}

// 👥 Community Screen
function CommunityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community</Text>
      <Text style={styles.subtitle}>
        Community posts, ideas, and past event highlights will live here.
      </Text>
    </View>
  );
}

// 👤 Account Screen
function AccountScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <Text style={styles.subtitle}>
        Log in, manage your profile, and notification preferences.
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Hub" component={HubScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Post" component={PostEventScreen} />
        <Tab.Screen name="Community" component={CommunityScreen} />
        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// 🎨 Global styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f7f7", // light neutral for now
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
  },
});
