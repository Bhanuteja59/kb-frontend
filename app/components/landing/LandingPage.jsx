"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { useAuthContext } from "../../context/AuthContext";
import "./LandingPage.css";


export default function LandingPage() {
    const [activeFeature, setActiveFeature] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [videoPlaying, setVideoPlaying] = useState(false);
    const [stats, setStats] = useState({ users: 1250, documents: 58000, queries: 2500000 });
    const videoRef = useRef(null);
    const heroRef = useRef(null);
    const featuresRef = useRef([]);

    const features = [
        {
            icon: 'bi-database-fill',
            title: 'Document Ingestion',
            description: 'Seamlessly upload PDF, DOCX, and TXT files. Our intelligent engine automatically chunks and vectorizes your data.',
            color: '#3b82f6',
            gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)'
        },
        {
            icon: 'bi-search',
            title: 'Semantic Search',
            description: 'Advanced AI-powered search that understands context and intent, not just keywords.',
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)'
        },
        {
            icon: 'bi-chat-square-text-fill',
            title: 'AI Chatbot',
            description: 'Natural conversations with your data. Get precise answers with source citations.',
            color: '#10b981',
            gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)'
        },
        {
            icon: 'bi-share-fill',
            title: 'Embed & Integrate',
            description: 'Embed our chatbot into any website or integrate with your existing systems.',
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)'
        }
    ];



    const securityFeatures = [
        { name: 'AES-256 Encryption', icon: 'bi-shield-lock' },
        { name: 'SOC 2 Compliance', icon: 'bi-check-circle' },
        { name: 'Multi-Factor Auth', icon: 'bi-key' },
        { name: 'Data Isolation', icon: 'bi-hdd-network' },
        { name: 'Audit Logging', icon: 'bi-journal-text' },
        { name: 'GDPR Ready', icon: 'bi-globe' }
    ];

    // Mouse movement effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);

            // Animate stats
            if (window.scrollY > 800) {
                setStats({
                    users: 1250,
                    documents: 58000,
                    queries: 2500000
                });
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-rotate features
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const playVideo = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setVideoPlaying(true);
        }
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const Section = ({ title, children, className = "", id = "" }) => (
        <section id={id} className={`section ${className}`}>
            <div className="container">
                <h2 className="section-title">{title}</h2>
                {children}
            </div>
        </section>
    );

    const FeatureCard = ({ feature, index, isActive }) => (
        <div
            className={`feature-card ${isActive ? 'active' : ''}`}
            style={{ '--feature-color': feature.color }}
            onClick={() => setActiveFeature(index)}
        >
            <div className="feature-icon">
                <i className={`bi ${feature.icon}`}></i>
            </div>
            <div className="feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
            </div>
            <div className="feature-glow"></div>
        </div>
    );



    return (
        <div className="landing-page">
            {/* Animated Background */}
            <div className="animated-background">
                <div className="bg-glow-1" style={{
                    left: `${mousePosition.x}%`,
                    top: `${mousePosition.y}%`
                }}></div>
                <div className="bg-glow-2"></div>
                <div className="bg-particles">
                    {[...Array(50)].map((_, i) => (
                        <div key={i} className="particle"></div>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    <div className="nav-logo">
                        <div className="logo-icon">
                            <i className="bi bi-cpu-fill"></i>
                        </div>
                        <span className="logo-text">KB<span className="logo-highlight">RAG</span></span>
                    </div>

                    <div className="nav-links">
                        <button onClick={() => scrollToSection('features')} className="nav-link">Features</button>
                        <button onClick={() => scrollToSection('security')} className="nav-link">Security</button>
                        {/* <button onClick={() => scrollToSection('pricing')} className="nav-link">Pricing</button> */}
                        <button onClick={() => scrollToSection('contact')} className="nav-link">Contact</button>
                    </div>

                    <div className="nav-actions">
                        <Link href="/login" className="btn btn-outline-light">Sign In</Link>
                        {/* <Link href="/register" className="btn btn-primary">Get Started Free</Link> */}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero" ref={heroRef}>
                <div className="hero-container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <i className="bi bi-stars"></i>
                            Trusted by 1,250+ Companies
                        </div>

                        <h1 className="hero-title">
                            Transform Your Documents into an
                            <span className="hero-highlight"> Intelligent Knowledge Base</span>
                        </h1>

                        <p className="hero-subtitle">
                            Secure, intelligent, and role-based Retrieval-Augmented Generation platform.
                            Turn static documents into interactive AI-powered insights.
                        </p>

                        <div className="hero-actions">
                            <Link href="/login" className="btn btn-primary btn-lg">
                                Get Started for Free
                                <i className="bi bi-arrow-right"></i>
                            </Link>
                            <button className="btn btn-outline-light btn-lg" onClick={() => scrollToSection('features')}>
                                <i className="bi bi-play-circle"></i>
                                Watch Demo
                            </button>
                        </div>

                        <div className="hero-stats">
                            <div className="stat">
                                <div className="stat-value">{stats.users.toLocaleString()}+</div>
                                <div className="stat-label">Active Users</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">{stats.documents.toLocaleString()}+</div>
                                <div className="stat-label">Documents Processed</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">{stats.queries.toLocaleString()}+</div>
                                <div className="stat-label">AI Queries Answered</div>
                            </div>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="visual-container">
                            <div className="floating-element element-1">
                                <i className="bi bi-file-earmark-text"></i>
                            </div>
                            <div className="floating-element element-2">
                                <i className="bi bi-robot"></i>
                            </div>
                            <div className="floating-element element-3">
                                <i className="bi bi-search"></i>
                            </div>
                            <div className="main-visual">
                                <div className="dashboard-preview">
                                    <div className="dashboard-header">
                                        <div className="header-dots">
                                            <span className="dot red"></span>
                                            <span className="dot yellow"></span>
                                            <span className="dot green"></span>
                                        </div>
                                    </div>
                                    <div className="dashboard-content">
                                        <div className="dashboard-stats">
                                            <div className="stat-preview">
                                                <div className="stat-preview-value">98%</div>
                                                <div className="stat-preview-label">Accuracy</div>
                                            </div>
                                            <div className="stat-preview">
                                                <div className="stat-preview-value">2.4s</div>
                                                <div className="stat-preview-label">Avg. Response</div>
                                            </div>
                                        </div>
                                        <div className="chat-preview">
                                            <div className="chat-message ai">
                                                <div className="message-content">
                                                    Based on your Q4 report, revenue increased by 32%...
                                                </div>
                                            </div>
                                            <div className="chat-message user">
                                                <div className="message-content">
                                                    What were our top performing products?
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <Section title="Powerful Features" id="features" className="features-section">
                <div className="features-container">
                    <div className="features-selector">
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={index}
                                feature={feature}
                                index={index}
                                isActive={activeFeature === index}
                            />
                        ))}
                    </div>

                    <div className="features-preview">
                        <div className="preview-container glass-morphism p-2 rounded-4">
                            <img
                                src="/assets/features/demo.png"
                                alt="Feature Preview"
                                className="w-100 h-100 object-fit-cover rounded-3 shadow-lg"
                                style={{ maxHeight: '450px', objectPosition: 'center' }}
                            />
                        </div>
                    </div>
                </div>
            </Section>

            {/* Security Section */}
            <Section title="Enterprise-Grade Security" id="security" className="security-section">
                <div className="security-container">
                    <div className="security-features">
                        {securityFeatures.map((feature, index) => (
                            <div key={index} className="security-feature">
                                <div className="security-icon">
                                    <i className={`bi ${feature.icon}`}></i>
                                </div>
                                <span>{feature.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="security-demo">
                        <div className="security-card">
                            <div className="security-header">
                                <h4 className="fw-bold text-white mb-0">Security Pulse</h4>
                                <div className="pulse-dot"></div>
                            </div>

                            <div className="security-footer">
                                <div className="compliance-info">
                                    <i className="bi bi-shield-check"></i>
                                    <div>
                                        <div className="compliance-title">GDPR & HIPAA Ready</div>
                                        <div className="compliance-desc">Fully compliant with global data protection regulations</div>
                                    </div>
                                </div>
                                <Link href="/security" className="btn btn-outline-light">
                                    Learn More
                                    <i className="bi bi-arrow-up-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* CTA Section */}
            <Section title="Ready to Transform Your Knowledge?" className="cta-section" id="contact">
                <div className="cta-container">
                    <div className="cta-card">
                        <div className="cta-content">
                            <h2>Start Your AI Journey Today</h2>
                            <p>Join thousands of organizations using KB RAG to unlock the power of their knowledge base.</p>

                            <div className="cta-features">
                                <div className="cta-feature">
                                    <i className="bi bi-check-circle-fill"></i>
                                    <span>14-day free trial</span>
                                </div>
                                <div className="cta-feature">
                                    <i className="bi bi-check-circle-fill"></i>
                                    <span>No credit card required</span>
                                </div>
                                <div className="cta-feature">
                                    <i className="bi bi-check-circle-fill"></i>
                                    <span>Full feature access</span>
                                </div>
                            </div>

                            <div className="cta-actions">
                                <Link href="/register" className="btn btn-primary btn-xl">
                                    Get Started Free
                                    <i className="bi bi-arrow-right"></i>
                                </Link>
                                <Link href="/demo" className="btn btn-outline-light btn-xl">
                                    <i className="bi bi-calendar-check"></i>
                                    Schedule Demo
                                </Link>
                            </div>
                        </div>

                        <div className="cta-visual">
                            <div className="testimonial-slider">
                                <div className="testimonial">
                                    <div className="testimonial-content">
                                        "KB RAG transformed how our team accesses information. 40% faster decision making."
                                    </div>
                                    <div className="testimonial-author">
                                        <div className="author-avatar">SD</div>
                                        <div>
                                            <div className="author-name">Sarah Davis</div>
                                            <div className="author-role">CTO, TechCorp Inc.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Floating Chat Assistant */}
            <div className="floating-assistant">
                <div className="assistant-toggle">
                    <i className="bi bi-robot"></i>
                    <span className="assistant-badge">AI</span>
                </div>

                <div className="assistant-chat">
                    <div className="chat-header">
                        <div className="assistant-avatar">
                            <i className="bi bi-robot"></i>
                        </div>
                        <div>
                            <div className="assistant-name">AI Assistant</div>
                            <div className="assistant-status">Online</div>
                        </div>
                    </div>

                    <div className="p-4 text-center">
                        <p className="mb-0 text-white opacity-90" style={{ fontSize: '0.95rem' }}>
                            Please <Link href="/login" className="text-primary fw-bold text-decoration-none">Login</Link> to access the chatbot.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-container">
                    <div className="footer-grid">
                        <div className="footer-col">
                            <div className="footer-logo">
                                <i className="bi bi-cpu-fill"></i>
                                KB RAG
                            </div>
                            <p className="footer-description">
                                Transforming documents into intelligent knowledge bases with AI-powered insights.
                            </p>
                        </div>

                        <div className="footer-col">
                            <h4>Product</h4>
                            <a href="#features">Features</a>
                            <a href="#security">Security</a>
                            <Link href="/pricing">Pricing</Link>
                            <a href="#contact">Contact</a>
                        </div>

                        <div className="footer-col">
                            <h4>Resources</h4>
                            <a href="/docs">Documentation</a>
                            <a href="/blog">Blog</a>
                            <a href="/support">Support</a>
                            <a href="/status">Status</a>
                        </div>

                        <div className="footer-col">
                            <h4>Company</h4>
                            <a href="/about">About Us</a>
                            <a href="/careers">Careers</a>
                            <a href="/legal">Legal</a>
                            <a href="/privacy">Privacy Policy</a>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <div className="copyright">
                            © {new Date().getFullYear()} KB RAG. All rights reserved.
                        </div>

                        <div className="social-links">
                            <a href="#" className="social-link"><i className="bi bi-twitter"></i></a>
                            <a href="#" className="social-link"><i className="bi bi-linkedin"></i></a>
                            <a href="#" className="social-link"><i className="bi bi-github"></i></a>
                            <a href="#" className="social-link"><i className="bi bi-discord"></i></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}