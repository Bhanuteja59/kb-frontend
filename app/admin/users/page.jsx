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
                    <div className="glass-panel mb-4 p-4 white-glow-shadow">
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
                <div className="glass-panel overflow-hidden bg-white shadow-sm">
                    <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                        <h2 className="h5 m-0 text-dark fw-bold d-flex align-items-center gap-2">
                            <i className="bi bi-people text-primary"></i>
                            Organization Members
                        </h2>
                        <div className="d-flex gap-2">
                            <input type="text" placeholder="Search members..." className="form-control form-control-sm border-secondary border-opacity-25 text-dark" style={{ maxWidth: '200px' }} />
                            <button className="btn btn-sm btn-outline-secondary"><i className="bi bi-filter"></i></button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table align-middle mb-0 text-dark" style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
                            <thead className="bg-light text-dark small text-uppercase letter-spacing-1">
                                <tr>
                                    <th className="px-4 py-3 border-bottom opacity-75 fw-bold text-secondary">User Info</th>
                                    <th className="py-3 border-bottom opacity-75 fw-bold text-secondary">Role</th>
                                    <th className="py-3 border-bottom opacity-75 fw-bold text-secondary">Status</th>
                                    <th className="py-3 border-bottom opacity-75 fw-bold text-secondary text-end px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.email} className="hover-bg-light transition-all">
                                        <td className="px-4 py-3 border-bottom">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center text-primary fw-bold shadow-sm" style={{ width: '40px', height: '40px' }}>
                                                    {u.full_name?.charAt(0) || u.email.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark">{u.full_name}</div>
                                                    <div className="small text-muted">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 border-bottom">
                                            <span className={`badge rounded-pill border ${u.role === 'admin' ? 'bg-primary bg-opacity-10 text-primary border-primary border-opacity-25' :
                                                u.role === 'manager' ? 'bg-info bg-opacity-10 text-info border-info border-opacity-25' :
                                                    'bg-secondary bg-opacity-10 text-secondary border-secondary border-opacity-25'
                                                } px-3 py-2 fw-medium`}>
                                                {u.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-3 border-bottom">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className={`rounded-circle ${u.is_active ? 'bg-success' : 'bg-danger'}`} style={{ width: '8px', height: '8px', boxShadow: u.is_active ? '0 0 10px rgba(34, 197, 94, 0.4)' : 'none' }}></div>
                                                <span className={`small fw-medium ${u.is_active ? 'text-success' : 'text-danger'}`}>
                                                    {u.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-end px-4 py-3 border-bottom">
                                            {isAdmin ? (
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button
                                                        className={`btn btn-sm btn-icon ${u.is_active ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                                        onClick={() => toggleActive(u)}
                                                        title={u.is_active ? "Deactivate User" : "Activate User"}
                                                        style={{ width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                        <i className={`bi ${u.is_active ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-icon btn-outline-danger"
                                                        onClick={() => onDeleteClick(u)}
                                                        title="Delete User"
                                                        style={{ width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                        <i className="bi bi-trash-fill"></i>
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-muted opacity-50 small fst-italic">View Only</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-5 text-muted">
                                            <div className="mb-3 opacity-25">
                                                <i className="bi bi-people-fill display-4"></i>
                                            </div>
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
