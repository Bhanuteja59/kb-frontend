"use client";
import { useState, useEffect, Suspense } from "react";
import Topbar from "../components/layout/Topbar";
import { resetPassword } from "../lib/api";
import { setToken } from "../lib/utils/token";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [msg, setMsg] = useState("");

    // If no token, show error immediately
    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMsg("Invalid or missing reset token.");
        }
    }, [token]);

    async function onSubmit(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus("error");
            setMsg("Passwords do not match");
            return;
        }

        setStatus("loading");
        setMsg("");

        try {
            const data = await resetPassword(token, password);
            setToken(data.access_token);
            setStatus("success");
            setTimeout(() => {
                location.href = "/"; // Redirect to dashboard
            }, 1000);
        } catch (e) {
            setStatus("error");
            setMsg(e.message || "Failed to reset password. Token may be expired.");
        }
    }

    if (!token) {
        return (
            <div className="container" style={{ marginTop: 50, textAlign: "center" }}>
                <p style={{ color: "red" }}>Invalid Link. Please request a new password reset.</p>
                <div style={{ marginTop: 20 }}>
                    <Link href="/forgot-password" style={{ textDecoration: 'none', color: '#666', fontSize: '0.9rem' }}>Plese request a new link here</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="card" style={{ maxWidth: 450, width: "100%", padding: "2rem" }}>
                <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                    <h1 style={{ marginTop: 0, fontSize: "1.8rem" }}>Set New Password</h1>
                    <p className="muted">Enter your new password below.</p>
                </div>

                {status === "success" ? (
                    <div style={{ textAlign: "center" }}>
                        <div style={{ color: "green", marginBottom: 20 }}>Password Reset Successful! Redirecting...</div>
                    </div>
                ) : (
                    <form onSubmit={onSubmit}>
                        <div style={{ marginTop: 15 }}>
                            <label>New Password</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    className="input"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    style={{ paddingRight: 50 }}
                                    autoFocus
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

                        {status === "error" && <p style={{ color: "#b91c1c", marginTop: 15 }}>{msg}</p>}

                        <button className="btn" disabled={status === "loading"} style={{ width: "100%", marginTop: 25 }}>
                            {status === "loading" ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <>
            <Topbar />
            <Suspense fallback={<div className="container" style={{ textAlign: "center", marginTop: 50 }}>Loading...</div>}>
                <ResetPasswordContent />
            </Suspense>
        </>
    );
}

function ResetPasswordContent() {
    return (
        <ResetPasswordForm />
    )
}
