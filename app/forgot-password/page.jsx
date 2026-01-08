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
            <div className="container" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="card" style={{ maxWidth: 450, width: "100%", padding: "2rem" }}>
                    <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                        <h1 style={{ marginTop: 0, fontSize: "1.8rem" }}>Reset Password</h1>
                        <p className="muted">Enter your email to receive a reset link.</p>
                    </div>

                    {status === "success" ? (
                        <div style={{ textAlign: "center" }}>
                            <div style={{ color: "green", marginBottom: 20 }}>{msg}</div>
                            <Link href="/login" className="btn">Back to Login</Link>
                        </div>
                    ) : (
                        <form onSubmit={onSubmit}>
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

                            {status === "error" && <p style={{ color: "#b91c1c", marginTop: 10 }}>{msg}</p>}

                            <button className="btn" disabled={status === "loading"} style={{ width: "100%", marginTop: 20 }}>
                                {status === "loading" ? "Sending..." : "Send Reset Link"}
                            </button>

                            <div style={{ marginTop: 20, textAlign: "center" }}>
                                <Link href="/login" style={{ textDecoration: 'none', color: '#666', fontSize: '0.9rem' }}>Back to Login</Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}
