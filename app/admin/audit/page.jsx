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
        <div className="light-page min-vh-100 d-flex flex-column">
            <Topbar />
            <div className="container py-5 fade-in">
                <div className="page-header d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <div className="page-header-icon" style={{ background: 'var(--primary)', boxShadow: '0 4px 12px rgba(255, 107, 107, 0.2)' }}>
                            <i className="bi bi-journal-text text-white" style={{ fontSize: 18 }}></i>
                        </div>
                        <div>
                            <h1 className="h3 fw-bold mb-0 text-dark">Audit Logs</h1>
                            <p className="text-muted mb-0 small fw-medium">Monitor organization activities and security events.</p>
                        </div>
                    </div>
                    <button className="btn btn-outline-dark rounded-pill px-4 fw-bold shadow-sm" onClick={() => load().catch(() => { })}>
                        <i className="bi bi-arrow-clockwise me-2"></i>Refresh
                    </button>
                </div>

                <div className="page-card mb-4" style={{ borderColor: 'var(--border)' }}>
                    <div className="page-card-body">
                        <div className="row g-3">
                            <div className="col-md-8">
                                <label className="form-label text-xs fw-bold text-uppercase text-muted small">Search Logs</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0" style={{ borderColor: 'var(--border)' }}>
                                        <i className="bi bi-search text-muted"></i>
                                    </span>
                                    <input
                                        className="form-control bg-light border-start-0 ps-0"
                                        style={{ borderColor: 'var(--border)' }}
                                        placeholder="Filter by actor, target, or action..."
                                        value={q}
                                        onChange={e => setQ(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label text-xs fw-bold text-uppercase text-muted small">Filter Action</label>
                                <select
                                    className="form-select bg-light"
                                    style={{ borderColor: 'var(--border)' }}
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
                    </div>
                </div>

                {err && <div className="alert alert-danger mb-4 rounded-3 fw-medium">{err}</div>}

                <div className="table-card" style={{ borderColor: 'var(--border)' }}>
                    <div className="table-card-header" style={{ background: 'rgba(255,107,107,0.02)', borderColor: 'var(--border)' }}>
                        <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-list-check text-primary"></i>
                            <h5 className="mb-0 fw-bold text-dark">Event History</h5>
                        </div>
                        <span className="text-muted small fw-medium">{filtered.length} events found</span>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr style={{ background: '#f8fafc' }}>
                                    <th className="fw-bold text-muted small py-3" style={{ paddingLeft: "1.25rem", borderBottom: '1px solid var(--border)' }}>Time</th>
                                    <th className="fw-bold text-muted small py-3" style={{ borderBottom: '1px solid var(--border)' }}>Actor</th>
                                    <th className="fw-bold text-muted small py-3" style={{ borderBottom: '1px solid var(--border)' }}>Action</th>
                                    <th className="fw-bold text-muted small py-3" style={{ borderBottom: '1px solid var(--border)' }}>Target</th>
                                    <th className="fw-bold text-muted small py-3" style={{ paddingRight: "1.25rem", borderBottom: '1px solid var(--border)' }}>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((e, i) => (
                                    <tr key={i}>
                                        <td className="text-muted small fw-medium" style={{ paddingLeft: "1.25rem" }}>
                                            {new Date(e.created_at).toLocaleString()}
                                        </td>
                                        <td className="fw-bold text-dark">{e.actor_email}</td>
                                        <td>
                                            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 fw-bold rounded-pill px-3">
                                                {e.action}
                                            </span>
                                        </td>
                                        <td className="text-muted fw-medium">{e.target || "—"}</td>
                                        <td className="text-muted small fw-medium" style={{ paddingRight: "1.25rem", maxWidth: "300px" }}>
                                            <div className="text-truncate" title={e.details}>
                                                {e.details || "—"}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-5 text-muted fw-medium">
                                            <i className="bi bi-journal-x fs-1 d-block mb-3 opacity-50"></i>
                                            No audit events found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
