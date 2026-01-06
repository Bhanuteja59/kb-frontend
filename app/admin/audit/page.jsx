"use client";
import { useEffect, useMemo, useState } from "react";
import Topbar from "../../components/layout/Topbar";
import { apiFetch } from "../../lib/api";

export default function AuditPage() {
    const [events, setEvents] = useState([]);
    const [q, setQ] = useState("");
    const [action, setAction] = useState("");
    const [err, setErr] = useState(null);

    async function load() {
        const params = new URLSearchParams();
        if (action) params.set("action", action);
        const r = await apiFetch(`/audit?${params.toString()}`);
        setEvents(await r.json());
    }

    useEffect(() => { load().catch(e => setErr(e.message)); }, [action]);

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
            <div className="container">
                <div className="row" style={{ justifyContent: "space-between" }}>
                    <h1 style={{ marginTop: 0 }}>Audit</h1>
                    <button className="btn secondary" onClick={() => load().catch(() => { })}>Refresh</button>
                </div>

                <div className="card">
                    <div className="row" style={{ justifyContent: "space-between" }}>
                        <input className="input" placeholder="Filter by actor/target/action..." value={q} onChange={e => setQ(e.target.value)} style={{ maxWidth: 420 }} />
                        <select className="select" value={action} onChange={e => setAction(e.target.value)} style={{ maxWidth: 240 }}>
                            <option value="">All actions</option>
                            <option value="login">login</option>
                            <option value="upload">upload</option>
                            <option value="delete">delete</option>
                            <option value="restore">restore</option>
                            <option value="user_create">user_create</option>
                            <option value="user_update">user_update</option>
                        </select>
                    </div>

                    {err ? <div style={{ color: "#b91c1c", marginTop: 10 }}>{err}</div> : null}

                    <div style={{ overflowX: "auto", marginTop: 12 }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Actor</th>
                                    <th>Action</th>
                                    <th>Target</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((e, i) => (
                                    <tr key={i}>
                                        <td className="muted">{new Date(e.created_at).toLocaleString()}</td>
                                        <td style={{ fontWeight: 800 }}>{e.actor_email}</td>
                                        <td><span className="pill">{e.action}</span></td>
                                        <td className="muted">{e.target || "—"}</td>
                                        <td className="muted" style={{ maxWidth: 420, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {e.details || "—"}
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 ? <tr><td colSpan={5} className="muted">No events.</td></tr> : null}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
