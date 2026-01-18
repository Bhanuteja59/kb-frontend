"use client";
import { useEffect, useState } from "react";
import Topbar from "../components/layout/Topbar";
import { getDocuments, deleteDocument, getMe } from "../lib/api";
import DeleteModal from "../components/ui/DeleteModal";
import Link from "next/link";

export default function DocumentsPage() {
    const [docs, setDocs] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        loadDocs();
    }, []);

    const loadDocs = async () => {
        setLoading(true);
        try {
            const [docsData, userData] = await Promise.all([
                getDocuments(),
                getMe().catch(() => null)
            ]);
            setDocs(docsData);
            setUser(userData);
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        try {
            await deleteDocument(deleteId);
            setDocs(docs.filter(d => d.doc_id !== deleteId));
            // Update local user doc count if available
            if (user) setUser({ ...user, doc_count: Math.max(0, (user.doc_count || 0) - 1) });
            setDeleteId(null);
        } catch (e) {
            alert(e.message);
        }
    };

    return (
        <>
            <Topbar />
            <div className="container py-5 fade-in">
                {/* Header Section */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
                    <div>
                        <h1 className="display-6 fw-bold text-white mb-2">Documents</h1>
                        <p className="text-light opacity-75 mb-0">Manage and track your indexed knowledge base.</p>
                    </div>

                    <div className="d-flex align-items-center gap-4">
                        {user && (
                            <div className="d-flex flex-column align-items-end gap-3">
                                {/* Doc Count Usage */}
                                <div className="d-flex flex-column align-items-end">
                                    <span className="text-white small fw-medium mb-1">
                                        Usage: <span className="text-primary">{user.doc_count || 0}</span> / {user.max_docs || 0} Docs
                                    </span>
                                    <div className="progress bg-white bg-opacity-10 rounded-pill" style={{ width: '120px', height: '6px' }}>
                                        <div
                                            className={`progress-bar rounded-pill ${(user.doc_count / user.max_docs) >= 1 ? 'bg-danger' :
                                                (user.doc_count / user.max_docs) >= 0.8 ? 'bg-warning' : 'bg-primary'
                                                }`}
                                            role="progressbar"
                                            style={{ width: `${Math.min(100, ((user.doc_count || 0) / (user.max_docs || 1)) * 100)}%` }}
                                        ></div>
                                    </div>
                                    {(user.doc_count >= user.max_docs) && (
                                        <small className="text-danger mt-1" style={{ fontSize: '0.7rem' }}>Doc Limit Reached</small>
                                    )}
                                </div>

                                {/* Storage Usage */}
                                <div className="d-flex flex-column align-items-end">
                                    <span className="text-white small fw-medium mb-1">
                                        Storage: <span className="text-primary">{user.storage_usage_mb || 0}</span> / {user.max_storage_mb || 100} MB
                                    </span>
                                    <div className="progress bg-white bg-opacity-10 rounded-pill" style={{ width: '120px', height: '6px' }}>
                                        <div
                                            className={`progress-bar rounded-pill ${(user.storage_usage_mb / user.max_storage_mb) >= 1 ? 'bg-danger' :
                                                    (user.storage_usage_mb / user.max_storage_mb) >= 0.8 ? 'bg-warning' : 'bg-purple'
                                                }`}
                                            role="progressbar"
                                            style={{ width: `${Math.min(100, ((user.storage_usage_mb || 0) / (user.max_storage_mb || 1)) * 100)}%`, backgroundColor: (user.storage_usage_mb / user.max_storage_mb) >= 0.8 ? undefined : '#8b5cf6' }}
                                        ></div>
                                    </div>
                                    {(user.storage_usage_mb >= user.max_storage_mb) && (
                                        <small className="text-danger mt-1" style={{ fontSize: '0.7rem' }}>Storage Full</small>
                                    )}
                                </div>
                            </div>
                        )}

                        <Link href="/upload" className={`btn rounded-pill px-4 py-2 hover-lift shadow-lg fw-bold d-flex align-items-center gap-2 ${user && (user.doc_count >= user.max_docs || user.storage_usage_mb >= user.max_storage_mb) ? 'btn-secondary disabled' : 'btn-primary'}`}>
                            <i className="bi bi-cloud-upload fs-5"></i>
                            <span>Upload New</span>
                        </Link>
                    </div>
                </div>

                {err && (
                    <div className="alert alert-danger glass-panel border-0 d-flex align-items-center gap-2 text-white">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                        {err}
                    </div>
                )}

                <div className="card border-0 shadow-sm overflow-hidden bg-white">
                    <div className="table-responsive">
                        <table className="table align-middle mb-0" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-4 py-3 text-uppercase small fw-bold" style={{ letterSpacing: '1px', color: '#000000' }}>Document</th>
                                    <th className="px-4 py-3 text-uppercase small fw-bold" style={{ letterSpacing: '1px', color: '#000000' }}>Size</th>
                                    <th className="px-4 py-3 text-uppercase small fw-bold" style={{ letterSpacing: '1px', color: '#000000' }}>Chunks</th>
                                    <th className="px-4 py-3 text-uppercase small fw-bold" style={{ letterSpacing: '1px', color: '#000000' }}>Status</th>
                                    <th className="px-4 py-3 text-end text-uppercase small fw-bold" style={{ letterSpacing: '1px', color: '#000000' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status"></div>
                                        </td>
                                    </tr>
                                ) : docs.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <div className="d-flex flex-column align-items-center py-4">
                                                <i className="bi bi-files text-secondary display-4 mb-3 opacity-50"></i>
                                                <h5 className="text-dark fw-medium">No documents found</h5>
                                                <p className="text-secondary mb-0">Start by uploading your first document</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    docs.map(doc => (
                                        <tr key={doc.doc_id} className="hover-bg-light transition-all">
                                            <td className="px-4 py-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="rounded-3 bg-primary bg-opacity-10 p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                                        <i className="bi bi-file-text text-primary fs-5"></i>
                                                    </div>
                                                    <div>
                                                        <Link href={`/documents/${doc.doc_id}`} className="text-decoration-none fw-bold stretched-link hover-text-primary" style={{ color: '#000000' }}>
                                                            {doc.filename}
                                                        </Link>
                                                        <div className="small" style={{ color: '#000000' }}>{doc.doc_id.substring(0, 8)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 fw-normal font-monospace small" style={{ color: '#000000' }}>
                                                {doc.size_bytes ? (doc.size_bytes / 1024).toFixed(1) + ' KB' : '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="d-flex align-items-center gap-2" style={{ color: '#000000' }}>
                                                    <i className="bi bi-layers small" style={{ color: '#000000' }}></i>
                                                    <span style={{ color: '#000000' }}>{doc.chunk_count || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`badge rounded-pill px-3 py-2 fw-normal ${doc.status === 'indexed'
                                                    ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-25'
                                                    : 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25'
                                                    }`}>
                                                    <i className={`bi ${doc.status === 'indexed' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1`}></i>
                                                    {doc.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-end position-relative z-index-2">
                                                <Link
                                                    href={`/documents/${doc.doc_id}`}
                                                    className="btn btn-icon btn-outline-primary border-0 rounded-circle hover-scale me-2"
                                                    style={{ width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                                    title="View Document"
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </Link>
                                                <button
                                                    className="btn btn-icon btn-outline-danger border-0 rounded-circle hover-scale"
                                                    style={{ width: 36, height: 36 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // prevent row click
                                                        setDeleteId(doc.doc_id);
                                                    }}
                                                    title="Delete"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <DeleteModal
                isOpen={!!deleteId}
                onCancel={() => setDeleteId(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete Document?"
                body="This will permanently delete the document and remove its vectors from the search index."
                isDeleting={false}
            />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            <style jsx>{`
                .hover-glass-row:hover {
                    background: rgba(255, 255, 255, 0.05);
                }
                .hover-text-primary:hover {
                    color: var(--accent-color) !important;
                }
                /* Allow row click via stretched-link but keep actions clickable */
                td.position-relative {
                    z-index: 2;
                }
            `}</style>
        </>
    );
}
