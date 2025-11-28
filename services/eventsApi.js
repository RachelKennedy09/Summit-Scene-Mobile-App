// eventsApi.js
// Small helper for talking to the SummitScene backend

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://172.28.248.13:4000";

/* --------------------------------------------------
   FETCH ALL EVENTS
-------------------------------------------------- */
export async function fetchEvents() {
  try {
    const response = await fetch(`${BASE_URL}/api/events`);

    if (!response.ok) {
      throw new Error(`Failed to fetch events (${response.status})`);
    }

    return await response.json(); // array
  } catch (error) {
    console.error("fetchEvents error:", error.message);
    throw error;
  }
}

/* --------------------------------------------------
   CREATE EVENT  (Business only)
-------------------------------------------------- */
export async function createEvent(eventData, token) {
  try {
    const response = await fetch(`${BASE_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Error creating event");
    }

    return data;
  } catch (error) {
    console.error("createEvent error:", error.message);
    throw error;
  }
}

/* --------------------------------------------------
   DELETE EVENT (Business only)
-------------------------------------------------- */
export async function deleteEvent(eventId, token) {
  try {
    const response = await fetch(`${BASE_URL}/api/events/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(text || "Failed to delete event");
    }

    return true;
  } catch (error) {
    console.error("deleteEvent error:", error.message);
    throw error;
  }
}

/* --------------------------------------------------
   UPDATE EVENT  (Business only)
-------------------------------------------------- */
export async function updateEvent(eventId, eventData, token) {
  try {
    const response = await fetch(`${BASE_URL}/api/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("updateEvent error response:", data);
      const message =
        data?.message || `Error updating event (status ${response.status})`;
      throw new Error(message);
    }

    return data;
  } catch (error) {
    console.error("updateEvent error:", error.message);
    throw error;
  }
}

/* --------------------------------------------------
   FETCH A SINGLE EVENT (useful later)
-------------------------------------------------- */
export async function fetchEventById(eventId) {
  try {
    const response = await fetch(`${BASE_URL}/api/events/${eventId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch event (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("fetchEventById error:", error.message);
    throw error;
  }
}
