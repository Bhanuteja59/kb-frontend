export const API_BASE = (
    process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000"
).replace(/\/$/, "");

export const TOKEN_KEY = "kb_token";

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
export const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
