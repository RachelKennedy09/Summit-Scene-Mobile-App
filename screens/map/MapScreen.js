// screens/MapScreen.js

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";

import { fetchEvents as fetchEventsFromApi } from "../../services/eventsApi.js";
import { colors } from "../../theme/colors.js";

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

// Helper: normalize any event.date to "YYYY-MM-DD" (for marker description)
function toDateOnlyString(value) {
  if (!value) return null;

  // If already looks like YYYY-MM-DD, just return it
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

export default function MapScreen() {
  const navigation = useNavigation();
  const mapRef = useRef(null); // reference to the MapView

  // Filter state
  const [selectedTown, setSelectedTown] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState("All");

  // Modal state
  const [isTownModalVisible, setIsTownModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);

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
    } catch (error) {
      console.error("MapScreen fetch events error:", error.message);
      setError("Could not load events for the map.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Filter events based on town, category, date RANGE (same logic as Hub)
  const eventsForMap = useMemo(() => {
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
      // Town filter
      const townMatch = selectedTown === "All" || event.town === selectedTown;

      // Category filter
      const categoryMatch =
        selectedCategory === "All" || event.category === selectedCategory;

      // Date filter
      let dateMatch = true;

      if (selectedDateFilter !== "All") {
        if (!event.date || typeof event.date !== "string") {
          dateMatch = false;
        } else {
          const [y, m, d] = event.date.split("-").map(Number);

          if (!y || !m || !d) {
            dateMatch = false;
          } else {
            const eventDay = new Date(y, m - 1, d); // local start-of-day

            if (rangeStart && rangeEnd) {
              dateMatch = eventDay >= rangeStart && eventDay < rangeEnd;
            }
          }
        }
      }

      return townMatch && categoryMatch && dateMatch;
    });
  }, [events, selectedTown, selectedCategory, selectedDateFilter]);

  // Friendly text for the summary line
  const filterSummary = useMemo(() => {
    const count = eventsForMap.length;

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
      return "No events match your current map filters.";
    }

    if (count === 1) {
      return `Showing 1 event in ${townLabel} for ${categoryLabel}${dateLabel}.`;
    }

    return `Showing ${count} events in ${townLabel} for ${categoryLabel}${dateLabel}.`;
  }, [eventsForMap.length, selectedTown, selectedCategory, selectedDateFilter]);

  // 🔹 Animate camera when selectedTown changes
  useEffect(() => {
    if (!mapRef.current) return;

    let targetRegion = INITIAL_REGION;

    if (selectedTown !== "All") {
      const coords = TOWN_COORDS[selectedTown];
      if (coords) {
        targetRegion = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.12, // tighter zoom for town
          longitudeDelta: 0.18,
        };
      }
    }

    mapRef.current.animateToRegion(targetRegion, 800);
  }, [selectedTown]);

  // When the user taps a marker go to EventDetail
  function handleMarkerPress(event) {
    navigation.navigate("EventDetail", {
      event,
      eventId: event._id,
    });
  }

  // --- Handlers for modal selections ---
  const handleSelectTown = (town) => {
    setSelectedTown(town);
    setIsTownModalVisible(false);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setIsCategoryModalVisible(false);
  };

  const handleSelectDateFilter = (filter) => {
    setSelectedDateFilter(filter);
    setIsDateModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Explore by Map</Text>
      <Text style={styles.subheading}>
        See events pinned across Banff, Canmore & Lake Louise.
      </Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Pills row – same layout as HubScreen */}
      <View style={styles.pillRow}>
        {/* Town Pill */}
        <Pressable
          style={styles.pill}
          onPress={() => setIsTownModalVisible(true)}
        >
          <Text style={styles.pillLabel}>Town</Text>
          <Text style={styles.pillValue}>
            {selectedTown === "All" ? "All towns ▾" : `${selectedTown} ▾`}
          </Text>
        </Pressable>

        {/* Category Pill */}
        <Pressable
          style={styles.pill}
          onPress={() => setIsCategoryModalVisible(true)}
        >
          <Text style={styles.pillLabel}>Category</Text>
          <Text style={styles.pillValue}>
            {selectedCategory === "All"
              ? "All categories ▾"
              : `${selectedCategory} ▾`}
          </Text>
        </Pressable>

        {/* Date Pill */}
        <Pressable
          style={styles.pill}
          onPress={() => setIsDateModalVisible(true)}
        >
          <Text style={styles.pillLabel}>Date</Text>
          <Text style={styles.pillValue}>{selectedDateFilter} ▾</Text>
        </Pressable>
      </View>

      <View style={styles.sectionDivider} />

      <Text style={styles.filterSummaryText}>{filterSummary}</Text>

      {/* Map area */}
      <View style={styles.mapContainer}>
        {loading ? (
          <View style={styles.mapLoading}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Loading map events...</Text>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={INITIAL_REGION}
          >
            {eventsForMap.map((event) => {
              const coords = TOWN_COORDS[event.town];
              if (!coords) return null; // skip if town missing or unknown

              const key =
                event._id?.toString() ??
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
          No events match this town + date range. Try another filter combo.
        </Text>
      )}

      {/* Town Selector Modal */}
      <Modal
        visible={isTownModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsTownModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose a town</Text>

            {TOWNS.map((town) => {
              const isSelected = town === selectedTown;
              return (
                <Pressable
                  key={town}
                  style={[
                    styles.townOption,
                    isSelected && styles.townOptionSelected,
                  ]}
                  onPress={() => handleSelectTown(town)}
                >
                  <Text
                    style={[
                      styles.townOptionText,
                      isSelected && styles.townOptionTextSelected,
                    ]}
                  >
                    {town === "All" ? "All towns" : town}
                  </Text>
                  {isSelected && <Text style={styles.townCheckMark}>✓</Text>}
                </Pressable>
              );
            })}

            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setIsTownModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Category Selector Modal */}
      <Modal
        visible={isCategoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose a category</Text>

            {CATEGORIES.map((category) => {
              const isSelected = category === selectedCategory;
              return (
                <Pressable
                  key={category}
                  style={[
                    styles.townOption,
                    isSelected && styles.townOptionSelected,
                  ]}
                  onPress={() => handleSelectCategory(category)}
                >
                  <Text
                    style={[
                      styles.townOptionText,
                      isSelected && styles.townOptionTextSelected,
                    ]}
                  >
                    {category === "All" ? "All categories" : category}
                  </Text>
                  {isSelected && <Text style={styles.townCheckMark}>✓</Text>}
                </Pressable>
              );
            })}

            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setIsCategoryModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Date Selector Modal */}
      <Modal
        visible={isDateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose a date range</Text>

            {DATE_FILTERS.map((filter) => {
              const isSelected = filter === selectedDateFilter;
              return (
                <Pressable
                  key={filter}
                  style={[
                    styles.townOption,
                    isSelected && styles.townOptionSelected,
                  ]}
                  onPress={() => handleSelectDateFilter(filter)}
                >
                  <Text
                    style={[
                      styles.townOptionText,
                      isSelected && styles.townOptionTextSelected,
                    ]}
                  >
                    {filter}
                  </Text>
                  {isSelected && <Text style={styles.townCheckMark}>✓</Text>}
                </Pressable>
              );
            })}

            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setIsDateModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textLight,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 8,
  },
  errorText: {
    color: colors.error,
    marginBottom: 6,
    fontSize: 13,
  },

  // ---- Pills (copied to match HubScreen style) ----
  pillRow: {
    gap: 12,
    marginBottom: 12,
  },
  pill: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
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
    backgroundColor: colors.border,
    marginTop: 4,
    marginBottom: 6,
  },
  filterSummaryText: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 8,
  },

  // ---- Map ----
  mapContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.secondary,
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
    color: colors.textMuted,
    fontSize: 14,
  },
  emptyText: {
    marginTop: 10,
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 13,
  },

  // ----- Modal styles (same as Hub) -----
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "85%",
    maxHeight: "70%",
    backgroundColor: colors.secondary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textLight,
    marginBottom: 12,
  },
  townOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginBottom: 8,
    backgroundColor: colors.cardDark,
    borderWidth: 1,
    borderColor: "transparent",
  },
  townOptionSelected: {
    backgroundColor: colors.tealTint,
    borderColor: colors.teal,
  },
  townOptionText: {
    fontSize: 15,
    color: colors.textLight,
  },
  townOptionTextSelected: {
    fontWeight: "700",
  },
  townCheckMark: {
    fontSize: 16,
    color: colors.accent,
  },
  modalCloseButton: {
    marginTop: 8,
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  modalCloseText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
