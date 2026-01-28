"use client";
import { useEffect } from "react";
import { API_BASE } from "../../lib/constants";

export default function WakeUpBackend() {
    useEffect(() => {
        // Fire and forget - just to wake up the Render instance
        fetch(`${API_BASE}/health`, { method: "GET", mode: "no-cors" })
            .catch(() => {
                // Ignore errors, user doesn't need to know
            });
    }, []);

    return null; // Renders nothing
}
