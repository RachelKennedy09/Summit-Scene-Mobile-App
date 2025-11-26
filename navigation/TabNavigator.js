// TabNavigator.js
// Bottom tab navigation for the app — Hub, Map, Community, Account
// Businesses also get a "Post Event" tab

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HubScreen from "../screens/hub/HubScreen";
import MapScreen from "../screens/map/MapScreen";
import PostEventScreen from "../screens/events/PostEventScreen";
import CommunityScreen from "../screens/community/CommunityScreen";
import AccountScreen from "../screens/account/AccountScreen";

import { useAuth } from "../context/AuthContext";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { user } = useAuth();

  // If no user or missing role -> treat as non-business
  const isBusiness = user?.role === "business";

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Hub" component={HubScreen} options={{ title: "Hub" }} />

      <Tab.Screen name="Map" component={MapScreen} options={{ title: "Map" }} />

      {/* Only business users see Post Event */}
      {isBusiness && (
        <Tab.Screen
          name="Post"
          component={PostEventScreen}
          options={{ title: "Post Event" }}
        />
      )}

      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{ title: "Community" }}
      />

      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{ title: "Account" }}
      />
    </Tab.Navigator>
  );
}
