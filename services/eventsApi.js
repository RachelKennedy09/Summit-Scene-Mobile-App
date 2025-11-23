// eventsApi.js
//small helper for talking to summitScene backend

const BASE_URL = "http://172.28.248.13:4000"; // BASE_URL is where node serve lives, on phone use local IP instead of host.

export async function fetchEvents() {
  //calling events on back end
  try {
    const response = await fetch(`${BASE_URL}/api/events`);

    if (!response.ok) {
      throw new Error(`Error fetching events: ${response.status}`);
    }

    const data = await response.json();
    return data; // array of events
  } catch (error) {
    console.error("fetchEvents error:", error.message);
    throw error;
  }
}

export async function createEvent(eventData) {
  try {
    const response = await fetch(`${BASE_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || "Error creating event");
    }
    return await response.json();
  } catch (error) {
    console.error("createEvent error:", error.message);
    throw error;
  }
}

export async function deleteEvent(eventId, token) {
  try {
    const res = await fetch(`${BASE_URL}/api/events/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || "Failed to delete event");
    }
    return true;
  } catch (error) {
    console.error("deleteEvent:", error.message);
    throw error;
  }
}

export async function updateEvent(eventId, eventData, token) {
  try {
    const res = await fetch(`${BASE_URL}/api/events/${eventId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || "Error updating event");
    }

    const updatedEvent = await res.json();
    return updatedEvent;
  } catch (error) {
    console.error("updatedEvent error:", error.message);
    throw error;
  }
}
