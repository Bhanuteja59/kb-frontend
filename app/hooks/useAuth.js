"use client";
import { useAuthContext } from "../context/AuthContext";

export function useAuth() {
    const { user, loading, refresh } = useAuthContext();
    return {
        user,
        loading,
        isAuthenticated: !!user,
        refresh,
    };
}
