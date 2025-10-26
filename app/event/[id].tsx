// take an id -> fetch the right event -> display it neatly

import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, Image, View } from "react-native";

const BASE_URL = "http://localhost:5000";

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>(); //Grabs the ID from the URL so knows which event to load
  const [ev, setEV] = useState<any>(null); // empty state until the event loads

  //When this page Loads, fetch that single event
  useEffect(() => {
    fetch(`${BASE_URL}/events/${id}`)
      .then((r) => r.json())
      .then(setEV);
  }, [id]);

  //shows loading until data arrives
  if (!ev) return <Text style={{ padding: 16 }}>Loading...</Text>;

  return (
    //allows content to scroll
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      {!!ev.coverUrl && (
        <Image
          source={{ uri: ev.coverUrl }}
          style={{ height: 220, borderRadius: 12 }}
        />
      )}
      <Text style={{ fontSize: 22, fontWeight: "800" }}>{ev.title}</Text>
      <Text style={{ color: "#666" }}>
        {ev.town} • {new Date(ev.startAt).toLocaleString()}
      </Text>
      <View style={{ height: 8 }} />
      <Text>{ev.desc}</Text>
    </ScrollView>
  );
}
