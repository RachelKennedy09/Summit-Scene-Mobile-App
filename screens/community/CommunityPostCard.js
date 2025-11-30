// screens/community/CommunityPostCard.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
} from "react-native";

import { colors } from "../../theme/colors";

// Helper to derive author identity info from post.user + post.name
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

export default function CommunityPostCard({
  post,
  user,
  theme,
  isReplyOpen,
  replyText,
  submittingReply,
  onToggleReply,
  onChangeReplyText,
  onSubmitReply,
  onDelete,
  onEdit,
  onToggleLike,
  onOpenProfile,
}) {
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

  const createdDate = post.createdAt ? new Date(post.createdAt) : null;

  // likes
  const likesArray = Array.isArray(post.likes) ? post.likes : [];
  const likesCount = likesArray.length;

  const userId = user?._id || user?.id;

  const isLikedByMe =
    !!userId &&
    likesArray.some((like) => {
      if (typeof like === "string") return like === userId;
      if (like && typeof like === "object" && like._id) {
        return like._id === userId;
      }
      return false;
    });

  // is this post owned by the logged-in user?
  const isOwner = (() => {
    if (!userId) return false;

    const postUserId =
      typeof post.user === "string" ? post.user : post.user?._id;

    if (!postUserId) return false;
    return postUserId === userId;
  })();

  return (
    <View
      style={[
        styles.sectionCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      {/* Identity row */}
      <View className="card-header" style={styles.cardHeaderRow}>
        <View style={styles.authorRow}>
          <View
            style={[
              styles.avatarCircle,
              { backgroundColor: theme.cardDark || colors.cardDark },
            ]}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <Text style={[styles.avatarInitial, { color: theme.textMain }]}>
                {name.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
          <View style={styles.authorTextCol}>
            <Text style={[styles.authorNameText, { color: theme.textMain }]}>
              {name}
            </Text>
            {createdDate && (
              <Text style={[styles.timestampText, { color: theme.textMuted }]}>
                {createdDate.toLocaleDateString()} •{" "}
                {createdDate.toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </Text>
            )}
            {email ? (
              <Text
                style={[styles.authorEmailText, { color: theme.textMuted }]}
              >
                {email}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.badgeColumn}>
          <Text style={[styles.townTag, { color: theme.textMuted }]}>
            {town || "Rockies local"}
          </Text>

          <Text
            style={[
              styles.roleBadge,
              {
                backgroundColor: theme.cardDark || colors.cardDark,
                color: theme.textMain,
              },
            ]}
          >
            {role === "business" ? "Business host" : "Local member"}
          </Text>

          {post.targetDate ? (
            <Text style={[styles.dateBadge, { color: theme.textMuted }]}>
              For: {new Date(post.targetDate).toLocaleDateString()}
            </Text>
          ) : null}

          {isOwner && (
            <Text style={[styles.ownerBadge, { color: theme.accent }]}>
              You
            </Text>
          )}
        </View>
      </View>

      {/* Title + body */}
      <Text style={[styles.sectionTitle, { color: theme.textMain }]}>
        {post.title}
      </Text>
      <Text style={[styles.sectionText, { color: theme.textMuted }]}>
        {post.body}
      </Text>

      {/* Likes */}
      <View style={styles.likesRow}>
        <Pressable
          style={[
            styles.likeButton,
            { borderColor: theme.border },
            isLikedByMe && {
              borderColor: theme.accent,
              backgroundColor: theme.accentSoft || colors.tealTint,
            },
          ]}
          onPress={onToggleLike}
        >
          <Text style={[styles.likeButtonText, { color: theme.textMain }]}>
            {isLikedByMe ? "♥ Liked" : "♡ Like"}
          </Text>
        </Pressable>

        <Text style={[styles.likesCountText, { color: theme.textMuted }]}>
          {likesCount === 0
            ? "No likes yet"
            : likesCount === 1
            ? "1 like"
            : `${likesCount} likes`}
        </Text>
      </View>

      {/* Owner-only buttons */}
      {isOwner && (
        <View style={styles.ownerActionsRow}>
          <Pressable
            style={[styles.editButton, { backgroundColor: theme.accent }]}
            onPress={onEdit}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
        </View>
      )}

      {/* View profile */}
      <View style={styles.profileRow}>
        <Pressable
          style={[styles.profileButton, { borderColor: theme.accent }]}
          onPress={() =>
            onOpenProfile &&
            onOpenProfile({
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
          <Text style={[styles.profileButtonText, { color: theme.accent }]}>
            View profile
          </Text>
        </Pressable>
      </View>

      {/* Divider before replies */}
      <View style={[styles.replyDivider, { backgroundColor: theme.border }]} />

      {/* Replies */}
      {Array.isArray(post.replies) && post.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {post.replies.map((reply) => {
            const replyCreated = reply.createdAt
              ? new Date(reply.createdAt)
              : new Date();
            const replyKey = reply._id ?? replyCreated.getTime().toString();

            const replyUserObj =
              typeof reply.user === "object" && reply.user !== null
                ? reply.user
                : null;

            const replyName = replyUserObj?.name || reply.name || "Member";
            const replyAvatarUrl = replyUserObj?.avatarUrl || null;
            const replyTown = replyUserObj?.town || "";
            const replyRole = replyUserObj?.role || "local";

            return (
              <Pressable
                key={replyKey}
                style={styles.replyRow}
                onPress={() => {
                  if (replyUserObj && onOpenProfile) {
                    onOpenProfile({
                      name: replyName,
                      role: replyRole,
                      town: replyTown,
                      avatarUrl: replyAvatarUrl,
                      lookingFor: replyUserObj.lookingFor || "",
                      instagram: replyUserObj.instagram || "",
                      bio: replyUserObj.bio || "",
                      website: replyUserObj.website || "",
                    });
                  }
                }}
              >
                <View
                  style={[
                    styles.replyAvatar,
                    {
                      backgroundColor: theme.cardDark || colors.cardDark,
                    },
                  ]}
                >
                  {replyAvatarUrl ? (
                    <Image
                      source={{ uri: replyAvatarUrl }}
                      style={styles.replyAvatarImage}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.replyAvatarInitial,
                        { color: theme.textMain },
                      ]}
                    >
                      {replyName.charAt(0).toUpperCase()}
                    </Text>
                  )}
                </View>
                <View style={styles.replyContent}>
                  <Text style={[styles.replyMeta, { color: theme.textMuted }]}>
                    <Text
                      style={[styles.replyAuthor, { color: theme.textMain }]}
                    >
                      {replyName}
                    </Text>{" "}
                    •{" "}
                    {replyCreated.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </Text>
                  {replyTown ? (
                    <Text
                      style={[styles.replyTownMeta, { color: theme.textMuted }]}
                    >
                      {replyTown}
                    </Text>
                  ) : null}
                  <Text
                    style={[styles.replyBodyText, { color: theme.textMuted }]}
                  >
                    {reply.body}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Reply toggle + input */}
      <View style={styles.replyActionsRow}>
        <Pressable style={styles.replyButton} onPress={onToggleReply}>
          <Text style={[styles.replyButtonText, { color: theme.accent }]}>
            {isReplyOpen ? "Cancel" : "Reply"}
          </Text>
        </Pressable>
      </View>

      {isReplyOpen && (
        <View
          style={[
            styles.replyInputContainer,
            {
              backgroundColor: theme.background,
              borderColor: theme.border,
            },
          ]}
        >
          <TextInput
            style={[styles.replyInput, { color: theme.textMain }]}
            value={replyText}
            onChangeText={onChangeReplyText}
            placeholder="Write a reply..."
            placeholderTextColor={theme.textMuted}
            multiline
          />
          <Pressable
            style={[
              styles.sendReplyButton,
              { backgroundColor: theme.accent },
              (!replyText.trim() || submittingReply) &&
                styles.sendReplyButtonDisabled,
            ]}
            onPress={onSubmitReply}
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
}

// Styles moved over from CommunityScreen (card + replies + likes)
const styles = StyleSheet.create({
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

  replyAvatarImage: {
    width: 26,
    height: 26,
    borderRadius: 13,
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

  replyTownMeta: {
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

  likesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },

  likeButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },

  likeButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textLight,
  },

  likesCountText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
