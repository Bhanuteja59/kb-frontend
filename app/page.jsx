"use client";
import { useEffect } from "react";
import "./landing.css";
import Topbar from "./components/layout/Topbar";
import ChatWidget from "./components/chat/ChatWidget";
import Link from "next/link";
import { useAuth } from "./hooks/useAuth";

const services = [
    {
        icon: "bi-cloud-arrow-up",
        title: "Smart Data Ingestion",
        desc: "Upload PDFs, DOCX, or connect directly to Google Drive. Documents are automatically sanitized, chunked, and indexed for immediate retrieval.",
    },
    {
        icon: "bi-chat-left-dots",
        title: "Context-Aware Intelligence",
        desc: "Our engine retrieves precise paragraphs from your proprietary data, grounding every answer in absolute truth rather than generic training data.",
    },
    {
        icon: "bi-shield-lock",
        title: "Enterprise Grade Security",
        desc: "Your data is encrypted at rest and in transit. Private RAG architecture ensures your proprietary knowledge never leaks into public models.",
    },
    {
        icon: "bi-bar-chart-line",
        title: "Comprehensive Audit Logs",
        desc: "Administrators gain full visibility into system usage, document processing limits, and team engagement metrics across the platform.",
    },
    {
        icon: "bi-code-slash",
        title: "Frictionless Integration",
        desc: "Embed our highly secure chat interface into any internal portal or website with a single, lightweight JavaScript snippet.",
    },
];

const quickActions = [
    { href: "/documents", icon: "bi-folder2-open", label: "Documents", sub: "Browse & search" },
    { href: "/upload", icon: "bi-cloud-upload", label: "Upload", sub: "Add new files" },
    { href: "/pricing", icon: "bi-gem", label: "Pricing", sub: "View plans" },
];

