"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { API_BASE } from "../lib/constants";
import { getToken } from "../lib/utils/token";

const AuthContext = createContext({
    user: null,
    loading: true,
    refresh: async () => {},
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        setLoading(true);
        try {
            const token = getToken();
            if (!token) {
                // No token at all — definitely not logged in, skip the network call
                setUser(null);
                return;
            }

            const res = await fetch(`${API_BASE}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                // 401/403 → token is invalid or expired
                setUser(null);
                if (res.status === 401) {
                    // Clear the stale token
                    localStorage.removeItem("kb_token");
                }
            }
        } catch {
            // Network error — treat as unauthenticated, leave token in place
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <AuthContext.Provider value={{ user, loading, refresh: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}
