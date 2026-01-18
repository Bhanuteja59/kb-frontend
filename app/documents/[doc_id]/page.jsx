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
            <div className="container py-5 fit-in fade-in">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div className="d-flex align-items-center gap-3">
                        <Link className="btn btn-outline-light rounded-circle p-0 d-flex align-items-center justify-content-center"
                            style={{ width: 40, height: 40 }}
                            href="/documents">
                            <i className="bi bi-arrow-left text-white"></i>
                        </Link>
                        <div>
                            <h1 className="h3 fw-bold text-white mb-0">Document Inspector</h1>
                            <p className="small text-white opacity-75 mb-0">Deep dive into chunks and vectors</p>
                        </div>
                    </div>
                </div>

                {err && <div className="alert alert-danger shadow-sm border-0">{err}</div>}

                {!data ? (
                    !err && (
                        <div className="d-flex justify-content-center py-5">
                            <div className="spinner-border text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )
                ) : (
                    <>
                        {/* Meta Info Card */}
                        <div className="glass-panel p-4 mb-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="rounded-3 bg-white bg-opacity-10 p-3 text-center" style={{ minWidth: 60 }}>
                                        <i className="bi bi-file-earmark-text text-white fs-3"></i>
                                    </div>
                                    <div>
                                        <h2 className="h4 text-white mb-1">{data.document.filename}</h2>
                                        <div className="d-flex gap-3 text-white opacity-75 small font-monospace">
                                            <span><i className="bi bi-hash me-1"></i>{data.document.doc_id.substring(0, 8)}</span>
                                            <span><i className="bi bi-filetype-pdf me-1"></i>{data.document.file_type || 'Unknown'}</span>
                                            <span><i className="bi bi-hdd me-1"></i>{data.document.source}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`badge rounded-pill px-3 py-2 ${data.document.is_deleted ? 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25' : 'bg-success bg-opacity-10 text-success border border-success border-opacity-25'}`}>
                                    <i className={`bi ${data.document.is_deleted ? 'bi-trash' : 'bi-check-circle'} me-2`}></i>
                                    {data.document.is_deleted ? "DELETED" : "ACTIVE & INDEXED"}
                                </span>
                            </div>
                        </div>

                        <div className="row g-4 h-100">
                            {/* Chunks List */}
                            <div className="col-lg-4 col-md-5">
                                <div className="glass-panel d-flex flex-column p-0 overflow-hidden" style={{ height: '75vh' }}>
                                    <div className="p-3 border-bottom border-light border-opacity-10">
                                        <h3 className="h6 text-white m-0 d-flex justify-content-between align-items-center">
                                            <span>Chunks</span>
                                            <span className="badge bg-white bg-opacity-10 text-white rounded-pill">{data.chunks.length}</span>
                                        </h3>
                                    </div>
                                    <div className="flex-grow-1 overflow-auto custom-scrollbar p-2">
                                        <div className="list-group list-group-flush gap-2">
                                            {data.chunks.map((c, idx) => (
                                                <button
                                                    key={c.chunk_id}
                                                    className={`list-group-item list-group-item-action border-0 rounded-3 p-3 transition-all ${idx === selected ? 'bg-primary text-white shadow-md' : 'bg-transparent text-white hover-glass'}`}
                                                    onClick={() => setSelected(idx)}
                                                    style={{ transition: 'all 0.2s ease' }}
                                                >
                                                    <div className="d-flex w-100 justify-content-between align-items-center mb-1">
                                                        <strong className={`mb-0 small text-uppercase ${idx === selected ? 'text-white' : 'text-white'}`} style={{ letterSpacing: '0.5px' }}>Chunk #{c.chunk_index}</strong>
                                                        <span className={`badge border ${idx === selected ? 'border-white text-white' : 'border-secondary text-white opacity-50'}`}>{c.text.length} chars</span>
                                                    </div>
                                                    <div className={`small text-truncate ${idx === selected ? 'text-white opacity-75' : 'text-white opacity-50'}`}>
                                                        {c.text}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Chunk Preview */}
                            <div className="col-lg-8 col-md-7">
                                <div className="glass-panel d-flex flex-column p-0 overflow-hidden" style={{ height: '75vh' }}>
                                    <div className="p-3 border-bottom border-light border-opacity-10 d-flex justify-content-between align-items-center">
                                        <h3 className="h6 text-white m-0">Content Preview</h3>
                                    </div>
                                    <div className="p-0 flex-grow-1 position-relative">
                                        <textarea
                                            className="form-control bg-transparent text-white border-0 h-100 p-4 font-monospace custom-scrollbar"
                                            style={{
                                                resize: 'none',
                                                fontSize: '1rem',
                                                lineHeight: '1.8',
                                                borderRadius: '0'
                                            }}
                                            value={data.chunks[selected]?.text || ""}
                                            readOnly
                                        />
                                    </div>
                                    <div className="p-3 border-top border-light border-opacity-10 d-flex align-items-center gap-2">
                                        <span className="text-white opacity-50 small">ID:</span>
                                        <code className="text-primary small bg-black bg-opacity-25 px-2 py-1 rounded border border-primary border-opacity-25">{data.chunks[selected]?.chunk_id}</code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <style jsx>{`
                .hover-bg-light-dark:hover {
                    background: #e9ecef !important;
                }
                .hover-dark:hover {
                    background: #212529;
                    color: white;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </>
    );
}
