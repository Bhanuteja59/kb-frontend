"use client";
import { useEffect, useState } from "react";
import Topbar from "../../components/layout/Topbar";
import { apiFetch } from "../../lib/api";
import DeleteModal from "../../components/ui/DeleteModal";

// Helper to generate initials for avatar
function getInitials(name) {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
}

// Helper for role badge colors
function getRoleBadgeColor(role) {
    switch (role) {
        case 'admin': return 'bg-dark text-white';
        case 'manager': return 'bg-info text-dark bg-opacity-25 border border-info';
        case 'user': return 'bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle';
        default: return 'bg-light text-dark';
    }
}

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [err, setErr] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [email, setEmail] = useState("");
    const [full_name, setFullName] = useState("");
    const [role, setRole] = useState("user");
    const [password, setPassword] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    async function load() {
        try {
            const r = await apiFetch("/users");
            const data = await r.json();
            setUsers(data);
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
                body: JSON.stringify({ email, full_name, role, password })
            });
            setEmail(""); setFullName(""); setPassword(""); setRole("user");
            await load();
        } catch (e) {
            setErr(e.message);
        } finally {
            setIsCreating(false);
        }
    }

    async function toggleActive(u) {
        // Optimistic update could go here, but for now we wait for server
        try {
            await apiFetch(`/users/${encodeURIComponent(u.email)}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_active: !u.is_active })
            });
            await load();
        } catch (e) {
            setErr(e.message);
        }
    }

    // --- Delete Logic ---
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    function onDeleteClick(u) {
        setUserToDelete(u);
        setDeleteModalOpen(true);
    }

    async function confirmDelete() {
        if (!userToDelete) return;
        setIsDeleting(true);
        try {
            const res = await apiFetch(`/users/${encodeURIComponent(userToDelete.email)}`, { method: "DELETE" });
            const data = await res.json();
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
        <>
            <Topbar />
            <div className="container-fluid bg-light min-vh-100 py-5">
                <div className="container" style={{ maxWidth: '1000px' }}>

                    {/* Header */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5">
                        <div>
                            <h1 className="display-6 fw-bold text-dark mb-1">User Management</h1>
                            <p className="text-muted mb-0">Manage access, roles, and permissions for your team.</p>
                        </div>
                        <div className="mt-3 mt-md-0">
                            <span className="badge bg-white text-secondary border px-3 py-2 rounded-pill shadow-sm">
                                <i className="bi bi-people-fill me-2 text-primary"></i>
                                {users.length} Total Users
                            </span>
                        </div>
                    </div>

                    {/* Create User Card */}
                    <div className="card border-0 shadow-sm rounded-4 mb-5 overflow-hidden">
                        <div className="card-header bg-white border-bottom-0 pt-4 px-4 pb-0">
                            <div className="d-flex align-items-center">
                                <div className="icon-square bg-primary bg-opacity-10 text-primary rounded-3 p-2 me-3">
                                    <i className="bi bi-person-plus-fill fs-5"></i>
                                </div>
                                <h5 className="mb-0 fw-bold text-dark">Add New Member</h5>
                            </div>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <label className="form-label text-xs fw-bold text-uppercase text-muted tracking-wide">Email Address</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope text-muted"></i></span>
                                        <input
                                            className="form-control bg-light border-start-0 ps-0"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="colleague@company.com"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-xs fw-bold text-uppercase text-muted tracking-wide">Full Name</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0"><i className="bi bi-person text-muted"></i></span>
                                        <input
                                            className="form-control bg-light border-start-0 ps-0"
                                            value={full_name}
                                            onChange={e => setFullName(e.target.value)}
                                            placeholder="Jane Doe"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label text-xs fw-bold text-uppercase text-muted tracking-wide">Role</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0"><i className="bi bi-shield-lock text-muted"></i></span>
                                        <select className="form-select bg-light border-start-0 ps-0" value={role} onChange={e => setRole(e.target.value)}>
                                            <option value="admin">Admin (Full Access)</option>
                                            <option value="manager">Manager (Limited)</option>
                                            <option value="user">User (Basic)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <label className="form-label text-xs fw-bold text-uppercase text-muted tracking-wide">Password</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0"><i className="bi bi-key text-muted"></i></span>
                                        <input
                                            className="form-control bg-light border-start-0 ps-0"
                                            type="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-end">
                                    <button
                                        className="btn btn-primary w-100 fw-semibold py-2"
                                        onClick={create}
                                        disabled={!email || !full_name || !password || isCreating}
                                    >
                                        {isCreating ? (
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        ) : (
                                            <i className="bi bi-plus-lg me-2"></i>
                                        )}
                                        Create Account
                                    </button>
                                </div>
                            </div>
                            {err && (
                                <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger mt-4 d-flex align-items-center rounded-3">
                                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                                    <div>{err}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Users List */}
                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">Directory</h5>
                            <div className="text-muted small">
                                Showing {users.length} users
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="px-4 py-3 text-secondary text-uppercase text-xs font-weight-bolder opacity-7 border-0">User</th>
                                        <th className="py-3 text-secondary text-uppercase text-xs font-weight-bolder opacity-7 border-0">Role</th>
                                        <th className="py-3 text-secondary text-uppercase text-xs font-weight-bolder opacity-7 border-0 text-center">Status</th>
                                        <th className="px-4 py-3 text-secondary text-uppercase text-xs font-weight-bolder opacity-7 border-0 text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-5">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : users.length > 0 ? (
                                        users.map(u => (
                                            <tr key={u.email} className="border-bottom-0">
                                                <td className="px-4 py-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar user-select-none rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: '40px', height: '40px' }}>
                                                            {getInitials(u.full_name)}
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold text-dark">{u.full_name}</div>
                                                            <div className="small text-muted">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <span className={`badge rounded-pill fw-normal px-3 py-2 ${getRoleBadgeColor(u.role)}`}>
                                                        {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-center">
                                                    {u.is_active ? (
                                                        <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3"><i className="bi bi-check-circle-fill me-1"></i> Active</span>
                                                    ) : (
                                                        <span className="badge bg-secondary bg-opacity-25 text-secondary rounded-pill px-3"><i className="bi bi-dash-circle-fill me-1"></i> Inactive</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-end">
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <button
                                                            className={`btn btn-sm d-flex align-items-center gap-2 ${u.is_active ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                                            onClick={() => toggleActive(u)}
                                                            title={u.is_active ? "Deactivate User" : "Activate User"}
                                                        >
                                                            <i className={`bi ${u.is_active ? 'bi-toggle-on' : 'bi-toggle-off'}`}></i>
                                                            <span className="small fw-semibold">{u.is_active ? "Deactivate" : "Activate"}</span>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2"
                                                            onClick={() => onDeleteClick(u)}
                                                            title="Delete User"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                            <span className="small fw-semibold">Delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-5 text-muted">
                                                <div className="d-flex flex-column align-items-center">
                                                    <i className="bi bi-people fs-1 mb-3 text-light-emphasis"></i>
                                                    <p className="mb-0">No users found.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <DeleteModal
                    isOpen={deleteModalOpen}
                    title="Delete User Account"
                    body={userToDelete ? (
                        <>
                            <p className="mb-1">Are you sure you want to delete <span className="fw-bold">{userToDelete.email}</span>?</p>
                            <p className="text-danger small mb-0"><i className="bi bi-exclamation-triangle-fill me-1"></i> This action is permanent and will delete all documents uploaded by this user.</p>
                        </>
                    ) : ""}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteModalOpen(false)}
                    isDeleting={isDeleting}
                />
            </div>

            <style jsx>{`
                .text-xs { font-size: 0.75rem; }
                .tracking-wide { letter-spacing: 0.05em; }
                .btn-icon { display: flex; align-items: center; justify-content: center; border-radius: 50%; }
                .btn-icon:hover { background-color: #e9ecef; }
            `}</style>
        </>
    );
}
