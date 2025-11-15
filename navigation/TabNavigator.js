//later will be RootNavigator.js

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HubScreen from "../screens/HubScreen";
import MapScreen from "../screens/MapScreen";
import PostEventScreen from "../screens/PostEventScreen";
import CommunityScreen from "../screens/CommunityScreen";
import AccountScreen from "../screens/AccountScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Hub" component={HubScreen} options={{ title: "Hub" }} />

      <Tab.Screen name="Map" component={MapScreen} options={{ title: "Map" }} />
      <Tab.Screen
        name="Post"
        component={PostEventScreen}
        options={{ title: "Post" }}
      />
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
