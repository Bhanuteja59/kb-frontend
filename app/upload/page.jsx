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
        <div className="min-vh-100 bg-dark-100  d-flex flex-column font-sans">
            <Topbar />

            <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-7">
                            <div className="card shadow-lg border-0 overflow-hidden rounded-4 white-glow-shadow">
                                {/* Header Section */}
                                <div className="bg-dark text-white text-center position-relative overflow-hidden"
                                    style={{ paddingTop: '100px', paddingBottom: '3rem', marginTop: '-70px' }}>
                                    <div className="position-absolute top-0 start-0 w-100 h-100"
                                        style={{ background: 'linear-gradient(45deg, rgba(255,255,255,0.05) 0%, transparent 100%)', zIndex: 0 }}></div>

                                    <div className="position-relative z-1 px-4">
                                        <div className="mb-4 d-inline-block bg-white bg-opacity-10 p-3 rounded-circle backdrop-blur">
                                            <i className="bi bi-clouds-fill fs-1 text-white"></i>
                                        </div>
                                        <h2 className="fw-bold mb-2">Ingest Knowledge</h2>
                                        <p className="opacity-75 mb-0" style={{ maxWidth: '400px', margin: '0 auto' }}>Upload documents to train your RAG agent. Supported formats: PDF, DOCX, TXT.</p>
                                    </div>
                                </div>

                                <div className="card-body p-4 p-md-5 bg-white">
                                    <form onSubmit={handleUpload}>

                                        {/* Drag & Drop Zone */}
                                        <div className="mb-5">
                                            <div className="position-relative group">
                                                <input
                                                    type="file"
                                                    id="fileInput"
                                                    className="form-control position-absolute opacity-0 top-0 start-0 w-100 h-100 z-1"
                                                    style={{ cursor: 'pointer' }}
                                                    onChange={(e) => setFile(e.target.files[0])}
                                                    accept=".pdf,.docx,.txt"
                                                />
                                                <div
                                                    className={`p-5 rounded-4 border-2 border-dashed text-center transition-all ${file ? 'border-success bg-success bg-opacity-10' : 'border-black bg-light hover-bg-light-dark'}`}
                                                    style={{ transition: 'all 0.2s ease', borderColor: file ? '' : 'black' }}
                                                >
                                                    {file ? (
                                                        <div className="py-3">
                                                            <div className="mb-3 text-success">
                                                                <i className="bi bi-file-earmark-check-fill display-3"></i>
                                                            </div>
                                                            <h5 className="fw-bold text-dark mb-1">{file.name}</h5>
                                                            <span className="badge bg-success bg-opacity-25 text-success rounded-pill px-3">Ready to Index</span>
                                                        </div>
                                                    ) : (
                                                        <div className="py-3 opacity-50 group-hover-opacity-100">
                                                            <div className="mb-3 text-primary">
                                                                <i className="bi bi-cloud-arrow-up display-3"></i>
                                                            </div>
                                                            <h5 className="fw-bold text-dark mb-2">Drop your file here</h5>
                                                            <p className="small text-muted mb-3">or click to browse from device</p>
                                                            <span className="badge bg-light text-secondary border rounded-pill px-3">Max 10MB</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Configuration (Optional) */}
                                        <div className="accordion mb-4" id="uploadSettings">
                                            <div className="accordion-item border-0">
                                                <h2 className="accordion-header">
                                                    <button className="accordion-button collapsed bg-white shadow-sm rounded-3 fw-semibold text-dark border border-black" type="button" data-bs-toggle="collapse" data-bs-target="#advancedSettings">
                                                        <i className="bi bi-sliders me-2"></i> Advanced AI Settings
                                                    </button>
                                                </h2>
                                                <div id="advancedSettings" className="accordion-collapse collapse" data-bs-parent="#uploadSettings">
                                                    <div className="accordion-body bg-light rounded-3 mt-2">
                                                        <div className="row g-3">
                                                            <div className="col-md-6">
                                                                <label className="form-label small fw-bold text-uppercase text-muted">Chunk Size (Tokens)</label>
                                                                <div className="input-group">
                                                                    <span className="input-group-text bg-white border border-black border-end-0"><i className="bi bi-scissors"></i></span>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control border border-black border-start-0 shadow-sm"
                                                                        value={params.chunk_tokens}
                                                                        onChange={e => setParams({ ...params, chunk_tokens: parseInt(e.target.value) })}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <label className="form-label small fw-bold text-uppercase text-muted">Overlap</label>
                                                                <div className="input-group">
                                                                    <span className="input-group-text bg-white border border-black border-end-0"><i className="bi bi-layers"></i></span>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control border border-black border-start-0 shadow-sm"
                                                                        value={params.overlap_tokens}
                                                                        onChange={e => setParams({ ...params, overlap_tokens: parseInt(e.target.value) })}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Messages */}
                                        {status && (
                                            <div className={`mb-4 rounded-3 p-3 d-flex align-items-center ${status.includes("Error") ? "bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25" : "bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25"}`}>
                                                {status.includes("Error") ? <i className="bi bi-exclamation-octagon-fill me-3 fs-4"></i> : <div className="spinner-border spinner-border-sm me-3 border-2"></div>}
                                                <div className="fw-semibold">{status}</div>
                                            </div>
                                        )}

                                        {/* Action Button */}
                                        <button
                                            className="btn btn-dark w-100 py-3 rounded-3 fw-bold fs-5 shadow-lg transition-transform hover-scale d-flex align-items-center justify-content-center gap-2"
                                            disabled={!file || uploading}
                                        >
                                            {uploading ? (
                                                <>Processing Brain...</>
                                            ) : (
                                                <>Ingest Document <i className="bi bi-lightning-charge-fill text-warning"></i></>
                                            )}
                                        </button>

                                        <div className="text-center mt-4">
                                            <a href="/documents" className="text-decoration-none small text-muted hover-text-dark fw-semibold">
                                                <i className="bi bi-arrow-left me-1"></i> Back to Library
                                            </a>
                                        </div>
                                    </form>
                                </div>
                            </div>
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
            {/* Helper Styles for Hover Effects */}
            <style jsx>{`
                .hover-bg-light-dark:hover { background-color: #f8f9fa !important; border-color: #adb5bd !important; }
                .hover-scale:active { transform: scale(0.98); }
                .backdrop-blur { backdrop-filter: blur(10px); }
            `}</style>
        </div>
    );
}
