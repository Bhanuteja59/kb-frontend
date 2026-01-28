"use client";
import { useEffect, useState } from "react";
import Topbar from "./components/layout/Topbar";
import { apiFetch } from "./lib/api";
import ChatWidget from "./components/chat/ChatWidget";
import Link from "next/link";

export default function Home() {
    const [me, setMe] = useState(null);


    useEffect(() => {
        apiFetch("/auth/me")
            .then(r => r.json())
            .then(u => {
                setMe(u);
            })
            .catch(() => { });
    }, []);

    return (
        <>
            <Topbar />
            <div className="container py-5">

                {/* HERO SECTION */}
                {!me ? (
                    <div className="hero-section text-center fade-in-up">
                        <h1 className="hero-title display-4 fw-bold mb-4 gradient-text">Your Enterprise Knowledge,<br />Instantly Accessible.</h1>
                        <p className="hero-subtitle lead mb-4 text-muted">
                            Transform your documents into an intelligent knowledge base.
                            Securely ingest data, manage access, and empower your team with AI-driven answers.
                        </p>
                        <div className="d-flex gap-3 justify-content-center mb-4">
                            <Link href="/login" className="btn btn-gradient btn-lg pulse">
                                🚀 Get Started
                            </Link>
                            <a href="https://pleach.in" target="_blank" className="btn btn-outline-primary btn-lg hover-lift">
                                Learn More
                            </a>
                        </div>
                        <div className="d-flex gap-3 justify-content-center flex-wrap mt-4">
                            <span className="trust-badge">🔒 256-bit Encryption</span>
                            <span className="trust-badge">✓ GDPR Compliant</span>
                            <span className="trust-badge">⚡ 99.9% Uptime</span>
                        </div>
                    </div>
                ) : (
                    <div className="fade-in">
                        <div className="hero-section text-center mb-5">
                            <h1 className="hero-title mb-3" style={{ fontSize: "2.5rem" }}>
                                Welcome back, {me.full_name?.split(' ')[0]}
                            </h1>
                            <p className="hero-subtitle lead text-muted">
                                You are signed in as <b>{me.role}</b> at <b>{me.org_name || "Your Organization"}</b>.
                            </p>
                        </div>

                        {/* DASHBOARD STATS */}
                        <div className="row mb-5">
                            <div className="col-md-4 mb-4 scale-in">
                                <div className="glass-card h-100 p-4 hover-lift">
                                    <div className="stat-value display-4 fw-bold gradient-text">{me.doc_count || 0}</div>
                                    <div className="stat-label text-muted">📄 Documents Indexed</div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-4 scale-in" style={{ animationDelay: '0.1s' }}>
                                <div className="glass-card h-100 p-4 hover-lift">
                                    <div className="stat-value display-4 fw-bold gradient-text">{me.max_docs || 10}</div>
                                    <div className="stat-label text-muted">📊 Document Limit</div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-4 scale-in" style={{ animationDelay: '0.2s' }}>
                                <div className="glass-card h-100 p-4 hover-lift">
                                    <div className="stat-value display-4 fw-bold gradient-text">{me.plan ? me.plan.toUpperCase() : "FREE"}</div>
                                    <div className="stat-label text-muted">⭐ Current Plan</div>
                                </div>
                            </div>
                        </div>

                        {/* USAGE BAR */}
                        {me.plan && (
                            <div className="card shadow-sm border-0 mb-5 border-start border-4 border-primary p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h3 className="h5 m-0">Storage Usage</h3>
                                    <Link href="/pricing" className="text-primary fw-bold text-decoration-none">Upgrade Plan &rarr;</Link>
                                </div>
                                <div className="progress" style={{ height: 12 }}>
                                    <div
                                        className={`progress-bar ${me.doc_count >= me.max_docs ? "bg-danger" : "bg-primary"}`}
                                        role="progressbar"
                                        style={{
                                            width: `${Math.min((me.doc_count / me.max_docs) * 100, 100)}%`,
                                        }}
                                        aria-valuenow={me.doc_count}
                                        aria-valuemin="0"
                                        aria-valuemax={me.max_docs}
                                    />
                                </div>
                                <div className="mt-2 small text-muted">
                                    Using <b>{me.doc_count}</b> of {me.max_docs} available document slots.
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="py-5 text-center">
                    <h2 className="section-title fw-bold mb-3">Turn Information into Intelligence</h2>
                    <p className="hero-subtitle lead text-muted">
                        Our goal is simple: <b>Eliminate the chaos of scattered documents.</b><br />
                        We provide a centralized, secure platform where your organization&apos;s knowledge lives, breathes, and answers questions instantly.
                    </p>
                </div>

                {/* SERVICES GRID */}
                <h2 className="section-title fw-bold mb-4 gradient-text">Comprehensive Services</h2>
                <div className="row g-4 mb-5">
                    <div className="col-md-6 col-lg-4 fade-in-up">
                        <div className="feature-card h-100 p-4 border rounded-3 shadow-sm bg-white hover-lift">
                            <div className="feature-icon mb-3 fs-3">📂</div>
                            <h3 className="h5 fw-bold mb-3">Smart Ingestion</h3>
                            <p className="text-muted mb-0">
                                We support PDF, DOCX, and Google Drive integration. Our system automatically cleans, chunks, and indexes your data, making it ready for AI retrieval in seconds.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div className="feature-card h-100 p-4 border rounded-3 shadow-sm bg-white hover-lift">
                            <div className="feature-icon mb-3 fs-3">🤖</div>
                            <h3 className="h5 fw-bold mb-3">Context-Aware AI</h3>
                            <p className="text-muted mb-0">
                                Unlike generic chatbots, ours understands <i>your</i> business. It retrieves specific paragraphs from your documents to provide accurate, cited answers.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="feature-card h-100 p-4 border rounded-3 shadow-sm bg-white">
                            <div className="feature-icon mb-3 fs-3">🔒</div>
                            <h3 className="h5 fw-bold mb-3">Enterprise-Grade Security</h3>
                            <p className="text-muted mb-0">
                                Your data never leaves your control. With strict Role-Based Access Control (RBAC) and Organization Isolation, sensitive information remains private.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="feature-card h-100 p-4 border rounded-3 shadow-sm bg-white">
                            <div className="feature-icon mb-3 fs-3">⚡</div>
                            <h3 className="h5 fw-bold mb-3">Instant Synchronization</h3>
                            <p className="text-muted mb-0">
                                Update a policy document? The chatbot knows instantly. Soft-delete old files to keep your knowledge base fresh without losing history.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="feature-card h-100 p-4 border rounded-3 shadow-sm bg-white">
                            <div className="feature-icon mb-3 fs-3">📊</div>
                            <h3 className="h5 fw-bold mb-3">Usage & Insights</h3>
                            <p className="text-muted mb-0">
                                Admins get full visibility. Track how many documents are indexed, monitor storage limits, and understand what your users are asking.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="feature-card h-100 p-4 border rounded-3 shadow-sm bg-white">
                            <div className="feature-icon mb-3 fs-3">🚀</div>
                            <h3 className="h5 fw-bold mb-3">Seamless Integration</h3>
                            <p className="text-muted mb-0">
                                Embed our intelligent chat widget on your public website, internal portal, or intranet with just one line of javascript.
                            </p>
                        </div>
                    </div>
                </div>

                {/* HOW IT WORKS */}
                <div className="section-alt py-5 bg-light rounded-3 my-5">
                    <div className="container">
                        <h2 className="section-title text-center fw-bold mb-3">How It Works</h2>
                        <p className="text-center text-muted mb-5">From raw files to intelligent answers in three simple steps.</p>

                        <div className="row g-4 text-center">
                            <div className="col-md-4">
                                <div className="feature-card h-100 p-4 bg-white rounded-3 shadow-sm">
                                    <div className="step-number mx-auto mb-3 fw-bold bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>1</div>
                                    <h3 className="h5 fw-bold mb-3">Upload Sources</h3>
                                    <p className="text-muted mb-0">
                                        Drag and drop your local files or connect your Google Drive folder.
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="feature-card h-100 p-4 bg-white rounded-3 shadow-sm">
                                    <div className="step-number mx-auto mb-3 fw-bold bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>2</div>
                                    <h3 className="h5 fw-bold mb-3">Processing</h3>
                                    <p className="text-muted mb-0">
                                        Our system reads, chunks, and vectorizes your text into a searchable semantic database.
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="feature-card h-100 p-4 bg-white rounded-3 shadow-sm">
                                    <div className="step-number mx-auto mb-3 fw-bold bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>3</div>
                                    <h3 className="h5 fw-bold mb-3">Ask & Answer</h3>
                                    <p className="text-muted mb-0">
                                        Users ask natural language questions and get instant, grounded responses.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ROLES */}
                <div className="py-5">
                    <h2 className="section-title fw-bold mb-3">Designed for Every Role</h2>
                    <p className="hero-subtitle lead text-muted mb-5">
                        We prioritize accessibility and usability, ensuring every team member has the right tools.
                    </p>

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="role-card h-100 p-4 border rounded-3 shadow-sm bg-white border-start border-4 border-primary">
                                <h3 className="h5 fw-bold mb-3">👑 Admins <span className="badge rounded-pill bg-dark ms-2">Full Control</span></h3>
                                <p className="text-muted mb-0">
                                    Complete oversight of the platform. Manage users, billing, API keys, and audit logs. You hold the keys to the kingdom.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="role-card h-100 p-4 border rounded-3 shadow-sm bg-white border-start border-4 border-primary">
                                <h3 className="h5 fw-bold mb-3">🛡️ Managers <span className="badge rounded-pill bg-info text-dark ms-2">Content Ops</span></h3>
                                <p className="text-muted mb-0">
                                    Focused on the knowledge. Upload, organize, and curate documents. Ensure the chatbot says the right things without worrying about billing.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="role-card h-100 p-4 border rounded-3 shadow-sm bg-white border-start border-4 border-primary">
                                <h3 className="h5 fw-bold mb-3">👤 Users <span className="badge rounded-pill bg-secondary ms-2">Consumption</span></h3>
                                <p className="text-muted mb-0">
                                    Reduced noise. Users can browse approved documents and use the chat interface to find answers quickly. Simple and effective.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {me && (
                    <ChatWidget org={me.org_slug || me.org_id} />
                )}
            </div>
        </>
    );
}
