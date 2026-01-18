"use client";
import { useEffect, useState } from "react";
import Topbar from "../components/layout/Topbar";
import { getMe } from "../lib/api";

export default function IntegrationsPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        getMe().then(u => {
            setUser(u);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    if (loading) return null;
    if (!user) return <div className="container text-center mt-5 text-white">Please login to view integrations.</div>;

    const orgIdentifier = user.org_slug || user.org_id;
    // Assume frontend URL is origin. If running locally, it's localhost:3000.
    // Ideally, this should come from an ENV var if the widget is hosted elsewhere, 
    // but for now we'll construct it relative to the current domain or a known base.
    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    // The script tag to embed
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

    return (
        <>
            <Topbar />
            <div className="container py-4 fade-in text-white">
                <div className="text-center mb-5">
                    <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-3" style={{ width: 80, height: 80 }}>
                        <i className="bi bi-code-slash text-primary" style={{ fontSize: '2.5rem' }}></i>
                    </div>
                    <h1 className="h2 fw-bold text-white">Integrations & Embeds</h1>
                    <p className="text-light opacity-75" style={{ maxWidth: 600, margin: '0 auto' }}>
                        Seamlessly integrate your RAG Chatbot into any website or application.
                    </p>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="glass-panel overflow-hidden">
                            <div className="glass-header p-4 d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="mb-1 text-white">Web Widget</h5>
                                    <p className="mb-0 text-light opacity-75 small">Standard HTML Embed</p>
                                </div>
                                <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25">Active</span>
                            </div>

                            <div className="p-4 bg-black bg-opacity-25">
                                <div className="d-flex justify-content-between align-items-end mb-2">
                                    <label className="text-light opacity-50 small text-uppercase fw-bold letter-spacing-1">Installation Code</label>
                                    <button
                                        className={`btn btn-sm ${copied ? 'btn-success' : 'btn-glass'} rounded-pill px-3`}
                                        onClick={handleCopy}
                                    >
                                        {copied ? <><i className="bi bi-check2 me-2"></i>Copied!</> : <><i className="bi bi-clipboard me-2"></i>Copy Code</>}
                                    </button>
                                </div>

                                <div className="position-relative">
                                    <pre className="m-0 p-4 rounded-3 bg-dark border border-secondary border-opacity-25 text-info font-monospace" style={{ textShadow: 'none' }}>
                                        <code>{embedCode}</code>
                                    </pre>
                                </div>

                                <div className="mt-4">
                                    <h6 className="text-white mb-3">Instructions</h6>
                                    <ol className="text-light opacity-75 small ps-3 mb-0 spacing-y-2">
                                        <li className="mb-2">Copy the code snippet above.</li>
                                        <li className="mb-2">Open the HTML file of your website (e.g., <code>index.html</code>).</li>
                                        <li className="mb-2">Paste the snippet just before the closing <code>&lt;/body&gt;</code> tag.</li>
                                        <li>Save and deploy. The chat widget will appear in the bottom-right corner.</li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                        {/* Future Integrations Placeholders */}
                        <div className="row g-4 mt-2">
                            <div className="col-md-6">
                                <div className="glass-panel p-4 h-100 opacity-50 grayscale-hover">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <i className="bi bi-slack display-6"></i>
                                        <h5 className="mb-0 text-white">Slack Bot</h5>
                                    </div>
                                    <p className="text-light opacity-75 small mb-0">Coming soon. Connect your knowledge base directly to Slack channels.</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="glass-panel p-4 h-100 opacity-50 grayscale-hover">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <i className="bi bi-discord display-6"></i>
                                        <h5 className="mb-0 text-white">Discord Bot</h5>
                                    </div>
                                    <p className="text-light opacity-75 small mb-0">Coming soon. Empower your community with instant answers.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </>
    );
}
