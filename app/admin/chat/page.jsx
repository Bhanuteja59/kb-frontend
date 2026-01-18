"use client";
import { useState, useRef, useEffect } from "react";
import Topbar from "../../components/layout/Topbar";
import { useAuthContext } from "../../context/AuthContext";
import { ragChat } from "../../lib/api";

export default function ChatPage() {
    const { user } = useAuthContext();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            // Use org_slug from user context if available
            const orgIdentifier = user?.org_slug || user?.org_id || "default";

            const data = await ragChat(userMsg.content, orgIdentifier);

            if (data.answer) {
                setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
            } else {
                setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error (No answer)." }]);
            }
        } catch (err) {
            console.error("Chat Error:", err);
            setMessages(prev => [...prev, { role: "assistant", content: "Error connecting to AI. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Topbar />
            <div className="container py-4 fade-in text-white" style={{ height: 'calc(100vh - 100px)' }}>
                <div className="glass-panel h-100 d-flex flex-column overflow-hidden">
                    {/* Header */}
                    <div className="glass-header p-3 d-flex align-items-center gap-3">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: 40, height: 40 }}>
                            <i className="bi bi-robot"></i>
                        </div>
                        <div>
                            <h5 className="mb-0 text-white">Assistant</h5>
                            <small className="text-light opacity-75">Powered by RAG</small>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-grow-1 p-4 overflow-auto custom-scrollbar">
                        {messages.length === 0 && (
                            <div className="text-center text-muted mt-5">
                                <i className="bi bi-chat-heart display-1 opacity-25"></i>
                                <p className="mt-3">Ask me anything about your documents!</p>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={`d-flex mb-3 ${msg.role === "user" ? "justify-content-end" : "justify-content-start"}`}>
                                <div
                                    className={`p-3 rounded-4 shadow-sm ${msg.role === "user" ? "bg-primary text-white custom-bubble-user" : "bg-dark bg-opacity-50 text-light border border-secondary custom-bubble-ai"}`}
                                    style={{ maxWidth: '80%', backdropFilter: 'blur(5px)' }}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="d-flex justify-content-start mb-3">
                                <div className="bg-dark bg-opacity-50 p-3 rounded-4 text-muted">
                                    <span className="spinner-dots">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 glass-header">
                        <form onSubmit={handleSend} className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control form-control-lg rounded-pill shadow-none"
                                placeholder="Type your message..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }}
                                autoFocus
                            />
                            <button
                                className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow-lg"
                                style={{ width: 50, height: 50 }}
                                disabled={loading || !input.trim()}
                            >
                                <i className="bi bi-send-fill"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 3px;
                }
                .custom-bubble-user {
                    border-bottom-right-radius: 4px !important;
                }
                .custom-bubble-ai {
                    border-bottom-left-radius: 4px !important;
                }
            `}</style>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </>
    );
}
