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

import EventCard from "../../components/EventCard";
import CategoryChips from "../../components/CategoryChips";
import TownChips from "../../components/TownChips";
import { fetchEvents as fetchEventsFromApi } from "../../services/eventsApi";

const CATEGORIES = [
  "All",
  "Market",
  "Wellness",
  "Music",
  "Workshop",
  "Family",
  "Retail",
  "Outdoors",
  "Food & Drink",
  "Art",
];

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

      setError(null);

      //  shared API helper
      const data = await fetchEventsFromApi();

      //  sort by date
      const sorted = (Array.isArray(data) ? data : []).slice().sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      });

      setEvents(sorted);
    } catch (error) {
      console.log("Error fetching events:", error.message);
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
      <Text style={styles.heading}>SummitScene Hub</Text>
      <Text style={styles.subheading}>
        Upcoming events in Banff, Canmore & Lake Louise
      </Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TownChips selectedTown={selectedTown} onSelectTown={setSelectedTown} />

      <CategoryChips
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

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
    backgroundColor: "#090d11ff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: "#b0c4de",
    marginBottom: 12,
  },
  errorText: {
    color: "#ffb3b3",
    marginBottom: 8,
    fontSize: 13,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyText: {
    marginTop: 24,
    textAlign: "center",
    color: "#b0c4de",
    fontSize: 14,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#b0c4de",
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
