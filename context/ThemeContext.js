// context/ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { themes as themeMap } from "../theme/themes";

const THEME_STORAGE_KEY = "appTheme";
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState("light");
  const [isThemeLoading, setIsThemeLoading] = useState(true);

  // Restore saved theme
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored && themeMap[stored]) {
          setThemeName(stored);
        }
      } catch (e) {
        console.error("Error restoring theme:", e);
      } finally {
        setIsThemeLoading(false);
      }
    })();
  }, []);

  // Persist theme choice
  useEffect(() => {
    if (!isThemeLoading) {
      AsyncStorage.setItem(THEME_STORAGE_KEY, themeName).catch((e) =>
        console.error("Error saving theme:", e)
      );
    }
  }, [themeName, isThemeLoading]);

  const theme = themeMap[themeName] || themeMap.light;

  function toggleLightDark() {
    setThemeName((prev) => (prev === "dark" ? "light" : "dark"));
  }

  function setTheme(key) {
    if (themeMap[key]) {
      setThemeName(key);
    } else {
      console.warn("Unknown theme key:", key);
    }
  }

  const value = {
    theme,
    themeName,
    setThemeName: setTheme,
    toggleLightDark,
    themes: Object.values(themeMap), // list of options if you ever want to render them
    isThemeLoading,
  };

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
