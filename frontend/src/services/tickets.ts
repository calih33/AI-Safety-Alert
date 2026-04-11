import type { Ticket } from "../types/tickets";

const API_BASE = "http://127.0.0.1:8000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchTickets(): Promise<Ticket[]> {
  const response = await fetch(`${API_BASE}/tickets`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch tickets");
  }

  return data;
}

export async function createTicket(payload: {
  title: string;
  content: string;
  location: string;
}) {
  const response = await fetch(`${API_BASE}/tickets`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create ticket");
  }

  return data;
}