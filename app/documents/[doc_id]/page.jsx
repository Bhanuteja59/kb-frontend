"use client";
import { useEffect, useState, use } from "react";
import Topbar from "../../components/layout/Topbar";
import { apiFetch } from "../../lib/api";
import Link from "next/link";

export default function DocDetails({ params }) {
    const { doc_id } = use(params);
    const [data, setData] = useState(null);
    const [err, setErr] = useState(null);
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        apiFetch(`/documents/${doc_id}`).then(r => r.json()).then(setData).catch(e => setErr(e.message));
    }, [doc_id]);

    return (
        <>
            <Topbar />
            <div className="container py-4 fit-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h2 m-0">Document Details</h1>
                    <Link className="btn btn-outline-secondary" href="/documents">
                        <i className="bi bi-arrow-left me-2"></i>Back
                    </Link>
                </div>

                {err && <div className="alert alert-danger">{err}</div>}

                {!data ? (
                    !err && (
                        <div className="d-flex justify-content-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )
                ) : (
                    <>
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h2 className="h4 text-primary mb-1">{data.document.filename}</h2>
                                        <div className="text-muted small">
                                            {data.document.doc_id} • {data.document.file_type} • {data.document.source}
                                        </div>
                                    </div>
                                    <span className={`badge rounded-pill ${data.document.is_deleted ? 'bg-danger' : 'bg-success'}`}>
                                        {data.document.is_deleted ? "DELETED" : "ACTIVE"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="row g-4">
                            <div className="col-lg-4 col-md-5">
                                <div className="card shadow-sm border-0 h-100">
                                    <div className="card-header bg-white py-3">
                                        <h3 className="h6 m-0">Token-based chunks</h3>
                                    </div>
                                    <div className="card-body p-0">
                                        <div className="list-group list-group-flush" style={{ maxHeight: "600px", overflowY: "auto" }}>
                                            {data.chunks.map((c, idx) => (
                                                <button
                                                    key={c.chunk_id}
                                                    className={`list-group-item list-group-item-action py-3 ${idx === selected ? 'active' : ''}`}
                                                    onClick={() => setSelected(idx)}
                                                    aria-current={idx === selected}
                                                >
                                                    <div className="d-flex w-100 justify-content-between align-items-center mb-1">
                                                        <strong className="mb-0">Chunk #{c.chunk_index}</strong>
                                                        <span className="badge bg-light text-dark border">{c.text.length} chars</span>
                                                    </div>
                                                    <div className="small text-truncate text-muted" style={{ opacity: idx === selected ? 0.8 : 1 }}>
                                                        {c.text}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-8 col-md-7">
                                <div className="card shadow-sm border-0 h-100">
                                    <div className="card-header bg-white py-3">
                                        <h3 className="h6 m-0">Chunk Preview</h3>
                                    </div>
                                    <div className="card-body">
                                        <p className="text-muted small mb-3">
                                            Used during retrieval to answer user queries.
                                        </p>
                                        <textarea
                                            className="form-control bg-light mb-3"
                                            style={{ minHeight: "500px", fontFamily: "monospace", fontSize: "0.875rem" }}
                                            value={data.chunks[selected]?.text || ""}
                                            readOnly
                                        />
                                        <div className="text-muted small">
                                            Chunk ID: <code className="text-dark bg-light px-1 py-1 rounded border">{data.chunks[selected]?.chunk_id}</code>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
