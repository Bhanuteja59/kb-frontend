"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../lib/api";
import { clearToken } from "../lib/utils/token";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
    user: null,
    loading: true,
    error: null,
    refresh: () => { },
    logout: () => { },
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    function fetchUser() {
        setLoading(true);
        return getMe()
            .then(u => {
                setUser(u);
                setError(null);
                return u;
            })
            .catch(err => {
                // If it's a 401/403, just user is null, not necessarily an "error" to show
                console.warn("Auth check failed:", err.message);
                setUser(null);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }

    const logout = () => {
        clearToken();
        if (typeof window !== "undefined") {
            sessionStorage.removeItem("dashboard_reloaded");
        }
        setUser(null);
        router.push("/login");
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error, refresh: fetchUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}
