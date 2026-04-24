"use client";
import { useEffect, useState } from "react";
import Topbar from "../../components/layout/Topbar";
import AuthGuard from "../../components/auth/AuthGuard";
import { apiFetch } from "../../lib/api";
import DeleteModal from "../../components/ui/DeleteModal";

function getInitials(name) {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
}

function UsersContent() {
    const [users, setUsers] = useState([]);
    const [err, setErr] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    async function load() {
        try {
            const r = await apiFetch("/users");
            setUsers(await r.json());
        } catch (e) {
            setErr(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function create() {
        setErr(null);
        setIsCreating(true);
        try {
            await apiFetch("/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, full_name: fullName }),
            });
            setEmail("");
            setFullName("");
            await load();
        } catch (e) {
            setErr(e.message);
        } finally {
            setIsCreating(false);
        }
    }

    async function toggleActive(u) {
        try {
            await apiFetch(`/users/${encodeURIComponent(u.email)}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_active: !u.is_active }),
            });
            await load();
        } catch (e) {
            setErr(e.message);
        }
    }

    async function confirmDelete() {
        if (!userToDelete) return;
        setIsDeleting(true);
        try {
            await apiFetch(`/users/${encodeURIComponent(userToDelete.email)}`, { method: "DELETE" });
            await load();
            setDeleteModalOpen(false);
            setUserToDelete(null);
        } catch (e) {
            alert(e.message);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="light-page min-vh-100 d-flex flex-column">
            <Topbar />
            <div className="container py-5 fade-in" style={{ maxWidth: 1000 }}>

                {/* Page Header */}
                <div className="page-header d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                    <div className="d-flex align-items-center gap-3">
                        <div className="page-header-icon" style={{ background: 'var(--primary)', boxShadow: '0 4px 12px rgba(255, 107, 107, 0.2)' }}>
                            <i className="bi bi-people-fill text-white" style={{ fontSize: 18 }}></i>
                        </div>
                        <div>
                            <h1 className="h3 fw-bold mb-0 text-dark">Team Members</h1>
                            <p className="text-muted mb-0 small fw-medium">Manage access for your team.</p>
                        </div>
                    </div>
                    <div className="mt-3 mt-md-0">
                        <span
                            className="badge px-3 py-2 rounded-pill fw-bold"
                            style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.15)", color: "var(--primary)", fontSize: "0.8rem" }}
                        >
                            <i className="bi bi-people me-1"></i>
                            {users.length} Members
                        </span>
                    </div>
                </div>

                {/* Invite Member Card */}
                <div className="page-card mb-4" style={{ borderColor: 'var(--border)' }}>
                    <div className="page-card-header" style={{ background: 'rgba(255,107,107,0.02)', borderColor: 'var(--border)' }}>
                        <div className="header-icon" style={{ background: "rgba(255,107,107,0.1)" }}>
                            <i className="bi bi-person-plus-fill text-primary"></i>
                        </div>
                        <div>
                            <h5 className="mb-0 fw-bold text-dark">Invite Member</h5>
                            <p className="text-muted mb-0 fw-medium" style={{ fontSize: "0.8rem" }}>Add someone to your organization</p>
                        </div>
                    </div>
                    <div className="page-card-body">
                        <div className="row g-4">
                            <div className="col-md-5">
                                <label className="form-label text-xs fw-bold text-uppercase text-muted small">Email Address</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0" style={{ borderColor: 'var(--border)' }}>
                                        <i className="bi bi-envelope text-muted"></i>
                                    </span>
                                    <input
                                        className="form-control bg-light border-start-0 ps-0"
                                        style={{ borderColor: 'var(--border)' }}
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="colleague@company.com"
                                    />
                                </div>
                            </div>
                            <div className="col-md-5">
                                <label className="form-label text-xs fw-bold text-uppercase text-muted small">Full Name</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0" style={{ borderColor: 'var(--border)' }}>
                                        <i className="bi bi-person text-muted"></i>
                                    </span>
                                    <input
                                        className="form-control bg-light border-start-0 ps-0"
                                        style={{ borderColor: 'var(--border)' }}
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        placeholder="Jane Doe"
                                    />
                                </div>
                            </div>
                            <div className="col-md-2 d-flex align-items-end">
                                <button
                                    className="btn btn-primary w-100 fw-bold py-2 rounded-3 shadow-sm"
                                    onClick={create}
                                    disabled={!email || !fullName || isCreating}
                                >
                                    {isCreating ? (
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    ) : (
                                        <i className="bi bi-plus-lg me-1"></i>
                                    )}
                                    Add
                                </button>
                            </div>
                        </div>
                        {err && (
                            <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger mt-4 d-flex align-items-center rounded-3 fw-medium">
                                <i className="bi bi-exclamation-circle-fill me-2"></i>
                                <div>{err}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Members Table */}
                <div className="table-card" style={{ borderColor: 'var(--border)' }}>
                    <div className="table-card-header" style={{ background: 'rgba(255,107,107,0.02)', borderColor: 'var(--border)' }}>
                        <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-list-ul text-primary"></i>
                            <h5 className="mb-0 fw-bold text-dark">Team Directory</h5>
                        </div>
                        <span className="text-muted small fw-medium">{users.length} member{users.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr style={{ background: '#f8fafc' }}>
                                    <th className="fw-bold text-muted small py-3" style={{ paddingLeft: "1.25rem", borderBottom: '1px solid var(--border)' }}>Member</th>
                                    <th className="text-center fw-bold text-muted small py-3" style={{ borderBottom: '1px solid var(--border)' }}>Status</th>
                                    <th className="fw-bold text-muted small py-3" style={{ borderBottom: '1px solid var(--border)' }}>Joined</th>
                                    <th className="text-end fw-bold text-muted small py-3" style={{ paddingRight: "1.25rem", borderBottom: '1px solid var(--border)' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length > 0 ? (
                                    users.map(u => (
                                        <tr key={u.email}>
                                            <td style={{ paddingLeft: "1.25rem" }}>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div
                                                        className="rounded-3 d-flex align-items-center justify-content-center fw-bold flex-shrink-0 border"
                                                        style={{
                                                            width: 40, height: 40,
                                                            background: "rgba(255,107,107,0.1)",
                                                            color: "var(--primary)",
                                                            fontSize: "0.85rem",
                                                            borderColor: 'rgba(255,107,107,0.2)'
                                                        }}
                                                    >
                                                        {getInitials(u.full_name)}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark">{u.full_name}</div>
                                                        <div className="small text-muted fw-medium">{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                {u.is_active ? (
                                                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3 fw-bold">
                                                        <i className="bi bi-check-circle-fill me-1"></i> Active
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 rounded-pill px-3 fw-bold">
                                                        <i className="bi bi-dash-circle-fill me-1"></i> Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="text-muted small fw-medium">
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="text-end" style={{ paddingRight: "1.25rem" }}>
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button
                                                        className={`btn btn-sm rounded-3 fw-bold ${u.is_active ? "btn-outline-warning" : "btn-outline-success"}`}
                                                        onClick={() => toggleActive(u)}
                                                    >
                                                        <i className={`bi ${u.is_active ? "bi-toggle-on" : "bi-toggle-off"} me-1`}></i>
                                                        {u.is_active ? "Deactivate" : "Activate"}
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger rounded-3 fw-bold"
                                                        onClick={() => { setUserToDelete(u); setDeleteModalOpen(true); }}
                                                    >
                                                        <i className="bi bi-trash me-1"></i> Remove
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-5 text-muted fw-medium">
                                            <i className="bi bi-people fs-1 mb-3 d-block text-light-emphasis"></i>
                                            No members yet. Invite someone above.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <DeleteModal
                    isOpen={deleteModalOpen}
                    title="Remove Member"
                    body={userToDelete ? (
                        <>
                            <p className="mb-1 text-dark">Remove <span className="fw-bold">{userToDelete.email}</span> from your organization?</p>
                            <p className="text-danger small mb-0 fw-medium">
                                <i className="bi bi-exclamation-triangle-fill me-1"></i>
                                This will also delete all documents uploaded by this user.
                            </p>
                        </>
                    ) : ""}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteModalOpen(false)}
                    isDeleting={isDeleting}
                />
            </div>
        </div>
    );
}

export default function UsersPage() {
    return (
        <AuthGuard>
            <UsersContent />
        </AuthGuard>
    );
}
