const FALLBACK_API_BASE = "http://127.0.0.1:8000/api";

export function getApiBase() {
    return import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || FALLBACK_API_BASE;
}