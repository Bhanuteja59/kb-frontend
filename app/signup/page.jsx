"use client";
import { useState } from "react";
import Topbar from "../components/layout/Topbar";
import { signup } from "../lib/api";
import { setToken } from "../lib/utils/token";
import { API_BASE } from "../lib/constants";
import Link from "next/link";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [organizationName, setOrganizationName] = useState("");  // Organization name field
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("user");
    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
            const data = await signup({
                email,
                full_name: fullName,
                organization_name: organizationName,  // Send organization name to API
                role,  // Send selected role
                password
            });
            setToken(data.access_token);
            location.href = "/";
        } catch (e) {
            setErr(e.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Topbar />
            <div className="container">
                <div className="card" style={{ maxWidth: 520 }}>
                    <h1 style={{ marginTop: 0 }}>Create Account</h1>
                    <p className="muted">Sign up to access the platform.</p>
                    <form onSubmit={onSubmit}>
                        <label>Full Name</label>
                        <input
                            className="input"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                        <div style={{ height: 10 }} />

                        {/* Organization Name Field */}
                        <label>Organization Name</label>
                        <input
                            className="input"
                            value={organizationName}
                            onChange={(e) => setOrganizationName(e.target.value)}
                            placeholder="e.g., Acme Corporation"
                            required
                        />
                        <p className="muted" style={{ fontSize: '0.85rem', marginTop: 4, marginBottom: 0 }}>
                            Includes <b>Normal (Free) Plan</b> (up to 3 documents).
                        </p>
                        <div style={{ height: 10 }} />

                        <label>Email</label>
                        <input
                            className="input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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

                        <label>Password</label>
                        <div style={{ position: "relative" }}>
                            <input
                                className="input"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
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

                        <div className="g-row" style={{ marginTop: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                            <button className="btn" disabled={loading}>
                                {loading ? "Creating..." : "Sign Up"}
                            </button>
                            <Link href="/login" style={{ textDecoration: 'none', color: '#666' }}>
                                Already have an account? Login
                            </Link>
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
                            <img src="https://www.google.com/favicon.ico" alt="Google" width="16" height="16" />
                            Sign up with Google
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
