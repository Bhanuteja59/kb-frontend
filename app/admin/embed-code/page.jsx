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
        <>
            <Topbar />
            <div className="container py-5">
                <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: 800 }}>
                    <div className="card-body p-4 p-md-5">
                        <div className="text-center mb-4">
                            <h1 className="h2 mb-2">📝 Embed Code</h1>
                            <p className="text-muted">
                                Add this code to your website to embed the chatbot widget.
                            </p>
                        </div>

                        {/* Embed Code Display */}
                        <div className="position-relative bg-light p-4 rounded-3 border mb-4">
                            <code className="d-block text-break font-monospace" style={{ color: "#d63384" }}>
                                {getEmbedCode()}
                            </code>

                            <button
                                onClick={copyToClipboard}
                                className={`btn btn-sm ${copied ? 'btn-success' : 'btn-outline-primary'} position-absolute top-0 end-0 m-2`}
                            >
                                {copied ? (
                                    <><i className="bi bi-check-lg me-1"></i>Copied!</>
                                ) : (
                                    <><i className="bi bi-clipboard me-1"></i>Copy</>
                                )}
                            </button>
                        </div>

                        {/* Instructions */}
                        <div className="mb-4">
                            <h3 className="h5 mb-3">Instructions</h3>
                            <ol className="list-group list-group-numbered list-group-flush">
                                <li className="list-group-item border-0 ps-0">
                                    Copy the embed code above.
                                </li>
                                <li className="list-group-item border-0 ps-0">
                                    Paste it into your website&apos;s HTML, just before the closing <code className="bg-light px-1 rounded">&lt;/body&gt;</code> tag.
                                </li>
                                <li className="list-group-item border-0 ps-0">
                                    The chatbot widget will appear in the bottom-right corner of your website.
                                </li>
                                <li className="list-group-item border-0 ps-0">
                                    The chatbot will only access documents uploaded to your organization: <strong>{orgSlug}</strong>
                                </li>
                            </ol>
                        </div>

                        {/* Preview Link */}
                        <div className="alert alert-info d-flex align-items-center justify-content-between mb-4" role="alert">
                            <div>
                                <h3 className="h6 alert-heading mb-1">Preview</h3>
                                <p className="mb-0 small">View the embedded chatbot in full-screen mode.</p>
                            </div>
                            <a
                                href={`/embed/${orgSlug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary btn-sm text-nowrap ms-3"
                            >
                                Open Preview <i className="bi bi-arrow-right ms-1"></i>
                            </a>
                        </div>

                        {/* Tips */}
                        <div className="alert alert-warning d-flex mb-0" role="alert">
                            <i className="bi bi-lightbulb-fill me-3 fs-5"></i>
                            <div>
                                <h4 className="h6 alert-heading">Tips</h4>
                                <ul className="mb-0 small ps-3">
                                    <li>Upload documents in the Documents section to populate the knowledge base.</li>
                                    <li>The chatbot will automatically use your organization&apos;s documents to answer questions.</li>
                                    <li>You can customize the widget appearance by modifying the <code className="text-dark">widget.js</code> file (if self-hosting).</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}
