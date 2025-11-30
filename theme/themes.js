// theme/themes.js
// Base theme objects for SummitScene, built on top of the shared palette.

import { colors } from "./colors";

export const themes = {
  light: {
    key: "light",
    label: "Light",
    isDark: false,

    // backgrounds
    background: "#F6F5F8",
    card: colors.card,
    pill: "#d6dbe2",

    // text
    text: "#111827",
    textMain: "#111827",
    textMuted: "#4b5563",
    textOnAccent: "#FFFFFF",

    // accents
    accent: colors.accent,
    accentSoft: "rgba(59, 130, 246, 0.15)",

    // borders / dividers
    border: "#E5E7EB",
    hairline: "#E5E7EB",

    // tab bar / navigation
    tabBarBackground: "#FFFFFF",
    tabBarActive: "#26177a",
    tabBarInactive: "#0a172e",
    tabActive: "#FF5C5C",
    tabInactive: "#999999",
    tabBackground: "#ffffff",

    // status
    error: colors.error,
    cta: colors.cta,
    danger: colors.danger,
  },

  dark: {
    key: "dark",
    label: "Dark",
    isDark: true,

    // backgrounds
    background: "#020617",
    card: "#020617",
    pill: "#111827",

    // text
    text: colors.textLight,
    textMain: colors.textLight,
    textMuted: colors.textMuted,
    textOnAccent: "#FFFFFF",

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
    tabInactive: "#777777",
    tabBackground: "#111111",

    // status
    error: colors.error,
    cta: colors.cta,
    danger: colors.danger,
  },

  feminine: {
    key: "feminine",
    label: "Feminine (Pink & Lilac)",
    isDark: false,

    background: "#FFF6FB",
    card: "#FFFFFF",
    pill: "#fde7f4",

    text: "#3C2640",
    textMain: "#3C2640",
    textMuted: "#8F6D99",
    textOnAccent: "#2B1220",

    accent: "#F28BB2",
    accentSoft: "rgba(242, 139, 178, 0.2)",

    border: "#F1D5EC",

    tabBarBackground: "#FFF6FB",
    tabBarActive: "#F28BB2",
    tabBarInactive: "#8F6D99",
    tabActive: "#F28BB2",
    tabInactive: "#8F6D99",
    tabBackground: "#FFF6FB",

    error: colors.error,
    cta: colors.cta,
    danger: colors.danger,
  },

  masculine: {
    key: "masculine",
    label: "Masculine (Blue & Gold)",
    isDark: false,

    background: "#F3F6FF",
    card: "#FFFFFF",
    pill: "#dde7ff",

    text: "#123152",
    textMain: "#123152",
    textMuted: "#5E6E85",
    textOnAccent: "#FDFDFD",

    accent: "#2F6FE4",
    accentSoft: "rgba(47, 111, 228, 0.2)",

    border: "#d2d4ff",

    tabBarBackground: "#F3F6FF",
    tabBarActive: "#2F6FE4",
    tabBarInactive: "#5E6E85",
    tabActive: "#2F6FE4",
    tabInactive: "#5E6E85",
    tabBackground: "#F3F6FF",

    error: colors.error,
    cta: colors.cta,
    danger: colors.danger,
  },

  rainbow: {
    key: "rainbow",
    label: "Rainbow",
    isDark: false,

    background: "#e94452",
    card: "#ce730c",
    pill: "#f59e0b",

    text: "#3806aa",
    textMain: "#3806aa",
    textMuted: "#7669af",
    textOnAccent: "#c251bc",

    accent: "#c5e610",
    accentSoft: "rgba(197, 230, 16, 0.25)",

    border: "#280ca7",

    tabBarBackground: "#e94452",
    tabBarActive: "#c5e610",
    tabBarInactive: "#280ca7",
    tabActive: "#c5e610",
    tabInactive: "#280ca7",
    tabBackground: "#e94452",

    error: colors.error,
    cta: colors.cta,
    danger: colors.danger,
  },
};
