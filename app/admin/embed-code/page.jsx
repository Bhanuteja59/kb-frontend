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
                <div className="container">
                    <p>Loading...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Topbar />
            <div className="container">
                <div className="card" style={{ maxWidth: 800 }}>
                    <h1 style={{ marginTop: 0 }}>📝 Embed Code</h1>
                    <p className="muted">
                        Add this code to your website to embed the chatbot widget.
                    </p>

                    {/* Embed Code Display */}
                    <div style={{
                        backgroundColor: "#f5f5f5",
                        padding: "20px",
                        borderRadius: "8px",
                        marginTop: "20px",
                        fontFamily: "monospace",
                        position: "relative"
                    }}>
                        <code style={{ wordBreak: "break-all" }}>
                            {getEmbedCode()}
                        </code>

                        {/* Copy Button */}
                        <button
                            onClick={copyToClipboard}
                            className="btn"
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                padding: "8px 16px",
                                fontSize: "14px"
                            }}
                        >
                            {copied ? "✓ Copied!" : "Copy"}
                        </button>
                    </div>

                    {/* Instructions */}
                    <div style={{ marginTop: "30px" }}>
                        <h3>Instructions</h3>
                        <ol style={{ lineHeight: "1.8" }}>
                            <li>
                                Copy the embed code above
                            </li>
                            <li>
                                Paste it into your website's HTML, just before the closing <code>&lt;/body&gt;</code> tag
                            </li>
                            <li>
                                The chatbot widget will appear in the bottom-right corner of your website
                            </li>
                            <li>
                                The chatbot will only access documents uploaded to your organization: <strong>{orgSlug}</strong>
                            </li>
                        </ol>
                    </div>

                    {/* Preview Link */}
                    <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f0f9ff", borderRadius: "8px" }}>
                        <h3 style={{ marginTop: 0 }}>Preview</h3>
                        <p>
                            View the embedded chatbot in full-screen mode:
                        </p>
                        <a
                            href={`/embed/${orgSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn"
                        >
                            Open Preview →
                        </a>
                    </div>

                    {/* Tips */}
                    <div style={{ marginTop: "30px", padding: "15px", backgroundColor: "#fffbeb", borderRadius: "8px", borderLeft: "4px solid #f59e0b" }}>
                        <h4 style={{ marginTop: 0, color: "#92400e" }}>💡 Tips</h4>
                        <ul style={{ marginBottom: 0, color: "#78350f" }}>
                            <li>Upload documents in the Documents section to populate the knowledge base</li>
                            <li>The chatbot will automatically use your organization's documents to answer questions</li>
                            <li>You can customize the widget appearance by modifying the widget.js file</li>
                        </ul>
                    </div>
                </div>
            </div >
        </>
    );
}
