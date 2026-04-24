"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { API_BASE } from "../lib/constants";
import "./auth.css";

function LoginContent() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const errorParam = searchParams.get("error");
    const sessionExpired = searchParams.get("session") === "expired";

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace("/");
        }
    }, [loading, isAuthenticated, router]);

    if (loading || isAuthenticated) return null;

    const errorMessage =
        sessionExpired
            ? "Your session has expired. Please sign in again."
            : errorParam === "auth_failed"
            ? "Authentication failed. Please try again."
            : null;

    const handleGoogleLogin = () => {
        window.location.href = `${API_BASE}/auth/google/login`;
    };

    return (
        <div className="auth-page min-vh-100 d-flex align-items-center justify-content-center p-3">
            <div className="fade-in" style={{ width: "100%", maxWidth: 450 }}>
                {/* Logo */}
                <div className="text-center mb-4 d-flex flex-column align-items-center">
                    <div className="auth-logo-wrapper">
                        <i className="bi bi-database-fill"></i>
                    </div>
                    <Link href="/" className="text-decoration-none mb-2">
                        <h1 className="h3 fw-bold text-dark mb-1">Welcome back</h1>
                    </Link>
                    <p className="text-muted fw-medium">Sign in to your enterprise account</p>
                </div>

                {/* Login Card */}
                <div className="auth-card">
                    {errorMessage && (
                        <div className="alert alert-danger border-0 rounded-4 p-3 mb-4 fw-bold small">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            {errorMessage}
                        </div>
                    )}

                    <button onClick={handleGoogleLogin} className="google-btn w-100 mb-4 shadow-none">
                        <Image
                            src="https://www.google.com/favicon.ico"
                            alt="Google"
                            width={20}
                            height={20}
                        />
                        Continue with Google
                    </button>

                    <div className="d-flex align-items-center gap-3 mb-4">
                        <hr className="flex-grow-1" />
                        <span className="text-muted small fw-bold">SECURE ACCESS</span>
                        <hr className="flex-grow-1" />
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-muted small fw-medium mb-4">
                            By continuing, you agree to our <a href="#" className="text-primary fw-bold text-decoration-none">Terms</a> and <a href="#" className="text-primary fw-bold text-decoration-none">Privacy Policy</a>.
                        </p>
                        <div className="d-flex justify-content-center gap-3 flex-wrap">
                            {[
                                { icon: "bi-lock-fill", label: "Encrypted" },
                                { icon: "bi-shield-check", label: "GDPR Safe" },
                                { icon: "bi-lightning-fill", label: "Fast" },
                            ].map(({ icon, label }) => (
                                <span key={label} className="text-muted small fw-bold d-flex align-items-center gap-1">
                                    <i className={`bi ${icon} text-primary`}></i> {label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-center mt-5">
                    <p className="text-muted small fw-medium">
                        © 2026 Enterprise Knowledge AI. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginContent />
        </Suspense>
    );
}
