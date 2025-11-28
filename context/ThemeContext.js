import React, { createContext, useContext, useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme } from "../theme/themes";
import {
  DefaultTheme as NavDefaultTheme,
  DarkTheme as NavDarkTheme,
} from "@react-navigation/native";

const STORAGE_KEY = "summitscene-theme";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState("light");
  const [isReady, setIsReady] = useState(false);

  const theme = themeName === "dark" ? darkTheme : lightTheme;
  const baseNavTheme = themeName === "dark" ? NavDarkTheme : NavDefaultTheme;

  const navTheme = {
    ...baseNavTheme,
    colors: {
      ...baseNavTheme.colors,

      background: theme.background,
      card: theme.card,
      text: theme.textMain,
      border: theme.border,
      primary: theme.accent,
    },
  };

  useEffect(() => {
    async function loadTheme() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === "light" || saved === "dark") {
          setThemeName(saved);
        }
      } catch (error) {
        console.warn("Failed to load saved theme:", error.message);
      } finally {
        setIsReady(true);
      }
    }

    loadTheme();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, themeName).catch((error) => {
      console.warn("Failed to save theme:", error.message);
    });
  }, [themeName]);

  function toggleTheme() {
    setThemeName((prev) => (prev === "light" ? "dark" : "light"));
  }

  const value = {
    theme,
    themeName,
    isDark: themeName === "dark",
    toggleTheme,
    setThemeName,
    navTheme,
  };

  // Show spinner while we figure out which theme to use
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }
  return ctx;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#F5F5F5",
  },
});
