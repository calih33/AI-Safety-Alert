const FALLBACK_API_BASE = "https://ai-safety-app-dxdbcyd7abg6d8cx.westus3-01.azurewebsites.net/api";
export function getApiBase() {
    return import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || FALLBACK_API_BASE;
}