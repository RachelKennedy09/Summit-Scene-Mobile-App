// screens/EventDetailScreen.js
// Show full details for a single event

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../../context/AuthContext";
import { deleteEvent } from "../../services/eventsApi";

import { colors } from "../../theme/colors";

export default function EventDetailScreen({ route }) {
  const navigation = useNavigation();
  const { user, token } = useAuth();

  // 👇 event passed in from navigate("EventDetail", { event })
  const { event } = route.params;

  // Decide if this event belongs to the logged in business user
  const isOwner =
    !!user &&
    !!event &&
    !!event.createdBy && // make sure field exists
    (event.createdBy === user._id || event.createdBy === user.id);

  const handleEdit = () => {
    navigation.navigate("EditEvent", {
      event,
    });
  };

  const handleDelete = () => {
    Alert.alert("Delete this event?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteEvent(event._id, token);

            // If myEventsScreen passes a refresh callback, use it
            if (route.params?.onUpdated) {
              route.params.onUpdated();
            }
            navigation.goBack();
          } catch (error) {
            console.error(error);
            Alert.alert("Error", error.message || "Failed to delete event.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {event.imageUrl ? (
          <Image source={{ uri: event.imageUrl }} style={styles.heroImage} />
        ) : null}

        <View style={styles.content}>
          <Text style={styles.category}>{event.category}</Text>
          <Text style={styles.title}>{event.title}</Text>

          <Text style={styles.meta}>
            {event.town} • {event.date}
            {event.time ? ` • ${event.time}` : ""}
          </Text>

          {event.location ? (
            <Text style={styles.location}>📍 {event.location}</Text>
          ) : null}

          {event.description ? (
            <>
              <Text style={styles.sectionHeading}>About this event</Text>
              <Text style={styles.description}>{event.description}</Text>
            </>
          ) : (
            <Text style={styles.description}>
              No detailed description added yet.
            </Text>
          )}

          {/* owner-only section */}
          {isOwner && (
            <View style={styles.ownerSection}>
              <Text style={styles.ownerBadge}>This is your event</Text>

              <View style={styles.ownerButtonsRow}>
                <Pressable
                  style={[styles.ownerButton, styles.editButton]}
                  onPress={handleEdit}
                >
                  <Text style={styles.ownerButtonText}>Edit Event</Text>
                </Pressable>

                <Pressable
                  style={[styles.ownerButton, styles.deleteButton]}
                  onPress={handleDelete}
                >
                  <Text style={styles.ownerButtonText}>Delete Event</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },

  heroImage: {
    width: "100%",
    height: 220,
  },

  content: {
    padding: 16,
  },

  category: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textLight,
    marginBottom: 6,
  },

  meta: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 4,
  },

  location: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },

  sectionHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textLight,
    marginBottom: 6,
    marginTop: 8,
  },

  description: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },

  ownerSection: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.tealTint,
  },

  ownerBadge: {
    alignSelf: "flex-start",
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: colors.teal,
    color: colors.textLight,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  ownerButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },

  ownerButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  editButton: {
    backgroundColor: colors.teal,
  },

  deleteButton: {
    backgroundColor: colors.danger,
  },

  ownerButtonText: {
    color: colors.textLight,
    fontWeight: "600",
    fontSize: 14,
  },
});
