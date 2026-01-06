"use client";

import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { clearToken } from "../../lib/utils/token";

export default function Topbar() {
    const { user, isAdmin, isManager } = useAuth();

    return (
        <div className="topbar">
            <div className="container g-row" style={{ justifyContent: "space-between" }}>

                {/* LEFT NAV */}
                <div className="g-row">
                    <Link href="/" style={{ fontWeight: 800 }}>
                        KB Admin
                    </Link>

                    {/* Everyone can see documents */}
                    {user && (
                        <Link href="/documents" className="muted">
                            Documents
                        </Link>
                    )}

                    {/* Admin + Manager can upload */}
                    {(isAdmin || isManager) && (
                        <Link href="/upload" className="muted">
                            Upload
                        </Link>
                    )}

                    {/* Admin only */}
                    {isAdmin && (
                        <>
                            <Link href="/admin/users" className="muted">
                                Users
                            </Link>
                            <Link href="/admin/audit" className="muted">
                                Audit
                            </Link>
                        </>
                    )}

                    {(isAdmin || isManager) && (
                        <Link href="/settings" className="muted">
                            Settings
                        </Link>
                    )}

                    {user && (
                        <Link href="/pricing" className="muted">
                            Pricing
                        </Link>
                    )}
                </div>

                {/* RIGHT NAV */}
                <div className="g-row">
                    {user ? (
                        <>
                            <span className="pill">{user.role}</span>
                            <span className="muted">{user.email}</span>
                            <button
                                className="btn secondary"
                                onClick={() => {
                                    clearToken();
                                    location.href = "/login";
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="btn secondary">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
