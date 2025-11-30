// screens/HubScreen.js

import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

import EventCard from "../../components/cards/EventCard";
import HubFilters from "../../components/hub/HubFilters";

import { fetchEvents as fetchEventsFromApi } from "../../services/eventsApi";
import { colors } from "../../theme/colors";

// Simple list of towns for the selector modal
const TOWNS = ["All", "Banff", "Canmore", "Lake Louise"];

// list of categories for selector modal
const CATEGORIES = [
  "All",
  "Market",
  "Wellness",
  "Music",
  "Workshop",
  "Family",
  "Retail",
  "Outdoors",
  "Food",
  "Art",
];

// Date filter options (relative ranges)
const DATE_FILTERS = [
  "All",
  "Today",
  "Next 3 days",
  "Next 7 days",
  "Next 30 days",
];

export default function HubScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const displayName = user?.name || user?.email || "there";

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTown, setSelectedTown] = useState("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState("All");

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

      setError(null);

      const data = await fetchEventsFromApi();

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
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    let rangeStart = null;
    let rangeEnd = null;

    if (selectedDateFilter === "Today") {
      rangeStart = todayStart;
      rangeEnd = new Date(todayStart);
      rangeEnd.setDate(rangeEnd.getDate() + 1);
    } else if (selectedDateFilter === "Next 3 days") {
      rangeStart = todayStart;
      rangeEnd = new Date(todayStart);
      rangeEnd.setDate(rangeEnd.getDate() + 3);
    } else if (selectedDateFilter === "Next 7 days") {
      rangeStart = todayStart;
      rangeEnd = new Date(todayStart);
      rangeEnd.setDate(rangeEnd.getDate() + 7);
    } else if (selectedDateFilter === "Next 30 days") {
      rangeStart = todayStart;
      rangeEnd = new Date(todayStart);
      rangeEnd.setDate(rangeEnd.getDate() + 30);
    }

    return events.filter((event) => {
      const categoryMatch =
        selectedCategory === "All" || event.category === selectedCategory;

      const townMatch = selectedTown === "All" || event.town === selectedTown;

      let dateMatch = true;

      if (selectedDateFilter !== "All") {
        if (!event.date || typeof event.date !== "string") {
          dateMatch = false;
        } else {
          const [y, m, d] = event.date.split("-").map(Number);
          if (!y || !m || !d) {
            dateMatch = false;
          } else {
            const eventDay = new Date(y, m - 1, d);
            if (rangeStart && rangeEnd) {
              dateMatch = eventDay >= rangeStart && eventDay < rangeEnd;
            }
          }
        }
      }

      return categoryMatch && townMatch && dateMatch;
    });
  }, [events, selectedCategory, selectedTown, selectedDateFilter]);

  const emptyMessage = useMemo(() => {
    if (
      selectedCategory === "All" &&
      selectedTown === "All" &&
      selectedDateFilter === "All"
    ) {
      return "No events available yet. Check back soon!";
    }

    if (selectedCategory === "All" && selectedTown !== "All") {
      return `No events found in ${selectedTown}. Try another town or check back later.`;
    }

    if (selectedTown === "All" && selectedCategory !== "All") {
      return `No ${selectedCategory} events found. Try another category or town.`;
    }

    if (selectedDateFilter !== "All") {
      return `No events match your filters for ${selectedDateFilter.toLowerCase()}.`;
    }

    return `No ${selectedCategory} events found in ${selectedTown}.`;
  }, [selectedCategory, selectedTown, selectedDateFilter]);

  const resultSummary = useMemo(() => {
    const count = eventsToShow.length;

    const townLabel = selectedTown === "All" ? "all towns" : ` ${selectedTown}`;
    const categoryLabel =
      selectedCategory === "All"
        ? "all categories"
        : ` ${selectedCategory.toLowerCase()}`;

    const dateLabel =
      selectedDateFilter === "All"
        ? ""
        : ` (${selectedDateFilter.toLowerCase()})`;

    if (count === 0) {
      return "No events match your current filters.";
    }

    if (count === 1) {
      return `Showing 1 event in ${townLabel} for ${categoryLabel}${dateLabel}.`;
    }

    return `Showing ${count} events in ${townLabel} for ${categoryLabel}${dateLabel}.`;
  }, [eventsToShow.length, selectedTown, selectedCategory, selectedDateFilter]);

  if (loading && !refreshing && events.length === 0) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: theme.background }]}
      >
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>
            Loading events...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && events.length === 0) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: theme.background }]}
      >
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>
            Pull down to try again.
          </Text>
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
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <FlatList
          data={eventsToShow}
          keyExtractor={(item) =>
            item._id?.toString() || Math.random().toString()
          }
          renderItem={renderEvent}
          contentContainerStyle={
            eventsToShow.length === 0
              ? styles.emptyContainer
              : styles.listContent
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
            <HubFilters
              displayName={displayName}
              selectedTown={selectedTown}
              selectedCategory={selectedCategory}
              selectedDateFilter={selectedDateFilter}
              resultSummary={resultSummary}
              error={error}
              towns={TOWNS}
              categories={CATEGORIES}
              dateFilters={DATE_FILTERS}
              onSelectTown={setSelectedTown}
              onSelectCategory={setSelectedCategory}
              onSelectDateFilter={setSelectedDateFilter}
            />
          }
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              {emptyMessage}
            </Text>
          }
        />

        {refreshing && (
          <View style={styles.refreshOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}
      </View>
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  errorText: {
    color: colors.error,
    marginBottom: 8,
    fontSize: 13,
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 32,
  },
  emptyContainer: {
    paddingTop: 8,
    paddingBottom: 32,
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
    backgroundColor: "#0b1522cc",
  },
});
