// screens/EventDetailScreen.js
// Show full details for a single event

import React, { useState } from "react";
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
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../../context/AuthContext";
import { deleteEvent } from "../../services/eventsApi";
import { useTheme } from "../../context/ThemeContext";

// Helper: derive business host info from event.createdBy (or fallback to event.user)
function getEventHost(event) {
  if (!event) return null;

  // Prefer createdBy, fallback to user if ever used
  const userObj =
    typeof event.createdBy === "object" && event.createdBy !== null
      ? event.createdBy
      : typeof event.user === "object" && event.user !== null
      ? event.user
      : null;

  if (!userObj) return null;
  if (userObj.role !== "business") return null; // only show for business hosts

  const name = userObj.name || "Event host";
  const town = userObj.town || event.town || "Rockies local";
  const avatarUrl = userObj.avatarUrl || null;
  const website = userObj.website || "";
  const instagram = userObj.instagram || "";
  const bio = userObj.bio || "";
  const businessType = userObj.lookingFor || "";

  return {
    name,
    town,
    avatarUrl,
    website,
    instagram,
    bio,
    businessType,
    role: userObj.role,
  };
}

// Helper: safely check if the logged-in user owns this event
function isEventOwner(event, user) {
  if (!event || !user) return false;

  const createdBy = event.createdBy;
  const eventOwnerId =
    typeof createdBy === "string" ? createdBy : createdBy?._id || createdBy?.id;

  const userId = user._id || user.id;

  if (!eventOwnerId || !userId) return false;

  return eventOwnerId.toString() === userId.toString();
}

