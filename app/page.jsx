"use client";
import { useEffect, useState } from "react";
import Topbar from "./components/layout/Topbar";
import { apiFetch } from "./lib/api";
import ChatWidget from "./components/chat/ChatWidget";
import Link from "next/link";

export default function Home() {
    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch("/auth/me")
            .then(r => r.json())
            .then(u => {
                setMe(u);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <>
            <Topbar />
            <div className="container">

                {/* HERO SECTION */}
                {!me ? (
                    <div className="hero-section fade-in">
                        <h1 className="hero-title">Your Enterprise Knowledge,<br />Instantly Accessible.</h1>
                        <p className="hero-subtitle">
                            Transform your documents into an intelligent knowledge base.
                            Securely ingest data, manage access, and empower your team with AI-driven answers.
                        </p>
                        <div className="g-row" style={{ justifyContent: "center" }}>
                            <Link href="/login" className="btn">
                                Get Started
                            </Link>
                            <a href="https://pleach.in" target="_blank" className="btn secondary">
                                Learn More
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="fade-in">
                        <div className="hero-section" style={{ padding: "40px 0 60px" }}>
                            <h1 className="hero-title" style={{ fontSize: "2.5rem" }}>
                                Welcome back, {me.full_name?.split(' ')[0]}
                            </h1>
                            <p className="hero-subtitle">
                                You are signed in as <b>{me.role}</b> at <b>{me.org_name || "Your Organization"}</b>.
                            </p>
                        </div>

                        {/* DASHBOARD STATS */}
                        <div className="dashboard-grid">
                            <div className="stat-card card">
                                <div className="stat-value">{me.doc_count || 0}</div>
                                <div className="stat-label">Documents Indexed</div>
                            </div>
                            <div className="stat-card card">
                                <div className="stat-value">{me.max_docs || 10}</div>
                                <div className="stat-label">Document Limit</div>
                            </div>
                            <div className="stat-card card">
                                <div className="stat-value">{me.plan ? me.plan.toUpperCase() : "FREE"}</div>
                                <div className="stat-label">Current Plan</div>
                            </div>
                        </div>

                        {/* USAGE BAR */}
                        {me.plan && (
                            <div className="card" style={{ borderLeft: "4px solid var(--primary)", marginBottom: "60px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                    <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Storage Usage</h3>
                                    <Link href="/pricing" style={{ fontSize: "0.9rem", color: "var(--primary)", fontWeight: 600 }}>Upgrade Plan &rarr;</Link>
                                </div>
                                <div style={{ height: 12, background: "var(--border)", borderRadius: 6, overflow: "hidden" }}>
                                    <div
                                        style={{
                                            width: `${Math.min((me.doc_count / me.max_docs) * 100, 100)}%`,
                                            background: me.doc_count >= me.max_docs ? "var(--danger)" : "var(--primary)",
                                            height: "100%",
                                            transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                                        }}
                                    />
                                </div>
                                <div style={{ marginTop: 12, fontSize: "0.9rem" }} className="muted">
                                    Using <b>{me.doc_count}</b> of {me.max_docs} available document slots.
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* MISSION SECTION */}
                <div style={{ padding: "80px 0", textAlign: "center" }}>
                    <h2 className="section-title">Turn Information into Intelligence</h2>
                    <p className="hero-subtitle" style={{ fontSize: "1.1rem" }}>
                        Our goal is simple: <b>Eliminate the chaos of scattered documents.</b><br />
                        We provide a centralized, secure platform where your organization's knowledge lives, breathes, and answers questions instantly.
                    </p>
                </div>

                {/* SERVICES GRID */}
                <h2 className="section-title">Comprehensive Services</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📂</div>
                        <h3 className="feature-title">Smart Ingestion</h3>
                        <p className="feature-desc">
                            We support PDF, DOCX, and Google Drive integration. Our system automatically cleans, chunks, and indexes your data, making it ready for AI retrieval in seconds.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🤖</div>
                        <h3 className="feature-title">Context-Aware AI</h3>
                        <p className="feature-desc">
                            Unlike generic chatbots, ours understands <i>your</i> business. It retrieves specific paragraphs from your documents to provide accurate, cited answers.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3 className="feature-title">Enterprise-Grade Security</h3>
                        <p className="feature-desc">
                            Your data never leaves your control. With strict Role-Based Access Control (RBAC) and Organization Isolation, sensitive information remains private.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3 className="feature-title">Instant Synchronization</h3>
                        <p className="feature-desc">
                            Update a policy document? The chatbot knows instantly. Soft-delete old files to keep your knowledge base fresh without losing history.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3 className="feature-title">Usage & Insights</h3>
                        <p className="feature-desc">
                            Admins get full visibility. Track how many documents are indexed, monitor storage limits, and understand what your users are asking.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🚀</div>
                        <h3 className="feature-title">Seamless Integration</h3>
                        <p className="feature-desc">
                            Embed our intelligent chat widget on your public website, internal portal, or intranet with just one line of javascript.
                        </p>
                    </div>
                </div>

                {/* HOW IT WORKS */}
                <div className="section-alt">
                    <div className="container">
                        <h2 className="section-title" style={{ textAlign: "center" }}>How It Works</h2>
                        <p className="hero-subtitle" style={{ textAlign: "center" }}>From raw files to intelligent answers in three simple steps.</p>

                        <div className="feature-grid" style={{ marginTop: 40 }}>
                            <div className="feature-card" style={{ textAlign: "center" }}>
                                <div className="step-number">1</div>
                                <h3 className="feature-title">Upload Sources</h3>
                                <p className="feature-desc">
                                    Drag and drop your local files or connect your Google Drive folder.
                                </p>
                            </div>
                            <div className="feature-card" style={{ textAlign: "center" }}>
                                <div className="step-number">2</div>
                                <h3 className="feature-title">Processing</h3>
                                <p className="feature-desc">
                                    Our system reads, chunks, and vectorizes your text into a searchable semantic database.
                                </p>
                            </div>
                            <div className="feature-card" style={{ textAlign: "center" }}>
                                <div className="step-number">3</div>
                                <h3 className="feature-title">Ask & Answer</h3>
                                <p className="feature-desc">
                                    Users ask natural language questions and get instant, grounded responses.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ACCESSIBILITY / ROLES */}
                <div style={{ padding: "80px 0" }}>
                    <h2 className="section-title">Designed for Every Role</h2>
                    <p className="hero-subtitle">
                        We prioritize accessibility and usability, ensuring every team member has the right tools.
                    </p>

                    <div className="dashboard-grid">
                        <div className="role-card">
                            <h3 className="feature-title">👑 Admins <span className="pill" style={{ marginLeft: 8, fontSize: 11 }}>Full Control</span></h3>
                            <p className="muted">
                                Complete oversight of the platform. Manage users, billing, API keys, and audit logs. You hold the keys to the kingdom.
                            </p>
                        </div>
                        <div className="role-card">
                            <h3 className="feature-title">🛡️ Managers <span className="pill" style={{ marginLeft: 8, fontSize: 11 }}>Content Ops</span></h3>
                            <p className="muted">
                                Focused on the knowledge. Upload, organize, and curate documents. Ensure the chatbot says the right things without worrying about billing.
                            </p>
                        </div>
                        <div className="role-card">
                            <h3 className="feature-title">👤 Users <span className="pill" style={{ marginLeft: 8, fontSize: 11 }}>Consumption</span></h3>
                            <p className="muted">
                                Reduced noise. Users can browse approved documents and use the chat interface to find answers quickly. Simple and effective.
                            </p>
                        </div>
                    </div>
                </div>

                <ChatWidget />
            </div>
        </>
    );
}
