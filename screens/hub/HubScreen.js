// screens/HubScreen.js

import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import EventCard from "../../components/cards/EventCard";
//  Removing Chips for the New UI Sprint (9)
// import CategoryChips from "../../components/chips/CategoryChips";
// import TownChips from "../../components/chips/TownChips";
import { fetchEvents as fetchEventsFromApi } from "../../services/eventsApi";

import { colors } from "../../theme/colors";

export default function HubScreen() {
  const navigation = useNavigation();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTown, setSelectedTown] = useState("All");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadEvents = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      // reset any previous error before fetching again

      setError(null);

      //  use shared API helper
      const data = await fetchEventsFromApi();

      //  sort by date (soonest first)
      const sorted = (Array.isArray(data) ? data : []).slice().sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      });

      setEvents(sorted);
    } catch (error) {
      console.error("Error fetching events:", error.message);
      setError("Could not load events. Pull to refresh to try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadEvents(false);
  }, [loadEvents]);

  const handleRefresh = () => {
    loadEvents(true);
  };

  const eventsToShow = useMemo(() => {
    return events.filter((event) => {
      const categoryMatch =
        selectedCategory === "All" || event.category === selectedCategory;

      const townMatch = selectedTown === "All" || event.town === selectedTown;

      return categoryMatch && townMatch;
    });
  }, [events, selectedCategory, selectedTown]);

  const emptyMessage = useMemo(() => {
    if (selectedCategory === "All" && selectedTown === "All") {
      return "No events available yet. Check back soon!";
    }

    if (selectedCategory === "All") {
      return `No events found in ${selectedTown}. Try another town or check back later.`;
    }

    if (selectedTown === "All") {
      return `No ${selectedCategory} events found. Try another category or town.`;
    }

    return `No ${selectedCategory} events found in ${selectedTown}.`;
  }, [selectedCategory, selectedTown]);

  if (loading && !refreshing && events.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && events.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.loadingText}>Pull down to try again.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderEvent = ({ item }) => (
    <EventCard
      event={item}
      onPress={() =>
        navigation.navigate("EventDetail", { event: item, eventId: item._id })
      }
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={eventsToShow}
        keyExtractor={(item) =>
          item._id?.toString() || Math.random().toString()
        }
        renderItem={renderEvent}
        contentContainerStyle={
          eventsToShow.length === 0 ? styles.emptyContainer : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="transparent"
            titleColor="transparent"
            colors={["transparent"]}
            progressBackgroundColor="transparent"
          />
        }
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>Welcome to your Summit Scene Hub</Text>
            <Text style={styles.subheading}>
              Choose a town and category to start exploring events near you.
            </Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.pillRow}>
              {/* Town Pill */}
              <Pressable
                style={styles.pill}
                onPress={() => {
                  // TODO (Sprint 9): Open town selector modal here
                }}
              >
                <Text style={styles.pillLabel}>Town</Text>
                <Text style={styles.pillValue}>Select town ▾</Text>
              </Pressable>

              {/* Category Pill */}
              <Pressable
                style={styles.pill}
                onPress={() => {
                  // TODO (Sprint 9): Open category selector modal here
                }}
              >
                <Text style={styles.pillLabel}>Category</Text>
                <Text style={styles.pillValue}>Select category ▾</Text>
              </Pressable>
            </View>

            <View style={styles.sectionDivider} />
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        }
      />

      {refreshing && (
        <View style={styles.refreshOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  headerContainer: {
    marginBottom: 12,
  },

  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textLight,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
  },

  errorText: {
    color: colors.error,
    marginBottom: 8,
    fontSize: 13,
  },

  pillRow: {
    gap: 12,
    marginBottom: 12,
  },

  pill: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },

  pillLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  pillValue: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textLight,
  },

  sectionDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginTop: 12,
  },

  listContent: {
    paddingBottom: 24,
  },

  emptyContainer: {
    paddingBottom: 24,
  },

  emptyText: {
    marginTop: 24,
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 14,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 8,
    color: colors.textMuted,
  },
  refreshOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(9, 13, 17, 0.6)",
  },
});
