"use client";
import React, { useEffect, useState } from "react";
import Topbar from "../components/layout/Topbar";
import { getMe } from "../lib/api";
import Link from "next/link";
import Image from "next/image";

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
        <div className="min-vh-100 pb-5">
            <Topbar />

            {/* Background Decor */}
            <div className="background-elements">
                <div className="bg-blur-1"></div>
                <div className="bg-blur-2"></div>
            </div>

            <main className="container pt-4 pt-lg-5 fade-in position-relative z-1">
                {/* Header */}
                <div className="mb-5">
                    <h1 className="display-5 fw-bold text-white mb-2">My Profile</h1>
                    <p className="text-white opacity-75 lead">
                        Manage your account settings and preferences.
                    </p>
                </div>

                <div className="row g-4 justify-content-center">
                    {/* Left Column: User Card */}
                    <div className="col-lg-4">
                        <div className="glass-panel p-4 text-center h-100">
                            <div className="position-relative d-inline-block mb-4">
                                <div className="profile-avatar-lg">
                                    {user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                </div>
                                <div className="position-absolute bottom-0 end-0 p-2 bg-success border border-4 border-dark rounded-circle"></div>
                            </div>

                            <h2 className="h4 text-white fw-bold mb-1">{user.full_name}</h2>
                            <p className="text-white opacity-75 mb-3">{user.email}</p>

                            <div className="d-flex justify-content-center gap-2 mb-4">
                                <span className={`badge rounded-pill ${user.role === 'admin' ? 'bg-primary' : 'bg-secondary'}`}>
                                    {user.role?.toUpperCase()}
                                </span>
                                <span className="badge rounded-pill bg-white bg-opacity-10 text-white border border-white border-opacity-10">
                                    {user.plan?.toUpperCase()} PLAN
                                </span>
                            </div>

                            <div className="d-grid gap-2">
                                <button className="btn btn-glass w-100">
                                    <i className="bi bi-pencil me-2"></i> Edit Profile
                                </button>
                                <button className="btn btn-outline-danger w-100 border-opacity-25 text-danger bg-transparent hover-danger">
                                    <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats & Organization */}
                    <div className="col-lg-8">
                        <div className="d-flex flex-column gap-4 h-100">

                            {/* Organization Overview */}
                            <div className="glass-panel p-4">
                                <h3 className="h5 text-white fw-bold mb-4 d-flex align-items-center gap-2">
                                    <i className="bi bi-building text-primary"></i> Organization Details
                                </h3>

                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="info-item">
                                            <label className="text-white opacity-50 small text-uppercase fw-semibold letter-spacing-1 mb-1">Company Name</label>
                                            <div className="text-white h5 mb-0">{user.org_name || 'My Organization'}</div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="info-item">
                                            <label className="text-white opacity-50 small text-uppercase fw-semibold letter-spacing-1 mb-1">Status</label>
                                            <div className="d-flex align-items-center gap-2 text-success fw-medium">
                                                <i className="bi bi-check-circle-fill"></i> Active
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="info-item">
                                            <label className="text-white opacity-50 small text-uppercase fw-semibold letter-spacing-1 mb-1">Member Since</label>
                                            <div className="text-white h5 mb-0">Jan 2026</div> {/* Placeholder for created_at if not available */}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="info-item">
                                            <label className="text-white opacity-50 small text-uppercase fw-semibold letter-spacing-1 mb-1">API Access</label>
                                            <div className="text-white h5 mb-0">Enabled</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Usage Stats with Visual Progress */}
                            <div className="glass-panel p-4 flex-grow-1">
                                <h3 className="h5 text-white fw-bold mb-4 d-flex align-items-center gap-2">
                                    <i className="bi bi-graph-up text-primary"></i> Plan Usage
                                </h3>

                                {/* Documents Usage */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-end mb-2">
                                        <label className="text-white fw-medium">Document Storage</label>
                                        <span className="text-white opacity-75 small">
                                            <strong className="text-white">{user.doc_count}</strong> / {user.max_docs} Docs
                                        </span>
                                    </div>
                                    <div className="progress bg-white bg-opacity-10" style={{ height: '8px' }}>
                                        <div
                                            className={`progress-bar ${usagePercent > 90 ? 'bg-danger' : 'bg-primary'}`}
                                            role="progressbar"
                                            style={{ width: `${usagePercent}%` }}
                                            aria-valuenow={usagePercent}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        ></div>
                                    </div>
                                </div>

                                {/* Feature Limits Grid */}
                                <div className="row g-3 mt-2">
                                    <div className="col-sm-6">
                                        <div className="feature-limit-card p-3 rounded-3 bg-white border-0 shadow-sm">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="feature-icon text-info bg-info bg-opacity-10 p-2 rounded">
                                                    <i className="bi bi-chat-left-text"></i>
                                                </div>
                                                <div>
                                                    <div className="text-black small fw-bolder">Chat Queries</div>
                                                    <div className="text-black extra-small fw-bolder">Unlimited</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="feature-limit-card p-3 rounded-3 bg-white border-0 shadow-sm">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="feature-icon text-warning bg-warning bg-opacity-10 p-2 rounded">
                                                    <i className="bi bi-people"></i>
                                                </div>
                                                <div>
                                                    <div className="text-black small fw-bolder">Team Seats</div>
                                                    <div className="text-black extra-small fw-bolder">3/5 Used</div>
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
                    <p className="text-white opacity-50 small">
                        Need to change your password or security settings?
                        <Link href="/settings" className="text-primary ms-1 text-decoration-none hover-underline">
                            Go to Settings
                        </Link>
                    </p>
                </div>
            </main>

            <style jsx>{`
                .profile-avatar-lg {
                    width: 120px;
                    height: 120px;
                    background: var(--primary-gradient);
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    font-weight: 700;
                    color: white;
                    box-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
                }

                .hover-danger:hover {
                    background: rgba(220, 53, 69, 0.1) !important;
                    border-color: #dc3545 !important;
                }

                .extra-small {
                    font-size: 0.75rem;
                }
            `}</style>
        </div>
    );
}
