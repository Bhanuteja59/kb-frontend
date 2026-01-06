import { API_BASE } from "../constants";
import { getToken } from "../utils/token";

export async function apiFetch(path, init = {}) {
    const token = getToken();
    const headers = { ...(init.headers || {}) };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Request failed: ${res.status}`);
    }

    return res;
}
