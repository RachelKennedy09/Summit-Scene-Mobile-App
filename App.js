// App.js at root
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabNavigator from "./navigation/TabNavigator";
import EventDetailScreen from "./screens/EventDetailScreen";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
