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
            <div className="container min-vh-80 d-flex align-items-center justify-content-center py-5">
                <div className="card shadow-sm border-0 w-100" style={{ maxWidth: 450 }}>
                    <div className="card-body p-4 text-center">
                        <div className="alert alert-danger mb-4">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            Invalid Link. Please request a new password reset.
                        </div>
                        <Link href="/forgot-password" className="btn btn-outline-secondary">
                            Request a new link here
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-80 py-5">
            <div className="card shadow-sm border-0 w-100" style={{ maxWidth: 450 }}>
                <div className="card-body p-4 p-md-5">
                    <div className="text-center mb-4">
                        <h1 className="h3 mb-2">Set New Password</h1>
                        <p className="text-muted">Enter your new password below.</p>
                    </div>

                    {status === "success" ? (
                        <div className="text-center">
                            <div className="alert alert-success mb-3" role="alert">
                                <i className="bi bi-check-circle-fill me-2"></i>
                                Password Reset Successful! Redirecting...
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={onSubmit}>
                            <div className="mb-3">
                                <label className="form-label">New Password</label>
                                <div className="input-group">
                                    <input
                                        className="form-control"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        autoFocus
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Confirm Password</label>
                                <input
                                    className="form-control"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                            </div>

                            {status === "error" && (
                                <div className="alert alert-danger mb-3" role="alert">
                                    {msg}
                                </div>
                            )}

                            <button
                                className="btn btn-primary w-100"
                                disabled={status === "loading"}
                            >
                                {status === "loading" ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Resetting...
                                    </>
                                ) : "Reset Password"}
                            </button>
                        </form>
                    )}
                </div>
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
