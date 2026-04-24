"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { completeOnboarding } from "../lib/api";
import { setToken } from "../lib/utils/token";

import "./onboarding.css";

function OnboardingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [token, setTempToken] = useState("");
    const [name, setName] = useState("");
    const [orgName, setOrgName] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    useEffect(() => {
        const t = searchParams.get("token");
        const n = searchParams.get("name");
        if (!t) {
            router.replace("/login");
            return;
        }
        setTempToken(t);
        if (n) setName(decodeURIComponent(n.replace(/\+/g, " ")));
    }, [searchParams, router]);

    async function onSubmit(e) {
        e.preventDefault();
        if (!orgName.trim()) {
            setErr("Organization name is required.");
            return;
        }
        setErr(null);
        setLoading(true);
        try {
            const data = await completeOnboarding({
                token,
                organization_name: orgName.trim(),
            });
            setToken(data.access_token);
            window.location.href = "/";
        } catch (e) {
            setErr(e.message || "Setup failed. Please try signing in again.");
        } finally {
            setLoading(false);
        }
    }

    if (!token) return null;

    return (
        <div className="onboarding-page min-vh-100 d-flex flex-column align-items-center justify-content-center p-3">
            <div className="fade-in" style={{ width: "100%", maxWidth: 480 }}>
                {/* Logo */}
                <div className="text-center mb-4 d-flex flex-column align-items-center">
                    <div className="onboarding-logo-wrapper">
                        <i className="bi bi-database-fill"></i>
                    </div>
                    <h1 className="h3 fw-bold text-dark mb-1">
                        {name ? `Welcome, ${name}!` : "Almost there!"}
                    </h1>
                    <p className="text-muted fw-medium">Set up your workspace to get started.</p>
                </div>

                {/* Card */}
                <div className="onboarding-card">
                    <form onSubmit={onSubmit}>
                        <div className="mb-4">
                            <label className="form-label fw-bold text-dark small mb-2">Organization Name *</label>
                            <input
                                type="text"
                                className="form-control onboarding-input"
                                placeholder="e.g. Acme Corp"
                                value={orgName}
                                onChange={e => setOrgName(e.target.value)}
                                required
                            />
                            <div className="form-text text-muted small mt-2 fw-medium">
                                <i className="bi bi-info-circle me-1"></i> This will be your organization&apos;s workspace name.
                            </div>
                        </div>

                        {err && (
                            <div className="alert alert-danger border-0 rounded-4 p-3 mb-4 fw-bold small">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {err}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !orgName.trim()}
                            className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-lg"
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Setting up your workspace...
                                </>
                            ) : (
                                <>
                                    Complete Setup <i className="bi bi-arrow-right ms-2"></i>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-5">
                    <p className="text-muted small fw-medium">
                        Need help? <a href="/contact" className="text-primary fw-bold text-decoration-none">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={null}>
            <OnboardingContent />
        </Suspense>
    );
}
