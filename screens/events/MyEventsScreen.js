// screens/MyEventsScreen.js
// Shows events created by the currently logged-in user
// Let business users manage their own events in one place

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Pressable,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { deleteEvent } from "../../services/eventsApi";

import { colors } from "../../theme/colors";


const API_BASE_URL = "http://172.28.248.13:4000/api";

export default function MyEventsScreen({ navigation }) {
  const { user, token } = useAuth();
  const isBusiness = user?.role === "business";

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  async function fetchMyEvents() {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/events/mine`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message = data?.message || "Failed to load your events.";
        throw new Error(message);
      }

      const data = await response.json();

      // sort events by date (earlier first)
      const sorted = (data || []).slice().sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      });
      setEvents(sorted);
    } catch (err) {
      console.error("Error fetching my events:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Initial load
  useEffect(() => {
    if (token) {
      fetchMyEvents();
    }
  }, [token]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await fetchMyEvents();
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // ---- Split into upcoming + past based on today's date ----
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayStr = `${year}-${month}-${day}`;

  const upcomingEvents = events.filter(
    (event) => event.date && event.date >= todayStr
  );
  const pastEvents = events.filter(
    (event) => event.date && event.date < todayStr
  );

  function buildDateTimeLabel(item) {
    const hasDate = Boolean(item.date);
    const hasStartTime = Boolean(item.time);
    const hasEndTime = Boolean(item.endTime);

    let label = "Date & time TBA";

    if (hasDate && hasStartTime && hasEndTime) {
      label = `${item.date} • ${item.time} – ${item.endTime}`;
    } else if (hasDate && hasStartTime) {
      label = `${item.date} • ${item.time}`;
    } else if (hasDate) {
      label = item.date;
    } else if (hasStartTime && hasEndTime) {
      label = `${item.time} – ${item.endTime}`;
    } else if (hasStartTime) {
      label = item.time;
    }

    return label;
  }

  function renderEventItem({ item }) {
    const dateTimeLabel = buildDateTimeLabel(item);

    return (
      <View style={styles.card}>
        {/* Tap the main card to open EventDetail */}
        <Pressable
          onPress={() =>
            navigation.navigate("EventDetail", {
              event: item,
              // lets EventDetail ask MyEvents to reload
              onUpdated: fetchMyEvents,
            })
          }
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>
            {item.town} • {item.category}
          </Text>
          <Text style={styles.dateText}>{dateTimeLabel}</Text>
          {item.location ? (
            <Text style={styles.location}>{item.location}</Text>
          ) : null}
        </Pressable>

        {/* Action buttons: Edit and Delete */}
        <View style={styles.cardActions}>
          <Pressable
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEdit(item)}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading your events...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchMyEvents}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  if (!events.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No events yet</Text>
        <Text style={styles.emptySubtitle}>
          Events you create with your business account will show up here.
        </Text>
        {isBusiness && (
          <Pressable
            style={styles.primaryButton}
            onPress={() => navigation.navigate("tabs", { screen: "Post" })}
          >
            <Text style={styles.primaryButtonText}>
              Create your first event
            </Text>
          </Pressable>
        )}
      </View>
    );
  }

  function handleEdit(event) {
    // navigate to an edit screen
    navigation.navigate("EditEvent", { event });
  }

  function handleDelete(event) {
    Alert.alert(
      "Delete Event",
      `Are you sure you want to delete "${event.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => confirmDelete(event),
        },
      ]
    );
  }

  async function confirmDelete(event) {
    try {
      if (!token) {
        Alert.alert("Not logged in", "Please log in again.");
        return;
      }

      // shared helper
      await deleteEvent(event._id, token);

      Alert.alert("Deleted", `"${event.title}" has been removed.`);

      onRefresh();
    } catch (error) {
      console.error("Error deleting event:", error);
      Alert.alert("Error", error.message || "Failed to delete event.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>My Events</Text>
      <Text style={styles.screenSubtitle}>
        Events created by {user?.name || user?.email}
      </Text>

      {/* 🔹 Quick shortcut to Post Event tab */}
      {isBusiness && (
        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate("tabs", { screen: "Post" })}
        >
          <Text style={styles.primaryButtonText}>Post a new event</Text>
        </Pressable>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <>
          <Text style={styles.sectionHeading}>My Upcoming Events</Text>
          <FlatList
            data={upcomingEvents}
            keyExtractor={(item) => item._id}
            renderItem={renderEventItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          />
        </>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <>
          <Text style={styles.sectionHeading}>My Past Events</Text>
          <FlatList
            data={pastEvents}
            keyExtractor={(item) => item._id}
            renderItem={renderEventItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textLight,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textLight,
    marginTop: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 8,
  },
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textLight,
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    color: colors.textLight,
  },
  location: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  center: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    color: colors.textLight,
  },
  errorText: {
    color: colors.error,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cta,
  },
  retryText: {
    color: colors.cta,
    fontWeight: "600",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textLight,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 16,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: colors.success,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  primaryButtonText: {
    color: colors.textDark,
    fontWeight: "700",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  editButton: {
    backgroundColor: colors.accent,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  actionButtonText: {
    color: colors.textDark,
    fontSize: 12,
    fontWeight: "600",
  },
});
