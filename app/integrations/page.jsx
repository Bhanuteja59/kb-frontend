"use client";
import React, { useEffect, useState } from "react";
import Topbar from "../components/layout/Topbar";
import { getMe } from "../lib/api";

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
        <>
            <Topbar />
            <div className="container-fluid min-vh-100 text-white pb-5" style={{ background: 'radial-gradient(circle at 80% 10%, rgba(99, 102, 241, 0.1), transparent 60%)' }}>
                <div className="container py-5 mt-4">

                    {/* Hero Section */}
                    <div className="row justify-content-center mb-5 fade-in-up">
                        <div className="col-lg-8 text-center">
                            <div className="d-inline-flex align-items-center justify-content-center bg-gradient-primary rounded-circle mb-4 shadow-lg pulse-animation" style={{ width: 80, height: 80 }}>
                                <i className="bi bi-grid-1x2-fill fs-1 text-white"></i>
                            </div>
                            <h1 className="display-4 fw-bold text-white mb-3">Integration Hub</h1>
                            <p className="lead text-white opacity-75">Connect your knowledge base to the tools you use every day.</p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="row g-4">
                        {/* Featured: Web Widget */}
                        <div className="col-lg-8 fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="glass-panel overflow-hidden border-primary border-opacity-25 position-relative card-shadow-lg">
                                {/* Decorative Glow */}
                                <div className="position-absolute top-0 end-0 bg-primary opacity-10 rounded-circle blur-3xl" style={{ width: '300px', height: '300px', transform: 'translate(30%, -30%)' }}></div>

                                <div className="p-4 p-md-5 position-relative z-1">
                                    <div className="d-flex align-items-center gap-3 mb-5">
                                        <div className="rounded-4 bg-primary bg-opacity-20 p-3 d-flex align-items-center justify-content-center border border-primary border-opacity-25">
                                            <i className="bi bi-window-desktop fs-2 text-primary"></i>
                                        </div>
                                        <div>
                                            <h3 className="fw-bold text-white mb-1">Web Chat Widget</h3>
                                            <p className="text-white opacity-75 mb-0">Embed our AI concierge on your website in seconds.</p>
                                        </div>
                                        <div className="ms-auto d-none d-md-block">
                                            <span className="badge bg-success bg-opacity-25 text-warning border border-success border-opacity-25 rounded-pill px-4 py-2">
                                                <i className="bi bi-check-circle-fill me-2"></i>Enabled
                                            </span>
                                        </div>
                                    </div>

                                    {/* Code Window */}
                                    <div className="mb-5">
                                        <div className="d-flex justify-content-between align-items-end mb-3">
                                            <label className="text-primary small text-uppercase fw-bold letter-spacing-1">Installation Code</label>
                                            <button
                                                className={`btn btn-md ${copied ? 'btn-success' : 'btn-glass'} rounded-pill px-4 transition-all text-warning border-warning`}
                                                onClick={handleCopy}
                                            >
                                                {copied ? <><i className="bi bi-check2 me-2"></i>Copied!</> : <><i className="bi bi-clipboard me-2"></i>Copy Snippet</>}
                                            </button>
                                        </div>

                                        <div className="rounded-3 overflow-hidden bg-dark border border-secondary border-opacity-25 shadow-lg">
                                            <div className="bg-dark-light px-3 py-2 border-bottom border-secondary border-opacity-25 d-flex align-items-center gap-2">
                                                <div className="rounded-circle bg-danger" style={{ width: 10, height: 10 }}></div>
                                                <div className="rounded-circle bg-warning" style={{ width: 10, height: 10 }}></div>
                                                <div className="rounded-circle bg-success" style={{ width: 10, height: 10 }}></div>
                                                <span className="ms-3 text-white opacity-25 small font-monospace">script.js</span>
                                            </div>
                                            <pre className="m-0 p-4 text-info font-monospace custom-scrollbar" style={{ textShadow: 'none', background: '#0d1117' }}>
                                                <code>{embedCode}</code>
                                            </pre>
                                        </div>
                                    </div>

                                    {/* Steps */}
                                    <div className="row g-4">
                                        <div className="col-md-4">
                                            <div className="d-flex gap-3">
                                                <div className="rounded-circle bg-white bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 32, height: 32 }}>1</div>
                                                <div>
                                                    <h6 className="text-white fw-bold mb-1">Copy Code</h6>
                                                    <p className="text-white fw-medium small mb-0">Use the button above to copy the script.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="d-flex gap-3">
                                                <div className="rounded-circle bg-white bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 32, height: 32 }}>2</div>
                                                <div>
                                                    <h6 className="text-white fw-bold mb-1">Paste in HTML</h6>
                                                    <p className="text-white fw-medium small mb-0">Insert before the closing <code className="text-warning fw-bold">&lt;/body&gt;</code> tag.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="d-flex gap-3">
                                                <div className="rounded-circle bg-white bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 32, height: 32 }}>3</div>
                                                <div>
                                                    <h6 className="text-white fw-bold mb-1">Publish</h6>
                                                    <p className="text-white fw-medium small mb-0">Deploy your site. The widget appears instantly.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Other Integrations */}
                        <div className="col-lg-4" style={{ animationDelay: '0.2s' }}>
                            <div className="d-flex flex-column gap-4 text-white">
                                <div className="fade-in-up">
                                    <h5 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
                                        <i className="bi bi-clock-history text-accent"></i> Coming Soon
                                    </h5>
                                    <div className="d-flex flex-column gap-3">
                                        <IntegrationCard
                                            icon="bi-slack"
                                            title="Slack"
                                            desc="Answer questions directly in your team's channels."
                                            upcoming={true}
                                        />
                                        <IntegrationCard
                                            icon="bi-discord"
                                            title="Discord"
                                            desc="Community support bot with role-based access."
                                            upcoming={true}
                                        />
                                        <IntegrationCard
                                            icon="bi-microsoft-teams"
                                            title="Microsoft Teams"
                                            desc="Enterprise knowledge retrieval for Teams."
                                            upcoming={true}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Request Card */}
                            <div className="glass-panel p-4 mt-4 fade-in-up border-0 bg-gradient-to-br from-primary to-purple">
                                <i className="bi bi-lightbulb fs-3 text-warning mb-3 d-block"></i>
                                <h5 className="text-white fw-bold">Need a specific integration?</h5>
                                <p className="text-white opacity-75 small">We are constantly adding new platforms. Let us know what you need.</p>
                                <button
                                    className="btn btn-sm btn-light rounded-pill w-100 text-primary fw-bold"
                                    onClick={handleRequestIntegration}
                                >
                                    Request Integration
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .card-shadow-lg {
                    box-shadow: 
                        0 0 0 1px rgba(255, 255, 255, 0.05),
                        0 20px 50px -12px rgba(0, 0, 0, 0.5), 
                        0 10px 20px -10px rgba(0, 0, 0, 0.4);
                }
                .pulsing-border {
                    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
                    animation: pulse-border 2s infinite;
                }
                @keyframes pulse-border {
                    0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
                }
                .bg-gradient-primary {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                }
                .bg-dark-light {
                    background: #1e293b;
                }
                .grayscale {
                    filter: grayscale(1);
                    opacity: 0.6;
                }
                .hover-lift:hover {
                    transform: translateY(-5px);
                    box-shadow: 
                        0 0 0 1px rgba(99, 102, 241, 0.3),
                        0 20px 40px -10px rgba(0, 0, 0, 0.6),
                        0 0 20px rgba(99, 102, 241, 0.2);
                }
                .transition-all {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .fade-in-up {
                    animation: fadeInUp 0.5s ease-out forwards;
                    opacity: 0;
                    transform: translateY(20px);
                }
                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </>
    );
}
