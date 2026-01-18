"use client";
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import Topbar from './components/layout/Topbar';
import LandingPage from './components/landing/LandingPage';
import { getMe, getDashboardStats } from "./lib/api";
import Footer from './components/layout/Footer';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        docs: 0,
        vectors: 0,
        storageUsage: 0,
        avgResponse: 0,
        recentActivity: []
    });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userData, statsData] = await Promise.all([
                    getMe().catch(() => null),
                    getDashboardStats().catch(() => null)
                ]);

                setUser(userData);

                if (statsData) {
                    setStats({
                        docs: statsData.docs_count || 0,
                        vectors: statsData.chunks_count || 0,
                        storageUsage: statsData.storage_size_bytes || 0, // In bytes
                        avgResponse: statsData.avg_response_ms || 0,
                        recentActivity: statsData.recent_activity || []
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Smooth loading animation
        const timer = setTimeout(() => {
            document.body.classList.add('loaded');
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const QuickActionCard = ({ title, desc, icon, href, color, gradient }) => (
        <Link href={href} className="text-decoration-none">
            <div className="quick-action-card p-4 h-100 border-0 glass-morphism hover-lift transition-all">
                <div className="d-flex align-items-start gap-3">
                    <div className={`action-icon rounded-3 d-flex align-items-center justify-content-center flex-shrink-0`}
                        style={{
                            width: 56,
                            height: 56,
                            background: gradient || `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
                            color: color
                        }}>
                        <i className={`bi ${icon} fs-4`}></i>
                    </div>
                    <div>
                        <h5 className="text-white fw-semibold mb-1">{title}</h5>
                        <p className="text-white opacity-75 small mb-0 lh-sm">{desc}</p>
                    </div>
                </div>
            </div>
        </Link>
    );

    const StatCard = ({ value, label, icon, color, trend, gradient }) => (
        <div className="stat-card h-100 border-0 overflow-hidden position-relative">
            <div className="card-body p-4 text-white">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <p className="text-white opacity-75 mb-1 text-uppercase small fw-medium letter-spacing-1">{label}</p>
                        <h3 className="display-4 fw-bold mb-0">{value.toLocaleString()}</h3>
                    </div>
                    <div className="stat-icon" style={{ color }}>
                        <i className={`bi ${icon} fs-2 opacity-50`}></i>
                    </div>
                </div>
                {trend && (
                    <div className="d-flex align-items-center gap-1">
                        <i className={`bi ${trend > 0 ? 'bi-arrow-up-right' : 'bi-arrow-down-right'} ${trend > 0 ? 'text-success' : 'text-danger'}`}></i>
                        <span className={`small ${trend > 0 ? 'text-success' : 'text-danger'}`}>
                            {trend > 0 ? '+' : ''}{trend}% this month
                        </span>
                    </div>
                )}
            </div>
            <div className="stat-gradient" style={{
                background: gradient || `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`
            }}></div>
        </div>
    );

    const ProcessStep = ({ step, title, desc, icon }) => (
        <div className="process-step text-center px-3">
            <div className="step-number mb-4 mx-auto">
                <div className="step-circle d-flex align-items-center justify-content-center mx-auto">
                    <span className="step-text fw-bold">{step}</span>
                </div>
                <div className="step-line"></div>
            </div>
            <div className="step-icon mb-3">
                <i className={`bi ${icon} fs-2 text-primary`}></i>
            </div>
            <h5 className="h6 text-white fw-semibold mb-2">{title}</h5>
            <p className="text-white opacity-75 small mb-0">{desc}</p>
        </div>
    );

    if (loading) {
        return (
            <div className="min-vh-100 d-flex flex-column">
                <Topbar />
                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-white opacity-75">Loading your dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) return <LandingPage />;

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 B';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    return (
        <div className="dashboard-container min-vh-100">
            <Topbar />

            {/* Background Elements */}
            <div className="background-elements">
                <div className="bg-blur-1"></div>
                <div className="bg-blur-2"></div>
                <div className="bg-gradient-1"></div>
            </div>

            <main className="flex-grow-1 position-relative">
                <div className="container-fluid px-lg-5 py-4 py-lg-5">
                    {/* Welcome Header */}
                    {/* Hero Welcome Section */}
                    <div className="welcome-section mb-5 py-5 d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: '60vh' }}>
                        <div className="d-flex align-items-center gap-2 mb-4">
                            <span className="welcome-badge px-3 py-2 rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 shadow-sm backdrop-blur">
                                <i className="bi bi-stars me-2"></i>
                                {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}
                            </span>
                        </div>

                        <h1 className="display-3 fw-bold text-white mb-4 tracking-tight" style={{ maxWidth: '800px' }}>
                            Hello, <span className="text-gradient">{user.full_name || 'Admin'}</span>
                        </h1>

                        <p className="text-white opacity-75 mb-5 lead fs-4" style={{ maxWidth: '600px' }}>
                            Ready to unlock insights from your knowledge base?
                            <br className="d-none d-md-block" />
                            Here's what's happening today.
                        </p>

                        <div className="d-flex flex-column flex-sm-row gap-3 w-100 justify-content-center" style={{ maxWidth: '500px' }}>
                            <Link href="/upload" className="btn btn-primary btn-lg rounded-pill px-5 py-3 shadow-lg hover-lift d-flex align-items-center justify-content-center gap-2">
                                <i className="bi bi-cloud-arrow-up fs-5"></i>
                                <span className="fw-semibold">Upload New</span>
                            </Link>
                            <Link href="/admin/chat" className="btn btn-glass btn-lg rounded-pill px-5 py-3 shadow-lg hover-lift d-flex align-items-center justify-content-center gap-2 text-white border-white border-opacity-25">
                                <i className="bi bi-lightning-charge fs-5"></i>
                                <span className="fw-semibold">Quick Chat</span>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="row g-4 mb-5">
                        <div className="col-xxl-8">
                            <div className="row g-4">
                                <div className="col-md-6 col-lg-3">
                                    <StatCard
                                        value={stats.docs}
                                        label="Active Documents"
                                        icon="bi-folder2-open"
                                        color="#3b82f6"
                                        trend={12}
                                        gradient="linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)"
                                    />
                                </div>
                                <div className="col-md-6 col-lg-3">
                                    <StatCard
                                        value={stats.vectors}
                                        label="Vector Chunks"
                                        icon="bi-diagram-3"
                                        color="#8b5cf6"
                                        trend={18}
                                        gradient="linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)"
                                    />
                                </div>
                                <div className="col-md-6 col-lg-3">
                                    <StatCard
                                        value={formatBytes(stats.storageUsage || 0)}
                                        label="Storage Used"
                                        icon="bi-database"
                                        color="#10b981"
                                        trend={8}
                                        gradient="linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)"
                                    />
                                </div>
                                <div className="col-md-6 col-lg-3">
                                    <StatCard
                                        value={stats.avgResponse || 0}
                                        label="Avg Response Time"
                                        icon="bi-clock"
                                        color="#f59e0b"
                                        trend={-5}
                                        gradient="linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)"
                                        suffix="ms"
                                    />
                                </div>
                            </div>

                            {/* Quick Actions Grid */}
                            <div className="mt-5">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h3 className="h4 text-white fw-bold mb-0 d-flex align-items-center gap-2">
                                        <i className="bi bi-lightning-fill text-primary"></i>
                                        Quick Actions
                                    </h3>
                                </div>
                                <div className="row g-3">
                                    <div className="col-md-6 col-lg-3">
                                        <QuickActionCard
                                            title="Manage Documents"
                                            desc="Organize and manage your knowledge base files"
                                            icon="bi-folder2-open"
                                            href="/documents"
                                            color="#3b82f6"
                                            gradient="linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)"
                                        />
                                    </div>
                                    <div className="col-md-6 col-lg-3">
                                        <QuickActionCard
                                            title="Upload Data"
                                            desc="Add new files to your knowledge base"
                                            icon="bi-cloud-arrow-up"
                                            href="/upload"
                                            color="#10b981"
                                            gradient="linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)"
                                        />
                                    </div>
                                    <div className="col-md-6 col-lg-3">
                                        <QuickActionCard
                                            title="Integrations"
                                            desc="Connect external data sources"
                                            icon="bi-plug"
                                            href="/integrations"
                                            color="#f59e0b"
                                            gradient="linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)"
                                        />
                                    </div>
                                    {/* <div className="col-md-6 col-lg-3">
                                        <QuickActionCard
                                            title="Analytics"
                                            desc="View usage and performance insights"
                                            icon="bi-graph-up"
                                            href="/analytics"
                                            color="#8b5cf6"
                                            gradient="linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)"
                                        />
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Sidebar */}
                        <div className="col-xxl-4">
                            <div className="glass-morphism p-4 h-100 rounded-4">
                                <h4 className="h5 text-white fw-bold mb-4 d-flex align-items-center gap-2">
                                    <i className="bi bi-activity"></i>
                                    Recent Activity
                                </h4>
                                <div className="activity-timeline">
                                    {stats.recentActivity.length > 0 ? stats.recentActivity.map((activity, index) => (
                                        <div key={index} className="activity-item d-flex gap-3 mb-3 pb-3 border-bottom border-light border-opacity-10">
                                            <div className="activity-icon" style={{ color: activity.color }}>
                                                <i className={`bi ${activity.icon} fs-5`}></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="text-white fw-semibold mb-1">{activity.title}</h6>
                                                <p className="text-white opacity-75 small mb-1">{activity.desc}</p>
                                                <span className="text-white opacity-50 small">{activity.time}</span>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-white opacity-50 small text-center py-4">No recent activity</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How It Works Process */}
                    <div className="mb-5">
                        <div className="text-center mb-5">
                            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-2 mb-3">
                                <i className="bi bi-magic me-1"></i> How It Works
                            </span>
                            <h2 className="display-6 fw-bold text-white mb-3">
                                From Documents to Insights
                            </h2>
                            <p className="text-white opacity-75 lead mx-auto" style={{ maxWidth: '600px' }}>
                                Our intelligent pipeline transforms your documents into actionable knowledge
                            </p>
                        </div>

                        <div className="process-flow">
                            <div className="row g-4">
                                <div className="col-lg-4">
                                    <ProcessStep
                                        step="1"
                                        title="Ingest & Process"
                                        desc="Documents are intelligently parsed, cleaned, and split into meaningful chunks"
                                        icon="bi-file-earmark-break"
                                    />
                                </div>
                                <div className="col-lg-4">
                                    <ProcessStep
                                        step="2"
                                        title="Embed & Index"
                                        desc="Transform text into high-dimensional vectors for semantic understanding"
                                        icon="bi-cpu"
                                    />
                                </div>
                                <div className="col-lg-4">
                                    <ProcessStep
                                        step="3"
                                        title="Retrieve & Answer"
                                        desc="Find relevant context and generate accurate, sourced responses"
                                        icon="bi-chat-square-quote"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Platform Features */}
                    <div className="row g-4 mb-5">
                        <div className="col-lg-8">
                            <div className="glass-morphism p-4 rounded-4 h-100">
                                <h4 className="h5 text-white fw-bold mb-4">
                                    <i className="bi bi-stars me-2 text-primary"></i>
                                    Platform Features
                                </h4>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="feature-card p-3 rounded-3">
                                            <div className="d-flex align-items-start gap-3">
                                                <div className="feature-icon rounded-2 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: 'rgba(59, 130, 246, 0.1)' }}>
                                                    <i className="bi bi-shield-check text-primary"></i>
                                                </div>
                                                <div>
                                                    <h6 className="text-white fw-semibold mb-1">Enterprise Security</h6>
                                                    <p className="text-white opacity-75 small mb-0">End-to-end encryption with SOC 2 compliance</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="feature-card p-3 rounded-3">
                                            <div className="d-flex align-items-start gap-3">
                                                <div className="feature-icon rounded-2 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: 'rgba(16, 185, 129, 0.1)' }}>
                                                    <i className="bi bi-lightning-charge text-success"></i>
                                                </div>
                                                <div>
                                                    <h6 className="text-white fw-semibold mb-1">Real-time Processing</h6>
                                                    <p className="text-white opacity-75 small mb-0">Instant vectorization and indexing</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="feature-card p-3 rounded-3">
                                            <div className="d-flex align-items-start gap-3">
                                                <div className="feature-icon rounded-2 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: 'rgba(139, 92, 246, 0.1)' }}>
                                                    <i className="bi bi-graph-up-arrow text-purple"></i>
                                                </div>
                                                <div>
                                                    <h6 className="text-white fw-semibold mb-1">Advanced Analytics</h6>
                                                    <p className="text-white opacity-75 small mb-0">Track usage patterns and performance metrics</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="feature-card p-3 rounded-3">
                                            <div className="d-flex align-items-start gap-3">
                                                <div className="feature-icon rounded-2 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: 'rgba(245, 158, 11, 0.1)' }}>
                                                    <i className="bi bi-arrows-fullscreen text-warning"></i>
                                                </div>
                                                <div>
                                                    <h6 className="text-white fw-semibold mb-1">Multi-format Support</h6>
                                                    <p className="text-white opacity-75 small mb-0">PDF, DOCX, TXT, and 15+ other formats</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="glass-morphism p-4 rounded-4 h-100">
                                <h4 className="h5 text-white fw-bold mb-4">
                                    <i className="bi bi-rocket-takeoff me-2 text-primary"></i>
                                    Quick Tips
                                </h4>
                                <div className="tips-list">
                                    {[
                                        "Use bulk upload for multiple documents",
                                        "Tag documents for better organization",
                                        "Set up automatic sync with cloud storage",
                                        "Monitor your vector store health weekly"
                                    ].map((tip, index) => (
                                        <div key={index} className="d-flex align-items-start gap-2 mb-3">
                                            <i className="bi bi-check-circle text-success mt-1"></i>
                                            <span className="text-white small">{tip}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-3 border-top border-light border-opacity-10">
                                    <Link href="/docs" className="text-primary small text-decoration-none d-flex align-items-center gap-1">
                                        <i className="bi bi-book"></i>
                                        View Documentation
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Bootstrap Icons */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

            <style jsx global>{`
                :root {
                    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    --glass-bg: rgba(255, 255, 255, 0.05);
                    --glass-border: rgba(255, 255, 255, 0.1);
                }

                body {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    min-height: 100vh;
                }

                .dashboard-container {
                    position: relative;
                    overflow-x: hidden;
                }

                .background-elements {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                    z-index: 0;
                }

                .bg-blur-1 {
                    position: absolute;
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
                    top: -100px;
                    right: -100px;
                    filter: blur(80px);
                }

                .bg-blur-2 {
                    position: absolute;
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%);
                    bottom: -150px;
                    left: -150px;
                    filter: blur(100px);
                }

                .text-gradient {
                    background: var(--primary-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .glass-morphism {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                }

                .glass-morphism:hover {
                    border-color: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }

                .stat-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    transition: all 0.3s ease;
                }

                .stat-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                }

                .stat-gradient {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-radius: 16px;
                    z-index: -1;
                    opacity: 0.5;
                }

                .quick-action-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    transition: all 0.3s ease;
                }

                .quick-action-card:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(255, 255, 255, 0.15);
                    transform: translateY(-2px);
                }

                .welcome-badge {
                    background: rgba(59, 130, 246, 0.1);
                    color: #3b82f6;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.875rem;
                    font-weight: 500;
                }

                .step-circle {
                    width: 60px;
                    height: 60px;
                    background: rgba(59, 130, 246, 0.1);
                    border: 2px solid rgba(59, 130, 246, 0.3);
                    border-radius: 50%;
                    position: relative;
                }

                .step-circle::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 100%;
                    width: 100%;
                    height: 2px;
                    background: rgba(255, 255, 255, 0.1);
                }

                .step-circle .step-text {
                    color: #3b82f6;
                    font-size: 1.25rem;
                }

                .process-step:last-child .step-circle::after {
                    display: none;
                }

                .hover-lift {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .hover-lift:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                }

                .feature-card {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: all 0.3s ease;
                }

                .feature-card:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .activity-item {
                    transition: all 0.3s ease;
                }

                .activity-item:hover {
                    transform: translateX(4px);
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .display-5 {
                        font-size: 2.5rem;
                    }
                    
                    .welcome-section .d-flex {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .step-circle::after {
                        display: none;
                    }
                    
                    .container-fluid {
                        padding-left: 1rem;
                        padding-right: 1rem;
                    }
                }

                @media (max-width: 576px) {
                    .btn-lg {
                        padding: 0.5rem 1.5rem;
                        font-size: 0.875rem;
                    }
                    
                    .stat-card h3 {
                        font-size: 2rem;
                    }
                }

                /* Loading Animation */
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .fade-in {
                    animation: fadeIn 0.5s ease-out;
                }

                body.loaded .fade-in {
                    animation-delay: 0.1s;
                }
            `}</style>
        </div>
    );
}