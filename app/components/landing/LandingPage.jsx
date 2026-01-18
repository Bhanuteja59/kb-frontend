"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { useAuthContext } from "../../context/AuthContext";

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

    const roles = [
        {
            title: 'Admin',
            description: 'Full control over organization settings, users, and documents.',
            icon: 'bi-shield-lock-fill',
            color: '#3b82f6',
            permissions: ['Organization Settings', 'User Management', 'Document Control', 'Analytics']
        },
        {
            title: 'Manager',
            description: 'Manage documents and view analytics without altering org settings.',
            icon: 'bi-person-gear',
            color: '#8b5cf6',
            permissions: ['Document Management', 'Team Collaboration', 'Performance Analytics', 'Content Moderation']
        },
        {
            title: 'Viewer',
            description: 'Read-only access to documents and interactive chat interface.',
            icon: 'bi-person',
            color: '#10b981',
            permissions: ['Document Viewing', 'AI Chat Access', 'Search Functionality', 'Export Results']
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

    const RoleCard = ({ role, index }) => (
        <div className="role-card">
            <div className="role-header">
                <div className="role-icon" style={{ backgroundColor: role.color + '20', color: role.color }}>
                    <i className={`bi ${role.icon}`}></i>
                </div>
                <h3>{role.title}</h3>
                <div className="role-badge" style={{ backgroundColor: role.color }}>{role.permissions.length} Permissions</div>
            </div>
            <p className="role-description">{role.description}</p>
            <div className="role-permissions">
                {role.permissions.map((permission, i) => (
                    <div key={i} className="permission-tag">
                        <i className="bi bi-check-circle"></i>
                        {permission}
                    </div>
                ))}
            </div>
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
                                <h3>Role-Based Access Control</h3>
                                <div className="security-badge">SOC 2 Compliant</div>
                            </div>

                            <div className="roles-grid">
                                {roles.map((role, index) => (
                                    <RoleCard key={index} role={role} index={index} />
                                ))}
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

            <style jsx global>{`
                :root {
                    --primary-color: #3b82f6;
                    --primary-gradient: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                    --secondary-color: #8b5cf6;
                    --success-color: #10b981;
                    --warning-color: #f59e0b;
                    --danger-color: #ef4444;
                    --dark-bg: #0f172a;
                    --dark-surface: #1e293b;
                    --dark-border: #334155;
                    --text-primary: #ffffff;
                    --text-secondary: #94a3b8;
                    --glass-bg: rgba(255, 255, 255, 0.05);
                    --glass-border: rgba(255, 255, 255, 0.1);
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    background: var(--dark-bg);
                    color: var(--text-primary);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    overflow-x: hidden;
                }

                .landing-page {
                    position: relative;
                }

                /* Animated Background */
                .animated-background {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                    z-index: -1;
                }

                .bg-glow-1 {
                    position: absolute;
                    width: 60vw;
                    height: 60vw;
                    background: radial-gradient(circle, var(--primary-color) 0%, transparent 70%);
                    filter: blur(100px);
                    opacity: 0.1;
                    transform: translate(-50%, -50%);
                    transition: all 0.3s ease;
                }

                .bg-glow-2 {
                    position: absolute;
                    width: 40vw;
                    height: 40vw;
                    background: radial-gradient(circle, var(--secondary-color) 0%, transparent 70%);
                    filter: blur(80px);
                    opacity: 0.05;
                    bottom: -20vw;
                    right: -10vw;
                }

                .bg-particles {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                }

                .particle {
                    position: absolute;
                    background: white;
                    border-radius: 50%;
                    opacity: 0.05;
                    animation: float 20s infinite linear;
                }

                @keyframes float {
                    0% { transform: translateY(100vh) rotate(0deg); }
                    100% { transform: translateY(-100vh) rotate(360deg); }
                }

                /* Navigation */
                .landing-nav {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: rgba(15, 23, 42, 0);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0);
                    z-index: 1000;
                    transition: all 0.3s ease;
                }

                .landing-nav.scrolled {
                    background: rgba(15, 23, 42, 0.9);
                    border-bottom-color: rgba(255, 255, 255, 0.1);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                }

                .nav-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 1rem 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .nav-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    text-decoration: none;
                }

                .logo-icon {
                    width: 40px;
                    height: 40px;
                    background: var(--primary-gradient);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .logo-highlight {
                    background: var(--primary-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .nav-links {
                    display: flex;
                    gap: 2rem;
                }

                .nav-link {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 0.95rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: color 0.3s ease;
                    position: relative;
                }

                .nav-link:hover {
                    color: white;
                }

                .nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: var(--primary-color);
                    transition: width 0.3s ease;
                }

                .nav-link:hover::after {
                    width: 100%;
                }

                .nav-actions {
                    display: flex;
                    gap: 1rem;
                }

                /* Button Styles */
                .btn {
                    padding: 0.75rem 1.5rem;
                    border-radius: 10px;
                    font-weight: 600;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    border: 2px solid transparent;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-primary {
                    background: var(--primary-gradient);
                    color: white;
                    border: none;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
                }

                .btn-outline-light {
                    background: transparent;
                    color: white;
                    border-color: rgba(255, 255, 255, 0.2);
                }

                .btn-outline-light:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.3);
                }

                .btn-lg {
                    padding: 1rem 2rem;
                    font-size: 1.1rem;
                }

                .btn-xl {
                    padding: 1.25rem 2.5rem;
                    font-size: 1.25rem;
                }

                /* Hero Section */
                .hero {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    padding: 6rem 0 4rem;
                    position: relative;
                }

                .hero-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    align-items: center;
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(59, 130, 246, 0.1);
                    color: var(--primary-color);
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-bottom: 2rem;
                }

                .hero-title {
                    font-size: 3.5rem;
                    font-weight: 800;
                    line-height: 1.2;
                    margin-bottom: 1.5rem;
                }

                .hero-highlight {
                    background: var(--primary-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    display: block;
                }

                .hero-subtitle {
                    font-size: 1.25rem;
                    color: var(--text-secondary);
                    line-height: 1.6;
                    margin-bottom: 2.5rem;
                    max-width: 600px;
                }

                .hero-actions {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 3rem;
                }

                .hero-stats {
                    display: flex;
                    gap: 3rem;
                }

                .stat {
                    display: flex;
                    flex-direction: column;
                }

                .stat-value {
                    font-size: 2.5rem;
                    font-weight: 700;
                    background: var(--primary-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .stat-label {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                }

                /* Hero Visual */
                .hero-visual {
                    position: relative;
                }

                .visual-container {
                    position: relative;
                    width: 100%;
                    height: 500px;
                }

                .floating-element {
                    position: absolute;
                    width: 80px;
                    height: 80px;
                    background: var(--dark-surface);
                    border: 1px solid var(--dark-border);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    animation: floatElement 6s ease-in-out infinite;
                }

                .element-1 {
                    top: 0;
                    left: 0;
                    background: rgba(59, 130, 246, 0.1);
                    color: var(--primary-color);
                    animation-delay: 0s;
                }

                .element-2 {
                    top: 50%;
                    right: 0;
                    background: rgba(139, 92, 246, 0.1);
                    color: var(--secondary-color);
                    animation-delay: 2s;
                }

                .element-3 {
                    bottom: 0;
                    left: 20%;
                    background: rgba(16, 185, 129, 0.1);
                    color: var(--success-color);
                    animation-delay: 4s;
                }

                @keyframes floatElement {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }

                .main-visual {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 400px;
                    height: 300px;
                }

                .dashboard-preview {
                    width: 100%;
                    height: 100%;
                    background: var(--dark-surface);
                    border-radius: 20px;
                    border: 1px solid var(--dark-border);
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }

                .dashboard-header {
                    padding: 1rem;
                    background: rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                }

                .header-dots {
                    display: flex;
                    gap: 0.5rem;
                }

                .dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                }

                .dot.red { background: #ef4444; }
                .dot.yellow { background: #f59e0b; }
                .dot.green { background: #10b981; }

                .dashboard-content {
                    padding: 1.5rem;
                }

                .dashboard-stats {
                    display: flex;
                    gap: 1.5rem;
                    margin-bottom: 1.5rem;
                }

                .stat-preview {
                    flex: 1;
                    text-align: center;
                }

                .stat-preview-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                }

                .stat-preview-label {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                }

                .chat-preview {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .chat-message {
                    max-width: 80%;
                    padding: 0.75rem 1rem;
                    border-radius: 15px;
                    font-size: 0.875rem;
                    line-height: 1.4;
                }

                .chat-message.ai {
                    background: rgba(59, 130, 246, 0.2);
                    align-self: flex-start;
                    border-bottom-left-radius: 5px;
                }

                .chat-message.user {
                    background: rgba(139, 92, 246, 0.2);
                    align-self: flex-end;
                    border-bottom-right-radius: 5px;
                }

                /* Sections */
                .section {
                    padding: 6rem 0;
                    position: relative;
                }

                .section-title {
                    font-size: 3rem;
                    font-weight: 800;
                    text-align: center;
                    margin-bottom: 3rem;
                    background: var(--primary-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }

                /* Features Section */
                .features-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    align-items: center;
                }

                .features-selector {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .feature-card {
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 15px;
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .feature-card:hover {
                    transform: translateX(10px);
                    border-color: var(--primary-color);
                }

                .feature-card.active {
                    background: rgba(59, 130, 246, 0.1);
                    border-color: var(--primary-color);
                    transform: translateX(10px);
                }

                .feature-icon {
                    width: 50px;
                    height: 50px;
                    background: var(--dark-surface);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    color: var(--primary-color);
                }

                .feature-card.active .feature-icon {
                    background: var(--primary-color);
                    color: white;
                }

                .feature-content h3 {
                    font-size: 1.25rem;
                    margin-bottom: 0.5rem;
                }

                .feature-content p {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                    line-height: 1.6;
                }

                .feature-glow {
                    position: absolute;
                    top: -50px;
                    right: -50px;
                    width: 100px;
                    height: 100px;
                    background: var(--primary-color);
                    border-radius: 50%;
                    filter: blur(40px);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .feature-card.active .feature-glow {
                    opacity: 0.2;
                }

                /* Features Preview */
                .features-preview {
                    position: relative;
                }

                .preview-container {
                    width: 100%;
                    height: 400px;
                    border-radius: 20px;
                    overflow: hidden;
                    position: relative;
                }

                .preview-image {
                    width: 100%;
                    height: 100%;
                    background-size: cover;
                    background-position: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .play-button {
                    width: 80px;
                    height: 80px;
                    background: var(--primary-gradient);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    font-size: 2rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .play-button:hover {
                    transform: scale(1.1);
                    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
                }

                .feature-video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: none;
                }

                .video-playing .feature-video {
                    display: block;
                }

                .video-close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: rgba(0, 0, 0, 0.5);
                    border: none;
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                /* Security Section */
                .security-section {
                    background: rgba(0, 0, 0, 0.2);
                }

                .security-container {
                    display: flex;
                    flex-direction: column;
                    gap: 3rem;
                }

                .security-features {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                }

                .security-feature {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.5rem;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 15px;
                }

                .security-icon {
                    width: 50px;
                    height: 50px;
                    background: var(--dark-surface);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    color: var(--primary-color);
                }

                /* Security Demo */
                .security-demo {
                    width: 100%;
                }

                .security-card {
                    background: var(--dark-surface);
                    border-radius: 20px;
                    border: 1px solid var(--dark-border);
                    padding: 2.5rem;
                }

                .security-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .security-badge {
                    background: var(--primary-gradient);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.875rem;
                    font-weight: 600;
                }

                .roles-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2rem;
                    margin-bottom: 2.5rem;
                }

                .role-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--dark-border);
                    border-radius: 15px;
                    padding: 1.5rem;
                }

                .role-header {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .role-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                }

                .role-badge {
                    align-self: flex-start;
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .role-description {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                    margin-bottom: 1.5rem;
                    line-height: 1.6;
                }

                .role-permissions {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .permission-tag {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-secondary);
                    font-size: 0.75rem;
                }

                .permission-tag i {
                    color: var(--success-color);
                }

                .security-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 2rem;
                    border-top: 1px solid var(--dark-border);
                }

                .compliance-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .compliance-info i {
                    font-size: 2rem;
                    color: var(--success-color);
                }

                .compliance-title {
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                }

                .compliance-desc {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                }

                /* CTA Section */
                .cta-section {
                    padding: 8rem 0;
                }

                .cta-container {
                    width: 100%;
                }

                .cta-card {
                    background: var(--primary-gradient);
                    border-radius: 30px;
                    padding: 4rem;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    align-items: center;
                }

                .cta-content h2 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }

                .cta-content p {
                    font-size: 1.25rem;
                    color: rgba(255, 255, 255, 0.9);
                    margin-bottom: 2rem;
                }

                .cta-features {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 3rem;
                }

                .cta-feature {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: white;
                }

                .cta-feature i {
                    color: white;
                }

                .cta-actions {
                    display: flex;
                    gap: 1rem;
                }

                .cta-visual {
                    display: flex;
                    justify-content: center;
                }

                .testimonial-slider {
                    max-width: 400px;
                }

                .testimonial {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 2rem;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .testimonial-content {
                    font-style: italic;
                    margin-bottom: 1.5rem;
                    line-height: 1.6;
                }

                .testimonial-author {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .author-avatar {
                    width: 50px;
                    height: 50px;
                    background: white;
                    color: var(--primary-color);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                }

                .author-name {
                    font-weight: 600;
                }

                .author-role {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.875rem;
                }

                /* Floating Assistant */
                .floating-assistant {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    z-index: 1000;
                }

                .assistant-toggle {
                    width: 60px;
                    height: 60px;
                    background: var(--primary-gradient);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
                    position: relative;
                }

                .assistant-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: var(--danger-color);
                    color: white;
                    font-size: 0.7rem;
                    font-weight: 700;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .assistant-chat {
                    position: absolute;
                    bottom: 70px;
                    right: 0;
                    width: 350px;
                    background: var(--dark-surface);
                    border-radius: 20px;
                    border: 1px solid var(--dark-border);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    display: none;
                }

                .floating-assistant:hover .assistant-chat {
                    display: block;
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Footer */
                .landing-footer {
                    background: var(--dark-surface);
                    border-top: 1px solid var(--dark-border);
                    padding: 4rem 0 2rem;
                }

                .footer-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }

                .footer-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1fr;
                    gap: 3rem;
                    margin-bottom: 3rem;
                }

                .footer-col h4 {
                    font-size: 1.125rem;
                    margin-bottom: 1.5rem;
                }

                .footer-col a {
                    display: block;
                    color: var(--text-secondary);
                    text-decoration: none;
                    margin-bottom: 0.75rem;
                    transition: color 0.3s ease;
                }

                .footer-col a:hover {
                    color: white;
                }

                .footer-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                }

                .footer-description {
                    color: var(--text-secondary);
                    line-height: 1.6;
                    max-width: 300px;
                }

                .footer-bottom {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 2rem;
                    border-top: 1px solid var(--dark-border);
                }

                .copyright {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                }

                .social-links {
                    display: flex;
                    gap: 1rem;
                }

                .social-link {
                    width: 40px;
                    height: 40px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .social-link:hover {
                    background: var(--primary-color);
                    transform: translateY(-2px);
                }

                /* Responsive Design */
                @media (max-width: 1024px) {
                    .hero-container,
                    .features-container,
                    .cta-card {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                    }

                    .roles-grid {
                        grid-template-columns: 1fr;
                    }

                    .security-features {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .footer-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                @media (max-width: 768px) {
                    .nav-links,
                    .nav-actions {
                        display: none;
                    }

                    .hero-title {
                        font-size: 2.5rem;
                    }

                    .section-title {
                        font-size: 2.5rem;
                    }

                    .hero-actions,
                    .cta-actions {
                        flex-direction: column;
                    }

                    .security-features {
                        grid-template-columns: 1fr;
                    }

                    .security-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }

                    .security-footer {
                        flex-direction: column;
                        gap: 2rem;
                        align-items: flex-start;
                    }

                    .cta-card {
                        padding: 2rem;
                    }

                    .footer-grid {
                        grid-template-columns: 1fr;
                    }

                    .footer-bottom {
                        flex-direction: column;
                        gap: 1.5rem;
                    }

                    .assistant-chat {
                        width: 300px;
                        right: -100px;
                    }
                }

                @media (max-width: 480px) {
                    .hero-container,
                    .features-container,
                    .cta-card {
                        padding: 0 1rem;
                    }

                    .hero-title {
                        font-size: 2rem;
                    }

                    .section-title {
                        font-size: 2rem;
                    }

                    .hero-stats {
                        flex-direction: column;
                        gap: 1.5rem;
                    }

                    .assistant-chat {
                        width: 280px;
                        right: -140px;
                    }
                }
            `}</style>
        </div>
    );
}