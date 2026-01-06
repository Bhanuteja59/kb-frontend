"use client";
import { useState } from "react";
import Topbar from "../components/layout/Topbar";
import { uploadDocument, uploadFromDrive } from "../lib/api";
import DrivePicker from "../components/documents/DrivePicker";
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

    async function driveUpload(picked, accessToken) {
        setBusy(true); setMsg(null);
        try {
            const data = await uploadFromDrive({ file_id: picked.id, access_token: accessToken });
            setMsg(`Drive file indexed: ${picked.name} → ${data.doc_id} (${data.chunks} chunks)`);
        } catch (e) {
            setMsg(e.message || "Drive ingestion failed");
        } finally {
            setBusy(false);
        }
    }

    return (
        <>
            <Topbar />
            <div className="container">
                <h1 style={{ marginTop: 0 }}>Upload</h1>

                <div className="card">
                    <h2 style={{ marginTop: 0 }}>Chunking settings (token-based)</h2>
                    <p className="muted">These control chunk size and overlap in tokens (better aligned with LLMs than characters).</p>
                    <div className="grid2">
                        <div>
                            <label>Chunk tokens</label>
                            <input className="input" type="number" value={chunkTokens} onChange={e => setChunkTokens(parseInt(e.target.value || "500", 10))} />
                        </div>
                        <div>
                            <label>Overlap tokens</label>
                            <input className="input" type="number" value={overlapTokens} onChange={e => setOverlapTokens(parseInt(e.target.value || "80", 10))} />
                        </div>
                    </div>
                </div>

                <div className="card" style={{ marginTop: 12 }}>
                    <h2 style={{ marginTop: 0 }}>Local upload</h2>
                    <p className="muted">Upload PDF, DOCX, TXT/MD, or CSV to index into Qdrant.</p>
                    <input id="file" type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
                    <div style={{ height: 12 }} />
                    <button className="btn" onClick={localUpload} disabled={!file || busy}>
                        {busy ? "Indexing..." : "Upload & index"}
                    </button>
                </div>

                <div className="card" style={{ marginTop: 12 }}>
                    <h2 style={{ marginTop: 0 }}>Google Drive upload (fully wired)</h2>
                    <p className="muted">Pick a file from your Drive and index it without downloading it manually.</p>
                    <DrivePicker onPicked={driveUpload} />
                </div>

                {msg ? <div className="card" style={{ marginTop: 12 }}>{msg}</div> : null}
            </div>
        </>
    );
}
