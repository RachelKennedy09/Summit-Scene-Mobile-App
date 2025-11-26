import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";

import TownChips from "../../components/chips/TownChips.js";
import CategoryChips from "../../components/chips/CategoryChips.js";
import { fetchEvents as fetchEventsFromApi } from "../../services/eventsApi.js";

// Static coordinates for each town
const TOWN_COORDS = {
  Banff: { latitude: 51.1784, longitude: -115.5708 },
  Canmore: { latitude: 51.0892, longitude: -115.3593 },
  "Lake Louise": { latitude: 51.4254, longitude: -116.1773 },
};

// Map starting position (roughly between Banff & Canmore)
const INITIAL_REGION = {
  latitude: 51.18,
  longitude: -115.57,
  latitudeDelta: 0.8,
  longitudeDelta: 0.8,
};

// Helper: normalize any event.date to "YYYY-MM-DD"
function toDateOnlyString(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

export default function MapScreen() {
  const navigation = useNavigation();

  // Filter state
  const [selectedTown, setSelectedTown] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  //Default date = today in YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  // Data + status state
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events (same helper as Hub, with sorting, for consistency)
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchEventsFromApi();

      const sorted = (Array.isArray(data) ? data : []).slice().sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      });

      setEvents(sorted);
    } catch (err) {
      console.log("MapScreen fetch events error:", err.message);
      setError("Could not load events for the map.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Filter events based on town, category, date
  const eventsForMap = useMemo(() => {
    return events.filter((event) => {
      // Town filter
      const townMatch = selectedTown === "all" || event.town === selectedTown;

      const categoryMatch =
        selectedCategory === "All" || event.category === selectedCategory;

      // Date filter: only show events that match selectedDate
      const eventDate = toDateOnlyString(event.date);
      const selectedDateString = selectedDate?.trim();

      const dateMatch = !selectedDateString || eventDate === selectedDateString;

      return townMatch && categoryMatch && dateMatch;
    });
  }, [events, selectedTown, selectedCategory, selectedDate]);

  // Simple friendly text for the date line
  const dateLabel = useMemo(() => {
    if (!selectedDate) return "All dates";
    return selectedDate;
  }, [selectedDate]);

  // when user taps a marker go to EventDetail
  function handleMarkerPress(event) {
    navigation.navigate("EventDetail", {
      event,
      eventId: event.id,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Explore by Map</Text>
      <Text style={styles.subheading}>
        See events pinned across Banff, Canmore & Lake Louise.
      </Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Town filter chips  */}
      <TownChips selectedTown={selectedTown} onSelectTown={setSelectedTown} />

      {/* Category filters chips */}
      <CategoryChips
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Date input */}
      <View style={styles.dateRow}>
        <Text style={styles.dateLabel}>Date (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.dateInput}
          value={selectedDate}
          onChangeText={setSelectedDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#64748b"
        />
      </View>

      <Text style={styles.filterSummary}>
        Showing {selectedCategory !== "All" ? `${selectedCategory}` : " all"}
        events{selectedTown !== "All" ? ` in ${selectedTown}` : ""} on
        {dateLabel}
      </Text>

      {/* Map area */}
      <View style={styles.mapContainer}>
        {loading ? (
          <View style={styles.mapLoading}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Loading map events...</Text>
          </View>
        ) : (
          <MapView style={styles.map} initialRegion={INITIAL_REGION}>
            {eventsForMap.map((event) => {
              const coords = TOWN_COORDS[event.town];
              if (!coords) return null; // skip if town missing or unknown

              const key =
                event.id?.toString() ??
                `${event.title}-${event.date}-${event.time}`;

              const descriptionPieces = [];
              if (event.location) descriptionPieces.push(event.location);
              if (event.date)
                descriptionPieces.push(toDateOnlyString(event.date));
              if (event.time) descriptionPieces.push(event.time);
              const description = descriptionPieces.join(" • ");

              return (
                <Marker
                  key={key}
                  coordinate={coords}
                  title={event.title}
                  description={description}
                  onPress={() => handleMarkerPress(event)}
                />
              );
            })}
          </MapView>
        )}
      </View>

      {!loading && eventsForMap.length === 0 && !error && (
        <Text style={styles.emptyText}>
          No events match this town + date. Try another day or town.
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050b12",
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
    marginBottom: 8,
  },
  errorText: {
    color: "#ffb3b3",
    marginBottom: 6,
    fontSize: 13,
  },
  dateRow: {
    marginBottom: 8,
  },
  dateLabel: {
    color: "#cbd5f5",
    fontSize: 13,
    marginBottom: 4,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#2c3e57",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#e2e8f0",
    backgroundColor: "#121826",
    fontSize: 14,
  },
  filterSummary: {
    fontSize: 12,
    color: "#7e8fa8",
    marginBottom: 8,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2c3e57",
    backgroundColor: "#0c1624",
  },
  map: {
    flex: 1,
  },
  mapLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#b0c4de",
    fontSize: 14,
  },
  emptyText: {
    marginTop: 10,
    textAlign: "center",
    color: "#b0c4de",
    fontSize: 13,
  },
});
