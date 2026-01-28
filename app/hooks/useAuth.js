"use client";
import { useAuthContext } from "../context/AuthContext";

export function useAuth() {
    const { user, loading, error, refresh } = useAuthContext();

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
        refresh
    };
}
