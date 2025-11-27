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
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../../context/AuthContext";
import { deleteEvent } from "../../services/eventsApi";

import { colors } from "../../theme/colors";

export default function EventDetailScreen({ route }) {
  const navigation = useNavigation();
  const { user, token } = useAuth();

  // event passed in from navigate("EventDetail", { event })
  const { event } = route.params || {};

  if (!event) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Event details not available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isOwner =
    !!user &&
    !!event &&
    !!event.createdBy &&
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

            if (route.params?.onUpdated) {
              route.params.onUpdated();
            }
            navigation.goBack();
          } catch (error) {
            console.error("Failed to delete event:", error);
            Alert.alert("Error", error.message || "Failed to delete event.");
          }
        },
      },
    ]);
  };

  const title = event.title || "Untitled event";
  const category = event.category || "Event";
  const town = event.town || "";
  const location = event.location || "";
  const description = event.description || "No detailed description added yet.";

  const hasDate = Boolean(event.date);
  const hasTime = Boolean(event.time);

  // Friendlier date label
  let dateLabel = "Date TBA";
  if (hasDate) {
    const parsed = new Date(event.date);
    if (!isNaN(parsed)) {
      dateLabel = parsed.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    } else {
      dateLabel = event.date;
    }
  }

  const timeLabel = hasTime ? event.time : "Time TBA";

  const handleOpenMaps = () => {
    const query = encodeURIComponent(location || town || title);
    if (!query) return;

    const url = Platform.select({
      ios: `http://maps.apple.com/?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });

    if (!url) return;

    Linking.openURL(url).catch((err) =>
      console.error("Error opening maps:", err)
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          {/* Hero image */}
          {event.imageUrl ? (
            <Image source={{ uri: event.imageUrl }} style={styles.heroImage} />
          ) : null}

          <View style={styles.content}>
            {/* Category + town row */}
            <View style={styles.topRow}>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
              {town ? <Text style={styles.townText}>{town}</Text> : null}
            </View>

            {/* Title */}
            <Text style={styles.title}>{title}</Text>

            {/* Date + time row */}
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Date</Text>
                <Text style={styles.metaValue}>{dateLabel}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Time</Text>
                <Text style={styles.metaValue}>{timeLabel}</Text>
              </View>
            </View>

            {/* Location + map link */}
            {location ? (
              <View style={styles.locationBlock}>
                <Text style={styles.metaLabel}>Location</Text>
                <Text style={styles.locationText}>{location}</Text>

                <Pressable style={styles.mapButton} onPress={handleOpenMaps}>
                  <Text style={styles.mapButtonText}>Open in Maps</Text>
                </Pressable>
              </View>
            ) : null}

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>About this event</Text>
              <Text style={styles.description}>{description}</Text>
            </View>

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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },

  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  card: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },

  heroImage: {
    width: "100%",
    height: 220,
  },

  content: {
    padding: 16,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.tealTint,
  },

  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  townText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "500",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textLight,
    marginBottom: 10,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 12,
  },

  metaItem: {
    flex: 1,
  },

  metaLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 2,
  },

  metaValue: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: "500",
  },

  locationBlock: {
    marginBottom: 16,
  },

  locationText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },

  mapButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: "transparent",
  },

  mapButtonText: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: "600",
  },

  section: {
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
    borderRadius: 16,
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

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },

  errorText: {
    fontSize: 14,
    color: colors.textLight,
  },
});
