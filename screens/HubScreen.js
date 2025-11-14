// screens/HubScreen.js
// Stae and logic only
//Screen for events pulled from AI (or MOCK if no events to pull/error)

import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { fetchEvents } from "../services/eventsApi";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import EventCard from "../components/EventCard";
import CategoryChips from "../components/CategoryChips";
import TownChips from "../components/TownChips";

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

const MOCK_EVENTS = [
  // MARKET
  {
    id: "1",
    title: "Banff Night Market",
    town: "Banff",
    location: "Banff",
    date: "Nov 20, 2025",
    time: "5:00 PM",
    category: "Market",
    imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  },
  {
    id: "2",
    title: "Canmore Winter Artisan Market",
    town: "Canmore",
    location: "Canmore Coast Hotel",
    date: "Dec 6, 2025",
    time: "10:00 AM",
    category: "Market",
    imageUrl: "https://images.unsplash.com/photo-1542831371-d531d36971e6",
  },

  // WELLNESS
  {
    id: "3",
    title: "Sunrise Yoga at Lake Louise",
    town: "Lake Louise",
    location: "Lake Louise Lakeshore",
    date: "Nov 22, 2025",
    time: "7:30 AM",
    category: "Wellness",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
  {
    id: "4",
    title: "Glacier Breathwork Workshop",
    town: "Banff",
    location: "Banff Centre",
    date: "Dec 3, 2025",
    time: "6:00 PM",
    category: "Wellness",
    imageUrl: "https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62",
  },

  // MUSIC
  {
    id: "5",
    title: "Live Music: Indie Nights",
    town: "Canmore",
    location: "Communitea Café (Canmore)",
    date: "Nov 23, 2025",
    time: "8:00 PM",
    category: "Music",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
  },
  {
    id: "6",
    title: "Banff Avenue Street Performers",
    town: "Banff",
    location: "Banff Avenue",
    date: "Dec 1, 2025",
    time: "2:00 PM",
    category: "Music",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
  },

  // WORKSHOP
  {
    id: "7",
    title: "Avalanche Safety Basics",
    town: "Banff",
    location: "Banff Centre",
    date: "Nov 25, 2025",
    time: "6:00 PM",
    category: "Workshop",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
  },
  {
    id: "8",
    title: "Beginner Ski Waxing Clinic",
    town: "Banff",
    location: "SkiBig3 Hub (Banff)",
    date: "Dec 5, 2025",
    time: "6:30 PM",
    category: "Workshop",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
  },

  // FAMILY
  {
    id: "10",
    title: "Christmas Lights Walk",
    town: "Banff",
    location: "Banff Cascade Gardens",
    date: "Dec 10, 2025",
    time: "6:00 PM",
    category: "Family",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },

  // RETAIL
  {
    id: "11",
    title: "Outdoor Gear Warehouse Sale",
    town: "Banff",
    location: "Banff Train Station Lot",
    date: "Dec 12, 2025",
    time: "9:00 AM",
    category: "Retail",
    imageUrl: "https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62",
  },
  {
    id: "12",
    title: "Canmore Boutique Holiday Sale",
    town: "Canmore",
    location: "Main Street Canmore",
    date: "Dec 4, 2025",
    time: "10:00 AM",
    category: "Retail",
    imageUrl: "https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62",
  },

  // OUTDOORS
  {
    id: "13",
    title: "Guided Sunrise Hike",
    town: "Canmore",
    location: "Ha Ling Peak Trailhead",
    date: "Nov 28, 2025",
    time: "6:00 AM",
    category: "Outdoors",
    imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  },
  {
    id: "14",
    title: "Ice Skating on Lake Louise",
    town: "Lake Louise",
    location: "Lake Louise",
    date: "Dec 2, 2025",
    time: "1:00 PM",
    category: "Outdoors",
    imageUrl: "https://images.unsplash.com/photo-1455218873509-8097305ee378",
  },

  // FOOD
  {
    id: "15",
    title: "Mountain Brunch Pop-Up",
    town: "Canmore",
    location: "Three Sisters Canmore",
    date: "Dec 8, 2025",
    time: "10:00 AM",
    category: "Food",
    imageUrl: "https://images.unsplash.com/photo-1484980972926-edee96e0960d",
  },
  {
    id: "16",
    title: "Banff Craft Hot Chocolate Trail",
    town: "Banff",
    location: "Banff Town",
    date: "Nov 30, 2025",
    time: "All Day",
    category: "Food",
    imageUrl: "https://images.unsplash.com/photo-1484980972926-edee96e0960d",
  },

  // ART
  {
    id: "17",
    title: "Rocky Mountain Watercolour Class",
    town: "Banff",
    location: "Banff Centre",
    date: "Dec 6, 2025",
    time: "1:00 PM",
    category: "Art",
    imageUrl: "https://images.unsplash.com/photo-1458535836701-3af20e25f22c",
  },
  {
    id: "18",
    title: "Photography Walk: Moraine Lake",
    town: "Lake Louise",
    location: "Moraine Lake",
    date: "Dec 9, 2025",
    time: "2:00 PM",
    category: "Art",
    imageUrl: "https://images.unsplash.com/photo-1458535836701-3af20e25f22c",
  },
];

// Main HubScreen component
export default function HubScreen() {
  const navigation = useNavigation();

  const [selectedCategory, setSelectedCategory] = useState("All"); // which event type is active?
  const [selectedTown, setSelectedTown] = useState("All"); //which town tab is active?
  // events come form state instead of mock_events
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //Load events from backend when screen mounts (once)
  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchEvents();

        if (Array.isArray(data) && data.length > 0) {
          // Combine mocks + live events so the list is nice and full
          const combined = [...MOCK_EVENTS, ...data];
          setEvents(combined);
        } else {
          // If no data from API, stick with mocks
          setEvents(MOCK_EVENTS);
        }
      } catch (err) {
        console.log("Error loading events in HubScreen:", err.message);
        setError("Could not load live events. Showing sample events instead.");
        setEvents(MOCK_EVENTS);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const eventsToShow = useMemo(() => {
    return events.filter((event) => {
      const categoryMatch =
        selectedCategory === "All" || event.category === selectedCategory;

      const townMatch = selectedTown === "All" || event.town === selectedTown;

      // must match BOTH selected filter
      return categoryMatch && townMatch;
    });
  }, [events, selectedCategory, selectedTown]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

      {/* Event list */}
      <FlatList
        data={eventsToShow}
        keyExtractor={(item) => item._id || item.id} // mock uses .id and source(live) uses _id, this will support both without crashing
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() =>
              navigation.navigate("EventDetail", {
                event: item,
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No events found for this category.
          </Text>
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1724",
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
});
