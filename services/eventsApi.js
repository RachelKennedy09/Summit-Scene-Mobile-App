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
      header: {
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
