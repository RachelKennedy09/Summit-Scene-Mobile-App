// services/communityApi.js
// Small helper for talking to the SummitScene community backend

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://172.28.248.13:4000";

/* --------------------------------------------------
   FETCH COMMUNITY POSTS
   GET /api/community?type=...
-------------------------------------------------- */
export async function fetchCommunityPosts(type, token) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/community?type=${type}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const message = body.message || `Failed to load posts (${res.status})`;
      throw new Error(message);
    }

    return await res.json(); // array of posts
  } catch (error) {
    console.error("fetchCommunityPosts error:", error);
    throw error;
  }
}

/* --------------------------------------------------
   DELETE COMMUNITY POST
   DELETE /api/community/:postId
-------------------------------------------------- */
export async function deleteCommunityPost(postId, token) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/community/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const message = body.message || `Failed to delete post (${res.status})`;
      throw new Error(message);
    }

    return true;
  } catch (error) {
    console.error("deleteCommunityPost error:", error);
    throw error;
  }
}

/* --------------------------------------------------
   CREATE REPLY
   POST /api/community/:postId/replies
-------------------------------------------------- */
export async function createCommunityReply(postId, replyText, token) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/community/${postId}/replies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ body: replyText }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const message = body.message || `Failed to send reply (${res.status})`;
      throw new Error(message);
    }

    return await res.json(); // the created reply or updated post
  } catch (error) {
    console.error("createCommunityReply error:", error);
    throw error;
  }
}

/* --------------------------------------------------
   TOGGLE LIKE
   POST /api/community/:postId/likes
-------------------------------------------------- */
export async function toggleCommunityLike(postId, token) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/community/${postId}/likes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message = data.message || `Failed to update like (${res.status})`;
      throw new Error(message);
    }

    return data; // updated post / likes info
  } catch (error) {
    console.error("toggleCommunityLike error:", error);
    throw error;
  }
}
