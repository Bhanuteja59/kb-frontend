"use client";
import { useState } from "react";
import Topbar from "../components/layout/Topbar";
import { uploadDocument } from "../lib/api";
import { useRouter } from "next/navigation";
import AlertModal from "../components/ui/AlertModal";

export default function UploadPage() {
    const router = useRouter();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState(null);
    const [params, setParams] = useState({ chunk_tokens: 512, overlap_tokens: 50 });
    const [alertData, setAlertData] = useState({ isOpen: false, title: "", body: "", type: "danger" });

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setStatus("Uploading...");

        // We need to access the underlying error code from uploadDocument if it fails
        // But our api utility usually throws Error. We might need to adjust logic or catch error message content.
        try {
            await uploadDocument(file, params.chunk_tokens, params.overlap_tokens);
            setStatus("Success! Processing vectors...");
            setTimeout(() => router.push("/documents"), 1500);
        } catch (err) {
            setUploading(false);

            // Check if it's our structured limit error (which might come as a JSON string in err.message or require parsing)
            // The apiFetch throws `new Error(json.detail || ...)`
            // If documents.py sends a dict as detail, apiFetch might stringify it or just use 'message'.
            // Let's rely on the error text for now or modify apiFetch.
            // Assuming apiFetch puts the detail string/object into the error message.

            if (err.message && err.message.includes("LIMIT_EXCEEDED")) {
                setAlertData({
                    isOpen: true,
                    title: "Document Limit Reached",
                    body: "You have reached the maximum of 3 documents allowance.", // Simplifying for now as parsing stringified JSON is flaky
                    type: "danger"
                });
                setStatus(null);
                return;
            } else if (err.message && err.message.includes("Upgrade your plan")) {
                setAlertData({
                    isOpen: true,
                    title: "Limit Reached",
                    body: "You have reached your document upload limit.",
                    type: "danger"
                });
                setStatus(null);
                return;
            }

            setStatus("Error: " + err.message);
        }
    };

    return (
        <>
            <Topbar />
            <div className="container py-4 fade-in text-white">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="glass-panel p-5 text-center">
                            <div className="mb-4">
                                <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-3" style={{ width: 64, height: 64 }}>
                                    <i className="bi bi-cloud-arrow-up text-primary" style={{ fontSize: '2rem' }}></i>
                                </div>
                                <h1 className="h3 text-white">Upload Knowledge</h1>
                                <p className="text-light opacity-75">Supports PDF, DOCX, and TXT files</p>
                            </div>

                            <form onSubmit={handleUpload}>
                                {/* Chunking Options (Collapsible or just inline) */}
                                <div className="row g-3 mb-4 text-start">
                                    <div className="col-md-6">
                                        <label className="form-label small text-uppercase fw-bold text-muted">Chunk Size</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={params.chunk_tokens}
                                            onChange={e => setParams({ ...params, chunk_tokens: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small text-uppercase fw-bold text-muted">Overlap</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={params.overlap_tokens}
                                            onChange={e => setParams({ ...params, overlap_tokens: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                {/* File Input (Hidden real input, styled label) */}
                                <div className="mb-4 position-relative">
                                    <input
                                        type="file"
                                        id="fileInput"
                                        className="form-control position-absolute opacity-0 top-0 start-0 h-100"
                                        style={{ cursor: 'pointer' }}
                                        onChange={(e) => setFile(e.target.files[0])}
                                        accept=".pdf,.docx,.txt"
                                    />
                                    <div className="p-5 border-2 border-dashed rounded-3" style={{ borderColor: 'var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                                        {file ? (
                                            <div>
                                                <i className="bi bi-file-earmark-check text-success display-4 mb-2"></i>
                                                <h5 className="mb-0">{file.name}</h5>
                                                <p className="text-muted small">Ready to upload</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="lead mb-1">Drag & Drop or Click to Browse</p>
                                                <p className="text-muted small">Max file size: 10MB</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button
                                    className="btn btn-primary btn-lg rounded-pill w-100 py-3"
                                    disabled={!file || uploading}
                                >
                                    {uploading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Indexing...
                                        </>
                                    ) : (
                                        "Start Ingestion"
                                    )}
                                </button>

                                {status && (
                                    <div className={`mt-3 alert ${status.includes("Error") ? "alert-danger" : "alert-success"} glass-panel border-0`}>
                                        {status}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <AlertModal
                isOpen={alertData.isOpen}
                title={alertData.title}
                body={alertData.body}
                type={alertData.type}
                onClose={() => setAlertData({ ...alertData, isOpen: false })}
            />

            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </>
    );
}
