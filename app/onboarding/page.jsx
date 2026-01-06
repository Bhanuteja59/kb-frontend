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
            <div className="container">
                <div className="card" style={{ maxWidth: 520 }}>
                    <h1 style={{ marginTop: 0 }}>Welcome, {name}!</h1>
                    <p className="muted">Please finish setting up your account.</p>

                    <form onSubmit={onSubmit}>
                        <label>Organization Name</label>
                        <input
                            className="input"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            placeholder="e.g. My Company"
                            required
                        />
                        <div style={{ height: 10 }} />

                        <label>Role</label>
                        <select
                            className="input"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{ background: 'white' }}
                        >
                            <option value="user">User</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                        <div style={{ height: 10 }} />

                        {err ? <p style={{ color: "#b91c1c" }}>{err}</p> : null}

                        <button className="btn" disabled={loading} style={{ marginTop: 12 }}>
                            {loading ? "Setting up..." : "Complete Setup"}
                        </button>
                    </form>
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
