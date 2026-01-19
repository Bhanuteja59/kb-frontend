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

    const suggestions = [
        "Summarize the latest compliance documents",
        "What are the key points ",
        "What is the main theme of the document?",
        "what are the key insights?"
    ];

    return (
        <>
            <Topbar />
            <div className="container-fluid min-vh-100 d-flex flex-column text-white pt-5 mt-4" style={{ background: 'radial-gradient(circle at 50% -20%, rgba(99, 102, 241, 0.15), transparent 70%)' }}>
                <div className="container flex-grow-1 d-flex flex-column h-100 py-4" style={{ maxHeight: 'calc(100vh - 80px)' }}>

                    <div className="glass-panel w-100 flex-grow-1 d-flex flex-column overflow-hidden position-relative white-glow-shadow">
                        {/* Header */}
                        <div className="glass-header p-4 d-flex align-items-center justify-content-between z-10">
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center text-white shadow-lg pulse-animation" style={{ width: 48, height: 48 }}>
                                    <i className="bi bi-stars fs-4"></i>
                                </div>
                                <div>
                                    <h5 className="mb-0 text-white fw-bold">AI Concierge</h5>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="status-dot"></div>
                                        <small className="text-light opacity-75">Ready to assist</small>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-icon btn-glass rounded-circle" title="Clear Chat" onClick={() => setMessages([])}>
                                    <i className="bi bi-trash3"></i>
                                </button>
                                <button className="btn btn-icon btn-glass rounded-circle" title="Settings">
                                    <i className="bi bi-gear"></i>
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-grow-1 p-4 p-md-5 overflow-auto custom-scrollbar scroll-smooth">
                            {messages.length === 0 && (
                                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center fade-in">
                                    <div className="mb-4 p-4 rounded-circle bg-white bg-opacity-5 d-inline-flex">
                                        <i className="bi bi-chat-square-quote display-3 text-primary opacity-50"></i>
                                    </div>
                                    <h3 className="fw-bold mb-3">How can I help you today?</h3>
                                    <p className="text-white opacity-50 mb-5 max-w-md">I can analyze your documents, answer questions, and generate insights.</p>

                                    <div className="d-flex flex-wrap justify-content-center text-start gap-3" style={{ maxWidth: '800px' }}>
                                        {suggestions.map((suggestion, i) => (
                                            <button
                                                key={i}
                                                className="btn btn-glass rounded-pill px-4 py-2 text-start text-white"
                                                onClick={() => { setInput(suggestion); document.querySelector('input')?.focus(); }}
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
                                            <div className="bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center text-white text-xs shadow-sm" style={{ width: 32, height: 32 }}>
                                                <i className="bi bi-stars"></i>
                                            </div>
                                        </div>
                                    )}
                                    <div
                                        className={`p-3 p-md-4 rounded-4 shadow-sm position-relative white-glow-shadow ${msg.role === "user"
                                            ? "bg-primary text-white custom-bubble-user ms-5"
                                            : "glass-morphism-light text-light custom-bubble-ai me-5"
                                            }`}
                                        style={{
                                            maxWidth: '85%',
                                            backdropFilter: 'blur(10px)',
                                            borderTopRightRadius: msg.role === 'user' ? '4px' : '24px',
                                            borderTopLeftRadius: msg.role === 'assistant' ? '4px' : '24px'
                                        }}
                                    >
                                        {msg.role === 'assistant' ? (
                                            <div className="markdown-body" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />
                                        ) : (
                                            msg.content
                                        )}
                                        <div className={`text-end mt-1 opacity-50 small ${msg.role === 'user' ? 'text-white-50' : 'text-muted'}`}>
                                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    {msg.role === "user" && (
                                        <div className="flex-shrink-0 ms-3 mt-1">
                                            <div className="bg-secondary bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm" style={{ width: 32, height: 32 }}>
                                                <i className="bi bi-person-fill"></i>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {loading && (
                                <div className="d-flex justify-content-start mb-4">
                                    <div className="flex-shrink-0 me-3 mt-1">
                                        <div className="bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: 32, height: 32 }}>
                                            <i className="bi bi-stars"></i>
                                        </div>
                                    </div>
                                    <div className="glass-morphism-light p-3 rounded-4 custom-bubble-ai">
                                        <div className="typing-indicator">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 glass-header position-relative z-10">
                            <form onSubmit={handleSend} className="position-relative">
                                <input
                                    type="text"
                                    className="form-control form-control-lg rounded-pill custom-input ps-5 pe-5 shadow-inner"
                                    placeholder="Type your message..."
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    autoFocus
                                    style={{
                                        height: '60px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                />
                                <div className="position-absolute top-50 start-0 translate-middle-y ms-4 text-white opacity-50">
                                    {/* <i className="bi bi-chat-text fs-5"></i> */}
                                </div>
                                <button
                                    className="position-absolute top-50 end-0 translate-middle-y me-2 btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow-lg hover-scale"
                                    style={{ width: 48, height: 48 }}
                                    disabled={loading || !input.trim()}
                                >
                                    <i className="bi bi-send-fill fs-5"></i>
                                </button>
                            </form>
                            <div className="text-center mt-2">
                                <small className="text-muted opacity-50" style={{ fontSize: '0.7rem' }}>
                                    AI can make mistakes. Please verify important information.
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .bg-gradient-primary {
                    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                }
                .glass-morphism-light {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #22c55e;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #22c55e;
                }
                .custom-input::placeholder {
                    color: rgba(255, 255, 255, 0.3);
                }
                .custom-input:focus {
                    background: rgba(255, 255, 255, 0.1) !important;
                    box-shadow: 0 0 20px rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) !important;
                    border-color: rgba(255, 255, 255, 0.8) !important;
                    transform: scale(1.01);
                }
                .pulse-animation {
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
                }
                .typing-indicator {
                    display: flex;
                    gap: 5px;
                    padding: 5px;
                }
                .typing-indicator span {
                    width: 8px;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    animation: bounce 1.4s infinite ease-in-out both;
                }
                .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
                .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
                .fade-in-up {
                    animation: fadeInUp 0.4s ease-out forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .hover-scale:hover {
                    transform: translateY(-50%) scale(1.05) !important;
                }
            `}</style>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </>
    );
}
