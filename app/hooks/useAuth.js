"use client";

import { useEffect, useState } from "react";
import { getMe } from "../lib/api";

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getMe()
            .then(setUser)
            .catch((err) => {
                setError(err.message);
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    const isAdmin = user?.role === "admin";
    const isManager = user?.role === "manager";
    const isUser = user?.role === "user";

    return {
        user,
        loading,
        error,
        isAdmin,
        isManager,
        isUser,
    };
}
