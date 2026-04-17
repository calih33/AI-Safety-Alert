import { getApiBase } from "./api";

const API_BASE = getApiBase();

function getAuthHeaders() {
    const token = localStorage.getItem("token");

    return {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
    };
}

export async function fetchNotifications() {
    const response = await fetch(`${API_BASE}/notifications`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch notifications");
    return response.json();
}

export async function markAllNotificationsRead() {
    const response = await fetch(`${API_BASE}/notifications/read-all`, {
        method: "PATCH",
        headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to mark notifications as read");
    return response.json();
}