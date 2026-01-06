"use client";
import { useEffect, useState } from "react";
import Topbar from "../components/layout/Topbar";
import { getMe } from "../lib/api";
import { API_BASE } from "../lib/constants";

export default function SettingsPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMe().then(u => {
            console.log("DEBUG: getMe response:", u);
            setUser(u);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    if (loading) return null;
    if (!user) return <div className="container">Please login to view settings.</div>;

    // Use org_slug if available, otherwise org_id
    const orgIdentifier = user.org_slug || user.org_id;

    // Construct Embed URL
    // We assume the frontend URL is the origin
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const embedUrl = `${origin}/embed/${orgIdentifier}`;



    const scriptCode = `<!-- Place this script at the end of your body tag -->
<script src="${origin}/widget.js" data-org-id="${orgIdentifier}" defer></script>`;

    return (
        <>
            <Topbar />
            <div className="container">
                <h1>Settings</h1>

                <div className="card">
                    <h2>Organization</h2>
                    <p><strong>Org ID:</strong> {user.org_id}</p>
                    <p><strong>Org Slug:</strong> {user.org_slug}</p>
                    <p><strong>Your Role:</strong> {user.role}</p>
                </div>

                {user.role === 'admin' || user.role === 'manager' ? (
                    <div className="card" style={{ marginTop: 20 }}>
                        <h2>Chatbot Embed Code</h2>
                        <p className="muted">
                            Add this chatbot to your website by copying the code below.
                            Ensure your website domain is allowed (CORS to be configured if on different domain).
                        </p>

                        <h3>Embed Script</h3>
                        <div style={{ position: 'relative' }}>
                            <textarea
                                readOnly
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    padding: '10px',
                                    background: '#f5f5f5',
                                    border: '1px solid #ddd',
                                    fontFamily: 'monospace',
                                    fontSize: '13px',
                                    resize: 'none'
                                }}
                                value={scriptCode}
                                onClick={(e) => e.target.select()}
                            />
                        </div>

                        <h3>Direct Link</h3>
                        <a href={embedUrl} target="_blank">{embedUrl}</a>
                    </div>
                ) : null}
            </div>
        </>
    );
}
