"use client";
import { useState, useRef, useEffect } from "react";
import Topbar from "../components/layout/Topbar";
import { useAuthContext } from "../context/AuthContext";
import { ragChat } from "../lib/api";
import "./chat.css";


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

    const suggestions = [
        "Summarize the latest compliance documents",
        "What are the key points?",
        "What is the main theme of the document?",
        "What are the key insights?"
    ];

    return (
        <div className="light-page min-vh-100 d-flex flex-column">
            <Topbar />
            <div className="background-elements">
            </div>
            <div className="container flex-grow-1 d-flex flex-column h-100 py-4" style={{ maxHeight: 'calc(100vh - 80px)', position: 'relative', zIndex: 1 }}>

                <div className="glass-panel w-100 flex-grow-1 d-flex flex-column overflow-hidden position-relative shadow-sm" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                    {/* Header */}
                    <div className="p-4 d-flex align-items-center justify-content-between z-10 border-bottom" style={{ borderColor: 'var(--border)' }}>
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center text-white shadow-md pulse-animation" style={{ width: 48, height: 48 }}>
                                <i className="bi bi-stars fs-4"></i>
                            </div>
                            <div>
                                <h5 className="mb-0 fw-bold">AI Concierge</h5>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="status-dot"></div>
                                    <small className="text-muted fw-medium">Ready to assist</small>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-icon btn-light border rounded-circle shadow-sm" title="Clear Chat" onClick={() => setMessages([])}>
                                <i className="bi bi-trash3 text-muted"></i>
                            </button>
                            <button className="btn btn-icon btn-light border rounded-circle shadow-sm" title="Settings">
                                <i className="bi bi-gear text-muted"></i>
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-grow-1 p-4 p-md-5 overflow-auto custom-scrollbar scroll-smooth" style={{ background: '#f8fafc' }}>
                        {messages.length === 0 && (
                            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center fade-in">
                                <div className="mb-4 p-4 rounded-circle bg-white shadow-sm border d-inline-flex" style={{ borderColor: 'var(--border)' }}>
                                    <i className="bi bi-chat-square-quote display-3 text-primary opacity-25"></i>
                                </div>
                                <h3 className="fw-bold mb-3">How can I help you today?</h3>
                                <p className="text-muted mb-5 max-w-md fw-medium">I can analyze your documents, answer questions, and generate insights from your knowledge base.</p>

                                <div className="d-flex flex-wrap justify-content-center text-start gap-3" style={{ maxWidth: '800px' }}>
                                    {suggestions.map((suggestion, i) => (
                                         <button
                                             key={i}
                                             className="btn btn-white rounded-pill px-4 py-3 text-start shadow-sm hover-lift border fw-bold"
                                             onClick={() => { setInput(suggestion); }}
                                             style={{ borderColor: 'var(--border)', color: '#475569', fontSize: '0.9rem' }}
                                         >
                                             <i className="bi bi-lightbulb me-2 text-warning"></i>
                                             {suggestion}
                                         </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={`d-flex mb-4 fade-in-up ${msg.role === "user" ? "justify-content-end" : "justify-content-start"}`}>
                                {msg.role !== "user" && (
                                    <div className="flex-shrink-0 me-3 mt-1">
                                        <div className="bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm" style={{ width: 32, height: 32 }}>
                                            <i className="bi bi-stars"></i>
                                        </div>
                                    </div>
                                )}
                                <div
                                    className={`p-3 p-md-4 rounded-4 shadow-sm position-relative ${msg.role === "user"
                                        ? "bg-primary text-white ms-5 shadow-lg"
                                        : "bg-white text-dark me-5 border"
                                        }`}
                                    style={{
                                        maxWidth: '85%',
                                        borderColor: msg.role === 'assistant' ? 'var(--border)' : 'transparent',
                                        borderTopRightRadius: msg.role === 'user' ? '4px' : '24px',
                                        borderTopLeftRadius: msg.role === 'assistant' ? '4px' : '24px'
                                    }}
                                >
                                    <div className="content fw-medium">
                                        {msg.content}
                                    </div>
                                    <div className={`text-end mt-2 opacity-50 small fw-bold ${msg.role === 'user' ? 'text-white' : 'text-muted'}`}>
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                {msg.role === "user" && (
                                    <div className="flex-shrink-0 ms-3 mt-1">
                                        <div className="bg-light border rounded-circle d-flex align-items-center justify-content-center text-muted shadow-sm" style={{ width: 32, height: 32 }}>
                                            <i className="bi bi-person-fill"></i>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="d-flex justify-content-start mb-4">
                                <div className="flex-shrink-0 me-3 mt-1">
                                    <div className="bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm" style={{ width: 32, height: 32 }}>
                                        <i className="bi bi-stars"></i>
                                    </div>
                                </div>
                                <div className="bg-white p-3 rounded-4 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
                                    <div className="typing-indicator">
                                        <span className="bg-primary"></span>
                                        <span className="bg-primary"></span>
                                        <span className="bg-primary"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-top position-relative z-10" style={{ borderColor: 'var(--border)' }}>
                        <form onSubmit={handleSend} className="position-relative">
                            <input
                                type="text"
                                className="form-control form-control-lg rounded-pill ps-5 pe-5 shadow-sm"
                                placeholder="Type your message..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                autoFocus
                                style={{
                                    height: '64px',
                                    background: '#fff',
                                    border: '1px solid var(--border)',
                                    color: '#000',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    transition: 'all 0.2s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--primary)';
                                    e.target.style.boxShadow = '0 0 0 4px rgba(255, 107, 107, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--border)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            <button
                                className="position-absolute top-50 end-0 translate-middle-y me-3 btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow-md hover-scale"
                                style={{ width: 44, height: 44 }}
                                disabled={loading || !input.trim()}
                            >
                                <i className="bi bi-send-fill fs-5"></i>
                            </button>
                        </form>
                        <div className="text-center mt-3">
                            <small className="text-muted fw-bold" style={{ fontSize: '0.7rem' }}>
                                <i className="bi bi-info-circle me-1"></i> AI can make mistakes. Please verify important information.
                            </small>
                        </div>
                    </div>
                </div>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            </div>
        </div>
    );
}