export default function EventDetailScreen({ route }) {
  const navigation = useNavigation();
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const [hostProfile, setHostProfile] = useState(null);

  // event passed in from navigate("EventDetail", { event })
  const { event } = route.params || {};

  if (!event) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: theme.background }]}
      >
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: theme.text }]}>
            Event details not available.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const host = getEventHost(event);
  const isOwner = isEventOwner(event, user);

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
  const hasStartTime = Boolean(event.time);
  const hasEndTime = Boolean(event.endTime);

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

  let timeLabel = "Time TBA";
  if (hasStartTime && hasEndTime) {
    timeLabel = `${event.time} – ${event.endTime}`;
  } else if (hasStartTime) {
    timeLabel = event.time;
  } else if (hasEndTime) {
    timeLabel = `Until ${event.endTime}`;
  }

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
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          {/* Hero image */}
          {event.imageUrl ? (
            <Image source={{ uri: event.imageUrl }} style={styles.heroImage} />
          ) : null}

          <View style={styles.content}>
            {/* Category + town row */}
            <View style={styles.topRow}>
              <View
                style={[
                  styles.categoryPill,
                  { backgroundColor: theme.accentSoft || theme.accent },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    { color: theme.onAccent || theme.background },
                  ]}
                >
                  {category}
                </Text>
              </View>
              {town ? (
                <Text style={[styles.townText, { color: theme.textMuted }]}>
                  {town}
                </Text>
              ) : null}
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

            {/* Date + time row */}
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Text style={[styles.metaLabel, { color: theme.textMuted }]}>
                  Date
                </Text>
                <Text style={[styles.metaValue, { color: theme.text }]}>
                  {dateLabel}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={[styles.metaLabel, { color: theme.textMuted }]}>
                  Time
                </Text>
                <Text style={[styles.metaValue, { color: theme.text }]}>
                  {timeLabel}
                </Text>
              </View>
            </View>

            {/* Location + map link */}
            {location ? (
              <View style={styles.locationBlock}>
                <Text style={[styles.metaLabel, { color: theme.textMuted }]}>
                  Location
                </Text>
                <Text
                  style={[styles.locationText, { color: theme.text }]}
                >
                  {location}
                </Text>

                <Pressable
                  style={[
                    styles.mapButton,
                    {
                      borderColor: theme.accent,
                    },
                  ]}
                  onPress={handleOpenMaps}
                >
                  <Text
                    style={[
                      styles.mapButtonText,
                      { color: theme.accent },
                    ]}
                  >
                    Open in Maps
                  </Text>
                </Pressable>
              </View>
            ) : null}

            {/* Description */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionHeading,
                  { color: theme.text },
                ]}
              >
                About this event
              </Text>
              <Text
                style={[
                  styles.description,
                  { color: theme.textMuted },
                ]}
              >
                {description}
              </Text>
            </View>

            {/* Hosted by (business) block */}
            {host && (
              <View
                style={[
                  styles.hostCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.hostSectionTitle,
                    { color: theme.text },
                  ]}
                >
                  Hosted by
                </Text>

                <View style={styles.hostRow}>
                  <View
                    style={[
                      styles.hostAvatar,
                      { backgroundColor: theme.card },
                    ]}
                  >
                    {host.avatarUrl ? (
                      <Image
                        source={{ uri: host.avatarUrl }}
                        style={styles.hostAvatarImage}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.hostAvatarInitial,
                          { color: theme.text },
                        ]}
                      >
                        {host.name.charAt(0).toUpperCase()}
                      </Text>
                    )}
                  </View>

                  <View style={styles.hostTextCol}>
                    <Text
                      style={[
                        styles.hostName,
                        { color: theme.text },
                      ]}
                    >
                      {host.name}
                    </Text>
                    <Text
                      style={[
                        styles.hostTown,
                        { color: theme.textMuted },
                      ]}
                    >
                      {host.town}
                    </Text>
                    {host.businessType ? (
                      <Text
                        style={[
                          styles.hostMeta,
                          { color: theme.textMuted },
                        ]}
                      >
                        {host.businessType}
                      </Text>
                    ) : null}
                  </View>
                </View>

                <Pressable
                  style={[
                    styles.hostProfileButton,
                    { borderColor: theme.accent },
                  ]}
                  onPress={() => setHostProfile(host)}
                >
                  <Text
                    style={[
                      styles.hostProfileButtonText,
                      { color: theme.accent },
                    ]}
                  >
                    View event posting profile
                  </Text>
                </Pressable>
              </View>
            )}

            {/* owner-only section */}
            {isOwner && (
              <View
                style={[
                  styles.ownerSection,
                  { backgroundColor: theme.card },
                ]}
              >
                <Text
                  style={[
                    styles.ownerBadge,
                    {
                      backgroundColor: theme.accent,
                      color: theme.onAccent || theme.background,
                    },
                  ]}
                >
                  This is your event
                </Text>

                <View style={styles.ownerButtonsRow}>
                  <Pressable
                    style={[
                      styles.ownerButton,
                      styles.editButton,
                      { backgroundColor: theme.accent },
                    ]}
                    onPress={handleEdit}
                  >
                    <Text
                      style={[
                        styles.ownerButtonText,
                        { color: theme.onAccent || theme.background },
                      ]}
                    >
                      Edit Event
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.ownerButton,
                      styles.deleteButton,
                      {
                        backgroundColor:
                          theme.danger || "#ff4d4f",
                      },
                    ]}
                    onPress={handleDelete}
                  >
                    <Text
                      style={[
                        styles.ownerButtonText,
                        { color: theme.onDanger || theme.background },
                      ]}
                    >
                      Delete Event
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}

            {hostProfile && (
              <Modal
                visible={true}
                animationType="slide"
                transparent
                onRequestClose={() => setHostProfile(null)}
              >
                <View style={styles.profileModalOverlay}>
                  <View
                    style={[
                      styles.profileModalCard,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    {/* Header */}
                    <View style={styles.profileModalHeader}>
                      <Text
                        style={[
                          styles.profileModalTitle,
                          { color: theme.text },
                        ]}
                      >
                        Event posting profile
                      </Text>
                      <Pressable onPress={() => setHostProfile(null)}>
                        <Text
                          style={[
                            styles.profileModalClose,
                            { color: theme.accent },
                          ]}
                        >
                          Close
                        </Text>
                      </Pressable>
                    </View>

                    {/* Top row */}
                    <View style={styles.profileTopRow}>
                      <View
                        style={[
                          styles.profileAvatar,
                          { backgroundColor: theme.card },
                        ]}
                      >
                        {hostProfile.avatarUrl ? (
                          <Image
                            source={{ uri: hostProfile.avatarUrl }}
                            style={styles.profileAvatarImage}
                          />
                        ) : (
                          <Text
                            style={[
                              styles.profileAvatarInitial,
                              { color: theme.text },
                            ]}
                          >
                            {hostProfile.name.charAt(0).toUpperCase()}
                          </Text>
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.profileName,
                            { color: theme.text },
                          ]}
                        >
                          {hostProfile.name}
                        </Text>
                        <Text
                          style={[
                            styles.profileTown,
                            { color: theme.textMuted },
                          ]}
                        >
                          {hostProfile.town || "Rockies business"}
                        </Text>
                        <Text
                          style={[
                            styles.profileRole,
                            { color: theme.textMuted },
                          ]}
                        >
                          Business host
                        </Text>
                      </View>
                    </View>

                    {/* About / business type */}
                    {hostProfile.bio ? (
                      <View style={styles.profileSection}>
                        <Text
                          style={[
                            styles.profileSectionLabel,
                            { color: theme.textMuted },
                          ]}
                        >
                          About
                        </Text>
                        <Text
                          style={[
                            styles.profileSectionText,
                            { color: theme.text },
                          ]}
                        >
                          {hostProfile.bio}
                        </Text>
                      </View>
                    ) : null}

                    {hostProfile.businessType ? (
                      <View style={styles.profileSection}>
                        <Text
                          style={[
                            styles.profileSectionLabel,
                            { color: theme.textMuted },
                          ]}
                        >
                          Business type
                        </Text>
                        <Text
                          style={[
                            styles.profileSectionText,
                            { color: theme.text },
                          ]}
                        >
                          {hostProfile.businessType}
                        </Text>
                      </View>
                    ) : null}

                    {/* Instagram */}
                    {hostProfile.instagram ? (
                      <View style={styles.profileSection}>
                        <Text
                          style={[
                            styles.profileSectionLabel,
                            { color: theme.textMuted },
                          ]}
                        >
                          Instagram
                        </Text>
                        <Text
                          style={[
                            styles.profileLinkText,
                            { color: theme.accent },
                          ]}
                        >
                          {hostProfile.instagram}
                        </Text>
                      </View>
                    ) : null}

                    {/* Website */}
                    {hostProfile.website ? (
                      <View style={styles.profileSection}>
                        <Text
                          style={[
                            styles.profileSectionLabel,
                            { color: theme.textMuted },
                          ]}
                        >
                          Website
                        </Text>
                        <Text
                          style={[
                            styles.profileLinkText,
                            { color: theme.accent },
                          ]}
                        >
                          {hostProfile.website}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </Modal>
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
  },

  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  card: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
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
  },

  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  townText: {
    fontSize: 13,
    fontWeight: "500",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
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
    marginBottom: 2,
  },

  metaValue: {
    fontSize: 14,
    fontWeight: "500",
  },

  locationBlock: {
    marginBottom: 16,
  },

  locationText: {
    fontSize: 14,
    marginBottom: 8,
  },

  mapButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },

  mapButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },

  section: {
    marginBottom: 16,
  },

  sectionHeading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 8,
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
  },

  ownerSection: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
  },

  ownerBadge: {
    alignSelf: "flex-start",
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
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

  editButton: {},

  deleteButton: {},

  ownerButtonText: {
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
  },

  hostCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  hostSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  hostRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  hostAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  hostAvatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  hostAvatarInitial: {
    fontSize: 20,
    fontWeight: "700",
  },
  hostTextCol: {
    flex: 1,
  },
  hostName: {
    fontSize: 15,
    fontWeight: "600",
  },
  hostTown: {
    fontSize: 13,
  },
  hostMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  hostProfileButton: {
    marginTop: 6,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
  },
  hostProfileButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },

  profileModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  profileModalCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  profileModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  profileModalTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  profileModalClose: {
    fontSize: 14,
    fontWeight: "600",
  },
  profileTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  profileAvatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  profileAvatarInitial: {
    fontSize: 22,
    fontWeight: "700",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "700",
  },
  profileTown: {
    fontSize: 13,
    marginTop: 2,
  },
  profileRole: {
    fontSize: 12,
    marginTop: 2,
  },
  profileSection: {
    marginTop: 10,
  },
  profileSectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
  },
  profileSectionText: {
    fontSize: 13,
  },
  profileLinkText: {
    fontSize: 13,
  },
});
