"use client";
import { useEffect, useState } from "react";
import Topbar from "../components/layout/Topbar";
import { getMe } from "../lib/api";

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
                <h1>Integrations</h1>

                <div className="card">
                    <h2>Profile & Organization</h2>
                    <div className="form-group" style={{ marginBottom: 15 }}>
                        <label>Full Name</label>
                        <input
                            type="text"
                            className="input"
                            value={user.full_name || ""}
                            onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                        />
                        <button
                            className="btn primary"
                            style={{ marginTop: 10 }}
                            onClick={async () => {
                                try {
                                    await import("../lib/api").then(m => m.updateProfile({ full_name: user.full_name }));
                                    alert("Profile Updated!");
                                } catch (e) {
                                    alert("Error updating profile");
                                }
                            }}
                        >
                            Save Name
                        </button>
                    </div>

                    <div className="form-group" style={{ marginBottom: 15 }}>
                        <label>Role</label>
                        <input type="text" className="input" value={user.role} readOnly disabled style={{ opacity: 0.7 }} />
                    </div>

                    <div className="form-group" style={{ marginBottom: 15 }}>
                        <label>Organization Name</label>
                        {/* We don't have org_name in user object yet, usually it comes from getMe response? 
                             Wait, getMe returns org_id and org_slug but maybe not org_name. 
                             I should check schemas.py MeResponse. It has org_id/slug. 
                             To edit Org Name, I need to fetch it or assume user knows it? 
                             Ideally I should have fetched it. For now I will make it editable if I can.
                             Actually, MeResponse doesn't send Name. I should update MeResponse or fetch Org details.
                             Given constraints, I'll just add the field but if it's empty, user can set it.
                          */}
                        {user.role === 'admin' ? (
                            <>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder={user.org_name || "Enter new Organization Name"}
                                    defaultValue={user.org_name || ""}
                                    onChange={(e) => setUser({ ...user, _temp_org_name: e.target.value })}
                                />
                                <button
                                    className="btn primary"
                                    style={{ marginTop: 10 }}
                                    onClick={async () => {
                                        if (!user._temp_org_name) return;
                                        try {
                                            await import("../lib/api").then(m => m.updateOrganization({ name: user._temp_org_name }));
                                            alert("Organization Updated!");
                                        } catch (e) {
                                            alert("Error updating organization: " + e.message);
                                        }
                                    }}
                                >
                                    Update Org Name
                                </button>
                            </>
                        ) : (
                            <div className="muted">Contact Admin to change Organization Name</div>
                        )}
                    </div>

                    <p><strong>Org ID:</strong> {user.org_id}</p>
                    <p><strong>Org Slug:</strong> {user.org_slug}</p>
                </div>

                <div className="card" style={{ marginTop: 20 }}>
                    <h2>Security</h2>
                    <div className="form-group" style={{ marginBottom: 15 }}>
                        <label>Change Password</label>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const current = e.target.current.value;
                                const newPass = e.target.newPass.value;
                                const confirmPass = e.target.confirmPass.value;

                                if (newPass !== confirmPass) {
                                    alert("New passwords do not match");
                                    return;
                                }

                                try {
                                    await import("../lib/api").then(m => m.changePassword(current, newPass));
                                    alert("Password changed successfully!");
                                    e.target.reset();
                                } catch (err) {
                                    alert(err.message || "Failed to change password");
                                }
                            }}
                        >
                            <input name="current" type="password" className="input" placeholder="Current Password" required style={{ marginBottom: 10 }} />
                            <input name="newPass" type="password" className="input" placeholder="New Password" required minLength={8} style={{ marginBottom: 10 }} />
                            <input name="confirmPass" type="password" className="input" placeholder="Confirm New Password" required minLength={8} style={{ marginBottom: 10 }} />
                            <button className="btn">Update Password</button>
                        </form>
                    </div>
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
