import { apiFetch } from "./client";

export async function login(credentials) {
    const res = await apiFetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
        }),
    });

    return res.json();
}

export async function signup(data) {
    const res = await apiFetch("/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return res.json();
}

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
