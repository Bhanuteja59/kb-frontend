/**
 * Organization-Specific Embed Page
 * 
 * This page renders a chatbot widget for a specific organization.
 * It's designed to be embedded in an iframe on external websites.
 * 
 * URL: /embed/[org]
 * Example: /embed/acme-corporation
 */

"use client"


import ChatWidget from "../../components/chat/ChatWidget";
import { use, useEffect, useState } from 'react';
import { API_BASE } from "../../lib/constants";

export default function EmbedPage({ params }) {
    // Extract organization slug from URL parameters
    const { org } = use(params);
    const [status, setStatus] = useState('loading'); // loading, valid, invalid

    useEffect(() => {
        async function checkOrg() {
            try {
                // Determine API URL (handle both relative proxy and absolute URL if needed, rely on API_BASE)
                const res = await fetch(`${API_BASE}/public/org/${org}`);
                if (res.ok) {
                    setStatus('valid');
                } else {
                    setStatus('invalid');
                }
            } catch (error) {
                console.error("Validation failed:", error);
                setStatus('invalid');
            }
        }
        checkOrg();
    }, [org]);

    if (status === 'loading') {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (status === 'invalid') {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="card shadow-lg border-0 text-center p-5" style={{ maxWidth: '400px' }}>
                    <div className="mb-4 text-danger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-shield-lock-fill" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5z" />
                        </svg>
                    </div>
                    <h3 className="h4 mb-3">Unauthorized Access</h3>
                    <p className="text-muted mb-4">
                        This chatbot is not authorized for use or the configuration is invalid.
                    </p>
                    <a href="/" className="btn btn-primary w-100 rounded-pill">
                        Get Your Own Chatbot
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            backgroundColor: '#f8fafc'
        }}>
            {/* 
                Render ChatWidget in embedded mode
                - embedded={true}: Shows full-screen chat interface
                - org={org}: Filters queries to this organization's documents
            */}
            <ChatWidget
                embedded={true}
                org={org}
            />
        </div>
    );
}
