//layout and navigation

import { Stack } from "expo-router";

// This is the "frame" of the app.
//It wraps all screens and controls their navigation bar (header).

export default function RootLayout() {
  return (
    // "Stack" is like a pile of screens.
    // Each new screen slides in on top.

    <Stack
      screenOptions={{ // lets you control what that header bar looks like on every screen
        headerTitle: "Summit Scene", //title shown on top of every page
        headerStyle: { backgroundColor: "#fff" },
        headerTitleStyle: { fontWeight: "700" },
      }}
    />
  );
}
