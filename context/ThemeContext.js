// context/ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { themes as themeMap } from "../theme/themes";
import { colors } from "../theme/colors";

const THEME_STORAGE_KEY = "appTheme";
const ThemeContext = createContext(null);

function makeDarkFromBase(base) {
  // Special dark treatment for Christmas (was rainbow)
  if (base.key === "rainbow") {
    return {
      ...base,
      key: "rainbow-dark",
      label: "Christmas (Dark)",
      isDark: true,

      // Deep evergreen night
      background: "#020B0A",
      card: "#041514",
      pill: "#052E24",

      // Text
      text: "#F9FAFB",
      textMain: "#F9FAFB",
      textMuted: "#D1FAE5",

      textOnAccent: "#021109",

      accent: "#15fa5aff",
      accentSoft: "rgba(250, 204, 21, 0.22)",

      border: "#064E3B",

      // Tabs: mix of green / red / gold
      tabBarBackground: "#020617",
      tabBarActive: "#FACC15",
      tabBarInactive: "#EF4444",

      tabActive: "#22C55E",
      tabInactive: "#EF4444",
      tabBackground: "#020617",

      error: colors.error,
      cta: colors.cta,
      danger: colors.danger,
    };
  }

  // Default dark mode for feminine / masculine etc.
  return {
    ...base,
    isDark: true,

    background: "#020617",
    card: "#020617",
    pill: "#111827",

    text: "#F9FAFB",
    textMain: "#F9FAFB",
    textMuted: "#9CA3AF",
    textOnAccent: "#FFFFFF",

    border: "#1F2933",
    hairline: "#374151",

    tabBarBackground: "#020617",
    tabBarActive: base.accent || "#F28BB2",
    tabBarInactive: "#6B7280",
    tabActive: base.accent || "#F28BB2",
    tabInactive: "#6B7280",
    tabBackground: "#020617",

    error: colors.error,
    cta: colors.cta,
    danger: colors.danger,
  };
}

export function ThemeProvider({ children }) {
  // Allowed keys: "feminine", "masculine", "rainbow"
  const [themeName, setThemeName] = useState("feminine");

  // Separate appearance toggle
  const [isDark, setIsDark] = useState(false);

  const [isThemeLoading, setIsThemeLoading] = useState(true);

  // Restore saved theme
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored) {
          // JSON string { themeName, isDark }
          try {
            const parsed = JSON.parse(stored);

            if (parsed && typeof parsed === "object") {
              if (parsed.themeName && themeMap[parsed.themeName]) {
                setThemeName(parsed.themeName);
              }

              if (typeof parsed.isDark === "boolean") {
                setIsDark(parsed.isDark);
              }

              setIsThemeLoading(false);
              return;
            }
          } catch {
            if (themeMap[stored]) {
              // If they had "dark" before, just treat it as dark appearance
              if (stored === "dark") {
                setThemeName("feminine");
                setIsDark(true);
              } else {
                setThemeName(stored);
                setIsDark(false);
              }
            }
          }
        }
      } catch (e) {
        console.error("Error restoring theme:", e);
      } finally {
        setIsThemeLoading(false);
      }
    })();
  }, []);

  // Persist theme choice (palette + appearance)
  useEffect(() => {
    if (!isThemeLoading) {
      const payload = JSON.stringify({ themeName, isDark });
      AsyncStorage.setItem(THEME_STORAGE_KEY, payload).catch((e) =>
        console.error("Error saving theme:", e)
      );
    }
  }, [themeName, isDark, isThemeLoading]);

  // Pick a base palette (always the *light* version from themeMap)
  const baseThemeName = themeMap[themeName] ? themeName : "feminine";
  const base = themeMap[baseThemeName];

  // Build final theme object for the app
  const theme = isDark
    ? makeDarkFromBase(base)
    : {
        ...base,
        isDark: false,
      };

  // Toggle just flips appearance, *not* palette
  function toggleLightDark() {
    setIsDark((prev) => !prev);
  }

  // Set which palette (feminine / masculine / rainbow)
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
    isDark,
    toggleLightDark,
    themes: Object.values(themeMap),
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
