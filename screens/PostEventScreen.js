import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PostEventScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post Event</Text>
      <Text style={styles.subtitle}>
        Business owners can post and manage events here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
  },
});
