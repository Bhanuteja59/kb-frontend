"use client";
import { useEffect, useState } from "react";
import Topbar from "../../components/layout/Topbar";
import { apiFetch } from "../../lib/api";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [err, setErr] = useState(null);

    const [email, setEmail] = useState("");
    const [full_name, setFullName] = useState("");
    const [role, setRole] = useState("user");
    const [password, setPassword] = useState("");

    async function load() {
        const r = await apiFetch("/users");
        setUsers(await r.json());
    }

    useEffect(() => { load().catch(e => setErr(e.message)); }, []);

    async function create() {
        setErr(null);
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

    return (
        <>
            <Topbar />
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h2 m-0">Users</h1>
                </div>

                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-header bg-white py-3">
                        <h2 className="h5 m-0 text-primary">Create User</h2>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Email</label>
                                <input
                                    className="form-control"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="user@example.com"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Full Name</label>
                                <input
                                    className="form-control"
                                    value={full_name}
                                    onChange={e => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Role</label>
                                <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="user">User</option>
                                </select>
                            </div>
                            <div className="col-md-5">
                                <label className="form-label">Password</label>
                                <input
                                    className="form-control"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="col-md-3 d-flex align-items-end">
                                <button
                                    className="btn btn-primary w-100"
                                    onClick={create}
                                    disabled={!email || !full_name || !password}
                                >
                                    <i className="bi bi-plus-lg me-2"></i>Create User
                                </button>
                            </div>
                        </div>
                        {err && <div className="alert alert-danger mt-3 mb-0">{err}</div>}
                    </div>
                </div>

                <div className="card shadow-sm border-0">
                    <div className="card-header bg-white py-3">
                        <h2 className="h5 m-0">All Users</h2>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 border-0">Email</th>
                                    <th className="border-0">Name</th>
                                    <th className="border-0">Role</th>
                                    <th className="border-0">Status</th>
                                    <th className="border-0 text-end px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.email}>
                                        <td className="px-4 fw-bold text-dark">{u.email}</td>
                                        <td>{u.full_name}</td>
                                        <td>
                                            <span className={`badge rounded-pill ${u.role === 'admin' ? 'bg-dark' : u.role === 'manager' ? 'bg-info text-dark' : 'bg-secondary'}`}>
                                                {u.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge rounded-pill ${u.is_active ? 'bg-success' : 'bg-danger'}`}>
                                                {u.is_active ? "ACTIVE" : "INACTIVE"}
                                            </span>
                                        </td>
                                        <td className="text-end px-4">
                                            <button
                                                className={`btn btn-sm ${u.is_active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                                onClick={() => toggleActive(u)}
                                            >
                                                {u.is_active ? "Deactivate" : "Activate"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-5 text-muted">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
