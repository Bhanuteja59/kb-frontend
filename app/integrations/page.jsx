"use client";
import React, { useEffect, useState } from "react";
import Topbar from "../components/layout/Topbar";
import { getMe } from "../lib/api";
import "./integrations.css";


export default function IntegrationsPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('web');

    useEffect(() => {
        getMe().then(u => {
            setUser(u);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <>
                <Topbar />
                <div className="min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </>
        )
    }

    if (!user) return <div className="container text-center mt-5 text-white">Please login to view integrations.</div>;

    const orgIdentifier = user.org_slug || user.org_id;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    const embedCode = `<!-- Add this to the <head> or end of <body> -->
<script 
  src="${origin}/widget.js" 
  data-org-id="${orgIdentifier}" 
  defer
></script>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const IntegrationCard = ({ icon, title, desc, status, upcoming }) => (
        <div className={`glass-panel p-4 h-100 transition-all ${upcoming ? 'opacity-75 grayscale' : 'hover-lift border-primary border-opacity-50 shadow-lg'}`}
            style={{ background: upcoming ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)' }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div className={`rounded-circle d-flex align-items-center justify-content-center ${upcoming ? 'bg-secondary bg-opacity-25' : 'bg-gradient-primary'}`}
                    style={{ width: 50, height: 50 }}>
                    <i className={`bi ${icon} fs-4 text-white`}></i>
                </div>
                {upcoming ? (
                    <span className="badge bg-secondary bg-opacity-25 text-white border border-secondary border-opacity-25 rounded-pill px-3">Coming Soon</span>
                ) : (
                    <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25 rounded-pill px-3 d-flex align-items-center gap-1">
                        <span className="dot bg-success rounded-circle" style={{ width: 6, height: 6 }}></span> Active
                    </span>
                )}
            </div>
            <h5 className="text-white fw-bold mb-2">{title}</h5>
            <p className="text-white opacity-75 small mb-0">{desc}</p>
        </div>
    );

    const handleRequestIntegration = () => {
        const subject = "Requesting New Integration";
        const body = `Hi,\n\nI would like to request an integration for:\n\n[Describe the tool/platform here]\n\nBest,\n${user?.full_name || 'User'}`;
        window.location.href = `mailto:bhanu21reddy@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="light-page min-vh-100 d-flex flex-column">
            <Topbar />
            <div className="background-elements">
            </div>
            <div className="container py-5 position-relative z-index-1 mt-4">

                    {/* Hero Section */}
                    <div className="row justify-content-center mb-5 fade-in-up">
                        <div className="col-lg-8 text-center">
                            <div className="d-inline-flex align-items-center justify-content-center bg-gradient-primary rounded-circle mb-4 shadow-lg pulse-animation" style={{ width: 80, height: 80 }}>
                                <i className="bi bi-grid-1x2-fill fs-1 text-white"></i>
                            </div>
                            <h1 className="display-4 fw-bold mb-3">Integration Hub</h1>
                            <p className="lead text-muted fw-medium">Connect your knowledge base to the tools you use every day.</p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="row g-4">
                        {/* Featured: Web Widget */}
                        <div className="col-lg-8 fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="glass-panel overflow-hidden shadow-sm position-relative" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                                <div className="p-4 p-md-5 position-relative z-1">
                                    <div className="d-flex align-items-center gap-3 mb-5">
                                        <div className="rounded-4 bg-primary bg-opacity-10 p-3 d-flex align-items-center justify-content-center border border-primary border-opacity-25">
                                            <i className="bi bi-window-desktop fs-2 text-primary"></i>
                                        </div>
                                        <div>
                                            <h3 className="fw-bold mb-1">Web Chat Widget</h3>
                                            <p className="text-muted mb-0 fw-medium">Embed our AI concierge on your website in seconds.</p>
                                        </div>
                                        <div className="ms-auto d-none d-md-block">
                                            <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-4 py-2 fw-bold">
                                                <i className="bi bi-check-circle-fill me-2"></i>Enabled
                                            </span>
                                        </div>
                                    </div>

                                    {/* Code Window */}
                                    <div className="mb-5">
                                        <div className="d-flex justify-content-between align-items-end mb-3">
                                            <label className="text-primary small text-uppercase fw-bold letter-spacing-1">Installation Code</label>
                                            <button
                                                className={`btn btn-md ${copied ? 'btn-success' : 'btn-light border'} rounded-pill px-4 transition-all fw-bold shadow-sm`}
                                                onClick={handleCopy}
                                            >
                                                {copied ? <><i className="bi bi-check2 me-2"></i>Copied!</> : <><i className="bi bi-clipboard me-2"></i>Copy Snippet</>}
                                            </button>
                                        </div>

                                        <div className="rounded-3 overflow-hidden bg-dark shadow-lg border" style={{ borderColor: '#334155' }}>
                                            <div className="bg-dark px-3 py-2 border-bottom border-secondary border-opacity-25 d-flex align-items-center gap-2">
                                                <div className="rounded-circle bg-danger" style={{ width: 10, height: 10 }}></div>
                                                <div className="rounded-circle bg-warning" style={{ width: 10, height: 10 }}></div>
                                                <div className="rounded-circle bg-success" style={{ width: 10, height: 10 }}></div>
                                                <span className="ms-3 text-white opacity-25 small font-monospace">widget-install.html</span>
                                            </div>
                                            <pre className="m-0 p-4 text-info font-monospace custom-scrollbar" style={{ textShadow: 'none', background: '#0f172a', fontSize: '0.9rem' }}>
                                                <code style={{ color: '#94a3b8' }}>{embedCode}</code>
                                            </pre>
                                        </div>
                                    </div>

                                    {/* Steps */}
                                    <div className="row g-4">
                                        <div className="col-md-4">
                                            <div className="d-flex gap-3">
                                                <div className="rounded-circle bg-primary bg-opacity-10 text-primary fw-bold d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 32, height: 32 }}>1</div>
                                                <div>
                                                    <h6 className="fw-bold mb-1">Copy Code</h6>
                                                    <p className="text-muted small mb-0 fw-medium">Use the button above to copy the script.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="d-flex gap-3">
                                                <div className="rounded-circle bg-primary bg-opacity-10 text-primary fw-bold d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 32, height: 32 }}>2</div>
                                                <div>
                                                    <h6 className="fw-bold mb-1">Paste in HTML</h6>
                                                    <p className="text-muted small mb-0 fw-medium">Insert before the closing <code className="text-primary fw-bold">&lt;/body&gt;</code> tag.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="d-flex gap-3">
                                                <div className="rounded-circle bg-primary bg-opacity-10 text-primary fw-bold d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 32, height: 32 }}>3</div>
                                                <div>
                                                    <h6 className="fw-bold mb-1">Publish</h6>
                                                    <p className="text-muted small mb-0 fw-medium">Deploy your site. The widget appears instantly.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Other Integrations */}
                        <div className="col-lg-4" style={{ animationDelay: '0.2s' }}>
                            <div className="d-flex flex-column gap-4">
                                <div className="fade-in-up">
                                    <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                        <i className="bi bi-clock-history text-primary"></i> Coming Soon
                                    </h5>
                                    <div className="d-flex flex-column gap-3">
                                        {[
                                            { icon: "bi-slack", title: "Slack", desc: "Answer questions directly in Slack." },
                                            { icon: "bi-discord", title: "Discord", desc: "Community support bot." },
                                            { icon: "bi-microsoft-teams", title: "Teams", desc: "Enterprise retrieval for Teams." }
                                        ].map((item, idx) => (
                                            <div key={idx} className="glass-panel p-3 shadow-sm" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', opacity: 0.8 }}>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="rounded-circle bg-light border d-flex align-items-center justify-content-center shadow-sm" style={{ width: 44, height: 44, flexShrink: 0 }}>
                                                        <i className={`bi ${item.icon} fs-5 text-muted`}></i>
                                                    </div>
                                                    <div>
                                                        <h6 className="fw-bold mb-0">{item.title}</h6>
                                                        <p className="text-muted small mb-0 fw-medium">{item.desc}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Request Card */}
                            <div className="p-4 mt-4 fade-in-up border-0 shadow-lg text-white" style={{ background: 'var(--primary-gradient)', borderRadius: '20px' }}>
                                <i className="bi bi-lightbulb fs-3 text-warning mb-3 d-block"></i>
                                <h5 className="fw-bold">Need a specific integration?</h5>
                                <p className="opacity-90 small fw-medium">We are constantly adding new platforms. Let us know what you need.</p>
                                <button
                                    className="btn btn-md btn-white w-100 fw-bold mt-2 shadow-sm"
                                    style={{ background: '#fff', color: 'var(--primary)', borderRadius: '12px' }}
                                    onClick={handleRequestIntegration}
                                >
                                    Request Integration
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </div>
    );
}
