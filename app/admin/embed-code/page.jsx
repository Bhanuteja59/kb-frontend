/**
 * Embed Code Display Page
 * 
 * This page shows users their organization's embed code
 * for integrating the chatbot on external websites.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "../../lib/api";
import Topbar from "../../components/layout/Topbar";

export default function EmbedCodePage() {
    const router = useRouter();
    const [orgSlug, setOrgSlug] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Fetch user's organization slug
    useEffect(() => {
        async function loadUser() {
            try {
                const user = await getMe();
                setOrgSlug(user.org_slug);
            } catch (e) {
                console.error("Failed to load user:", e);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    }, [router]);

    // Copy embed code to clipboard
    function copyToClipboard() {
        const code = getEmbedCode();
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    // Generate embed code
    function getEmbedCode() {
        // Get current domain (in production, use actual domain)
        const domain = window.location.origin;
        return `<script data-org="${orgSlug}" src="${domain}/widget.js"></script>`;
    }

    if (loading) {
        return (
            <>
                <Topbar />
                <div className="container py-5 text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="light-page min-vh-100 d-flex flex-column">
            <Topbar />
            <div className="container py-5 fade-in">
                <div className="page-card shadow-sm border mx-auto" style={{ maxWidth: 800, borderColor: 'var(--border)' }}>
                    <div className="card-body p-4 p-md-5">
                        <div className="text-center mb-5">
                            <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-3" style={{ width: 64, height: 64 }}>
                                <i className="bi bi-code-square text-primary fs-2"></i>
                            </div>
                            <h1 className="h2 fw-bold mb-2 text-dark">Embed Code</h1>
                            <p className="text-muted fw-medium">
                                Add this code to your website to embed the chatbot widget.
                            </p>
                        </div>

                        {/* Embed Code Display */}
                        <div className="position-relative bg-light p-4 rounded-3 border mb-5" style={{ borderColor: 'var(--border)' }}>
                            <code className="d-block text-break font-monospace fw-bold" style={{ color: "var(--primary)" }}>
                                {getEmbedCode()}
                            </code>

                            <button
                                onClick={copyToClipboard}
                                className={`btn btn-sm ${copied ? 'btn-success' : 'btn-dark'} position-absolute top-0 end-0 m-2 rounded-pill px-3 fw-bold shadow-sm`}
                            >
                                {copied ? (
                                    <><i className="bi bi-check-lg me-1"></i>Copied!</>
                                ) : (
                                    <><i className="bi bi-clipboard me-1"></i>Copy</>
                                )}
                            </button>
                        </div>

                        {/* Instructions */}
                        <div className="mb-5">
                            <h3 className="h5 mb-4 fw-bold text-dark">Instructions</h3>
                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex gap-3 align-items-start">
                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold" style={{ width: 24, height: 24, fontSize: '0.8rem' }}>1</div>
                                    <p className="mb-0 text-muted fw-medium">Copy the embed code above.</p>
                                </div>
                                <div className="d-flex gap-3 align-items-start">
                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold" style={{ width: 24, height: 24, fontSize: '0.8rem' }}>2</div>
                                    <p className="mb-0 text-muted fw-medium">Paste it into your website&apos;s HTML, just before the closing <code className="bg-white border px-1 rounded text-dark">&lt;/body&gt;</code> tag.</p>
                                </div>
                                <div className="d-flex gap-3 align-items-start">
                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold" style={{ width: 24, height: 24, fontSize: '0.8rem' }}>3</div>
                                    <p className="mb-0 text-muted fw-medium">The chatbot widget will appear in the bottom-right corner of your website.</p>
                                </div>
                                <div className="d-flex gap-3 align-items-start">
                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold" style={{ width: 24, height: 24, fontSize: '0.8rem' }}>4</div>
                                    <p className="mb-0 text-muted fw-medium">The chatbot will only access documents uploaded to your organization: <strong className="text-dark">{orgSlug}</strong></p>
                                </div>
                            </div>
                        </div>

                        {/* Preview Link */}
                        <div className="bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-4 p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-5" role="alert">
                            <div className="mb-3 mb-md-0">
                                <h3 className="h6 fw-bold text-dark mb-1">Live Preview</h3>
                                <p className="mb-0 text-muted small fw-medium">Test your embedded chatbot in a separate window.</p>
                            </div>
                            <a
                                href={`/embed/${orgSlug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm text-nowrap"
                            >
                                Open Preview <i className="bi bi-arrow-right ms-1"></i>
                            </a>
                        </div>

                        {/* Tips */}
                        <div className="alert alert-warning bg-warning bg-opacity-10 border-warning border-opacity-25 d-flex mb-0 rounded-4 p-4" role="alert">
                            <i className="bi bi-lightbulb-fill me-3 fs-4 text-warning"></i>
                            <div>
                                <h4 className="h6 fw-bold text-dark mb-2">Pro Tips</h4>
                                <ul className="mb-0 small ps-3 text-muted fw-medium">
                                    <li>Upload documents in the <strong className="text-dark">Documents</strong> section to populate the knowledge base.</li>
                                    <li>The chatbot will automatically use your organization&apos;s documents to answer questions.</li>
                                    <li>Changes to your knowledge base are reflected in real-time on your embedded widget.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
