//later will be RootNavigator.js

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HubScreen from "../screens/HubScreen";
import MapScreen from "../screens/MapScreen";
import PostEventScreen from "../screens/PostEventScreen";
import CommunityScreen from "../screens/CommunityScreen";
import AccountScreen from "../screens/AccountScreen";

console.log("HubScreen is:", HubScreen);

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
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
  );
}
