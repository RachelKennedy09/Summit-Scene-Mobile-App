import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
  Modal,
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

  // posts from API
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [replyForPostId, setReplyForPostId] = useState(null); // which post is being replied to
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const [profileUser, setProfileUser] = useState(null);

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
      console.error("Error fetching community posts:", error);
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

  async function handleReplySubmit(postId) {
    if (!replyText.trim()) {
      Alert.alert("Reply required", "Please write something before sending.");
      return;
    }

    try {
      setSubmittingReply(true);

      const res = await fetch(
        `${API_BASE_URL}/api/community/${postId}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ body: replyText }),
        }
      );

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || "Failed to send reply.");
      }

      // Clear local reply state and refresh posts
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

  // Helper: derive author identity info from post.user + post.name
  function getPostAuthor(post) {
    const userObj =
      typeof post.user === "object" && post.user !== null ? post.user : null;

    const name = userObj?.name || post.name || "SummitScene member";
    const email = userObj?.email || "";
    const role = userObj?.role || "local"; // e.g. "local" or "business"
    const avatarUrl = userObj?.avatarUrl || null;
    const town = userObj?.town || post.town || "";
    const lookingFor = userObj?.lookingFor || "";
    const instagram = userObj?.instagram || "";
    const bio = userObj?.bio || "";
    const website = userObj?.website || "";

    return {
      name,
      email,
      role,
      avatarUrl,
      town,
      lookingFor,
      instagram,
      bio,
      website,
    };
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

      {/* Result summary */}
      <Text style={styles.summaryText}>
        {loading
          ? "Loading posts..."
          : filteredPosts.length === 0
          ? "No posts here yet. Be the first to share something."
          : `Showing ${filteredPosts.length} post${
              filteredPosts.length > 1 ? "s" : ""
            } in this board.`}
      </Text>

      {/*  Posts list for the selected board  */}
      <ScrollView
        contentContainerStyle={styles.sectionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.textLight} />
            <Text style={styles.loadingText}>Loading posts...</Text>
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
            const {
              name,
              email,
              role,
              avatarUrl,
              town,
              lookingFor,
              instagram,
              bio,
              website,
            } = getPostAuthor(post);

            const createdDate = new Date(post.createdAt);
            const postId = post._id ?? post.id;
            const isReplyOpen = replyForPostId === postId;
            return (
              <View key={postId} style={styles.sectionCard}>
                {/* Identity row */}
                <View style={styles.cardHeaderRow}>
                  {/* Left: avatar + name + timestamps */}
                  <View style={styles.authorRow}>
                    <View style={styles.avatarCircle}>
                      {avatarUrl ? (
                        <Image
                          source={{ uri: avatarUrl }}
                          style={styles.avatarImage}
                        />
                      ) : (
                        <Text style={styles.avatarInitial}>
                          {name.charAt(0).toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <View style={styles.authorTextCol}>
                      <Text style={styles.authorNameText}>{name}</Text>
                      <Text style={styles.timestampText}>
                        {createdDate.toLocaleDateString()} •{" "}
                        {createdDate.toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </Text>
                      {email ? (
                        <Text style={styles.authorEmailText}>{email}</Text>
                      ) : null}
                    </View>
                  </View>

                  {/* Right: town + role + date badge + owner badge */}
                  <View style={styles.badgeColumn}>
                    <Text style={styles.townTag}>
                      {town || "Rockies local"}
                    </Text>

                    <Text style={styles.roleBadge}>
                      {role === "business" ? "Business host" : "Local member"}
                    </Text>

                    <Text style={styles.dateBadge}>
                      For: {new Date(post.targetDate).toLocaleDateString()}
                    </Text>

                    {isOwner && <Text style={styles.ownerBadge}>You</Text>}
                  </View>
                </View>

                {/* Title + body */}
                <Text style={styles.sectionTitle}>{post.title}</Text>
                <Text style={styles.sectionText}>{post.body}</Text>

                {/* Owner-only delete/edit buttons */}
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
                      onPress={() => handleDeletePost(postId)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </Pressable>
                  </View>
                )}

                {/* View profile button */}
                <View style={styles.profileRow}>
                  <Pressable
                    style={styles.profileButton}
                    onPress={() =>
                      setProfileUser({
                        name,
                        role,
                        town,
                        avatarUrl,
                        lookingFor,
                        instagram,
                        bio,
                        website,
                      })
                    }
                  >
                    <Text style={styles.profileButtonText}>View profile</Text>
                  </Pressable>
                </View>

                {/* Divider before replies */}
                <View style={styles.replyDivider} />

                {/* Replies list */}
                {Array.isArray(post.replies) && post.replies.length > 0 && (
                  <View style={styles.repliesContainer}>
                    {post.replies.map((reply) => {
                      const replyCreated = new Date(reply.createdAt);
                      const replyKey =
                        reply._id ?? replyCreated.getTime().toString();

                      return (
                        <View key={replyKey} style={styles.replyRow}>
                          <View style={styles.replyAvatar}>
                            <Text style={styles.replyAvatarInitial}>
                              {(reply.name || "M").charAt(0).toUpperCase()}
                            </Text>
                          </View>
                          <View style={styles.replyContent}>
                            <Text style={styles.replyMeta}>
                              <Text style={styles.replyAuthor}>
                                {reply.name || "Member"}
                              </Text>{" "}
                              •{" "}
                              {replyCreated.toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </Text>
                            <Text style={styles.replyBodyText}>
                              {reply.body}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}

                {/* Reply toggle + input */}
                <View style={styles.replyActionsRow}>
                  <Pressable
                    style={styles.replyButton}
                    onPress={() => {
                      if (isReplyOpen) {
                        setReplyForPostId(null);
                        setReplyText("");
                      } else {
                        setReplyForPostId(postId);
                        setReplyText("");
                      }
                    }}
                  >
                    <Text style={styles.replyButtonText}>
                      {isReplyOpen ? "Cancel" : "Reply"}
                    </Text>
                  </Pressable>
                </View>

                {isReplyOpen && (
                  <View style={styles.replyInputContainer}>
                    <TextInput
                      style={styles.replyInput}
                      value={replyText}
                      onChangeText={setReplyText}
                      placeholder="Write a reply..."
                      placeholderTextColor={colors.textMuted}
                      multiline
                    />
                    <Pressable
                      style={[
                        styles.sendReplyButton,
                        (!replyText.trim() || submittingReply) &&
                          styles.sendReplyButtonDisabled,
                      ]}
                      onPress={() => handleReplySubmit(postId)}
                      disabled={!replyText.trim() || submittingReply}
                    >
                      <Text style={styles.sendReplyButtonText}>
                        {submittingReply ? "Sending..." : "Send"}
                      </Text>
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

      {profileUser && (
        <Modal
          visible={true}
          animationType="slide"
          transparent
          onRequestClose={() => setProfileUser(null)}
        >
          <View style={styles.profileModalOverlay}>
            <View style={styles.profileModalCard}>
              {/* Close button */}
              <View style={styles.profileModalHeader}>
                <Text style={styles.profileModalTitle}>Member Profile</Text>
                <Pressable onPress={() => setProfileUser(null)}>
                  <Text style={styles.profileModalClose}>Close</Text>
                </Pressable>
              </View>

              {/* Avatar + name + town */}
              <View style={styles.profileTopRow}>
                <View style={styles.profileAvatar}>
                  {profileUser.avatarUrl ? (
                    <Image
                      source={{ uri: profileUser.avatarUrl }}
                      style={styles.profileAvatarImage}
                    />
                  ) : (
                    <Text style={styles.profileAvatarInitial}>
                      {profileUser.name?.charAt(0).toUpperCase() || "M"}
                    </Text>
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.profileName}>{profileUser.name}</Text>
                  {profileUser.town ? (
                    <Text style={styles.profileTown}>{profileUser.town}</Text>
                  ) : null}
                  <Text style={styles.profileRole}>
                    {profileUser.role === "business"
                      ? "Business host"
                      : "Local member"}
                  </Text>
                </View>
              </View>

              {/* Bio (locals only for now) */}
              {profileUser.bio ? (
                <View style={styles.profileSection}>
                  <Text style={styles.profileSectionLabel}>About</Text>
                  <Text style={styles.profileSectionText}>
                    {profileUser.bio}
                  </Text>
                </View>
              ) : null}

              {/* Looking for / Business type */}
              {profileUser.lookingFor ? (
                <View style={styles.profileSection}>
                  <Text style={styles.profileSectionLabel}>
                    {profileUser.role === "business"
                      ? "Business type"
                      : "Looking for"}
                  </Text>
                  <Text style={styles.profileSectionText}>
                    {profileUser.lookingFor}
                  </Text>
                </View>
              ) : null}

              {/* Instagram */}
              {profileUser.instagram ? (
                <View style={styles.profileSection}>
                  <Text style={styles.profileSectionLabel}>Instagram</Text>
                  <Text style={styles.profileLinkText}>
                    {profileUser.instagram}
                  </Text>
                </View>
              ) : null}

              {/* Website (business only) */}
              {profileUser.role === "business" && profileUser.website ? (
                <View style={styles.profileSection}>
                  <Text style={styles.profileSectionLabel}>Website</Text>
                  <Text style={styles.profileLinkText}>
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
    marginBottom: 10,
  },

  /* identity block */
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },

  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.cardDark,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  avatarImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },

  avatarInitial: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textLight,
  },

  authorTextCol: {
    flexShrink: 1,
  },

  authorNameText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textLight,
  },

  authorEmailText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },

  timestampText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },

  badgeColumn: {
    alignItems: "flex-end",
    gap: 4,
  },

  townTag: {
    fontSize: 12,
    color: colors.textMuted,
  },

  roleBadge: {
    fontSize: 11,
    color: colors.textLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: colors.cardDark,
  },

  dateBadge: {
    fontSize: 11,
    color: colors.textMuted,
  },

  ownerBadge: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textLight,
    marginBottom: 4,
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

  /* ---- OWNER BUTTONS ---- */
  ownerActionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 12,
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

  /* ---- PROFILE BUTTON ROW ---- */
  profileRow: {
    marginTop: 8,
    marginBottom: 4,
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  profileButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent,
  },

  profileButtonText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: "600",
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

  /* ---- LOADING ROW ---- */
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

  /* ---- REPLIES ---- */
  replyDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 12,
    marginBottom: 8,
  },

  repliesContainer: {
    gap: 8,
    marginBottom: 8,
  },

  replyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  replyAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.cardDark,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  replyAvatarInitial: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textLight,
  },

  replyContent: {
    flex: 1,
  },

  replyMeta: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 2,
  },

  replyAuthor: {
    fontWeight: "600",
    color: colors.textLight,
  },

  replyBodyText: {
    fontSize: 13,
    color: colors.textMuted,
  },

  replyActionsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 4,
  },

  replyButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  replyButtonText: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: "600",
  },

  replyInputContainer: {
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.primary,
    padding: 8,
    gap: 6,
  },

  replyInput: {
    minHeight: 40,
    maxHeight: 120,
    color: colors.textLight,
    fontSize: 13,
  },

  sendReplyButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },

  sendReplyButtonDisabled: {
    opacity: 0.6,
  },

  sendReplyButtonText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: "600",
  },
});
