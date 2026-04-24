"use client";
import { useState } from "react";
import Topbar from "../components/layout/Topbar";
import AuthGuard from "../components/auth/AuthGuard";
import { useAuth } from "../hooks/useAuth";

function InlineAlert({ type, message, onClose }) {
    if (!message) return null;
    return (
        <div className={`alert alert-${type} alert-dismissible d-flex align-items-center gap-2 mt-3 mb-0`} role="alert">
            <i className={`bi ${type === "success" ? "bi-check-circle-fill" : "bi-exclamation-circle-fill"} flex-shrink-0`}></i>
            <div className="flex-grow-1">{message}</div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
        </div>
    );
}

function SettingsContent() {
    const { user } = useAuth();
    const [localUser, setLocalUser] = useState(null);

    const [profileStatus, setProfileStatus] = useState({ type: null, message: null });
    const [orgStatus, setOrgStatus] = useState({ type: null, message: null });
    const [passwordStatus, setPasswordStatus] = useState({ type: null, message: null });

    const [savingProfile, setSavingProfile] = useState(false);
    const [savingOrg, setSavingOrg] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    if (!localUser && user) {
        setLocalUser({ ...user });
    }

    const editUser = localUser || user;
    if (!editUser) return null;

    async function handleSaveName() {
        setSavingProfile(true);
        setProfileStatus({ type: null, message: null });
        try {
            const { updateProfile } = await import("../lib/api");
            await updateProfile({ full_name: editUser.full_name });
            setProfileStatus({ type: "success", message: "Name updated successfully." });
        } catch (e) {
            setProfileStatus({ type: "danger", message: e.message || "Failed to update name." });
        } finally {
            setSavingProfile(false);
        }
    }

    async function handleSaveOrg() {
        if (!editUser._temp_org_name) return;
        setSavingOrg(true);
        setOrgStatus({ type: null, message: null });
        try {
            const { updateOrganization } = await import("../lib/api");
            await updateOrganization({ name: editUser._temp_org_name });
            setLocalUser({ ...editUser, org_name: editUser._temp_org_name, _temp_org_name: undefined });
            setOrgStatus({ type: "success", message: "Organization name updated." });
        } catch (e) {
            setOrgStatus({ type: "danger", message: e.message || "Failed to update organization." });
        } finally {
            setSavingOrg(false);
        }
    }

    async function handleChangePassword(e) {
        e.preventDefault();
        const current = editUser.auth_provider === "google" ? "dummy" : e.target.current.value;
        const newPass = e.target.newPass.value;
        const confirmPass = e.target.confirmPass.value;

        if (newPass !== confirmPass) {
            setPasswordStatus({ type: "danger", message: "New passwords do not match." });
            return;
        }

        setSavingPassword(true);
        setPasswordStatus({ type: null, message: null });
        try {
            const { changePassword } = await import("../lib/api");
            await changePassword(current, newPass);
            setPasswordStatus({ type: "success", message: "Password updated successfully." });
            e.target.reset();
        } catch (err) {
            setPasswordStatus({ type: "danger", message: err.message || "Failed to change password." });
        } finally {
            setSavingPassword(false);
        }
    }

    return (
        <div className="light-page min-vh-100 d-flex flex-column">
            <Topbar />
            <div className="container py-5 fade-in" style={{ maxWidth: 720 }}>

                {/* Page Header */}
                <div className="page-header d-flex align-items-center gap-3">
                    <div className="page-header-icon" style={{ background: 'var(--primary)', boxShadow: '0 4px 12px rgba(255, 107, 107, 0.2)' }}>
                        <i className="bi bi-gear-fill text-white" style={{ fontSize: 20 }}></i>
                    </div>
                    <div>
                        <h1 className="h3 fw-bold mb-0 text-dark">Settings</h1>
                        <p className="text-muted mb-0 small fw-medium">Manage your profile and organization preferences.</p>
                    </div>
                </div>

                {/* Profile & Organization */}
                <div className="page-card mb-4" style={{ borderColor: 'var(--border)' }}>
                    <div className="page-card-header" style={{ background: 'rgba(255,107,107,0.02)', borderColor: 'var(--border)' }}>
                        <div className="header-icon" style={{ background: "rgba(255, 107, 107, 0.1)" }}>
                            <i className="bi bi-person-circle text-primary"></i>
                        </div>
                        <div>
                            <h5 className="mb-0 fw-bold text-dark">Profile &amp; Organization</h5>
                            <p className="text-muted mb-0 fw-medium" style={{ fontSize: "0.8rem" }}>Update your display name and organization</p>
                        </div>
                    </div>
                    <div className="page-card-body p-4">

                        {/* Full Name */}
                        <div className="form-section pb-4 mb-4 border-bottom" style={{ borderColor: 'var(--border)' }}>
                            <label className="form-label fw-bold text-dark mb-2 small">Full Name</label>
                            <div className="d-flex gap-2">
                                <input
                                    type="text"
                                    className="form-control bg-light"
                                    value={editUser.full_name || ""}
                                    onChange={(e) => setLocalUser({ ...editUser, full_name: e.target.value })}
                                    style={{ border: '1px solid var(--border)', color: '#000', borderRadius: '10px' }}
                                />
                                <button
                                    className="btn btn-primary px-4 flex-shrink-0 shadow-sm fw-bold"
                                    style={{ borderRadius: 10 }}
                                    onClick={handleSaveName}
                                    disabled={savingProfile}
                                >
                                    {savingProfile ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : "Save"}
                                </button>
                            </div>
                            <InlineAlert
                                type={profileStatus.type}
                                message={profileStatus.message}
                                onClose={() => setProfileStatus({ type: null, message: null })}
                            />
                        </div>

                        {/* Organization Name */}
                        <div className="form-section pb-4 mb-4 border-bottom" style={{ borderColor: 'var(--border)' }}>
                            <label className="form-label fw-bold text-dark mb-2 small">Organization Name</label>
                                <>
                                    <div className="d-flex gap-2">
                                        <input
                                            type="text"
                                            className="form-control bg-light"
                                            placeholder={editUser.org_name || "Enter organization name"}
                                            defaultValue={editUser.org_name || ""}
                                            onChange={(e) => setLocalUser({ ...editUser, _temp_org_name: e.target.value })}
                                            style={{ border: '1px solid var(--border)', color: '#000', borderRadius: '10px' }}
                                        />
                                        <button
                                            className="btn btn-primary px-4 flex-shrink-0 shadow-sm fw-bold"
                                            style={{ borderRadius: 10 }}
                                            onClick={handleSaveOrg}
                                            disabled={savingOrg || !editUser._temp_org_name}
                                        >
                                            {savingOrg ? (
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            ) : "Update"}
                                        </button>
                                    </div>
                                    <InlineAlert
                                        type={orgStatus.type}
                                        message={orgStatus.message}
                                        onClose={() => setOrgStatus({ type: null, message: null })}
                                    />
                                </>
                        </div>

                        {/* Org meta */}
                         <div className="row g-3 mt-1">
                            <div className="col-md-6">
                                <div className="p-3 rounded-3 bg-light border" style={{ borderColor: 'var(--border)' }}>
                                    <div className="text-muted small mb-1 fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>Org ID</div>
                                    <code className="text-primary fw-bold" style={{ fontSize: "0.8rem" }}>{editUser.org_id}</code>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="p-3 rounded-3 bg-light border" style={{ borderColor: 'var(--border)' }}>
                                    <div className="text-muted small mb-1 fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>Org Slug</div>
                                    <code className="text-primary fw-bold" style={{ fontSize: "0.8rem" }}>{editUser.org_slug}</code>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="page-card mb-4" style={{ borderColor: 'var(--border)' }}>
                    <div className="page-card-header" style={{ background: 'rgba(239,68,68,0.02)', borderColor: 'var(--border)' }}>
                        <div className="header-icon" style={{ background: "rgba(239,68,68,0.1)" }}>
                            <i className="bi bi-shield-lock" style={{ color: "#ef4444" }}></i>
                        </div>
                        <div>
                            <h5 className="mb-0 fw-bold text-dark">Security</h5>
                            <p className="text-muted mb-0 fw-medium" style={{ fontSize: "0.8rem" }}>
                                {editUser.auth_provider === "google" ? "Set a password for email login" : "Change your account password"}
                            </p>
                        </div>
                    </div>
                    <div className="page-card-body p-4">

                        {editUser.auth_provider === "google" && (
                            <div className="alert alert-info d-flex align-items-start gap-3 py-3 mb-4 rounded-3 border-0 bg-primary bg-opacity-10 text-primary">
                                <i className="bi bi-info-circle-fill mt-1 flex-shrink-0"></i>
                                <span className="small fw-bold">
                                    You signed in with Google. You can set a password here to also enable direct email login.
                                </span>
                            </div>
                        )}

                        <form onSubmit={handleChangePassword}>
                            {editUser.auth_provider !== "google" && (
                                <div className="form-section mb-4">
                                    <label className="form-label fw-bold text-dark mb-2 small">Current Password</label>
                                    <input
                                        name="current"
                                        type="password"
                                        className="form-control bg-light"
                                        placeholder="Enter current password"
                                        required
                                        style={{ border: '1px solid var(--border)', color: '#000', borderRadius: '10px' }}
                                    />
                                </div>
                            )}
                            <div className="form-section mb-4">
                                <label className="form-label fw-bold text-dark mb-2 small">New Password</label>
                                <input
                                    name="newPass"
                                    type="password"
                                    className="form-control bg-light"
                                    placeholder="At least 8 characters"
                                    required
                                    minLength={8}
                                    style={{ border: '1px solid var(--border)', color: '#000', borderRadius: '10px' }}
                                />
                            </div>
                            <div className="form-section mb-4">
                                <label className="form-label fw-bold text-dark mb-2 small">Confirm New Password</label>
                                <input
                                    name="confirmPass"
                                    type="password"
                                    className="form-control bg-light"
                                    placeholder="Repeat new password"
                                    required
                                    minLength={8}
                                    style={{ border: '1px solid var(--border)', color: '#000', borderRadius: '10px' }}
                                />
                            </div>

                            <InlineAlert
                                type={passwordStatus.type}
                                message={passwordStatus.message}
                                onClose={() => setPasswordStatus({ type: null, message: null })}
                            />

                            <button
                                type="submit"
                                className="btn btn-dark mt-4 px-4 py-3 shadow-sm fw-bold w-100 rounded-pill"
                                disabled={savingPassword}
                            >
                                {savingPassword ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Saving…
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-lock-fill me-2"></i>
                                        {editUser.auth_provider === "google" ? "Set Password" : "Update Password"}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <AuthGuard>
            <SettingsContent />
        </AuthGuard>
    );
}