export default function Home() {
    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading) return;
        const observer = new IntersectionObserver(
            entries => entries.forEach(e => {
                if (e.isIntersecting) e.target.classList.add("visible");
            }),
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );
        document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [loading]);

    if (loading) return <Topbar />;

    return (
        <div className="light-page d-flex flex-column">
            <Topbar />
            <div className="background-elements"></div>
            
            <div className="container py-5 position-relative z-index-1">
                {!user ? (
                    /* ---- LANDING HERO ---- */
                    <div className="row align-items-center py-5 fade-in-up">
                        <div className="col-lg-6 pe-lg-5 mb-5 mb-lg-0">
                            <div className="section-badge mb-4 d-inline-flex align-items-center gap-2" style={{ padding: '6px 16px', borderRadius: '50px', background: 'rgba(255, 107, 107, 0.1)', color: '#FF6B6B', fontWeight: 600, fontSize: '0.85rem' }}>
                                <i className="bi bi-shield-check"></i> Enterprise Knowledge Management
                            </div>
                            <h1 className="hero-title">
                                Centralize <br />
                                <span className="highlight">Your Intelligence.</span>
                            </h1>
                            <p className="lead text-muted mb-5" style={{ maxWidth: '540px', fontSize: '1.2rem', lineHeight: 1.6 }}>
                                Securely transform your scattered documentation into an intelligent, instantly accessible knowledge base. Empower your workforce with precise answers derived exclusively from your proprietary data.
                            </p>
                            <div className="d-flex gap-3 flex-wrap">
                                <Link href="/login" className="btn btn-gradient btn-lg d-inline-flex align-items-center gap-2">
                                    Deploy Now <i className="bi bi-arrow-right"></i>
                                </Link>
                                <a href="#features" className="btn btn-outline-light btn-lg" style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#ccd6f6' }}>
                                    Explore Features
                                </a>
                            </div>
                            
                            <div className="mt-5 pt-4 border-top" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                                <p className="text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: '#8892b0' }}>Trusted by Industry Leaders</p>
                                <div className="d-flex gap-4 opacity-50">
                                    <i className="bi bi-microsoft fs-4"></i>
                                    <i className="bi bi-google fs-4"></i>
                                    <i className="bi bi-amazon fs-4"></i>
                                    <i className="bi bi-apple fs-4"></i>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="position-relative">
                                {/* The user should place the hero_data_nodes image here */}
                                <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.15)', border: '1px solid var(--border)' }}>
                                    <img 
                                        src="/images/hero_bg.png" 
                                        alt="Data Nodes Visualization" 
                                        style={{ width: '100%', height: 'auto', display: 'block', backgroundColor: 'var(--bg-surface)', minHeight: '400px' }}
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80'; }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ---- AUTHENTICATED DASHBOARD ---- */
                    <div className="fade-in">
                         <div className="mb-5 border-bottom pb-4" style={{ borderColor: 'var(--border)' }}>
                            <h1 className="h3 fw-bold mb-1">
                                Dashboard Overview
                            </h1>
                            <p className="text-muted mb-0">
                                Welcome back, {user.full_name?.split(" ")[0]}. You are connected to <strong>{user.org_name || "your organization"}</strong>.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="row g-4 mb-5">
                            {[
                                { icon: "bi-file-earmark-text", label: "Documents Indexed", value: user.doc_count ?? 0 },
                                { icon: "bi-hdd-network", label: "Storage Capacity", value: user.max_docs ?? 10 },
                                { icon: "bi-shield-check", label: "Security Tier", value: user.plan ?? "Standard", upper: true },
                            ].map(({ icon, label, value, upper }, i) => (
                                <div className="col-md-4" key={label}>
                                    <div
                                        className="glass-panel h-100 p-4 reveal"
                                        style={{ transitionDelay: `${i * 0.1}s` }}
                                    >
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <div
                                                className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{ width: 44, height: 44, background: "rgba(255, 107, 107, 0.1)" }}
                                            >
                                                <i className={`bi ${icon} text-primary fs-5`}></i>
                                            </div>
                                            <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>{label}</span>
                                        </div>
                                        <div className={`display-6 fw-bold stat-value ${upper ? "text-uppercase" : ""}`}>
                                            {value}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Usage bar */}
                        {user.plan && (
                            <div className="glass-panel mb-5 p-4 reveal">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h3 className="h6 fw-bold m-0">System Resource Usage</h3>
                                    <Link href="/pricing" className="text-primary small fw-bold text-decoration-none">
                                        Manage Subscription <i className="bi bi-arrow-right ms-1"></i>
                                    </Link>
                                </div>
                                <div className="progress" style={{ height: 8, borderRadius: 4, background: 'var(--border)' }}>
                                    <div
                                        className={`progress-bar ${(user.doc_count ?? 0) >= (user.max_docs ?? 10) ? "bg-danger" : "bg-primary"}`}
                                        role="progressbar"
                                        style={{ width: `${Math.min(((user.doc_count ?? 0) / (user.max_docs ?? 10)) * 100, 100)}%`, borderRadius: 4 }}
                                        aria-valuenow={user.doc_count}
                                        aria-valuemin="0"
                                        aria-valuemax={user.max_docs}
                                    />
                                </div>
                                <div className="mt-3 small text-muted">
                                    Utilizing <strong style={{color: 'var(--text-main)'}}>{user.doc_count ?? 0}</strong> out of <strong style={{color: 'var(--text-main)'}}>{user.max_docs ?? 10}</strong> available document nodes.
                                </div>
                            </div>
                        )}

                        {/* Quick actions */}
                        <h2 className="h6 fw-bold text-uppercase text-muted mb-4" style={{ letterSpacing: "0.06em" }}>Quick Actions</h2>
                        <div className="row g-3 mb-5">
                            {quickActions
                                .map((a, i) => (
                                    <div className="col-6 col-md-4" key={a.href}>
                                        <Link href={a.href} className="text-decoration-none">
                                            <div
                                                className="glass-panel p-4 d-flex align-items-center gap-3 hover-lift h-100 reveal"
                                                style={{ transitionDelay: `${i * 0.08}s` }}
                                            >
                                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 107, 107, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <i className={`bi ${a.icon} fs-4 text-primary`}></i>
                                                </div>
                                                <div>
                                                    <div className="fw-bold mb-1">{a.label}</div>
                                                    <div className="text-muted" style={{ fontSize: "0.8rem" }}>{a.sub}</div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {!user && (
                    <>
                        {/* ---- FEATURE SPOTLIGHT 1 ---- */}
                        <div id="features" className="row align-items-center py-5 my-5 reveal">
                            <div className="col-lg-5 order-lg-2 mb-4 mb-lg-0">
                                <h2 className="section-title">Impenetrable Data Vault</h2>
                                <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                                    Our architecture is built on a foundation of zero-trust security. 
                                    Your documents are encrypted at rest and in transit, ensuring that your proprietary knowledge remains strictly yours.
                                </p>
                                <ul className="list-unstyled d-flex flex-column gap-3 text-muted">
                                    <li><i className="bi bi-check-circle-fill text-primary me-2"></i> SOC2 Type II Compliant Infrastructure</li>
                                    <li><i className="bi bi-check-circle-fill text-primary me-2"></i> Strict Tenant Isolation</li>
                                    <li><i className="bi bi-check-circle-fill text-primary me-2"></i> Role-Based Access Controls (RBAC)</li>
                                </ul>
                            </div>
                            <div className="col-lg-7 order-lg-1 pe-lg-5">
                                <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.15)', border: '1px solid var(--border)' }}>
                                    <img 
                                        src="/images/feature_vault.png" 
                                        alt="Secure Vault" 
                                        style={{ width: '100%', height: 'auto', display: 'block', backgroundColor: 'var(--bg-surface)', minHeight: '350px' }}
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80'; }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ---- SERVICES GRID ---- */}
                        <div className="py-5 my-5">
                            <div className="reveal text-center mb-5">
                                <h2 className="section-title">Uncompromising Capabilities</h2>
                                <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                                    A platform designed for high-performance teams that demand accuracy, security, and absolute reliability.
                                </p>
                            </div>
                            <div className="row g-4">
                                {services.map((s, i) => (
                                    <div key={s.title} className="col-md-6 col-lg-4">
                                        <div
                                            className="glass-panel h-100 p-4 hover-lift reveal"
                                            style={{ transitionDelay: `${i * 0.08}s` }}
                                        >
                                            <div className="feature-icon mb-4">
                                                <i className={`bi ${s.icon}`}></i>
                                            </div>
                                            <h3 className="h5 fw-bold mb-3">{s.title}</h3>
                                            <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ---- HOW IT WORKS ---- */}
                        <div className="glass-panel py-5 px-4 my-5" style={{ borderRadius: '24px' }}>
                            <div className="reveal">
                                <h2 className="section-title text-center mb-5">Streamlined Operational Flow</h2>
                            </div>

                            <div className="row g-4 text-center">
                                {[
                                    { step: 1, title: "Connect Sources", desc: "Integrate your existing data silos securely via our robust API or direct file upload." },
                                    { step: 2, title: "Algorithmic Indexing", desc: "Our system parses, sanitizes, and vectors your documents into a high-dimensional database." },
                                    { step: 3, title: "Deploy Intelligence", desc: "Integrate our chat widget and immediately begin extracting precise answers." },
                                ].map(({ step, title, desc }, i) => (
                                    <div key={step} className="col-md-4">
                                        <div
                                            className="p-4 reveal"
                                            style={{ transitionDelay: `${i * 0.12}s` }}
                                        >
                                            <div className="step-number mb-4 shadow-sm">{step}</div>
                                            <h3 className="h5 fw-bold mb-3">{title}</h3>
                                            <p className="text-muted mb-0">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {user && (
                    <ChatWidget org={user.org_slug || user.org_id} />
                )}
            </div>
        </div>
    );
}
