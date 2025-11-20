// screens/MyEventsScreen.js
// Shows events created by the currently logged-in user
//Let business users manage their own events in one place

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Pressable,
} from "react-native";
import { useAuth } from "../context/AuthContext";

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
      setEvents(data || []);
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

  function renderEventItem({ item }) {
    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          navigation.navigate("EventDetail", {
            event: item,
          })
        }
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>
          {item.town} • {item.category}
        </Text>
        <Text style={styles.dateText}>
          {item.date} {item.time ? `• ${item.time}` : ""}
        </Text>
        {item.location ? (
          <Text style={styles.location}>{item.location}</Text>
        ) : null}
      </Pressable>
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

      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        renderItem={renderEventItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#e2e8f0",
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#0b1120",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e7eb",
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    color: "#cbd5e1",
  },
  location: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  center: {
    flex: 1,
    backgroundColor: "#020617",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    color: "#e2e8f0",
  },
  errorText: {
    color: "#fecaca",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f97316",
  },
  retryText: {
    color: "#f97316",
    fontWeight: "600",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e7eb",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 16,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "#22c55e",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  primaryButtonText: {
    color: "#0f172a",
    fontWeight: "700",
  },
});
