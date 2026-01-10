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
            <div className="container py-4 fade-in">
                <h1 className="h2 mb-4">Settings</h1>

                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-header bg-white py-3">
                        <h2 className="h5 m-0 text-primary">Profile & Organization</h2>
                    </div>
                    <div className="card-body">
                        <div className="mb-3">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={user.full_name || ""}
                                onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                            />
                            <button
                                className="btn btn-primary mt-2"
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

                        <div className="mb-3">
                            <label className="form-label">Role</label>
                            <input type="text" className="form-control bg-light" value={user.role} readOnly disabled />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Organization Name</label>
                            {user.role === 'admin' ? (
                                <>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={user.org_name || "Enter new Organization Name"}
                                        defaultValue={user.org_name || ""}
                                        onChange={(e) => setUser({ ...user, _temp_org_name: e.target.value })}
                                    />
                                    <button
                                        className="btn btn-primary mt-2"
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
                                <div className="text-muted small">Contact Admin to change Organization Name</div>
                            )}
                        </div>

                        <div className="row g-3 text-muted small mt-2">
                            <div className="col-md-6">
                                <strong>Org ID:</strong> <code className="text-dark">{user.org_id}</code>
                            </div>
                            <div className="col-md-6">
                                <strong>Org Slug:</strong> <code className="text-dark">{user.org_slug}</code>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-header bg-white py-3">
                        <h2 className="h5 m-0 text-danger">Security</h2>
                    </div>
                    <div className="card-body">
                        <h3 className="h6 mb-3">Change Password</h3>
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
                            <div className="mb-3">
                                <input name="current" type="password" className="form-control" placeholder="Current Password" required />
                            </div>
                            <div className="mb-3">
                                <input name="newPass" type="password" className="form-control" placeholder="New Password" required minLength={8} />
                            </div>
                            <div className="mb-3">
                                <input name="confirmPass" type="password" className="form-control" placeholder="Confirm New Password" required minLength={8} />
                            </div>
                            <button className="btn btn-danger">Update Password</button>
                        </form>
                    </div>
                </div>

                {(user.role === 'admin' || user.role === 'manager') && (
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-white py-3">
                            <h2 className="h5 m-0">Integrations</h2>
                        </div>
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h3 className="h6 mb-1">Chatbot Embed Code</h3>
                                <p className="text-muted small mb-0">
                                    Get the code to add the chatbot to your website.
                                </p>
                            </div>
                            <a href="/admin/embed-code" className="btn btn-outline-primary">
                                View Embed Code
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
