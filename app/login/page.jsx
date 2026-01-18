"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { API_BASE } from "../lib/constants";
import { useSearchParams } from "next/navigation";
import { setToken } from "../lib/utils/token";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const errorMsg = searchParams.get("error");

    useEffect(() => {
        if (token) {
            setToken(token);
            window.location.href = "/";
        }
    }, [token]);

    return (
        <div className="d-flex min-vh-100 w-100 overflow-hidden bg-white fade-in">
            {/* LEFT SIDE - VISUALS (Dark Premium Brand) */}
            <div className="d-none d-lg-flex col-lg-6 position-relative align-items-center justify-content-center p-5 bg-dark">
                {/* Background Image */}
                <div
                    className="position-absolute top-0 start-0 w-100 h-100 z-0"
                    style={{
                        backgroundImage: 'url(/assets/landing/hero_bg.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.6)'
                    }}
                ></div>

                {/* Overlay & Content */}
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-primary opacity-20 mix-blend-overlay"></div>
                <div className="position-relative z-1 text-center max-w-lg glass-panel p-5 border-0 bg-black bg-opacity-20 backdrop-blur-md text-white">
                    <div className="mb-4 d-inline-block p-3 rounded-circle bg-white bg-opacity-10 border border-white border-opacity-10 shadow-lg">
                        <i className="bi bi-robot text-white display-4"></i>
                    </div>
                    <h2 className="display-6 fw-bold mb-3">Intelligent Knowledge Base</h2>
                    <p className="lead text-light opacity-90 mb-4">
                        "Transform your static documents into an interactive AI knowledge base.
                        Secure, scalable, and instant."
                    </p>
                    <div className="d-flex gap-2 justify-content-center opacity-75">
                        <i className="bi bi-shield-check fs-4 text-success"></i>
                        <i className="bi bi-lightning-charge fs-4 text-warning"></i>
                        <i className="bi bi-graph-up-arrow fs-4 text-info"></i>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE - LOGIN FORM (Clean Light Theme) */}
            <div className="col-12 col-lg-6 d-flex flex-column align-items-center justify-content-center p-4 p-md-5 position-relative bg-white text-dark">
                <div className="w-100 position-relative z-1" style={{ maxWidth: '450px' }}>
                    <div className="text-center mb-5">
                        <div className="mb-4 d-inline-flex d-lg-none align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle" style={{ width: 60, height: 60 }}>
                            <i className="bi bi-robot text-primary fs-2"></i>
                        </div>
                        <h1 className="fw-bold display-5 mb-2 tracking-tight text-dark">Welcome Back</h1>
                        <p className="text-secondary opacity-75">Sign in to access your workspace</p>
                    </div>

                    {errorMsg && (
                        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 border-0 shadow-sm" role="alert">
                            <i className="bi bi-exclamation-circle-fill"></i>
                            <small>{errorMsg}</small>
                        </div>
                    )}

                    <div className="card border-0 shadow-none">
                        <div className="card-body p-0">
                            <div className="d-grid gap-4">
                                <a
                                    href={`${API_BASE}/auth/google/login`}
                                    className="btn btn-white border border-4 border-secondary btn-lg d-flex align-items-center justify-content-center gap-3 py-3 position-relative overflow-hidden hover-shadow transition-all text-dark fw-bold"
                                    style={{ borderRadius: '12px', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                                >
                                    <Image src="https://www.google.com/favicon.ico" alt="Google" width={24} height={24} />
                                    <span className="text-secondary">Continue with Google</span>
                                </a>

                                <div className="position-relative text-center my-2">
                                    <hr className="border-secondary opacity-10" />
                                    <span className="position-absolute top-50 start-50 translate-middle px-3 text-secondary small bg-white">
                                        or
                                    </span>
                                </div>

                                <div className="text-center">
                                    <p className="small text-secondary mb-0">
                                        By continuing, you agree to our <a href="#" className="text-primary fw-semibold text-decoration-none">Terms</a> and <a href="#" className="text-primary fw-semibold text-decoration-none">Privacy Policy</a>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 text-center">
                        <p className="text-muted small">
                            Powered by <span className="text-dark fw-bold">KB RAG Platform</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Preload Icons */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </div>
    );
}
