/**
 * Integration Page
 * 
 * This page centrally manages all third-party integrations.
 * Currently features the Chatbot Embed Code.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "../lib/api";
import Topbar from "../components/layout/Topbar";

export default function IntegrationPage() {
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
        if (typeof window === 'undefined') return '';
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
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h2 m-0">Integrations</h1>
                </div>

                <div className="card shadow-sm border-0 mb-5">
                    <div className="card-header bg-white py-3">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-code-square text-primary me-2 fs-5"></i>
                            <h2 className="h5 m-0 text-dark">Website Embed Widget</h2>
                        </div>
                    </div>
                    <div className="card-body p-4">
                        <div className="row">
                            <div className="col-lg-8">
                                <p className="text-muted mb-4">
                                    Add this code to your website to instantly embed the chatbot widget. It will automatically answer questions using your uploaded documents.
                                </p>

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
                                            <><i className="bi bi-clipboard me-1"></i>Copy Code</>
                                        )}
                                    </button>
                                </div>

                                <h3 className="h6 mb-3">Installation Instructions</h3>
                                <ol className="text-muted small ps-3 mb-4">
                                    <li className="mb-2">Copy the code snippet above.</li>
                                    <li className="mb-2">Paste it into your website&apos;s HTML, just before the closing <code className="bg-light px-1 rounded">&lt;/body&gt;</code> tag.</li>
                                    <li>The widget will appear in the bottom-right corner of your site.</li>
                                </ol>
                            </div>

                            <div className="col-lg-4">
                                <div className="card bg-light border-0 h-100">
                                    <div className="card-body">
                                        <h6 className="fw-bold mb-3">Preview</h6>
                                        <p className="small text-muted mb-3">Test the chatbot in a full-screen standalone view.</p>
                                        <a
                                            href={`/embed/${orgSlug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-outline-dark w-100"
                                        >
                                            Open Full Preview <i className="bi bi-box-arrow-up-right ms-1"></i>
                                        </a>

                                        <hr className="my-4" />

                                        <div className="d-flex align-items-start">
                                            <i className="bi bi-info-circle-fill text-info me-2 mt-1"></i>
                                            <p className="small text-muted mb-0">
                                                This widget is linked to organization: <strong>{orgSlug}</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
