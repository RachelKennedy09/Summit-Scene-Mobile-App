// home screen
import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";

//URL of backend API
const BASE_URL = "http://localhost:5000";

export default function Feed() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  //function that loads events from our server
  async function load() {
    setLoading(true);
    try {
      const r = await fetch(`${BASE_URL}/events`);
      const json = await r.json();
      setEvents(json);
    } finally {
      setLoading(false);
    }
  }

  //load events once when the app starts
  useEffect(() => {
    load();
  }, []);

  return (
    //efficient list for scrolling
    <FlatList
      data={events}
      keyExtractor={(item) => item._id}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      //how each event looks
      renderItem={({ item }) => (
        <TouchableOpacity style={{ padding: 12, gap: 8 }}>
          {!!item.coverUrl && (
            <Image
              source={{ uri: item.coverUrl }}
              style={{ height: 160, borderRadius: 12 }}
            />
          )}
          <Text style={{ fontSize: 18, fontWeight: "700" }}>{item.title}</Text>
          <Text style={{ color: "#666" }}>
            {item.town} • {new Date(item.startAt).toLocaleString()}
          </Text>
          <Link
            //tap to move to a new link
            href={`/event/${item._id}`}
            style={{ color: "#2563eb", marginTop: 4 }}
          >
            View details →
          </Link>
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      contentContainerStyle={{ padding: 12 }}
      ListEmptyComponent={
        <Text style={{ padding: 16 }}>No events yet. Add some soon.</Text>
      }
    />
  );
}
