"use client";
import { useState } from "react";
import Image from "next/image";
import Topbar from "../components/layout/Topbar";
import { signup, sendVerification, verifyOtp } from "../lib/api";
import { setToken } from "../lib/utils/token";
import { API_BASE } from "../lib/constants";
import Link from "next/link";

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [verificationToken, setVerificationToken] = useState(null);

    const [fullName, setFullName] = useState("");
    const [organizationName, setOrganizationName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("user");

    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(false);

    async function onSendCode(e) {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
            await sendVerification(email);
            setStep(2);
        } catch (e) {
            setErr(e.message || "Failed to send code");
        } finally {
            setLoading(false);
        }
    }

    async function onVerifyCode(e) {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
            const data = await verifyOtp(email, otp);
            setVerificationToken(data.access_token); // This is the temporary 'email_verified' token
            setStep(3);
        } catch (e) {
            setErr(e.message || "Invalid code");
        } finally {
            setLoading(false);
        }
    }

    async function onCompleteSignup(e) {
        e.preventDefault();
        setErr(null);

        if (password !== confirmPassword) {
            setErr("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const data = await signup({
                email,
                full_name: fullName,
                organization_name: organizationName,
                role,
                password,
                verification_token: verificationToken
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
            <div className="container" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="card" style={{ maxWidth: 520, width: "100%", padding: "2rem" }}>
                    <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                        <h1 style={{ marginTop: 0, fontSize: "1.8rem" }}>Create Account</h1>
                        <p className="muted">
                            {step === 1 && "Enter your email to get started."}
                            {step === 2 && "We sent a code to your email."}
                            {step === 3 && "Complete your profile."}
                        </p>
                    </div>

                    {step === 1 && (
                        <form onSubmit={onSendCode}>
                            <label>Email Address</label>
                            <input
                                className="input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                required
                                autoFocus
                            />

                            {err && <p style={{ color: "#b91c1c", marginTop: 10 }}>{err}</p>}

                            <button className="btn" disabled={loading} style={{ width: "100%", marginTop: 20 }}>
                                {loading ? "Sending Code..." : "Continue with Email"}
                            </button>

                            <div style={{ marginTop: 20, textAlign: "center" }}>
                                <span className="muted">Already have an account? </span>
                                <Link href="/login" style={{ textDecoration: 'none', color: '#000' }}>Login</Link>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={onVerifyCode}>
                            <label>Verification Code</label>
                            <input
                                className="input"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="123456"
                                required
                                maxLength={6}
                                style={{ letterSpacing: "2px", fontSize: "1.2rem", textAlign: "center" }}
                                autoFocus
                            />
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                                <span className="muted" style={{ fontSize: "0.8rem" }}>Sent to {email}</span>
                                <button type="button" onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "0.8rem" }}>change email</button>
                            </div>

                            {err && <p style={{ color: "#b91c1c", marginTop: 10 }}>{err}</p>}

                            <button className="btn" disabled={loading} style={{ width: "100%", marginTop: 20 }}>
                                {loading ? "Verifying..." : "Verify Code"}
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={onCompleteSignup}>
                            <div style={{ marginBottom: 15 }}>
                                <label>Email <span className="muted">(Verified)</span></label>
                                <input className="input" value={email} disabled style={{ background: "#f3f4f6", color: "#666" }} />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                                <div>
                                    <label>Full Name</label>
                                    <input
                                        className="input"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label>Organization Name</label>
                                    <input
                                        className="input"
                                        value={organizationName}
                                        onChange={(e) => setOrganizationName(e.target.value)}
                                        placeholder="Company Inc."
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: 15 }}>
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
                                        }}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <div style={{ marginTop: 15 }}>
                                <label>Confirm Password</label>
                                <input
                                    className="input"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                            </div>

                            <div style={{ marginTop: 15 }}>
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
                            </div>

                            {err && <p style={{ color: "#b91c1c", marginTop: 10 }}>{err}</p>}

                            <button className="btn" disabled={loading} style={{ width: "100%", marginTop: 25 }}>
                                {loading ? "Creating Account..." : "Complete Signup"}
                            </button>
                        </form>
                    )}

                    {/* Google Login only on step 1 */}
                    {step === 1 && (
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
                                Sign up with Google
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
