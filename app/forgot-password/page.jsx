"use client";
import { useState } from "react";
import Topbar from "../components/layout/Topbar";
import { forgotPassword } from "../lib/api";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [msg, setMsg] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setStatus("loading");
        setMsg("");
        try {
            await forgotPassword(email);
            setStatus("success");
            setMsg("If an account exists, a reset email has been sent to " + email);
        } catch (e) {
            setStatus("error");
            setMsg(e.message || "Something went wrong");
        }
    }

    return (
        <>
            <Topbar />
            <div className="container d-flex align-items-center justify-content-center min-vh-80 py-5">
                <div className="card shadow-sm border-0 w-100" style={{ maxWidth: 450 }}>
                    <div className="card-body p-4 p-md-5">
                        <div className="text-center mb-4">
                            <h1 className="h3 mb-2">Reset Password</h1>
                            <p className="text-muted">Enter your email to receive a reset link.</p>
                        </div>

                        {status === "success" ? (
                            <div className="text-center">
                                <div className="alert alert-success mb-4" role="alert">
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    {msg}
                                </div>
                                <Link href="/login" className="btn btn-primary w-100">Back to Login</Link>
                            </div>
                        ) : (
                            <form onSubmit={onSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Email Address</label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@company.com"
                                        required
                                        autoFocus
                                    />
                                </div>

                                {status === "error" && (
                                    <div className="alert alert-danger mb-3" role="alert">
                                        {msg}
                                    </div>
                                )}

                                <button
                                    className="btn btn-primary w-100 mb-3"
                                    disabled={status === "loading"}
                                >
                                    {status === "loading" ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Sending...
                                        </>
                                    ) : "Send Reset Link"}
                                </button>

                                <div className="text-center">
                                    <Link href="/login" className="text-decoration-none text-muted small">
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
