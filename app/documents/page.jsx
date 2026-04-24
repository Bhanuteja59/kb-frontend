"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Topbar from "../components/layout/Topbar";
import AuthGuard from "../components/auth/AuthGuard";
import { apiFetch } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import Link from "next/link";
import DeleteModal from "../components/ui/DeleteModal";

function DocumentsContent() {
    const { user } = useAuth();
    const [docs, setDocs] = useState([]);
    const [q, setQ] = useState("");
    const [loadingDocs, setLoadingDocs] = useState(true);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [docToDelete, setDocToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const load = useCallback(async () => {
        try {
            setLoadingDocs(true);
            const r = await apiFetch("/documents");
            setDocs(await r.json());
        } catch {
            // Errors handled by apiFetch (401 auto-redirects)
        } finally {
            setLoadingDocs(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const filtered = useMemo(() => {
        const qq = q.trim().toLowerCase();
        if (!qq) return docs;
        return docs.filter(
            d => d.filename.toLowerCase().includes(qq) || d.doc_id.toLowerCase().includes(qq)
        );
    }, [docs, q]);

    function onDelete(doc) {
        setDocToDelete(doc);
        setDeleteModalOpen(true);
    }

    async function confirmDelete() {
        if (!docToDelete) return;
        setIsDeleting(true);
        try {
            await apiFetch(`/documents/${docToDelete.doc_id}`, { method: "DELETE" });
            await load();
            setDeleteModalOpen(false);
            setDocToDelete(null);
        } catch (error) {
            alert("Failed to delete: " + error.message);
        } finally {
            setIsDeleting(false);
        }
    }

    const usagePct = Math.min(100, ((user?.doc_count ?? 0) / (user?.max_docs ?? 10)) * 100);

    return (
        <div className="light-page min-vh-100 d-flex flex-column">
            <Topbar />
            <div className="background-elements">
            </div>
            <div className="container py-5 position-relative z-index-1 fade-in">

                {/* Page Header */}
                <div className="page-header d-flex justify-content-between align-items-center mb-5">
                    <div className="d-flex align-items-center gap-3">
                        <div className="page-header-icon" style={{ background: 'var(--primary-gradient)', boxShadow: 'var(--shadow-md)' }}>
                            <i className="bi bi-folder2-open text-white" style={{ fontSize: 20 }}></i>
                        </div>
                        <div>
                            <h1 className="h3 fw-bold mb-0">Documents</h1>
                            <p className="text-muted mb-0 small fw-medium">
                                {docs.length} document{docs.length !== 1 ? "s" : ""} in your knowledge base
                            </p>
                        </div>
                    </div>
                    <Link href="/upload" className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 shadow-sm fw-bold" style={{ borderRadius: '12px' }}>
                        <i className="bi bi-plus-lg"></i>
                        Upload New
                    </Link>
                </div>

                {/* Usage Stats */}
                {user && (
                    <div className="row g-4 mb-5">
                        <div className="col-md-4">
                            <div className="glass-panel p-4 h-100 shadow-sm" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <div
                                        className="rounded-3 d-flex align-items-center justify-content-center"
                                        style={{ width: 36, height: 36, background: "rgba(255, 107, 107, 0.1)" }}
                                    >
                                        <i className="bi bi-file-earmark-text text-primary" style={{ fontSize: 15 }}></i>
                                    </div>
                                    <span className="small fw-bold text-muted text-uppercase" style={{ letterSpacing: "0.06em", fontSize: "0.7rem" }}>
                                        Documents Used
                                    </span>
                                </div>
                                <div className="d-flex align-items-end justify-content-between mb-2">
                                    <span className="h3 fw-bold mb-0">
                                        {user.doc_count ?? 0}
                                        <span className="text-muted fs-6 fw-bold"> / {user.max_docs ?? 10}</span>
                                    </span>
                                    {(user.doc_count ?? 0) >= (user.max_docs ?? 10) && (
                                        <span className="badge bg-danger text-white">Limit Reached</span>
                                    )}
                                </div>
                                <div className="progress" style={{ height: 8, borderRadius: 8, background: '#f1f5f9' }}>
                                    <div
                                        className={`progress-bar ${usagePct >= 100 ? "bg-danger" : "bg-primary"}`}
                                        role="progressbar"
                                        style={{ width: `${usagePct}%`, borderRadius: 8 }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="glass-panel p-4 h-100 shadow-sm" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <div
                                        className="rounded-3 d-flex align-items-center justify-content-center"
                                        style={{ width: 36, height: 36, background: "rgba(34, 197, 94, 0.1)" }}
                                    >
                                        <i className="bi bi-hdd text-success" style={{ fontSize: 15 }}></i>
                                    </div>
                                    <span className="small fw-bold text-muted text-uppercase" style={{ letterSpacing: "0.06em", fontSize: "0.7rem" }}>
                                        Storage Used
                                    </span>
                                </div>
                                <div className="h3 fw-bold mb-0">
                                    {((user.total_storage_bytes ?? 0) / (1024 * 1024)).toFixed(1)}
                                    <span className="text-muted fs-6 fw-bold"> MB</span>
                                </div>
                                <div className="text-muted small mt-2 fw-medium">Total size of uploaded files</div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="glass-panel p-4 h-100 shadow-sm d-flex flex-column justify-content-between" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <div
                                        className="rounded-3 d-flex align-items-center justify-content-center"
                                        style={{ width: 36, height: 36, background: "rgba(245, 158, 11, 0.1)" }}
                                    >
                                        <i className="bi bi-gem text-warning" style={{ fontSize: 15 }}></i>
                                    </div>
                                    <span className="small fw-bold text-muted text-uppercase" style={{ letterSpacing: "0.06em", fontSize: "0.7rem" }}>
                                        Current Plan
                                    </span>
                                </div>
                                <div className="h3 fw-bold text-capitalize mb-2">{user.plan ?? "Free"}</div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <span className="badge bg-light text-primary border fw-bold">
                                        Max {((user.max_file_size_bytes ?? 20971520) / (1024 * 1024))} MB/file
                                    </span>
                                    {user.plan === "free" && (
                                        <Link href="/pricing" className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold">
                                            Upgrade
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Document Table */}
                <div className="glass-panel overflow-hidden shadow-sm" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                    <div className="glass-header p-3 d-flex align-items-center justify-content-between border-bottom" style={{ borderColor: 'var(--border)' }}>
                        <div className="position-relative flex-grow-1" style={{ maxWidth: 400 }}>
                            <i
                                className="bi bi-search position-absolute text-muted"
                                style={{ left: "0.875rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.875rem", pointerEvents: "none" }}
                            ></i>
                            <input
                                className="form-control"
                                style={{ paddingLeft: "2.5rem", background: '#fff', border: '1px solid var(--border)', color: '#000', borderRadius: 10 }}
                                placeholder="Search by filename or doc ID…"
                                value={q}
                                onChange={e => setQ(e.target.value)}
                            />
                        </div>
                        <span className="badge rounded-pill text-muted border px-3 py-2 fw-bold" style={{ background: "#f8fafc", fontSize: "0.75rem" }}>
                            {filtered.length} document{filtered.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {loadingDocs ? (
                        <div className="text-center py-5 text-muted">
                            <div className="spinner-border spinner-border-sm text-primary me-2" />
                            Loading documents…
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead style={{ background: '#f8fafc' }}>
                                    <tr>
                                        <th style={{ paddingLeft: "1.25rem", color: '#475569', borderBottom: '1px solid var(--border)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase' }}>Document</th>
                                        <th style={{ color: '#475569', borderBottom: '1px solid var(--border)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase' }}>Type</th>
                                        <th style={{ color: '#475569', borderBottom: '1px solid var(--border)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase' }}>Status</th>
                                        <th style={{ color: '#475569', borderBottom: '1px solid var(--border)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase' }}>Uploaded</th>
                                        <th className="text-end" style={{ paddingRight: "1.25rem", color: '#475569', borderBottom: '1px solid var(--border)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(d => (
                                        <tr key={d.doc_id}>
                                            <td style={{ paddingLeft: "1.25rem" }}>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div
                                                        className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
                                                        style={{ width: 36, height: 36, background: "#fff", border: '1px solid var(--border)' }}
                                                    >
                                                        <i className="bi bi-file-earmark-text text-primary" style={{ fontSize: 15 }}></i>
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={`/documents/${d.doc_id}`}
                                                            className="fw-bold text-decoration-none text-dark hover-primary"
                                                        >
                                                            {d.filename}
                                                        </Link>
                                                        <div className="text-muted small fw-medium">
                                                            {d.doc_id} &bull; {(d.size_bytes / 1024).toFixed(1)} KB
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-muted border text-uppercase fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}>
                                                    {d.file_type}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge rounded-pill fw-bold ${
                                                        d.status === "error"
                                                            ? "bg-danger bg-opacity-10 text-danger border border-danger-subtle"
                                                            : "bg-success bg-opacity-10 text-success border border-success-subtle"
                                                    }`}
                                                >
                                                    <i className={`bi ${d.status === "error" ? "bi-x-circle-fill" : "bi-check-circle-fill"} me-1`}></i>
                                                    {d.status}
                                                </span>
                                                {d.status === "error" && (
                                                    <div className="text-danger small mt-1 fw-medium">{d.error_message}</div>
                                                )}
                                            </td>
                                            <td className="text-muted small fw-medium">
                                                <i className="bi bi-calendar3 me-1 text-primary"></i>
                                                {new Date(d.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="text-end" style={{ paddingRight: "1.25rem" }}>
                                                <button
                                                    className="btn btn-sm btn-outline-danger rounded-3 fw-bold px-3"
                                                    onClick={() => onDelete(d)}
                                                >
                                                    <i className="bi bi-trash me-1"></i> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filtered.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-5">
                                                <i className="bi bi-folder2 fs-2 d-block mb-2 text-muted opacity-25"></i>
                                                <span className="text-muted fw-medium">
                                                    {q ? "No documents match your search." : "No documents uploaded yet."}
                                                </span>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <DeleteModal
                isOpen={deleteModalOpen}
                title="Delete Document?"
                body={`Are you sure you want to permanently delete "${docToDelete?.filename || 'this document'}"? This cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModalOpen(false)}
                isDeleting={isDeleting}
            />
        </div>
    );
}
export default function DocumentsPage() {
    return (
        <AuthGuard>
            <DocumentsContent />
        </AuthGuard>
    );
}
