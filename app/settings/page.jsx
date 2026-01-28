"use client";
import { useEffect, useState } from "react";
import Topbar from "../components/layout/Topbar";
import { getMe } from "../lib/api";

export default function SettingsPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMe().then(u => {
            setUser(u);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    if (loading) return null;
    if (!user) return <div className="container">Please login to view settings.</div>;

    // Use org_slug if available, otherwise org_id
    // const orgIdentifier = user.org_slug || user.org_id; // Kept as it might be useful, but logic was for embed


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
                                const current = user.auth_provider === 'google' ? "dummy" : e.target.current.value;
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
                                    // Refresh user to see provider update
                                    window.location.reload();
                                } catch (err) {
                                    alert(err.message || "Failed to change password");
                                }
                            }}
                        >
                            {user.auth_provider !== 'google' && (
                                <div className="mb-3">
                                    <input name="current" type="password" className="form-control" placeholder="Current Password" required />
                                </div>
                            )}
                            {user.auth_provider === 'google' && (
                                <div className="alert alert-info py-2 small">
                                    <i className="bi bi-info-circle me-2"></i>
                                    You signed in with Google. You can set a password here to login with email/password as well.
                                </div>
                            )}
                            <div className="mb-3">
                                <input name="newPass" type="password" className="form-control" placeholder="New Password" required minLength={8} />
                            </div>
                            <div className="mb-3">
                                <input name="confirmPass" type="password" className="form-control" placeholder="Confirm New Password" required minLength={8} />
                            </div>
                            <button className="btn btn-danger">
                                {user.auth_provider === 'google' ? "Set Password" : "Update Password"}
                            </button>
                        </form>
                    </div>
                </div>


            </div>
        </>
    );
}
