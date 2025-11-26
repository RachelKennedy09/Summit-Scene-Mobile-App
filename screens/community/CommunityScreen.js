import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../../context/AuthContext";

import { colors } from "../../theme/colors";

// post types (backend values and labels)
const POST_TYPES = [
  { label: "Highway Conditions", value: "highwayconditions" },
  { label: "Ride Share", value: "rideshare" },
  { label: "Event Buddy", value: "eventbuddy" },
];

export default function CommunityScreen({ navigation }) {
  const [selectedType, setSelectedType] = useState("eventbuddy");

  // mock data later api
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, token } = useAuth(); //get JWT token

  const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL || "http://172.28.248.13:4000";

  const filteredPosts = useMemo(
    () => posts.filter((post) => post.type === selectedType),
    [posts, selectedType]
  );

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${API_BASE_URL}/api/community?type=${selectedType}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to load posts");
      }

      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.errpr("Error fetching community posts:", error);
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, selectedType, token]);

  useFocusEffect(
    useCallback(() => {
      // When the screen comes into focus (first load OR coming back),
      // fetch the posts for the current board
      fetchPosts();
    }, [fetchPosts])
  );

  const handleDeletePost = (postId) => {
    Alert.alert("Delete post?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/community/${postId}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            if (!res.ok) {
              throw new Error("Failed to delete post");
            }

            // refresh the feed
            fetchPosts();
          } catch (error) {
            console.error("Error deleting community post:", error);
            Alert.alert("Error", error.message || "Failed to delete post.");
          }
        },
      },
    ]);
  };

  function isPostOwner(post) {
    if (!user) return false;

    // Logged-in user id (support _id or id)
    const userId = user._id || user.id;
    if (!userId) return false;

    // Post owner id can be a string or a populated object
    const postUserId =
      typeof post.user === "string" ? post.user : post.user?._id;

    if (!postUserId) return false;

    return postUserId === userId;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>Community</Text>
          <Text style={styles.subheading}>
            A space for locals to share road conditions, rides, and event
            buddies.
          </Text>
        </View>
        <Pressable
          style={styles.newPostButton}
          onPress={() => navigation.navigate("CommunityPost")}
        >
          <Text style={styles.newPostButtonText}>New Post</Text>
        </Pressable>
      </View>

      {/* Type selector pills */}
      <View style={styles.typeRow}>
        {POST_TYPES.map((type) => {
          const isActive = type.value === selectedType;
          return (
            <Pressable
              key={type.value}
              onPress={() => setSelectedType(type.value)}
              style={[styles.typePill, isActive && styles.typePillActive]}
            >
              <Text
                style={[
                  styles.typePillText,
                  isActive && styles.typePillTextActive,
                ]}
              >
                {type.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/*  Posts list for the selected board  */}
      <ScrollView
        contentContainerStyle={styles.sectionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ color: colors.textLight }}>Loading posts...</Text>
          </View>
        )}

        {error && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Error Loading Posts</Text>
            <Text style={styles.emptyText}>{error}</Text>
            <Pressable
              onPress={fetchPosts}
              style={[styles.typePillActive, { padding: 10, marginTop: 10 }]}
            >
              <Text style={{ color: colors.textLight }}>Try Again</Text>
            </Pressable>
          </View>
        )}

        {/* MAIN POSTS LIST */}
        {!loading &&
          !error &&
          filteredPosts.map((post) => {
            const isOwner = isPostOwner(post);

            return (
              <View key={post._id ?? post.id} style={styles.sectionCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.sectionTitle}>{post.title}</Text>
                  <Text style={styles.townTag}>{post.town}</Text>
                </View>

                {/* Name + posted time */}
                <Text style={styles.timestampText}>
                  {post.name ? `${post.name} • ` : ""}
                  {new Date(post.createdAt).toLocaleDateString()} •{" "}
                  {new Date(post.createdAt).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </Text>

                {/* Required event/ride date */}
                <Text style={styles.dateText}>
                  For: {new Date(post.targetDate).toLocaleDateString()}
                </Text>

                <Text style={styles.sectionText}>{post.body}</Text>

                {/* Owner-only delete button */}
                {isOwner && (
                  <View style={styles.ownerActionsRow}>
                    <Pressable
                      style={styles.editButton}
                      onPress={() =>
                        navigation.navigate("EditCommunityPost", { post })
                      }
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </Pressable>
                    <Pressable
                      style={styles.deleteButton}
                      onPress={() => handleDeletePost(post._id || post.id)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            );
          })}

        {/* EMPTY STATE */}
        {!loading && !error && filteredPosts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptyText}>
              Be the first to share something in this board.
            </Text>
          </View>
        )}
      </ScrollView>
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
    marginBottom: 16,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  newPostButton: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },

  newPostButtonText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: "600",
  },

  /* ---- CATEGORY PILLS ---- */
  typeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },

  typePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.primary,
  },

  typePillActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.accent,
  },

  typePillText: {
    color: colors.textMuted,
    fontSize: 13,
  },

  typePillTextActive: {
    color: colors.textLight,
    fontWeight: "600",
  },

  /* ---- SECTIONS / CARDS ---- */
  sectionsContainer: {
    paddingBottom: 32,
    gap: 16,
  },

  sectionCard: {
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textLight,
    flex: 1,
    marginRight: 8,
  },

  townTag: {
    fontSize: 12,
    color: colors.textMuted,
    opacity: 0.9,
  },

  sectionText: {
    fontSize: 14,
    color: colors.textMuted,
  },

  /* ---- EMPTY STATE ---- */
  emptyState: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textLight,
    marginBottom: 4,
  },

  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },

  dateText: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },

  /* ---- OWNER BUTTONS ---- */
  ownerActionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 10,
  },

  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },

  editButtonText: {
    color: colors.textLight,
    fontWeight: "600",
    fontSize: 13,
  },

  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: colors.danger,
  },

  deleteButtonText: {
    color: colors.textLight,
    fontWeight: "600",
    fontSize: 13,
  },
});
