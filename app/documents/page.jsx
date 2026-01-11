"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import Topbar from "../components/layout/Topbar";
import { apiFetch } from "../lib/api";
import Link from "next/link";
import DeleteModal from "../components/ui/DeleteModal";

export default function DocumentsPage() {
    const [docs, setDocs] = useState([]);
    const [me, setMe] = useState(null);
    const [q, setQ] = useState("");

    // Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [docToDelete, setDocToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const load = useCallback(async () => {
        const meRes = await apiFetch("/auth/me");
        const meData = await meRes.json();
        setMe(meData);
        // Always fetch documents, no more include_deleted logic needed as hard delete implies gone forever
        const r = await apiFetch("/documents");
        setDocs(await r.json());
    }, []);

    useEffect(() => { load().catch(() => { }); }, [load]);

    const filtered = useMemo(() => {
        const qq = q.trim().toLowerCase();
        if (!qq) return docs;
        return docs.filter(d => d.filename.toLowerCase().includes(qq) || d.doc_id.toLowerCase().includes(qq));
    }, [docs, q]);

    // Open Modal
    function onDelete(doc) {
        setDocToDelete(doc);
        setDeleteModalOpen(true);
    }

    // Confirm Delete
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

    return (
        <>
            <Topbar />
            <div className="container py-4 fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h2 m-0">Documents</h1>
                    {(me?.role === "admin" || me?.role === "manager") && (
                        <Link href="/upload" className="btn btn-primary">
                            <i className="bi bi-plus-lg me-2"></i>Upload New
                        </Link>
                    )}
                </div>

                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                            <div className="flex-grow-1" style={{ maxWidth: 420 }}>
                                <input
                                    className="form-control"
                                    placeholder="Search by filename or doc_id..."
                                    value={q}
                                    onChange={e => setQ(e.target.value)}
                                />
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <span className="badge bg-secondary rounded-pill">{filtered.length} docs</span>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="border-0">Document</th>
                                        <th className="border-0">Type</th>
                                        <th className="border-0">Status</th>
                                        <th className="border-0">Uploaded</th>
                                        <th className="border-0 text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(d => (
                                        <tr key={d.doc_id}>
                                            <td>
                                                <div className="fw-bold">
                                                    <Link href={`/documents/${d.doc_id}`} className="text-decoration-none text-primary">
                                                        {d.filename}
                                                    </Link>
                                                </div>
                                                <div className="text-muted small">
                                                    {d.doc_id} • {(d.size_bytes / 1024).toFixed(1)} KB
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark border text-uppercase">
                                                    {d.file_type}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge rounded-pill ${d.status === 'error' ? 'bg-danger-subtle text-danger border border-danger-subtle' : 'bg-success-subtle text-success border border-success-subtle'}`}>
                                                    {d.status}
                                                </span>
                                                {d.status === "error" && (
                                                    <div className="text-danger small mt-1">{d.error_message}</div>
                                                )}
                                            </td>
                                            <td className="text-muted small">
                                                {new Date(d.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="text-end">
                                                {(me?.role === "admin" || me?.role === "manager") ? (
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => onDelete(d)}
                                                    >
                                                        Delete
                                                    </button>
                                                ) : (
                                                    <span className="text-muted">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {filtered.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-5 text-muted">
                                                No documents found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteModal
                isOpen={deleteModalOpen}
                title="Delete Document?"
                body={`Are you sure you want to delete "${docToDelete?.filename}"?`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModalOpen(false)}
                isDeleting={isDeleting}
            />
        </>
    );
}
