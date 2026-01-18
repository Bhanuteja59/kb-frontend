"use client";
import { useEffect, useState } from "react";
import Topbar from "../../components/layout/Topbar";
import { apiFetch } from "../../lib/api";
import DeleteModal from "../../components/ui/DeleteModal";
import AlertModal from "../../components/ui/AlertModal";
import { useAuthContext } from "../../context/AuthContext";

export default function UsersPage() {
    const { user: currentUser } = useAuthContext();
    const [users, setUsers] = useState([]);
    const [err, setErr] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const [email, setEmail] = useState("");
    const [full_name, setFullName] = useState("");
    const [role, setRole] = useState("user");

    const [alertData, setAlertData] = useState({ isOpen: false, title: "", body: "", type: "danger" });

    const isAdmin = currentUser?.role === 'admin';

    async function load() {
        if (!isAdmin) {
            // Managers might only see users but not edit
            // For now assuming list_users endpoint has basic fetch
        }
        try {
            const r = await apiFetch("/users");
            if (r.ok) {
                setUsers(await r.json());
            }
        } catch (e) {
            setErr("Failed to load users");
        }
    }

    useEffect(() => { load(); }, []);

    async function invite() {
        setErr(null);
        setSuccessMsg(null);
        try {
            await apiFetch("/users/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, full_name, role })
            });

            setEmail(""); setFullName(""); setRole("user");
            setSuccessMsg(`Invitation sent to ${email}`);
            await load();
        } catch (e) {
            // apiFetch throws generic Error(responseText) on failure
            // Try to parse the response text as JSON to show pretty errors
            try {
                const errorData = JSON.parse(e.message);
                if (errorData.detail) {
                    const msg = errorData.detail;

                    if (msg.includes("already exists") || msg.includes("already in another")) {
                        setAlertData({
                            isOpen: true,
                            title: "User Already Exists",
                            body: msg,
                            type: "danger"
                        });
                        return;
                    }

                    if (msg.includes("Limit Reached")) {
                        setAlertData({
                            isOpen: true,
                            title: "Limit Reached",
                            body: msg,
                            type: "danger"
                        });
                        return;
                    }
                }
            } catch (parseErr) {
                // Not JSON, ignore
            }

            setErr(e.message || "Failed to invite user");
        }
    }

    async function toggleActive(u) {
        await apiFetch(`/users/${encodeURIComponent(u.email)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_active: !u.is_active })
        });
        await load();
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
            if (data.deleted_docs > 0) {
                alert(`User and ${data.deleted_docs} documents deleted successfully.`);
            }
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
            <div className="container py-4 fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h2 m-0 text-white">Team Management</h1>
                    {!isAdmin && <span className="badge bg-secondary">View Only</span>}
                </div>

                {/* Invite Form - Admin Only */}
                {isAdmin && (
                    <div className="glass-panel mb-4 p-4">
                        <div className="d-flex justify-content-between align-items-center border-bottom border-light border-opacity-25 pb-2 mb-4">
                            <h2 className="h5 mb-0 text-white">Invite New Member</h2>
                            <div className="text-light opacity-75 small">
                                <i className="bi bi-info-circle me-1"></i>
                                Limits: 3 Admins, 10 Managers, 20 Users
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-md-5">
                                <label className="form-label text-light small">Email Address</label>
                                <input
                                    className="form-control"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="colleague@company.com"
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label text-light small">Full Name</label>
                                <input
                                    className="form-control"
                                    value={full_name}
                                    onChange={e => setFullName(e.target.value)}
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label text-light small">Role</label>
                                <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="user">User</option>
                                </select>
                            </div>
                            <div className="col-12 text-end">
                                <button
                                    className="btn btn-primary px-4"
                                    onClick={invite}
                                    disabled={!email || !full_name}
                                >
                                    <i className="bi bi-envelope-paper me-2"></i>Send Invitation
                                </button>
                            </div>
                        </div>
                        {successMsg && <div className="alert alert-success mt-3 mb-0 py-2">{successMsg}</div>}
                        {err && <div className="alert alert-danger mt-3 mb-0 py-2">{err}</div>}
                    </div>
                )}

                {/* Users Table */}
                <div className="glass-panel overflow-hidden bg-white">
                    <div className="p-3 border-bottom">
                        <h2 className="h5 m-0 text-dark fw-bold">
                            <i className="bi bi-people me-2"></i>Organization Members
                        </h2>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0 text-dark">
                            <thead className="bg-light fw-bold" style={{ color: '#000000' }}>
                                <tr>
                                    <th className="px-4 border-0" style={{ color: 'black' }}>User Info</th>
                                    <th className="border-0" style={{ color: 'black' }}>Role</th>
                                    <th className="border-0" style={{ color: 'black' }}>Status</th>
                                    <th className="border-0 text-end px-4" style={{ color: 'black' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.email}>
                                        <td className="px-4">
                                            <div className="fw-bold text-black">{u.full_name}</div>
                                            <div className="small text-muted fw-semibold">{u.email}</div>
                                        </td>
                                        <td>
                                            <span className={`badge rounded-pill ${u.role === 'admin' ? 'bg-primary' :
                                                u.role === 'manager' ? 'bg-info text-dark' : 'bg-secondary'
                                                }`}>
                                                {u.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge rounded-pill ${u.is_active ? 'bg-success' : 'bg-danger'}`}>
                                                {u.is_active ? "ACTIVE" : "INACTIVE"}
                                            </span>
                                        </td>
                                        <td className="text-end px-4">
                                            {isAdmin ? (
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button
                                                        className={`btn btn-sm ${u.is_active ? 'btn-outline-warning' : 'btn-outline-success'} d-flex align-items-center gap-2`}
                                                        onClick={() => toggleActive(u)}
                                                        title={u.is_active ? "Deactivate User" : "Activate User"}
                                                    >
                                                        <i className={`bi ${u.is_active ? 'bi-pause-circle' : 'bi-play-circle'} text-dark`}></i>
                                                        <span className="text-black fw-bold">{u.is_active ? "Deactivate" : "Activate"}</span>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2"
                                                        onClick={() => onDeleteClick(u)}
                                                        title="Delete User"
                                                    >
                                                        <i className="bi bi-trash text-danger"></i>
                                                        <span className="text-black fw-bold">Delete</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-muted small fst-italic">View Only</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-5 text-muted fw-bold">
                                            No users found.
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
                title="Remove Team Member?"
                body={`Are you sure you want to remove ${userToDelete?.full_name}? This will revoke their access immediately.`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModalOpen(false)}
                isDeleting={isDeleting}
            />

            <AlertModal
                isOpen={alertData.isOpen}
                title={alertData.title}
                body={alertData.body}
                type={alertData.type}
                onClose={() => setAlertData({ ...alertData, isOpen: false })}
            />
        </>
    );
}
