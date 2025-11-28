// app/services/apiClient.js
import { Alert } from "react-native";

export async function apiFetch(url, { token, logout, ...options } = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401) {
    let message = "Session expired. Please log in again.";

    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      // ignore JSON parse errors
    }

    Alert.alert("Session expired", message);

    if (typeof logout === "function") {
      logout(); // 👈 log the user out from AuthContext
    }

    // Throw so callers know it failed
    throw new Error("Unauthorized");
  }

  return res;
}
