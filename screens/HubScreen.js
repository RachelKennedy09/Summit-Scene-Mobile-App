// screens/HubScreen.js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    location: "Banff",
    date: "Nov 20, 2025",
    time: "5:00 PM",
    category: "Market",
  },
  {
    id: "2",
    title: "Canmore Winter Artisan Market",
    location: "Canmore Coast Hotel",
    date: "Dec 6, 2025",
    time: "10:00 AM",
    category: "Market",
  },

  // WELLNESS
  {
    id: "3",
    title: "Sunrise Yoga at Lake Louise",
    location: "Lake Louise Lakeshore",
    date: "Nov 22, 2025",
    time: "7:30 AM",
    category: "Wellness",
  },
  {
    id: "4",
    title: "Glacier Breathwork Workshop",
    location: "Banff Centre",
    date: "Dec 3, 2025",
    time: "6:00 PM",
    category: "Wellness",
  },

  // MUSIC
  {
    id: "5",
    title: "Live Music: Indie Nights",
    location: "Communitea Café (Canmore)",
    date: "Nov 23, 2025",
    time: "8:00 PM",
    category: "Music",
  },
  {
    id: "6",
    title: "Banff Avenue Street Performers",
    location: "Banff Avenue",
    date: "Dec 1, 2025",
    time: "2:00 PM",
    category: "Music",
  },

  // WORKSHOP
  {
    id: "7",
    title: "Avalanche Safety Basics",
    location: "Banff Centre",
    date: "Nov 25, 2025",
    time: "6:00 PM",
    category: "Workshop",
  },
  {
    id: "8",
    title: "Beginner Ski Waxing Clinic",
    location: "SkiBig3 Hub (Banff)",
    date: "Dec 5, 2025",
    time: "6:30 PM",
    category: "Workshop",
  },

  // FAMILY
  {
    id: "9",
    title: "Family Snowshoe Adventure",
    location: "Kananaskis Village",
    date: "Dec 7, 2025",
    time: "11:00 AM",
    category: "Family",
  },
  {
    id: "10",
    title: "Christmas Lights Walk",
    location: "Banff Cascade Gardens",
    date: "Dec 10, 2025",
    time: "6:00 PM",
    category: "Family",
  },

  // RETAIL
  {
    id: "11",
    title: "Outdoor Gear Warehouse Sale",
    location: "Banff Train Station Lot",
    date: "Dec 12, 2025",
    time: "9:00 AM",
    category: "Retail",
  },
  {
    id: "12",
    title: "Canmore Boutique Holiday Sale",
    location: "Main Street Canmore",
    date: "Dec 4, 2025",
    time: "10:00 AM",
    category: "Retail",
  },

  // OUTDOORS
  {
    id: "13",
    title: "Guided Sunrise Hike",
    location: "Ha Ling Peak Trailhead",
    date: "Nov 28, 2025",
    time: "6:00 AM",
    category: "Outdoors",
  },
  {
    id: "14",
    title: "Ice Skating on Lake Louise",
    location: "Lake Louise",
    date: "Dec 2, 2025",
    time: "1:00 PM",
    category: "Outdoors",
  },

  // FOOD
  {
    id: "15",
    title: "Mountain Brunch Pop-Up",
    location: "Three Sisters Canmore",
    date: "Dec 8, 2025",
    time: "10:00 AM",
    category: "Food",
  },
  {
    id: "16",
    title: "Banff Craft Hot Chocolate Trail",
    location: "Banff Town",
    date: "Nov 30, 2025",
    time: "All Day",
    category: "Food",
  },

  // ART
  {
    id: "17",
    title: "Rocky Mountain Watercolour Class",
    location: "Banff Centre",
    date: "Dec 6, 2025",
    time: "1:00 PM",
    category: "Art",
  },
  {
    id: "18",
    title: "Photography Walk: Moraine Lake",
    location: "Moraine Lake",
    date: "Dec 9, 2025",
    time: "2:00 PM",
    category: "Art",
  },
];

// 2️⃣ A small component to display one event card
function EventCard({ event }) {
  return (
    <View style={styles.card}>
      <Text style={styles.category}>{event.category}</Text>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.location}>{event.location}</Text>
      <Text style={styles.datetime}>
        {event.date} • {event.time}
      </Text>
    </View>
  );
}

// Main HubScreen component
export default function HubScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const eventsToShow = useMemo(() => {
    if (selectedCategory === "All") return MOCK_EVENTS;
    return MOCK_EVENTS.filter((event) => event.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>SummitScene Hub</Text>
      <Text style={styles.subheading}>
        Upcoming events in Banff, Canmore & Lake Louise
      </Text>

      {/* Category filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text
                style={[styles.chipText, isActive && styles.chipTextActive]}
              >
                {category}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Event list */}
      <FlatList
        data={eventsToShow}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <EventCard event={item} />}
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
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 16, // increased from 12 → 16
    paddingVertical: 8, // increased from 6 → 8
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2c3e57",
    backgroundColor: "#121f33",
    marginRight: 10,
    minWidth: 70, // optional, prevents over-squishing
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: "#1c3250",
    borderColor: "#a5d6ff",
  },

  chipText: {
    color: "#d1e0ff",
    fontSize: 14, // increased from 13 → 14
    fontWeight: "500",
  },

  chipTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#152238",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#243b53",
  },
  category: {
    fontSize: 12,
    fontWeight: "600",
    color: "#a5d6ff",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#d1e0ff",
    marginBottom: 2,
  },
  datetime: {
    fontSize: 12,
    color: "#9fb3c8",
  },
  emptyText: {
    marginTop: 24,
    textAlign: "center",
    color: "#b0c4de",
    fontSize: 14,
  },
});
