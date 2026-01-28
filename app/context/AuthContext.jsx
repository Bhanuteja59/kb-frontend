"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../lib/api";

const AuthContext = createContext({
    user: null,
    loading: true,
    error: null,
    refresh: () => { },
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                throw err;
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error, refresh: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}
