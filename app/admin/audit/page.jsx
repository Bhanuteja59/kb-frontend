"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import Topbar from "../../components/layout/Topbar";
import { apiFetch } from "../../lib/api";

export default function AuditPage() {
    const [events, setEvents] = useState([]);
    const [q, setQ] = useState("");
    const [action, setAction] = useState("");
    const [err, setErr] = useState(null);

    const load = useCallback(async () => {
        const params = new URLSearchParams();
        if (action) params.set("action", action);
        const r = await apiFetch(`/audit?${params.toString()}`);
        setEvents(await r.json());
    }, [action]);

    useEffect(() => { load().catch(e => setErr(e.message)); }, [load]);

    const filtered = useMemo(() => {
        const qq = q.trim().toLowerCase();
        if (!qq) return events;
        return events.filter(e =>
            e.actor_email.toLowerCase().includes(qq) ||
            (e.target || "").toLowerCase().includes(qq) ||
            e.action.toLowerCase().includes(qq)
        );
    }, [events, q]);

    return (
        <>
            <Topbar />
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h2 m-0">Audit Logs</h1>
                    <button className="btn btn-outline-secondary" onClick={() => load().catch(() => { })}>
                        <i className="bi bi-arrow-clockwise me-2"></i>Refresh
                    </button>
                </div>

                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        <div className="row g-3 mb-4">
                            <div className="col-md-8">
                                <input
                                    className="form-control"
                                    placeholder="Filter by actor, target, or action..."
                                    value={q}
                                    onChange={e => setQ(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <select
                                    className="form-select"
                                    value={action}
                                    onChange={e => setAction(e.target.value)}
                                >
                                    <option value="">All actions</option>
                                    <option value="login">Login</option>
                                    <option value="upload">Upload</option>
                                    <option value="delete">Delete</option>
                                    <option value="restore">Restore</option>
                                    <option value="user_create">User Create</option>
                                    <option value="user_update">User Update</option>
                                </select>
                            </div>
                        </div>

                        {err && <div className="alert alert-danger mb-4">{err}</div>}

                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="border-0">Time</th>
                                        <th className="border-0">Actor</th>
                                        <th className="border-0">Action</th>
                                        <th className="border-0">Target</th>
                                        <th className="border-0">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((e, i) => (
                                        <tr key={i}>
                                            <td className="text-muted small">
                                                {new Date(e.created_at).toLocaleString()}
                                            </td>
                                            <td className="fw-bold text-dark">{e.actor_email}</td>
                                            <td>
                                                <span className="badge bg-light text-dark border border-secondary fw-normal">
                                                    {e.action}
                                                </span>
                                            </td>
                                            <td className="text-muted">{e.target || "—"}</td>
                                            <td className="text-muted small" style={{ maxWidth: "300px" }}>
                                                <div className="text-truncate" title={e.details}>
                                                    {e.details || "—"}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filtered.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-5 text-muted">
                                                No events found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
