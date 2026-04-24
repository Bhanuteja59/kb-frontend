"use client";
import React, { useEffect, useState } from "react";
import Topbar from "../components/layout/Topbar";
import { getMe } from "../lib/api";
import Link from "next/link";
import Image from "next/image";
import "./profile.css";


export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const userData = await getMe();
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="min-vh-100 d-flex flex-column">
                <Topbar />
                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    // Calculate usage percentage for progress bar
    const usagePercent = Math.min(100, (user.doc_count / user.max_docs) * 100);

    return (
        <div className="light-page min-vh-100 pb-5 d-flex flex-column">
            <Topbar />

            <main className="container pt-4 pt-lg-5 fade-in position-relative flex-grow-1" style={{ zIndex: 1 }}>
                {/* Header */}
                <div className="page-header mb-5 border-bottom pb-4">
                    <div className="d-flex align-items-center gap-3">
                        <div className="page-header-icon" style={{ background: 'var(--primary)', boxShadow: '0 4px 12px rgba(255, 107, 107, 0.2)' }}>
                            <i className="bi bi-person-fill text-white" style={{ fontSize: 24 }}></i>
                        </div>
                        <div>
                            <h1 className="h2 fw-bold mb-0 text-dark">My Profile</h1>
                            <p className="text-muted mb-0 small fw-medium">Manage your account settings and preferences.</p>
                        </div>
                    </div>
                </div>

                <div className="row g-4 justify-content-center">
                    {/* Left Column: User Card */}
                    <div className="col-lg-4">
                        <div className="page-card p-4 text-center h-100 shadow-sm border" style={{ borderColor: 'var(--border)' }}>
                            <div className="position-relative d-inline-block mb-4">
                                <div className="profile-avatar-lg shadow-sm border" style={{ 
                                    width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,107,107,0.1)', 
                                    color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    fontSize: '2.5rem', fontWeight: 'bold', borderColor: 'rgba(255,107,107,0.2)' 
                                }}>
                                    {user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                </div>
                                <div className="position-absolute bottom-0 end-0 p-2 bg-success border border-3 border-white rounded-circle shadow-sm"></div>
                            </div>

                            <h2 className="h4 fw-bold mb-1 text-dark">{user.full_name}</h2>
                            <p className="text-muted mb-4 fw-medium">{user.email}</p>

                            <div className="d-flex justify-content-center gap-2 mb-4">
                                <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 fw-bold" style={{ fontSize: '0.75rem' }}>
                                    {user.plan?.toUpperCase()} PLAN
                                </span>
                            </div>

                            <div className="d-grid gap-2">
                                <Link href="/settings" className="btn btn-dark rounded-pill fw-bold py-2 shadow-sm">
                                    <i className="bi bi-pencil me-2"></i> Edit Profile
                                </Link>
                                <button className="btn btn-outline-danger rounded-pill fw-bold py-2 shadow-sm">
                                    <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats & Organization */}
                    <div className="col-lg-8">
                        <div className="d-flex flex-column gap-4 h-100">

                            {/* Organization Overview */}
                            <div className="page-card shadow-sm border" style={{ borderColor: 'var(--border)' }}>
                                <div className="page-card-header border-bottom py-3 px-4" style={{ background: 'rgba(255,107,107,0.02)', borderColor: 'var(--border)' }}>
                                    <h3 className="h6 fw-bold mb-0 d-flex align-items-center gap-2 text-dark">
                                        <i className="bi bi-building text-primary"></i> Organization Details
                                    </h3>
                                </div>
                                <div className="p-4">
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <div className="info-item">
                                                <label className="text-muted small text-uppercase fw-bold letter-spacing-1 mb-1">Company Name</label>
                                                <div className="h5 mb-0 fw-bold text-dark">{user.org_name || 'My Organization'}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="info-item">
                                                <label className="text-muted small text-uppercase fw-bold letter-spacing-1 mb-1">Status</label>
                                                <div className="d-flex align-items-center gap-2 text-success fw-bold">
                                                    <i className="bi bi-check-circle-fill"></i> Active
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="info-item">
                                                <label className="text-muted small text-uppercase fw-bold letter-spacing-1 mb-1">Member Since</label>
                                                <div className="h5 mb-0 fw-bold text-dark">{new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="info-item">
                                                <label className="text-muted small text-uppercase fw-bold letter-spacing-1 mb-1">API Access</label>
                                                <div className="h5 mb-0 fw-bold text-dark">Enabled</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Usage Stats with Visual Progress */}
                            <div className="page-card shadow-sm border flex-grow-1" style={{ borderColor: 'var(--border)' }}>
                                <div className="page-card-header border-bottom py-3 px-4" style={{ background: 'rgba(255,107,107,0.02)', borderColor: 'var(--border)' }}>
                                    <h3 className="h6 fw-bold mb-0 d-flex align-items-center gap-2 text-dark">
                                        <i className="bi bi-graph-up text-primary"></i> Plan Usage
                                    </h3>
                                </div>
                                <div className="p-4">
                                    {/* Documents Usage */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-end mb-2">
                                            <label className="fw-bold text-dark">Document Storage</label>
                                            <span className="text-muted small fw-bold">
                                                <strong className="text-dark">{user.doc_count}</strong> / {user.max_docs} Docs
                                            </span>
                                        </div>
                                        <div className="progress border" style={{ height: '12px', background: '#f1f5f9', borderRadius: '10px', borderColor: 'var(--border)' }}>
                                            <div
                                                className={`progress-bar ${usagePercent > 90 ? 'bg-danger' : 'bg-primary'}`}
                                                role="progressbar"
                                                style={{ width: `${usagePercent}%`, borderRadius: '10px' }}
                                                aria-valuenow={usagePercent}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Feature Limits Grid */}
                                    <div className="row g-3 mt-2">
                                        <div className="col-sm-6">
                                            <div
                                                className="feature-limit-card p-3 rounded-3 bg-light border"
                                                style={{ borderColor: "var(--border)" }}
                                            >
                                                <div className="d-flex align-items-center gap-3">
                                                    <div
                                                        className="rounded-3 d-flex align-items-center justify-content-center shadow-sm bg-white border"
                                                        style={{ width: 38, height: 38, borderColor: 'var(--border)', flexShrink: 0 }}
                                                    >
                                                        <i className="bi bi-chat-left-text" style={{ color: "var(--primary)" }}></i>
                                                    </div>
                                                    <div>
                                                        <div className="small fw-bold text-dark">Chat Queries</div>
                                                        <div className="text-muted" style={{ fontSize: "0.75rem", fontWeight: '600' }}>Unlimited</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div
                                                className="feature-limit-card p-3 rounded-3 bg-light border"
                                                style={{ borderColor: "var(--border)" }}
                                            >
                                                <div className="d-flex align-items-center gap-3">
                                                    <div
                                                        className="rounded-3 d-flex align-items-center justify-content-center shadow-sm bg-white border"
                                                        style={{ width: 38, height: 38, borderColor: 'var(--border)', flexShrink: 0 }}
                                                    >
                                                        <i className="bi bi-hdd-network" style={{ color: "var(--primary)" }}></i>
                                                    </div>
                                                    <div>
                                                        <div className="small fw-bold text-dark">Storage Used</div>
                                                        <div className="text-muted" style={{ fontSize: "0.75rem", fontWeight: '600' }}>
                                                            {((user.total_storage_bytes ?? 0) / (1024 * 1024)).toFixed(1)} MB
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Settings Link */}
                <div className="text-center mt-5">
                    <p className="text-muted small fw-medium">
                        Need to change your password or security settings?
                        <Link href="/settings" className="text-primary ms-1 text-decoration-none fw-bold">
                            Go to Settings
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
    );
}
