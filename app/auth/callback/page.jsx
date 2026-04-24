"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { setToken } from "../../lib/utils/token";
import { useAuth } from "../../hooks/useAuth";

function CallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { refresh } = useAuth();

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            console.error("No token found in callback URL");
            router.replace("/login?error=auth_failed");
            return;
        }

        // 1. Persist the token
        setToken(token);

        // 2. Refresh the auth context so the user object is populated
        //    Then redirect to home regardless of whether refresh succeeded.
        refresh()
            .catch(() => {})
            .finally(() => {
                router.replace("/");
            });
    }, [searchParams, router, refresh]);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                color: "#fff",
            }}
        >
            <div
                style={{
                    width: 48,
                    height: 48,
                    border: "3px solid rgba(255,255,255,0.2)",
                    borderTopColor: "#4f46e5",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                }}
            />
            <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>
                Signing you in...
            </h2>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "0.875rem" }}>
                Please wait while we set up your session.
            </p>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default function CallbackPage() {
    return (
        <Suspense fallback={null}>
            <CallbackContent />
        </Suspense>
    );
}
