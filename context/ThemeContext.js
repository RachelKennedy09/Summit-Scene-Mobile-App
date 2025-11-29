// context/ThemeContext.js
// Global theme system: light, dark, feminine, masculine

import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_STORAGE_KEY = "appTheme";

const themes = {
  light: {
    key: "light",
    label: "Light",
    isDark: false,
    background: "#F6F5F8",
    card: "#FFFFFF",
    text: "#1E1E1E",
    textMuted: "#534545ff",
    accent: "#d7d9e4ff",
    onAccent: "#645b5bff",
    border: "#E0E0E0",
  },
  dark: {
    key: "dark",
    label: "Dark",
    isDark: true,
    background: "#050509",
    card: "#111118",
    text: "#F7F7F7",
    textMuted: "#A3A3B3",
    accent: "#464445ff",
    onAccent: "#1E1E1E",
    border: "#2A2A3A",
  },
  feminine: {
    key: "feminine",
    label: "Feminine (Pink & Lilac)",
    isDark: false,
    background: "#FFF6FB", // very soft pink
    card: "#FFFFFF",
    text: "#3C2640",
    textMuted: "#8F6D99",
    accent: "#F28BB2", // bright pink
    onAccent: "#2B1220",
    border: "#F1D5EC",
  },
  masculine: {
    key: "masculine",
    label: "Masculine (Blue & Gold)",
    isDark: false,
    background: "#F3F6FF", 
    card: "#FFFFFF",
    text: "#123152",
    textMuted: "#5E6E85",
    accent: "#2F6FE4", 
    onAccent: "#FDFDFD",
    border: "#d2d450ff",
  
  },
   rainbow: {
    key: "rainbow",
    label: "Rainbow",
    isDark: false,

    background: "#e94452ff",
    card: "#ce730cff",
    text: "#3806aaff",
    textMuted: "#7669afff",

    accent: "#c5e610ff",
    onAccent: "#c251bcff",
    border: "#280ca7ff",
  
},

};
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState("light");
  const [isThemeLoading, setIsThemeLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored && themes[stored]) {
          setThemeName(stored);
        }
      } catch (e) {
        console.error("Error restoring theme:", e);
      } finally {
        setIsThemeLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isThemeLoading) {
      AsyncStorage.setItem(THEME_STORAGE_KEY, themeName).catch((e) =>
        console.error("Error saving theme:", e)
      );
    }
  }, [themeName, isThemeLoading]);

  const theme = themes[themeName] || themes.light;

  function toggleLightDark() {
    setThemeName((prev) => (prev === "dark" ? "light" : "dark"));
  }

  function setTheme(key) {
    if (themes[key]) {
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
    themes: Object.values(themes), // could be used to render a list of options
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
