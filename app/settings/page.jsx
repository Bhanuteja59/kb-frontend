"use client";
import { useEffect, useState } from "react";
import Topbar from "../components/layout/Topbar";
import { getMe, updateProfile, updateOrganization, deleteAccount } from "../lib/api";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        getMe().then(u => {
            setUser(u);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    const handleUpdateProfile = async () => {
        try {
            await updateProfile({ full_name: user.full_name });
            alert("Profile Updated Successfully!");
        } catch (e) {
            alert("Error updating profile: " + e.message);
        }
    };

    const handleUpdateOrg = async () => {
        if (!user._temp_org_name) return;
        try {
            await updateOrganization({ name: user._temp_org_name });
            // Update local state to reflect change
            setUser(prev => ({ ...prev, org_name: user._temp_org_name }));
            alert("Organization Name Updated!");
        } catch (e) {
            alert("Error updating organization: " + e.message);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("ARE YOU SURE? This will permanently delete your account and all documents you uploaded. This action cannot be undone.")) {
            return;
        }
        setIsDeleting(true);
        try {
            await deleteAccount();
            alert("Account deleted. Redirecting...");
            router.push("/login");
        } catch (e) {
            alert("Error deleting account: " + e.message);
            setIsDeleting(false);
        }
    };

    if (loading) return null;
    if (!user) return <div className="container text-center mt-5 text-muted">Please login to view settings.</div>;

    const isAdmin = user.role === 'admin';

    return (
        <>
            <Topbar />
            <div className="container py-5 fade-in">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                        <h1 className="h2 fw-bold mb-1 text-white">Account Settings</h1>
                        <p className="text-white opacity-75 small mb-0">Manage your profile and organization preferences.</p>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Left Column: Profile & Org */}
                    <div className="col-lg-8">

                        {/* Profile Section */}
                        <div className="glass-panel mb-4 p-0 white-glow-shadow">
                            <div className="border-bottom border-light border-opacity-10 p-4">
                                <h2 className="h5 fw-bold text-white mb-0">Personal Profile</h2>
                            </div>
                            <div className="p-4">
                                <div className="d-flex align-items-center gap-4 mb-4">
                                    <div className="bg-primary bg-opacity-25 text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: 64, height: 64 }}>
                                        {user.full_name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <div>
                                        <h3 className="h6 text-white fw-bold mb-1">{user.email}</h3>
                                        <span className="badge bg-light bg-opacity-10 text-white border border-light border-opacity-10">{user.role.toUpperCase()}</span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label text-white opacity-75 small fw-bold">Full Name</label>
                                    <div className="d-flex gap-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={user.full_name || ""}
                                            onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                                        />
                                        <button className="btn btn-primary px-4" onClick={handleUpdateProfile}>
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Organization Section */}
                        <div className="glass-panel p-0 white-glow-shadow">
                            <div className="border-bottom border-light border-opacity-10 p-4">
                                <h2 className="h5 fw-bold text-white mb-0">Organization Details</h2>
                            </div>
                            <div className="p-4">
                                <div className="mb-4">
                                    <label className="form-label text-white opacity-75 small fw-bold">Organization Name</label>
                                    <div className="d-flex gap-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={user.org_name || "Enter Organization Name"}
                                            defaultValue={user.org_name || ""}
                                            onChange={(e) => setUser({ ...user, _temp_org_name: e.target.value })}
                                            disabled={!isAdmin}
                                        />
                                        {isAdmin && (
                                            <button className="btn btn-outline-light px-4" onClick={handleUpdateOrg}>
                                                Update
                                            </button>
                                        )}
                                    </div>
                                    {!isAdmin && <small className="text-white opacity-50 mt-1 d-block">Only admins can rename the organization.</small>}
                                </div>

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-white opacity-75 small fw-bold">Organization ID</label>
                                        <div className="bg-black bg-opacity-25 p-3 rounded text-white font-monospace small user-select-all border border-light border-opacity-10">
                                            {user.org_id}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-white opacity-75 small fw-bold">Slug</label>
                                        <div className="bg-black bg-opacity-25 p-3 rounded text-white font-monospace small user-select-all border border-light border-opacity-10">
                                            {user.org_slug}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Usage & Danger Zone */}
                    <div className="col-lg-4">

                        {/* Usage Card */}
                        <div className="glass-panel text-white mb-4 p-0 white-glow-shadow">
                            <div className="p-4 bg-primary bg-opacity-20 rounded-top" style={{ backdropFilter: 'blur(10px)' }}>
                                <h3 className="h5 fw-bold mb-4">Current Plan</h3>
                                <div className="d-flex justify-content-between align-items-end mb-2">
                                    <span className="display-4 fw-bold">{user.doc_count || 0}</span>
                                    <span className="h3 opacity-50 mb-2">/ {user.max_docs || 5}</span>
                                </div>
                                <p className="small opacity-75 mb-3">Documents Uploaded</p>
                                <div className="progress bg-white bg-opacity-10" style={{ height: 6 }}>
                                    <div
                                        className="progress-bar bg-warning"
                                        role="progressbar"
                                        style={{ width: `${Math.min(((user.doc_count || 0) / (user.max_docs || 1)) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <div className="mt-4 pt-3 border-top border-white border-opacity-10">
                                    <span className="badge bg-white bg-opacity-10 text-white rounded-pill px-3 py-2 fw-bold text-uppercase border border-white border-opacity-10">
                                        {user.plan || "Free Tier"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="glass-panel border-danger border-opacity-50 p-0">
                            <div className="border-bottom border-danger border-opacity-25 p-4 bg-danger bg-opacity-10 rounded-top">
                                <h2 className="h6 fw-bold text-danger mb-0">Danger Zone</h2>
                            </div>
                            <div className="p-4">
                                <p className="small text-white opacity-75 mb-3">
                                    Deleting your account is permanent. All your documents and data will be wiped immediately.
                                </p>
                                <button
                                    className="btn btn-outline-danger w-100 py-2 fw-bold"
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "Deleting..." : "Delete Account"}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
