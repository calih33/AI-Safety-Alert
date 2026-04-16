export async function fetchNotifications() {
    const token = localStorage.getItem("token");
    const response = await fetch("http://127.0.0.1:8000/api/notifications", {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
        },
    });
    if (!response.ok) throw new Error("Failed to fetch notifications");
    return response.json();
}