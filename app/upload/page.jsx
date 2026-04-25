"use client";

import { useState } from "react";
import Topbar from "../components/layout/Topbar";
import AuthGuard from "../components/auth/AuthGuard";
import { uploadDocument } from "../lib/api/documents";

import "./upload.css";

function UploadContent() {
    const [file, setFile] = useState(null);
    const [msg, setMsg] = useState(null);
    const [msgType, setMsgType] = useState("info");
    const [busy, setBusy] = useState(false);
    const [progress, setProgress] = useState(0);

    const [chunkTokens, setChunkTokens] = useState(500);
    const [overlapTokens, setOverlapTokens] = useState(80);

    async function handleUpload() {
        if (!file) return;
        setBusy(true);
        setMsg(null);
        setProgress(10);

        try {
            setProgress(30);
            const data = await uploadDocument(file, "local", chunkTokens, overlapTokens);
            setProgress(100);
            setMsg(`Successfully uploaded and indexed "${data.filename}" — ${data.chunk_count} chunks created.`);
            setMsgType("success");
            setFile(null);
            const fileInput = document.getElementById("file-input");
            if (fileInput) fileInput.value = "";
        } catch (e) {
            setProgress(0);
            setMsg(e.message || "Upload failed. Please try again.");
            setMsgType("danger");
        } finally {
            setBusy(false);
            setTimeout(() => setProgress(0), 800);
        }
    }

    function handleFileChange(e) {
        const selected = e.target.files?.[0] || null;
        setFile(selected);
        setMsg(null);
    }

    function formatFileSize(bytes) {
        if (!bytes) return "";
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    return (
        <div className="upload-page min-vh-100 d-flex flex-column">
            <Topbar />
            <div className="container py-5 fade-in" style={{ maxWidth: 800 }}>

                {/* Page Header */}
                <div className="page-header d-flex align-items-center gap-3 mb-4">
                    <div className="page-header-icon" style={{ background: 'var(--primary)' }}>
                        <i className="bi bi-cloud-arrow-up-fill text-white"></i>
                    </div>
                    <div>
                        <h1 className="h3 fw-bold mb-0 text-dark">Upload Documents</h1>
                        <p className="text-muted mb-0 small fw-medium">Ingest PDF or Word documents into the knowledge base.</p>
                    </div>
                </div>

                {/* Settings Card */}
                <div className="upload-card mb-4">
                    <div className="upload-header">
                        <div className="bg-primary bg-opacity-10 rounded-3 p-2">
                            <i className="bi bi-sliders text-primary"></i>
                        </div>
                        <h5 className="mb-0 fw-bold text-dark">Chunking Configuration</h5>
                    </div>
                    <div className="upload-body">
                        <div className="row g-3">
                            <div className="col-sm-6">
                                <label className="form-label fw-bold text-dark small">Chunk Size ({chunkTokens} tokens)</label>
                                <input
                                    className="form-control bg-light border"
                                    type="number"
                                    value={chunkTokens}
                                    onChange={e => setChunkTokens(parseInt(e.target.value || "500", 10))}
                                    style={{ borderRadius: 10, color: '#000', fontWeight: '600' }}
                                />
                                <div className="form-text text-muted small fw-medium mt-2">Recommended: 400–600 tokens</div>
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label fw-bold text-dark small">Overlap ({overlapTokens} tokens)</label>
                                <input
                                    className="form-control bg-light border"
                                    type="number"
                                    value={overlapTokens}
                                    onChange={e => setOverlapTokens(parseInt(e.target.value || "80", 10))}
                                    style={{ borderRadius: 10, color: '#000', fontWeight: '600' }}
                                />
                                <div className="form-text text-muted small fw-medium mt-2">Recommended: 50–100 tokens</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upload Card */}
                <div className="upload-card">
                    <div className="upload-header">
                        <div className="bg-primary bg-opacity-10 rounded-3 p-2">
                            <i className="bi bi-file-earmark-arrow-up text-primary"></i>
                        </div>
                        <h5 className="mb-0 fw-bold text-dark">Select File</h5>
                    </div>
                    <div className="upload-body">
                        <label htmlFor="file-input" className={`upload-dropzone d-block mb-4 ${file ? "has-file" : ""}`}>
                            {file ? (
                                <div className="d-flex flex-column align-items-center gap-2">
                                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 mb-2">
                                        <i className="bi bi-file-earmark-text-fill text-primary fs-2"></i>
                                    </div>
                                    <div className="fw-bold text-dark">{file.name}</div>
                                    <div className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '0.75rem' }}>
                                        {formatFileSize(file.size)}
                                    </div>
                                    <div className="text-muted small fw-bold mt-2">Click to change file</div>
                                </div>
                            ) : (
                                <div className="d-flex flex-column align-items-center gap-2">
                                    <div className="bg-white border rounded-circle p-3 mb-2 shadow-sm">
                                        <i className="bi bi-cloud-arrow-up text-muted fs-2"></i>
                                    </div>
                                    <div className="fw-bold text-dark">Click to select a file</div>
                                    <div className="text-muted small fw-medium">or drag and drop here</div>
                                    <div className="d-flex gap-2 mt-3">
                                        {["PDF", "DOCX"].map((ext) => (
                                            <span key={ext} className="badge bg-white text-muted border px-3 py-2 fw-bold" style={{ fontSize: '0.7rem' }}>{ext}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <input id="file-input" type="file" className="d-none" onChange={handleFileChange} accept=".pdf,.docx" />
                        </label>

                        {busy && (
                            <div className="upload-progress-wrapper mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="small text-muted fw-bold">Processing...</span>
                                    <span className="small text-primary fw-bold">{progress}%</span>
                                </div>
                                <div className="upload-progress-bar">
                                    <div className="upload-progress-fill" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                        )}

                        <button
                            className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-lg"
                            onClick={handleUpload}
                            disabled={!file || busy}
                        >
                            {busy ? (
                                <><span className="spinner-border spinner-border-sm me-2"></span> Indexing...</>
                            ) : (
                                <><i className="bi bi-cloud-arrow-up-fill me-2"></i> Upload &amp; Index Document</>
                            )}
                        </button>

                        {msg && (
                            <div className={`alert alert-${msgType === "success" ? "success" : "danger"} border-0 rounded-4 p-3 mt-4 mb-0 fw-medium d-flex align-items-start gap-3`} style={{ background: msgType === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: msgType === "success" ? "#059669" : "#dc2626" }}>
                                <i className={`bi ${msgType === "success" ? "bi-check-circle-fill" : "bi-exclamation-circle-fill"} mt-1`}></i>
                                <span>{msg}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function UploadPage() {
    return (
        <AuthGuard>
            <UploadContent />
        </AuthGuard>
    );
}
