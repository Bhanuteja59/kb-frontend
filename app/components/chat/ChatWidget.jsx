"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ragChat } from "../../lib/api";
import "./ChatWidget.css";

export default function ChatWidget({ embedded = false, org }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: "welcome", role: "assistant", text: "👋 Hi! Ask me anything." },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const bottomRef = useRef(null);
    const textareaRef = useRef(null);

    // Auto-open when embedded
    useEffect(() => {
        if (embedded) setIsOpen(true);
    }, [embedded]);

    // Fetch Org Info
    const [orgName, setOrgName] = useState("AI Chatbot");
    const [isValid, setIsValid] = useState(null); // null = checking, true = valid, false = invalid

    useEffect(() => {
        if (!org) {
            setIsValid(false);
            return;
        }

        async function fetchOrgInfo() {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
                const res = await fetch(`${baseUrl}/public/org/${org}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrgName(data.name);
                    setMessages(prev => {
                        if (prev[0]?.id === 'welcome') {
                            return [{ ...prev[0], text: data.welcome_message }];
                        }
                        return prev;
                    });
                    setIsValid(true);
                } else {
                    console.warn("Invalid Org ID");
                    setIsValid(false);
                }
            } catch (err) {
                console.warn("Failed to fetch org info:", err);
                setIsValid(false);
            }
        }
        fetchOrgInfo();
    }, [org]);

    // Smooth auto-scroll
    useEffect(() => {
        if (!isOpen) return;
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading, isOpen]);

    // Auto-grow textarea
    useEffect(() => {
        if (!textareaRef.current) return;
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height =
            Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }, [input]);



    const canSend = useMemo(
        () => input.trim().length > 0 && !loading,
        [input, loading]
    );

    async function send() {
        if (!canSend) return;

        const text = input.trim();
        setInput("");

        setMessages((m) => [
            ...m,
            { id: crypto.randomUUID(), role: "user", text },
        ]);

        setLoading(true);
        try {
            const res = await ragChat(text, org);
            setMessages((m) => [
                ...m,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    text: res.answer || "No answer found.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    function onKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    }

    // VALIDATION GUARD
    if (isValid === false) {
        if (embedded) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    backgroundColor: '#f8fafc',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    color: '#1e293b',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Bot Unavailable</h2>
                    <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '400px', lineHeight: '1.5' }}>
                        The Organization ID provided <code>({org})</code> is invalid or active access credentials are missing.
                    </p>
                    <div style={{ marginTop: '24px', padding: '12px 20px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', color: '#64748b' }}>
                        Please verify your <strong>data-org-id</strong> configuration.
                    </div>
                </div>
            );
        }
        return null; // Hide toggle button if invalid
    }

    return (
        <>
            {/* CHAT WINDOW */}
            <div className={`chat-window ${isOpen ? "open" : ""}`}>
                <div className="chat-card">
                    {/* HEADER */}
                    <div className="chat-header">
                        <div>
                            <strong>{orgName} </strong>
                            <div className="status">● Online</div>
                        </div>
                        {!embedded && (
                            <button
                                className="close-btn"
                                onClick={() => setIsOpen(false)}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* MESSAGES */}
                    <div className="chat-messages">
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`chat-message ${m.role}`}
                            >
                                <div className="bubble">
                                    <ReactMarkdown>{m.text}</ReactMarkdown>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="chat-message assistant">
                                <div className="bubble typing">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>

                    {/* INPUT */}
                    <div className="chat-input">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={onKeyDown}
                            placeholder="Type a message…"
                            disabled={loading}
                        />
                        <button
                            onClick={send}
                            disabled={!canSend}
                        >
                            Send
                        </button>
                    </div>

                    <div className="chat-footer">
                        Developed by Teja
                    </div>
                </div>
            </div>

            {/* TOGGLE BUTTON */}
            {!embedded && (
                <button
                    className="chat-toggle"
                    onClick={() => setIsOpen((v) => !v)}
                >
                    {isOpen ? (
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                        </svg>
                    )}
                </button>
            )}
        </>
    );
}
