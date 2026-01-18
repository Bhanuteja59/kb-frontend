import { apiFetch } from "./client";

export async function completeOnboarding(data) {
    const res = await apiFetch("/auth/google/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}


export async function getMe() {
    const res = await apiFetch("/auth/me", {
        method: "GET",
    });

    return res.json();
}

export async function updateProfile(data) {
    const res = await apiFetch("/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function updateOrganization(data) {
    const res = await apiFetch("/users/organizations/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function deleteAccount() {
    const res = await apiFetch("/users/me", {
        method: "DELETE",
    });
    return res.json();
}
