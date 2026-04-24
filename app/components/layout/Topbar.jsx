"use client";

import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { clearToken } from "../../lib/utils/token";

export default function Topbar() {
    const { user, isAuthenticated } = useAuth();

    function handleLogout() {
        clearToken();
        window.location.href = "/";
    }

    return (
        <nav
            className="navbar navbar-expand-lg navbar-dark mb-4 shadow-sm"
            style={{ background: "rgba(15, 23, 42, 0.97)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
            <div className="container">
                <Link href="/" className="navbar-brand fw-bold d-flex align-items-center gap-2">
                    <span
                        style={{
                            display: "inline-flex",
                            width: 28,
                            height: 28,
                            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                            borderRadius: 7,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <i className="bi bi-database-fill text-white" style={{ fontSize: 13 }}></i>
                    </span>
                    <span>KnowledgeBase</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    {/* LEFT NAV — shown to all authenticated users */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {isAuthenticated && (
                            <>
                                <li className="nav-item">
                                    <Link href="/documents" className="nav-link">
                                        Documents
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/upload" className="nav-link">
                                        Upload
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link href="/chat" className="nav-link">
                                        Chat
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/integrations" className="nav-link">
                                        Integrations
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/settings" className="nav-link">
                                        Settings
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/pricing" className="nav-link">
                                        Pricing
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* RIGHT NAV */}
                    <div className="d-flex align-items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <span className="text small d-none d-md-inline">
                                    {user?.email}
                                </span>
                                <button
                                    className="btn btn-danger"
                                    onClick={handleLogout}
                                    style={{ borderRadius: 8 }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="btn btn-sm"
                                style={{
                                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                                    color: "#fff",
                                    borderRadius: 8,
                                    border: "none",
                                }}
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
