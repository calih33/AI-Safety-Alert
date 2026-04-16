import { getApiBase } from "./api";

const API_BASE = getApiBase();

type CreateTicketInput = {
  title: string;
  content: string;
  location_id: number;
};

type UpdateTicketInput = {
  title?: string;
  content?: string;
  status?: "needs-attention" | "in-progress" | "resolved";
};

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchTickets() {
  const response = await fetch(`${API_BASE}/tickets`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Unauthorized or failed to fetch tickets.");
  }

  return response.json();
}

export async function createTicket(payload: CreateTicketInput) {
  const requestBody = {
    title: payload.title,
    content: payload.content,
    location: payload.location_id === 1 ? "SW1 100" :
      payload.location_id === 2 ? "SW2 200" : "NE1 200"
  };

  const response = await fetch(`${API_BASE}/tickets`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to create ticket");
  return data;
}

export async function updateTicket(
  ticketId: number,
  payload: UpdateTicketInput
) {
  const response = await fetch(`${API_BASE}/tickets/${ticketId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to update ticket");
  return data;
}

export async function deleteTicket(ticketId: number) {
  const response = await fetch(`${API_BASE}/tickets/${ticketId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to delete ticket");
  return data;
}