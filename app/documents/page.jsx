"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import Topbar from "../components/layout/Topbar";
import { apiFetch } from "../lib/api";
import Link from "next/link";

export default function DocumentsPage() {
    const [docs, setDocs] = useState([]);
    const [me, setMe] = useState(null);
    const [q, setQ] = useState("");
    const [showDeleted, setShowDeleted] = useState(false);

    const load = useCallback(async () => {
        const meRes = await apiFetch("/auth/me");
        const meData = await meRes.json();
        setMe(meData);
        const url = meData.role === "user" ? "/documents" : `/documents?include_deleted=${showDeleted ? "true" : "false"}`;
        const r = await apiFetch(url);
        setDocs(await r.json());
    }, [showDeleted]);

    useEffect(() => { load().catch(() => { }); }, [load]);

    const filtered = useMemo(() => {
        const qq = q.trim().toLowerCase();
        if (!qq) return docs;
        return docs.filter(d => d.filename.toLowerCase().includes(qq) || d.doc_id.toLowerCase().includes(qq));
    }, [docs, q]);

    async function onDelete(doc_id) {
        if (!confirm(`Soft-delete ${doc_id}? You can restore later.`)) return;
        await apiFetch(`/documents/${doc_id}`, { method: "DELETE" });
        await load();
    }

    async function onRestore(doc_id) {
        await apiFetch(`/documents/${doc_id}/restore`, { method: "POST" });
        await load();
    }

    return (
        <>
            <Topbar />
            <div className="container fade-in">
                <div className="g-row" style={{ justifyContent: "space-between", marginBottom: 24 }}>
                    <h1 className="section-title" style={{ margin: 0 }}>Documents</h1>
                    {(me?.role === "admin" || me?.role === "manager") && (
                        <Link href="/upload" className="btn">
                            + Upload New
                        </Link>
                    )}
                </div>

                <div className="card">
                    <div className="g-row" style={{ justifyContent: "space-between", marginBottom: 24 }}>
                        <input
                            className="input"
                            placeholder="Search by filename or doc_id..."
                            value={q}
                            onChange={e => setQ(e.target.value)}
                            style={{ maxWidth: 420 }}
                        />
                        <div className="g-row">
                            {(me?.role === "admin" || me?.role === "manager") ? (
                                <label className="muted" style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
                                    <input type="checkbox" checked={showDeleted} onChange={e => setShowDeleted(e.target.checked)} />
                                    Show deleted
                                </label>
                            ) : null}
                            <span className="pill">{filtered.length} docs</span>
                        </div>
                    </div>

                    <div style={{ overflowX: "auto" }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Document</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Uploaded</th>
                                    <th style={{ textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(d => (
                                    <tr key={d.doc_id} style={{ opacity: d.is_deleted ? 0.6 : 1 }}>
                                        <td>
                                            <div><Link href={`/documents/${d.doc_id}`} style={{ fontWeight: 600, color: "var(--primary)" }}>{d.filename}</Link></div>
                                            <div className="muted" style={{ fontSize: 13 }}>{d.doc_id} • {(d.size_bytes / 1024).toFixed(1)} KB</div>
                                        </td>
                                        <td><span className="pill" style={{ textTransform: "uppercase" }}>{d.file_type}</span></td>
                                        <td>
                                            {d.status === "error" ? (
                                                <span className="pill" style={{ background: "#fef2f2", color: "#ef4444", borderColor: "#fecaca" }}>Error</span>
                                            ) : (
                                                <span className="pill" style={{ background: "#f0fdf4", color: "#166534", borderColor: "#bbf7d0" }}>{d.status}</span>
                                            )}
                                            {d.status === "error" ? <div style={{ color: "var(--danger)", fontSize: 12, marginTop: 4 }}>{d.error_message}</div> : null}
                                        </td>
                                        <td className="muted">{new Date(d.created_at).toLocaleDateString()}</td>
                                        <td style={{ textAlign: "right" }}>
                                            {(me?.role === "admin" || me?.role === "manager") ? (
                                                d.is_deleted ? (
                                                    <div className="g-row" style={{ justifyContent: "flex-end" }}>
                                                        <span className="muted" style={{ fontSize: 12 }}>by {d.deleted_by || "?"}</span>
                                                        <button className="btn secondary" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => onRestore(d.doc_id)}>Restore</button>
                                                    </div>
                                                ) : (
                                                    <button className="btn secondary" style={{ padding: "6px 12px", fontSize: 12, color: "var(--danger)", borderColor: "var(--border)" }} onClick={() => onDelete(d.doc_id)}>
                                                        Delete
                                                    </button>
                                                )
                                            ) : (
                                                <span className="muted">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={5} className="muted" style={{ textAlign: "center", padding: 40 }}>No documents found.</td></tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
