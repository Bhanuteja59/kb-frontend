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
        if (token) {
            setToken(token);
            // Refresh auth state before redirecting to ensure UI updates
            refresh()
                .catch(() => { }) // Ignore errors, allow redirect to try anyway
                .finally(() => {
                    router.push("/");
                });
        } else {
            // Handle error or missing token
            console.error("No token found in callback URL");
            router.push("/login?error=auth_failed");
        }
    }, [searchParams, router, refresh]);

    return (
        <div style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "1rem"
        }}>
            <h2>Authenticating...</h2>
            <p className="muted">Please wait while we log you in.</p>
        </div>
    );
}

export default function CallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent />
        </Suspense>
    );
}
