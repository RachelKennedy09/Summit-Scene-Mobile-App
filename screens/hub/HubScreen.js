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
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import EventCard from "../../components/cards/EventCard";
//  Removing Chips for the New UI Sprint (9)
// import CategoryChips from "../../components/chips/CategoryChips";
// import TownChips from "../../components/chips/TownChips";
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
  const navigation = useNavigation();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTown, setSelectedTown] = useState("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState("All");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  //controls whether the Town selector modal is visible
  const [isTownModalVisible, setIsTownModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);

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
    // Helper to compute date range based on selectedDateFilter
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
      rangeEnd.setDate(rangeEnd.getDate() + 1); // [today, today+1)
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
      // Category filter
      const categoryMatch =
        selectedCategory === "All" || event.category === selectedCategory;

      // Town filter
      const townMatch = selectedTown === "All" || event.town === selectedTown;

      // Date filter
      let dateMatch = true;
      if (selectedDateFilter !== "All dates") {
        if (!event.date) {
          dateMatch = false;
        } else {
          const eventDateObj = new Date(event.date);
          if (isNaN(eventDateObj)) {
            dateMatch = false;
          } else {
            // normalize event date to start-of-day
            const eventDay = new Date(
              eventDateObj.getFullYear(),
              eventDateObj.getMonth(),
              eventDateObj.getDate()
            );

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
      selectedDateFilter === "All dates"
    ) {
      return "No events available yet. Check back soon!";
    }

    if (selectedCategory === "All" && selectedTown !== "All") {
      return `No events found in ${selectedTown}. Try another town or check back later.`;
    }

    if (selectedTown === "All" && selectedCategory !== "All") {
      return `No ${selectedCategory} events found. Try another category or town.`;
    }

    if (selectedDateFilter !== "All dates") {
      return `No events match your filters for ${selectedDateFilter.toLowerCase()}.`;
    }

    return `No ${selectedCategory} events found in ${selectedTown}.`;
  }, [selectedCategory, selectedTown, selectedDateFilter]);
  // Friendly summary of what we're showing
  const resultSummary = useMemo(() => {
    const count = eventsToShow.length;

    const townLabel = selectedTown === "All" ? "all towns" : ` ${selectedTown}`;
    const categoryLabel =
      selectedCategory === "All"
        ? "all categories"
        : ` ${selectedCategory.toLowerCase()}`;

    const dateLabel =
      selectedDateFilter === "All dates"
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

  // When the user taps a town option inside the modal
  const handleSelectTown = (town) => {
    setSelectedTown(town);
    setIsTownModalVisible(false);
  };

  // When the user taps a category option inside the modal
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setIsCategoryModalVisible(false);
  };

  // When the user taps a date filter option inside the modal
  const handleSelectDateFilter = (filter) => {
    setSelectedDateFilter(filter);
    setIsDateModalVisible(false);
  };

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

            {/* Filter summary */}
            <Text style={styles.filterSummaryText}>{resultSummary}</Text>
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

  headerContainer: {
    marginBottom: 20,
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
    marginTop: 8,
    marginBottom: 6,
  },

  // summary under filters
  filterSummaryText: {
    fontSize: 13,
    color: colors.textMuted,
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

  // ----- Modal styles -----
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
