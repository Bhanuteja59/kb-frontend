"use client";
import { useState } from "react";
import Image from "next/image";
import Topbar from "../components/layout/Topbar";
import { login } from "../lib/api";
import { setToken } from "../lib/utils/token";
import { API_BASE } from "../lib/constants";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
            const data = await login({ email, password });
            setToken(data.access_token);
            location.href = "/";
        } catch (e) {
            setErr(e.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Topbar />
            <div className="container d-flex align-items-center justify-content-center min-vh-100 py-5" style={{ background: 'var(--bg-gradient)' }}>
                <div className="glass-card w-100 fade-in-up" style={{ maxWidth: 520 }}>
                    <div className="card-body p-4 p-md-5">
                        <h1 className="h3 mb-2 text-center gradient-text">Login</h1>
                        <p className="text-muted text-center mb-4">Login to access your knowledge base</p>

                        <form onSubmit={onSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Email</label>
                                <input
                                    className="form-control"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <div className="position-relative">
                                    <input
                                        className="form-control"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ paddingRight: 50 }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="btn btn-link text-decoration-none position-absolute top-50 end-0 translate-middle-y text-muted"
                                        style={{ fontSize: "0.8rem", marginRight: "5px" }}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            {err && <div className="alert alert-danger py-2">{err}</div>}

                            <div className="d-flex align-items-center justify-content-between mt-4">
                                <button className="btn btn-primary px-4" disabled={loading}>
                                    {loading ? "Signing in..." : "Sign in"}
                                </button>
                                <a href="/signup" className="text-decoration-none small">Create account</a>
                            </div>

                            <div className="text-center mt-3">
                                <a href="/forgot-password" className="text-muted small text-decoration-none">Forgot Password?</a>
                            </div>
                        </form>

                        <div className="mt-4">
                            <div className="d-flex align-items-center my-3">
                                <div className="flex-grow-1 border-bottom"></div>
                                <span className="px-3 text-muted small">OR</span>
                                <div className="flex-grow-1 border-bottom"></div>
                            </div>
                            <a
                                href={`${API_BASE}/auth/google/login`}
                                className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
                            >
                                <Image src="https://www.google.com/favicon.ico" alt="Google" width={16} height={16} />
                                Sign in with Google
                            </a>
                        </div>
                    </div>
                </div >
            </div >
        </>
    );
}
