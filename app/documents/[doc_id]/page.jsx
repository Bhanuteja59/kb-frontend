"use client";
import { useEffect, useState } from "react";
import Topbar from "../../components/layout/Topbar";
import { apiFetch } from "../../lib/api";
import Link from "next/link";

export default function DocDetails({ params }) {
    const [data, setData] = useState(null);
    const [err, setErr] = useState(null);
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        apiFetch(`/documents/${params.doc_id}`).then(r => r.json()).then(setData).catch(e => setErr(e.message));
    }, [params.doc_id]);

    return (
        <>
            <Topbar />
            <div className="container">
                <div className="row" style={{ justifyContent: "space-between" }}>
                    <h1 style={{ margin: 0 }}>Document Details</h1>
                    <Link className="btn secondary" href="/documents">Back</Link>
                </div>

                {err ? <div className="card" style={{ marginTop: 12, color: "#b91c1c" }}>{err}</div> : null}
                {!data ? <div className="card" style={{ marginTop: 12 }}>Loading...</div> : (
                    <>
                        <div className="card" style={{ marginTop: 12 }}>
                            <div className="row" style={{ justifyContent: "space-between" }}>
                                <div>
                                    <h2 style={{ marginTop: 0 }}>{data.document.filename}</h2>
                                    <div className="muted">{data.document.doc_id} • {data.document.file_type} • {data.document.source}</div>
                                </div>
                                {data.document.is_deleted ? <span className="pill">deleted</span> : <span className="pill">active</span>}
                            </div>
                        </div>

                        <div className="row" style={{ marginTop: 12, alignItems: "stretch" }}>
                            <div className="card" style={{ flex: "1 1 340px", minWidth: 320 }}>
                                <h3 style={{ marginTop: 0 }}>Token-based chunks</h3>
                                <div className="muted" style={{ marginBottom: 8 }}>Chunks are created by token count + overlap.</div>
                                <div style={{ maxHeight: 520, overflow: "auto" }}>
                                    {data.chunks.map((c, idx) => (
                                        <button
                                            key={c.chunk_id}
                                            className="btn secondary"
                                            style={{ width: "100%", textAlign: "left", marginBottom: 8, borderColor: idx === selected ? "#111827" : "#e5e7eb" }}
                                            onClick={() => setSelected(idx)}
                                        >
                                            <div style={{ fontWeight: 800 }}>Chunk #{c.chunk_index}</div>
                                            <div className="muted" style={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {c.text}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="card" style={{ flex: "2 1 520px", minWidth: 320 }}>
                                <h3 style={{ marginTop: 0 }}>Chunk preview</h3>
                                <div className="muted">Used during retrieval to answer user queries.</div>
                                <div style={{ height: 10 }} />
                                <textarea className="textarea" rows={22} value={data.chunks[selected]?.text || ""} readOnly />
                                <div style={{ marginTop: 10 }} className="muted">
                                    Chunk ID: <code>{data.chunks[selected]?.chunk_id}</code>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
