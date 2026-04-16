import { getApiBase } from "./api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchProfile() {
  const response = await fetch(`${getApiBase()}/profile`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to load profile");
  return data.user;
}

export async function updateProfile(payload: { first_name: string; last_name: string; email: string }) {
  const response = await fetch(`${getApiBase()}/profile`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to update profile");
  return data.user;
}
