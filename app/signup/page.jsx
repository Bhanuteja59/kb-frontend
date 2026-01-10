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
            <div className="container d-flex align-items-center justify-content-center min-vh-100 py-5">
                <div className="card shadow-sm border-0 w-100" style={{ maxWidth: 520 }}>
                    <div className="card-body p-4 p-md-5">
                        <div className="text-center mb-4">
                            <h1 className="h3 mb-2">Create Account</h1>
                            <p className="text-muted">
                                {step === 1 && "Enter your email to get started."}
                                {step === 2 && "We sent a code to your email."}
                                {step === 3 && "Complete your profile."}
                            </p>
                        </div>

                        {step === 1 && (
                            <form onSubmit={onSendCode}>
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

                                {err && <div className="alert alert-danger py-2">{err}</div>}

                                <button className="btn btn-primary w-100 mb-4" disabled={loading}>
                                    {loading ? "Sending Code..." : "Continue with Email"}
                                </button>

                                <div className="text-center">
                                    <span className="text-muted small">Already have an account? </span>
                                    <Link href="/login" className="text-decoration-none fw-bold text-dark">Login</Link>
                                </div>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={onVerifyCode}>
                                <div className="mb-3">
                                    <label className="form-label">Verification Code</label>
                                    <input
                                        className="form-control text-center fs-4 letter-spacing-2"
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="123456"
                                        required
                                        maxLength={6}
                                        style={{ letterSpacing: "4px" }}
                                        autoFocus
                                    />
                                    <div className="d-flex justify-content-between mt-2">
                                        <span className="text-muted small">Sent to {email}</span>
                                        <button type="button" onClick={() => setStep(1)} className="btn btn-link p-0 text-decoration-none small text-muted">change email</button>
                                    </div>
                                </div>

                                {err && <div className="alert alert-danger py-2">{err}</div>}

                                <button className="btn btn-primary w-100 mb-3" disabled={loading}>
                                    {loading ? "Verifying..." : "Verify Code"}
                                </button>
                            </form>
                        )}

                        {step === 3 && (
                            <form onSubmit={onCompleteSignup}>
                                <div className="mb-3">
                                    <label className="form-label">Email <span className="text-muted small">(Verified)</span></label>
                                    <input className="form-control bg-light" value={email} disabled />
                                </div>

                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            className="form-control"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Organization Name</label>
                                        <input
                                            className="form-control"
                                            value={organizationName}
                                            onChange={(e) => setOrganizationName(e.target.value)}
                                            placeholder="Company Inc."
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <div className="position-relative">
                                        <input
                                            className="form-control"
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
                                            className="btn btn-link text-decoration-none position-absolute top-50 end-0 translate-middle-y text-muted"
                                            style={{ fontSize: "0.8rem", marginRight: "5px" }}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-3">
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

                                <div className="mb-3">
                                    <label className="form-label">Role</label>
                                    <select
                                        className="form-select"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="user">User</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                {err && <div className="alert alert-danger py-2">{err}</div>}

                                <button className="btn btn-primary w-100 mt-3" disabled={loading}>
                                    {loading ? "Creating Account..." : "Complete Signup"}
                                </button>
                            </form>
                        )}

                        {/* Google Login only on step 1 */}
                        {step === 1 && (
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
                                    Sign up with Google
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
