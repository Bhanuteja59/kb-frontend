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
            <div className="container">
                <h1 style={{ marginTop: 0 }}>Users</h1>
                <div className="card">
                    <h2 style={{ marginTop: 0 }}>Create user</h2>
                    <div className="row">
                        <div style={{ flex: "1 1 260px" }}>
                            <label>Email</label>
                            <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div style={{ flex: "1 1 260px" }}>
                            <label>Full name</label>
                            <input className="input" value={full_name} onChange={e => setFullName(e.target.value)} />
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: 10 }}>
                        <div style={{ flex: "1 1 220px" }}>
                            <label>Role</label>
                            <select className="select" value={role} onChange={e => setRole(e.target.value)}>
                                <option value="admin">admin</option>
                                <option value="manager">manager</option>
                                <option value="user">user</option>
                            </select>
                        </div>
                        <div style={{ flex: "2 1 320px" }}>
                            <label>Password</label>
                            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div style={{ alignSelf: "flex-end" }}>
                            <button className="btn" onClick={create} disabled={!email || !full_name || !password}>Create</button>
                        </div>
                    </div>
                    {err ? <p style={{ color: "#b91c1c" }}>{err}</p> : null}
                </div>

                <div className="card" style={{ marginTop: 12 }}>
                    <h2 style={{ marginTop: 0 }}>All users</h2>
                    <div style={{ overflowX: "auto" }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.email}>
                                        <td style={{ fontWeight: 800 }}>{u.email}</td>
                                        <td>{u.full_name}</td>
                                        <td><span className="pill">{u.role}</span></td>
                                        <td>{u.is_active ? <span className="pill">active</span> : <span className="pill">inactive</span>}</td>
                                        <td><button className="btn secondary" onClick={() => toggleActive(u)}>{u.is_active ? "Deactivate" : "Activate"}</button></td>
                                    </tr>
                                ))}
                                {users.length === 0 ? <tr><td colSpan={5} className="muted">No users.</td></tr> : null}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
