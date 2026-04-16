
const API_BASE = "http://127.0.0.1:8000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchTickets() {
  const token = localStorage.getItem("token");

  const response = await fetch("http://127.0.0.1:8000/api/tickets", {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unauthorized or failed to fetch tickets.");
  }

  return response.json();
}

export async function createTicket(payload: any) {
  const dbPayload = {
    title: payload.title,
    content: payload.content,
    location: payload.location_id === 1 ? "SW1 100" :
      payload.location_id === 2 ? "SW2 200" : "NE1 200"
  };

  const response = await fetch(`${API_BASE}/tickets`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(dbPayload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to create ticket");
  return data;
}