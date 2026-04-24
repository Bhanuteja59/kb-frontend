import { API_BASE, TOKEN_KEY } from "../constants";
import { getToken, clearToken } from "../utils/token";

export async function apiFetch(path, init = {}) {
    const token = getToken();
    const headers = { ...(init.headers || {}) };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

    if (res.status === 401) {
        // Token expired or invalid — clear it and redirect to login
        clearToken();
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
            window.location.href = "/login?session=expired";
        }
        throw new Error("Session expired. Please log in again.");
    }

    if (!res.ok) {
        let msg;
        try {
            // Try to parse structured JSON error
            const data = await res.json();
            msg = data?.detail?.message || data?.detail || data?.error || `Request failed: ${res.status}`;
        } catch {
            msg = await res.text().catch(() => `Request failed: ${res.status}`);
        }
        throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
    }

    return res;
}
