// App.js
// Entry point of the app
// Sets up providers and NavigationContainer,
// then renders RootNavigator which decides Auth vs App stack.

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import RootNavigator from "./navigation/RootNavigator";

//  use the theme hook
function AppNavigation() {
  const { navTheme } = useTheme();

  return (
    <NavigationContainer theme={navTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <AppNavigation />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
