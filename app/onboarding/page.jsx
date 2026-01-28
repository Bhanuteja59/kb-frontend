"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { completeOnboarding } from "../lib/api";
import { setToken } from "../lib/utils/token";
import Topbar from "../components/layout/Topbar";

function OnboardingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [token, setTempToken] = useState("");
    const [name, setName] = useState("");
    const [orgName, setOrgName] = useState("");
    const [role, setRole] = useState("user");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    useEffect(() => {
        const t = searchParams.get("token");
        const n = searchParams.get("name");
        if (!t) {
            router.push("/login");
            return;
        }
        setTempToken(t);
        if (n) setName(n);
    }, [searchParams, router]);

    async function onSubmit(e) {
        e.preventDefault();
        setErr(null);
        setLoading(true);

        try {
            const data = await completeOnboarding({
                token,
                organization_name: orgName,
                role
            });
            setToken(data.access_token);
            location.href = "/";
        } catch (e) {
            setErr(e.message || "Onboarding failed");
        } finally {
            setLoading(false);
        }
    }

    if (!token) return null;

    return (
        <>
            <Topbar />
            <div className="container d-flex align-items-center justify-content-center min-vh-80 py-5">
                <div className="card shadow-sm border-0 w-100" style={{ maxWidth: 520 }}>
                    <div className="card-body p-4 p-md-5">
                        <div className="text-center mb-4">
                            <h1 className="h2 mb-2">Welcome, {name}!</h1>
                            <p className="text-muted">Please finish setting up your account.</p>
                        </div>

                        <form onSubmit={onSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Organization Name</label>
                                <input
                                    className="form-control"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    placeholder="e.g. My Company"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Role</label>
                                <select
                                    className="form-select"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="user">User</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {err && (
                                <div className="alert alert-danger mb-3" role="alert">
                                    {err}
                                </div>
                            )}

                            <button
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Setting up...
                                    </>
                                ) : "Complete Setup"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OnboardingContent />
        </Suspense>
    );
}
