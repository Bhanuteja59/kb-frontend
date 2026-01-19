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
    const [role, setRole] = useState("admin"); // Default to Admin as requested
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    const [isInputFocused, setIsInputFocused] = useState(true);

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
        <div className="min-vh-100 d-flex bg-white font-sans">
            {/* Left Side: Brand & Value */}
            <div className="d-none d-lg-flex col-lg-5 flex-column justify-content-between p-5 text-white position-relative overflow-hidden"
                style={{ background: '#09090b' }}>

                {/* Abstract Background Shapes */}
                <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden">
                    <div className="position-absolute rounded-circle opacity-20" style={{ width: '600px', height: '600px', background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', top: '-20%', left: '-20%', filter: 'blur(80px)' }}></div>
                    <div className="position-absolute rounded-circle opacity-10" style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', bottom: '-10%', right: '-10%', filter: 'blur(80px)' }}></div>
                </div>

                <div className="position-relative z-1 fw-bold fs-5 d-flex align-items-center gap-2 tracking-tight">
                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 24, height: 24 }}>
                        <div className="bg-black rounded-circle" style={{ width: 12, height: 12 }}></div>
                    </div>
                    KB Platform
                </div>

                <div className="position-relative z-1 my-auto">
                    <span className="badge bg-white text-black rounded-pill mb-4 px-3 py-2 fw-bold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>Early Access</span>
                    <h1 className="display-4 fw-bold mb-4" style={{ letterSpacing: '-0.02em' }}>Command your data with AI.</h1>
                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex align-items-center gap-3 opacity-75">
                            <i className="bi bi-check-circle-fill text-primary"></i>
                            <span className="fs-5">Connect Documents & Drives</span>
                        </div>
                        <div className="d-flex align-items-center gap-3 opacity-75">
                            <i className="bi bi-check-circle-fill text-primary"></i>
                            <span className="fs-5">Instant RAG Search</span>
                        </div>
                        <div className="d-flex align-items-center gap-3 opacity-75">
                            <i className="bi bi-check-circle-fill text-primary"></i>
                            <span className="fs-5">Secure Admin Controls</span>
                        </div>
                    </div>
                </div>

                <div className="position-relative z-1 d-flex justify-content-between align-items-end small opacity-50">
                    <div>&copy; 2024 KB RAG Platform</div>
                    <div className="text-end">Secure SSL<br />Encrypted Data</div>
                </div>
            </div>

            {/* Right Side: Interactive Form */}
            <div className="col-12 col-lg-7 d-flex flex-column align-items-center justify-content-center p-4 p-md-5 bg-light">
                <div className="w-100" style={{ maxWidth: '600px' }}>

                    <div className="mb-5">
                        <div className="progress mb-4" style={{ height: 6 }}>
                            <div className="progress-bar bg-dark w-50" role="progressbar"></div>
                        </div>
                        <h2 className="display-6 fw-bold text-black mb-2">Setup Workspace</h2>
                        <p className="text-muted fs-5">Hello <strong>{name}</strong>, complete these details to launch your organization.</p>
                    </div>

                    <form onSubmit={onSubmit}>
                        {/* 1. Org Name Input */}
                        <div className="mb-5">
                            <label className="form-label fw-bold text-black small text-uppercase mb-3">Organization Name</label>
                            <div
                                className={`input-group input-group-lg shadow-sm rounded-3 overflow-hidden border transition-all ${isInputFocused ? 'border-dark shadow-lg' : 'border-light'}`}
                                style={{
                                    transform: isInputFocused ? 'scale(1.02)' : 'scale(1)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <span className={`input-group-text bg-white border-0 ps-4 ${isInputFocused ? 'text-primary' : 'text-muted'}`}>
                                    <i className={`bi bi-building ${isInputFocused ? 'fs-5' : ''} transition-all`}></i>
                                </span>
                                <input
                                    className="form-control bg-white border-0 py-3 fw-bold text-dark"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    placeholder="Enter Org Name ..."
                                    style={{ fontSize: '1.1rem' }}
                                    required
                                    onFocus={() => setIsInputFocused(true)}
                                    onBlur={() => setIsInputFocused(false)}
                                />
                            </div>
                        </div>

                        {/* 2. Interactive Role Selection Cards */}
                        <div className="mb-5">
                            <label className="form-label fw-bold text-black small text-uppercase mb-3">Select Your Role</label>

                            <div className="d-flex flex-column gap-3">
                                {/* Admin Option */}
                                <div
                                    onClick={() => setRole("admin")}
                                    className={`card cursor-pointer transition-all border-0 shadow-sm p-3 hover-glow-shadow ${role === 'admin' ? 'ring-2 ring-dark bg-white' : 'bg-white opacity-75 hover-opacity-100'}`}
                                    style={{ cursor: 'pointer', outline: role === 'admin' ? '2px solid #000' : 'none', transform: role === 'admin' ? 'scale(1.01)' : 'scale(1)' }}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <div className={`rounded-circle p-3 d-flex align-items-center justify-content-center ${role === 'admin' ? 'bg-dark text-white' : 'bg-light text-dark'}`} style={{ width: 50, height: 50 }}>
                                            <i className="bi bi-shield-lock-fill fs-5"></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="fw-bold mb-1 text-black">Administrator <span className="badge bg-success bg-opacity-10 text-success ms-2 small" style={{ fontSize: '0.65rem' }}>RECOMMENDED</span></h6>
                                            <p className="mb-0 text-muted small">Full access to manage users, billing, and settings.</p>
                                        </div>
                                        <div className="fs-4 text-success">
                                            {role === 'admin' && <i className="bi bi-check-circle-fill"></i>}
                                        </div>
                                    </div>
                                </div>

                                {/* Manager Option */}
                                <div
                                    onClick={() => setRole("manager")}
                                    className={`card cursor-pointer transition-all border-0 shadow-sm p-3 hover-glow-shadow ${role === 'manager' ? 'ring-2 ring-dark bg-white' : 'bg-white opacity-75 hover-opacity-100'}`}
                                    style={{ cursor: 'pointer', outline: role === 'manager' ? '2px solid #000' : 'none' }}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <div className={`rounded-circle p-3 d-flex align-items-center justify-content-center ${role === 'manager' ? 'bg-dark text-white' : 'bg-light text-dark'}`} style={{ width: 50, height: 50 }}>
                                            <i className="bi bi-people-fill fs-5"></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="fw-bold mb-1 text-black">Manager</h6>
                                            <p className="mb-0 text-muted small">Can manage content and view analytics.</p>
                                        </div>
                                        <div className="fs-4 text-success">
                                            {role === 'manager' && <i className="bi bi-check-circle-fill"></i>}
                                        </div>
                                    </div>
                                </div>

                                {/* User Option */}
                                <div
                                    onClick={() => setRole("user")}
                                    className={`card cursor-pointer transition-all border-0 shadow-sm p-3 hover-glow-shadow ${role === 'user' ? 'ring-2 ring-dark bg-white' : 'bg-white opacity-75 hover-opacity-100'}`}
                                    style={{ cursor: 'pointer', outline: role === 'user' ? '2px solid #000' : 'none' }}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <div className={`rounded-circle p-3 d-flex align-items-center justify-content-center ${role === 'user' ? 'bg-dark text-white' : 'bg-light text-dark'}`} style={{ width: 50, height: 50 }}>
                                            <i className="bi bi-person-fill fs-5"></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="fw-bold mb-1 text-black">Standard User</h6>
                                            <p className="mb-0 text-muted small">Read-only access to search and view documents.</p>
                                        </div>
                                        <div className="fs-4 text-success">
                                            {role === 'user' && <i className="bi bi-check-circle-fill"></i>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {err && (
                            <div className="alert alert-danger d-flex align-items-center shadow-sm border-0 mb-4" role="alert">
                                <i className="bi bi-exclamation-circle-fill me-2 fs-5"></i>
                                {err}
                            </div>
                        )}

                        <button
                            className="btn btn-dark w-100 py-3 rounded-pill fw-bold fs-5 shadow-lg transition-transform hover-scale"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Finalizing...
                                </>
                            ) : "Launch Workspace"}
                        </button>

                        <div className="text-center mt-4">
                            <p className="small text-muted mb-0">By joining, you agree to our Terms of Service.</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OnboardingContent />
        </Suspense>
    );
}
