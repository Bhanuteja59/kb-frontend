import { apiFetch } from "./client";
import { API_BASE } from "../constants";
import { getToken } from "../utils/token";

export async function getDocuments() {
    const res = await apiFetch("/documents");
    return res.json();
}

export async function getDocument(docId) {
    const res = await apiFetch(`/documents/${docId}`);
    return res.json();
}

export async function uploadDocument(
    file,
    source = "local",
    chunkTokens = 500,
    overlapTokens = 80
) {
    const token = getToken();
    const form = new FormData();
    form.append("file", file);
    form.append("source", source);
    form.append("chunk_tokens", String(chunkTokens));
    form.append("overlap_tokens", String(overlapTokens));

    const res = await fetch(`${API_BASE}/ingest`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return res.json();
}

export async function uploadFromDrive(data) {
    const res = await apiFetch("/ingest/drive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    return res.json();
}

export async function deleteDocument(docId) {
    await apiFetch(`/documents/${docId}`, { method: "DELETE" });
}

export async function restoreDocument(docId) {
    await apiFetch(`/documents/${docId}/restore`, { method: "POST" });
}
