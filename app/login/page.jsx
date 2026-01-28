"use client";
import Image from "next/image";
import Topbar from "../components/layout/Topbar";
import { API_BASE } from "../lib/constants";

export default function LoginPage() {
    return (
        <>
            <Topbar />
            <div className="container d-flex align-items-center justify-content-center min-vh-100 py-5" style={{ background: 'var(--bg-gradient)' }}>
                <div className="glass-card w-100 fade-in-up" style={{ maxWidth: 480 }}>
                    <div className="card-body p-4 p-md-5 text-center">
                        <div className="mb-4">
                            <h1 className="h3 mb-2 gradient-text fw-bold">Welcome Back</h1>
                            <p className="text-muted">Sign in to access your enterprise knowledge base.</p>
                        </div>

                        <div className="d-grid gap-3">
                            <a
                                href={`${API_BASE}/auth/google/login`}
                                className="btn btn-lg btn-white border shadow-sm d-flex align-items-center justify-content-center gap-3 hover-lift"
                                style={{ transition: 'all 0.2s' }}
                            >
                                <Image src="https://www.google.com/favicon.ico" alt="Google" width={24} height={24} />
                                <span className="fw-medium text-dark">Continue with Google</span>
                            </a>
                        </div>

                        <div className="mt-4 text-muted small">
                            <p className="mb-0">
                                By continuing, you agree to our <a href="#" className="text-decoration-none">Terms of Service</a> and <a href="#" className="text-decoration-none">Privacy Policy</a>.
                            </p>
                        </div>
                    </div>
                </div >
            </div >
        </>
    );
}
