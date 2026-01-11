"use client";
import { useState } from "react";
import Topbar from "../components/layout/Topbar";
import { API_BASE } from "../lib/constants";

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [msg, setMsg] = useState(null);
    const [busy, setBusy] = useState(false);

    const [chunkTokens, setChunkTokens] = useState(500);
    const [overlapTokens, setOverlapTokens] = useState(80);

    async function localUpload() {
        if (!file) return;
        setBusy(true); setMsg(null);
        try {
            const token = localStorage.getItem("kb_token");
            const form = new FormData();
            form.append("file", file);
            form.append("source", "local");
            form.append("chunk_tokens", String(chunkTokens));
            form.append("overlap_tokens", String(overlapTokens));

            const res = await fetch(`${API_BASE}/ingest`, {
                method: "POST",
                headers: token ? { "Authorization": `Bearer ${token}` } : undefined,
                body: form
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setMsg(`Uploaded and indexed: ${data.doc_id} (${data.chunks} chunks)`);
            setFile(null);
            document.getElementById("file").value = "";
        } catch (e) {
            setMsg(e.message || "Upload failed");
        } finally {
            setBusy(false);
        }
    }



    return (
        <>
            <Topbar />
            <div className="container py-4 fade-in">
                <h1 className="h2 mb-4">Upload Documents</h1>

                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-header bg-white py-3">
                        <h2 className="h5 m-0 text-primary">Chunking Settings</h2>
                    </div>
                    <div className="card-body">
                        <p className="text-muted small mb-3">
                            Control chunk size and overlap in tokens (better aligned with LLMs than characters).
                        </p>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Chunk tokens</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    value={chunkTokens}
                                    onChange={e => setChunkTokens(parseInt(e.target.value || "500", 10))}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Overlap tokens</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    value={overlapTokens}
                                    onChange={e => setOverlapTokens(parseInt(e.target.value || "80", 10))}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-md-8">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-header bg-white py-3">
                                <h2 className="h5 m-0">Local Upload</h2>
                            </div>
                            <div className="card-body">
                                <p className="text-muted small mb-3">
                                    Upload PDF, DOCX, TXT/MD, or CSV to index into Qdrant.
                                </p>
                                <div className="mb-3">
                                    <input
                                        className="form-control"
                                        type="file"
                                        id="file"
                                        onChange={e => setFile(e.target.files?.[0] || null)}
                                    />
                                </div>
                                <button
                                    className="btn btn-primary w-100"
                                    onClick={localUpload}
                                    disabled={!file || busy}
                                >
                                    {busy ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Indexing...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-upload me-2"></i>Upload & Index
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {msg && (
                    <div className="alert alert-info mt-4 d-flex align-items-center" role="alert">
                        <i className="bi bi-info-circle-fill me-2"></i>
                        <div>{msg}</div>
                    </div>
                )}
            </div>
        </>
    );
}
