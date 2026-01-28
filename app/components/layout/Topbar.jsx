"use client";

import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { clearToken } from "../../lib/utils/token";

export default function Topbar() {
    const { user, isAdmin, isManager } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
            <div className="container">
                <Link href="/" className="navbar-brand fw-bold">
                    KB Admin
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    {/* LEFT NAV */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {user && (
                            <li className="nav-item">
                                <Link href="/documents" className="nav-link">
                                    Documents
                                </Link>
                            </li>
                        )}

                        {(isAdmin || isManager) && (
                            <li className="nav-item">
                                <Link href="/upload" className="nav-link">
                                    Upload
                                </Link>
                            </li>
                        )}

                        {isAdmin && (
                            <>
                                <li className="nav-item">
                                    <Link href="/admin/users" className="nav-link">
                                        Users
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/admin/audit" className="nav-link">
                                        Audit
                                    </Link>
                                </li>
                            </>
                        )}

                        {(isAdmin || isManager) && (
                            <>
                                <li className="nav-item">
                                    <Link href="/settings" className="nav-link">
                                        Settings
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/integration" className="nav-link">
                                        Integration
                                    </Link>
                                </li>
                            </>
                        )}

                        {user && (
                            <li className="nav-item">
                                <Link href="/pricing" className="nav-link">
                                    Pricing
                                </Link>
                            </li>
                        )}
                    </ul>

                    {/* RIGHT NAV */}
                    <div className="d-flex align-items-center gap-3">
                        {user ? (
                            <>
                                <span className="badge bg-secondary rounded-pill">{user.role}</span>
                                <span className="text-light small d-none d-md-inline">{user.email}</span>
                                <button
                                    className="btn btn-sm btn-outline-light"
                                    onClick={() => {
                                        clearToken();
                                        location.href = "/login";
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="btn btn-sm btn-outline-light">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
