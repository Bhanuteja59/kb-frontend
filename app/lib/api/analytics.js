import { apiFetch } from "./client";

export async function getDashboardStats() {
    const res = await apiFetch("/analytics/dashboard", {
        method: "GET",
    });
    return res.json();
}
