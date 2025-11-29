// theme/themes.js
// Base Light + Dark theme objects for SummitScene

export const lightTheme = {
  name: "light",
  // backgrounds
  background: "#F6F5F8",
  card: "#FFFFFF",
  pill: "#d6dbe2ff",

  // text
  textMain: "#111827",
  textMuted: "#040b18ff",
  textOnAccent: "#FFFFFF",

  // accents
  accent: "#031142ff",
  accentSoft: "#a4a3a8ff",

  // borders / dividers
  border: "#E5E7EB",
  hairline: "#E5E7EB",

  // tab bar / navigation
  tabBarBackground: "#FFFFFF",
  tabBarActive: "#26177aff",
  tabBarInactive: "#0a172eff",

  tabActive: "#FF5C5C",
  tabInactive: "#999",
  tabBackground: "#fff",

  isDark: false,
};

export const darkTheme = {
  name: "dark",
  // backgrounds
  background: "#020617",
  card: "#020617",
  pill: "#111827",

  // text
  textMain: "#F9FAFB",
  textMuted: "#9CA3AF",
  textOnAccent: "#FFFFFF",
  text: "#F9FAFB",

  // accents
  accent: "#6B7280",
  accentSoft: "#4B5563",

  // borders / dividers
  border: "#1F2933",
  hairline: "#374151",

  // tab bar / navigation
  tabBarBackground: "#020617",
  tabBarActive: "#6B7280",
  tabBarInactive: "#6B7280",

  tabActive: "#70CFFF",
  tabInactive: "#777",
  tabBackground: "#111",
  isDark: true,
};
