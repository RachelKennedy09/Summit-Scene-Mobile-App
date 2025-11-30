// screens/community/CommunityScreen.js

import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
} from "react-native";

import {
  fetchCommunityPosts,
  deleteCommunityPost,
  createCommunityReply,
  toggleCommunityLike,
} from "../../services/communityApi";

import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/colors";
import { useTheme } from "../../context/ThemeContext";
import CommunityPostCard from "./CommunityPostCard";

// post types (backend values and labels)
const POST_TYPES = [
  { label: "Highway Conditions", value: "highwayconditions" },
  { label: "Ride Share", value: "rideshare" },
  { label: "Event Buddy", value: "eventbuddy" },
];

// navigation route to community post screen, edit community post screen
export default function CommunityScreen({ navigation }) {
  //which board is currently active, eventbuddy default
  const [selectedType, setSelectedType] = useState("eventbuddy");

  // posts from API
  const [posts, setPosts] = useState([]);

  // Error and loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reply states
  const [replyForPostId, setReplyForPostId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  // Profile modal
  const [profileUser, setProfileUser] = useState(null);

  // logged in user object, JWT used for protected requests
  const { user, token } = useAuth();

  // current theme object
  const { theme } = useTheme();

  // useMemo for performace
  const filteredPosts = useMemo(
    () => posts.filter((post) => post.type === selectedType),
    [posts, selectedType]
  );

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchCommunityPosts(selectedType, token);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching community posts:", error);
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [selectedType, token]);

  // gaurantees fresh posts when coming back to community tab
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  // Delete post handler
  const handleDeletePost = (postId) => {
    Alert.alert("Delete post?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCommunityPost(postId, token);
            fetchPosts();
          } catch (error) {
            console.error("Error deleting community post:", error);
            Alert.alert("Error", error.message || "Failed to delete post.");
          }
        },
      },
    ]);
  };

  // Reply submit handler
  async function handleReplySubmit(postId) {
    if (!replyText.trim()) {
      Alert.alert("Reply required", "Please write something before sending.");
      return;
    }

    try {
      setSubmittingReply(true);

      await createCommunityReply(postId, replyText, token);

      setReplyText("");
      setReplyForPostId(null);
      fetchPosts();
    } catch (error) {
      console.error("Error sending reply:", error);
      Alert.alert("Error", error.message || "Failed to send reply.");
    } finally {
      setSubmittingReply(false);
    }
  }

  // Like toggle handler
  async function handleToggleLike(postId) {
    if (!token) {
      Alert.alert("Login required", "Please log in to like posts.");
      return;
    }

    try {
      await toggleCommunityLike(postId, token);
      fetchPosts();
    } catch (error) {
      console.error("Error toggling like:", error);
      Alert.alert("Error", error.message || "Failed to update like.");
    }
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.heading, { color: theme.textMain }]}>
            Community
          </Text>
          <Text style={[styles.subheading, { color: theme.textMuted }]}>
            A space for locals to share road conditions, rides, and event
            buddies.
          </Text>
        </View>
        <Pressable
          style={[styles.newPostButton, { backgroundColor: theme.accent }]}
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
              style={[
                styles.typePill,
                {
                  backgroundColor: theme.pill || theme.background,
                  borderColor: theme.border,
                },
                isActive && {
                  backgroundColor: theme.card,
                  borderColor: theme.accent,
                },
              ]}
            >
              <Text
                style={[
                  styles.typePillText,
                  { color: theme.textMuted },
                  isActive && {
                    color: theme.textMain,
                    fontWeight: "600",
                  },
                ]}
              >
                {type.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Result summary */}
      <Text style={[styles.summaryText, { color: theme.textMuted }]}>
        {loading
          ? "Loading posts..."
          : filteredPosts.length === 0
          ? "No posts here yet. Be the first to share something."
          : `Showing ${filteredPosts.length} post${
              filteredPosts.length > 1 ? "s" : ""
            } in this board.`}
      </Text>

      {/* Posts list */}
      <ScrollView
        contentContainerStyle={styles.sectionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={theme.accent} />
            <Text style={[styles.loadingText, { color: theme.textMuted }]}>
              Loading posts...
            </Text>
          </View>
        )}

        {error && (
          <View
            style={[
              styles.emptyState,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.emptyTitle, { color: theme.textMain }]}>
              Error Loading Posts
            </Text>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              {error}
            </Text>
            <Pressable
              onPress={fetchPosts}
              style={[
                styles.typePill,
                {
                  padding: 10,
                  marginTop: 10,
                  backgroundColor: theme.accent,
                  borderColor: theme.accent,
                },
              ]}
            >
              <Text style={{ color: colors.textLight }}>Try Again</Text>
            </Pressable>
          </View>
        )}

        {/* MAIN POSTS LIST */}
        {!loading &&
          !error &&
          filteredPosts.map((post) => {
            const postId = post._id ?? post.id;
            const isReplyOpen = replyForPostId === postId;

            return (
              <CommunityPostCard
                key={postId}
                post={post}
                user={user}
                theme={theme}
                isReplyOpen={isReplyOpen}
                replyText={replyText}
                submittingReply={submittingReply}
                onToggleReply={() => {
                  if (isReplyOpen) {
                    setReplyForPostId(null);
                    setReplyText("");
                  } else {
                    setReplyForPostId(postId);
                    setReplyText("");
                  }
                }}
                onChangeReplyText={setReplyText}
                onSubmitReply={() => handleReplySubmit(postId)}
                onDelete={() => handleDeletePost(postId)}
                onEdit={() =>
                  navigation.navigate("EditCommunityPost", { post })
                }
                onToggleLike={() => handleToggleLike(postId)}
                onOpenProfile={(profileData) => setProfileUser(profileData)}
              />
            );
          })}

        {/* EMPTY STATE */}
        {!loading && !error && filteredPosts.length === 0 && (
          <View
            style={[
              styles.emptyState,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.emptyTitle, { color: theme.textMain }]}>
              No posts yet
            </Text>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              Be the first to share something in this board.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Profile modal */}
      {profileUser && (
        <Modal
          visible={true}
          animationType="slide"
          transparent
          onRequestClose={() => setProfileUser(null)}
        >
          <View style={styles.profileModalOverlay}>
            <View
              style={[
                styles.profileModalCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.profileModalHeader}>
                <Text
                  style={[styles.profileModalTitle, { color: theme.textMain }]}
                >
                  Member Profile
                </Text>
                <Pressable onPress={() => setProfileUser(null)}>
                  <Text
                    style={[styles.profileModalClose, { color: theme.accent }]}
                  >
                    Close
                  </Text>
                </Pressable>
              </View>

              <View style={styles.profileTopRow}>
                <View
                  style={[
                    styles.profileAvatar,
                    { backgroundColor: theme.cardDark || colors.cardDark },
                  ]}
                >
                  {profileUser.avatarUrl ? (
                    <Image
                      source={{ uri: profileUser.avatarUrl }}
                      style={styles.profileAvatarImage}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.profileAvatarInitial,
                        { color: theme.textMain },
                      ]}
                    >
                      {profileUser.name?.charAt(0).toUpperCase() || "M"}
                    </Text>
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.profileName, { color: theme.textMain }]}>
                    {profileUser.name}
                  </Text>
                  {profileUser.town ? (
                    <Text
                      style={[styles.profileTown, { color: theme.textMuted }]}
                    >
                      {profileUser.town}
                    </Text>
                  ) : null}
                  <Text
                    style={[styles.profileRole, { color: theme.textMuted }]}
                  >
                    {profileUser.role === "business"
                      ? "Business host"
                      : "Local member"}
                  </Text>
                </View>
              </View>

              {profileUser.bio ? (
                <View style={styles.profileSection}>
                  <Text
                    style={[
                      styles.profileSectionLabel,
                      { color: theme.textMuted },
                    ]}
                  >
                    About
                  </Text>
                  <Text
                    style={[
                      styles.profileSectionText,
                      { color: theme.textMain },
                    ]}
                  >
                    {profileUser.bio}
                  </Text>
                </View>
              ) : null}

              {profileUser.lookingFor ? (
                <View style={styles.profileSection}>
                  <Text
                    style={[
                      styles.profileSectionLabel,
                      { color: theme.textMuted },
                    ]}
                  >
                    {profileUser.role === "business"
                      ? "Business type"
                      : "Looking for"}
                  </Text>
                  <Text
                    style={[
                      styles.profileSectionText,
                      { color: theme.textMain },
                    ]}
                  >
                    {profileUser.lookingFor}
                  </Text>
                </View>
              ) : null}

              {profileUser.instagram ? (
                <View style={styles.profileSection}>
                  <Text
                    style={[
                      styles.profileSectionLabel,
                      { color: theme.textMuted },
                    ]}
                  >
                    Instagram
                  </Text>
                  <Text
                    style={[styles.profileLinkText, { color: theme.accent }]}
                  >
                    {profileUser.instagram}
                  </Text>
                </View>
              ) : null}

              {profileUser.role === "business" && profileUser.website ? (
                <View style={styles.profileSection}>
                  <Text
                    style={[
                      styles.profileSectionLabel,
                      { color: theme.textMuted },
                    ]}
                  >
                    Website
                  </Text>
                  <Text
                    style={[styles.profileLinkText, { color: theme.accent }]}
                  >
                    {profileUser.website}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

// ---- Styles (screen-level only) ----
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

  typeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
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

  summaryText: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 8,
  },

  sectionsContainer: {
    paddingBottom: 32,
    gap: 16,
  },

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

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },

  loadingText: {
    color: colors.textLight,
    fontSize: 13,
  },

  profileModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  profileModalCard: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  profileModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  profileModalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textLight,
  },

  profileModalClose: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: "600",
  },

  profileTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.cardDark,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  profileAvatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },

  profileAvatarInitial: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textLight,
  },

  profileName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textLight,
  },

  profileTown: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },

  profileRole: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },

  profileSection: {
    marginTop: 10,
  },

  profileSectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: 2,
  },

  profileSectionText: {
    fontSize: 13,
    color: colors.textLight,
  },

  profileLinkText: {
    fontSize: 13,
    color: colors.accent,
  },
});
