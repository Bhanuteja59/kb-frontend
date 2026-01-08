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
            <div className="container">
                <div className="card" style={{ maxWidth: 520 }}>
                    <h1 style={{ marginTop: 0 }}>Login</h1>
                    <p className="muted">Login to access the more things .... </p>
                    <form onSubmit={onSubmit}>
                        <label>Email</label>
                        <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
                        <div style={{ height: 10 }} />
                        <label>Password</label>
                        <div style={{ position: "relative" }}>
                            <input
                                className="input"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ paddingRight: 50 }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: 10,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    color: "#666",
                                    fontSize: "0.8rem",
                                }}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {err ? <p style={{ color: "#b91c1c" }}>{err}</p> : null}
                        <div className="g-row" style={{ marginTop: 12 }}>
                            <button className="btn" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
                            <span className="muted" style={{ marginLeft: 10 }}>
                                <a href="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>Create account</a>
                            </span>
                        </div>
                        <div style={{ marginTop: 15, textAlign: 'center' }}>
                            <a href="/forgot-password" style={{ color: '#666', fontSize: '0.9rem', textDecoration: 'none' }}>Forgot Password?</a>
                        </div>
                    </form>
                    <div style={{ marginTop: 20 }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            margin: '20px 0',
                            color: '#666'
                        }}>
                            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }}></div>
                            <span style={{ padding: '0 10px', fontSize: '0.9rem' }}>OR</span>
                            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }}></div>
                        </div>
                        <a
                            href={`${API_BASE}/auth/google/login`}
                            className="btn"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                background: '#fff',
                                color: '#333',
                                border: '1px solid #d1d5db',
                                textDecoration: 'none',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                        >
                            <Image src="https://www.google.com/favicon.ico" alt="Google" width={16} height={16} />
                            Sign in with Google
                        </a>
                    </div>
                </div >
            </div >
        </>
    );
}
