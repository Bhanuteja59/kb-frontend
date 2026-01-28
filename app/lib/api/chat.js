import { apiFetch } from "./client";

/**
 * Send a chat query to the RAG API
 * @param {string} query - User's question
 * @param {string|null} org - Organization slug for filtering (optional, for embedded widgets)
 * @param {number} topK - Number of relevant chunks to retrieve
 * @returns {Promise<{answer: string, citations: Array}>}
 */
export async function ragChat(query, org = null, topK = 6) {
    const res = await apiFetch("/rag/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query,
            top_k: topK,
            org_id: org  // Send organization slug for scoping
        }),
    });

    return res.json();
}
