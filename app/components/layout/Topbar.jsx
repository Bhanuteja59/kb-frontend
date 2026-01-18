"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function Topbar() {
    const { user, loginUrl, logout } = useAuthContext();
    const pathname = usePathname();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef(null);

    // Navigation items
    const navItems = user ? [
        { name: 'Dashboard', path: '/', icon: 'bi-speedometer2' },
        { name: 'Documents', path: '/documents', icon: 'bi-folder2-open' },
        { name: 'Upload', path: '/upload', icon: 'bi-cloud-arrow-up' },
        { name: 'Integrations', path: '/integrations', icon: 'bi-plug' },
        { name: 'Pricing', path: '/pricing', icon: 'bi-currency-dollar' },
        { name: 'Users', path: '/admin/users', icon: 'bi-people' },
    ] : [];

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Click outside to close menus
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
            if (mobileOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.mobile-toggle')) {
                setMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showUserMenu, mobileOpen]);

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        setMobileOpen(false);
    };

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'KB';

    return (
        <>
            <header className={`topbar fade-in ${scrolled ? 'scrolled' : ''}`}>
                <div className="container-fluid px-3 px-lg-4 h-100">
                    <div className="d-flex align-items-center justify-content-between h-100 position-relative">

                        {/* 1. LEFT LOGO AREA (Always Visible) */}
                        <div className="d-flex align-items-center">
                            <Link href="/" className="logo-btn d-flex align-items-center gap-2 text-decoration-none">
                                <div className="logo-icon shadow-lg">
                                    <i className="bi bi-cpu-fill text-white"></i>
                                </div>
                                <div className="d-flex flex-column lh-1">
                                    <span className="logo-text text-white fw-bold tracking-wide">KB<span className="text-primary-light">RAG</span></span>
                                </div>
                            </Link>
                        </div>

                        {/* 2. CENTER DESKTOP NAV (Hidden < 1200px) */}
                        <nav className="desktop-nav d-none d-xl-flex align-items-center gap-1 position-absolute start-50 translate-middle-x">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`nav-link-item ${pathname === item.path ? 'active' : ''}`}
                                >
                                    <i className={`bi ${item.icon} me-2 opacity-75`}></i>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* 3. RIGHT ACTIONS AREA (User + Mobile Toggle) */}
                        <div className="d-flex align-items-center gap-3">

                            {/* User Profile Dropdown (Always visible avatar) */}
                            {user ? (
                                <div className="position-relative" ref={userMenuRef}>
                                    <button
                                        className={`user-btn ${showUserMenu ? 'active' : ''}`}
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                    >
                                        <div className="user-avatar shadow-sm">
                                            {getInitials(user.full_name)}
                                            <div className="online-indicator"></div>
                                        </div>
                                        <div className="user-info-text d-none d-md-block text-start ms-2">
                                            <div className="user-name text-white fw-semibold small mb-0">{user.full_name}</div>
                                        </div>
                                        <i className={`bi bi-chevron-down ms-2 text-white opacity-50 small transition-transform ${showUserMenu ? 'rotate-180' : ''}`}></i>
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className={`dropdown-menu-custom ${showUserMenu ? 'show' : ''}`}>
                                        <div className="p-3 border-bottom border-secondary border-opacity-10 text-center">
                                            <div className="user-avatar large mx-auto mb-2">
                                                {getInitials(user.full_name)}
                                            </div>
                                            <h6 className="text-white mb-0">{user.full_name}</h6>
                                            <p className="text-muted small mb-0">{user.email}</p>
                                        </div>
                                        <div className="py-2">
                                            <button className="dropdown-item-custom" onClick={() => router.push('/profile')}>
                                                <i className="bi bi-person me-2"></i> My Profile
                                            </button>
                                            <button className="dropdown-item-custom" onClick={() => router.push('/settings')}>
                                                <i className="bi bi-gear-wide-connected me-2"></i> Settings
                                            </button>
                                            <div className="dropdown-divider bg-secondary bg-opacity-10 my-1"></div>
                                            <button className="dropdown-item-custom text-danger" onClick={handleLogout}>
                                                <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex gap-2">
                                    <a href={loginUrl} className="btn btn-sm btn-glass text-white border-0 fw-semibold">Sign In</a>
                                    <Link href="/register" className="btn btn-sm btn-primary fw-semibold rounded-pill px-3">Get Started</Link>
                                </div>
                            )}

                            {/* Mobile Toggle Button (< 1200px) */}
                            <button
                                className="mobile-toggle d-xl-none btn btn-icon"
                                onClick={() => setMobileOpen(!mobileOpen)}
                            >
                                <i className={`bi ${mobileOpen ? 'bi-x-lg' : 'bi-list'} fs-4 text-white`}></i>
                            </button>

                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Drawer */}
            <div className={`mobile-menu-overlay ${mobileOpen ? 'show' : ''}`} onClick={() => setMobileOpen(false)}></div>
            <div className={`mobile-menu ${mobileOpen ? 'show' : ''}`}>
                <div className="d-flex flex-column h-100">
                    <div className="p-4 border-bottom border-light border-opacity-10">
                        <div className="d-flex align-items-center gap-3">
                            <div className="user-avatar large shadow-lg">
                                {getInitials(user?.full_name)}
                            </div>
                            <div>
                                <h6 className="text-white fw-bold mb-0">{user?.full_name || 'Guest User'}</h6>
                                <p className="text-white opacity-50 small mb-0">{user?.email || 'Please sign in'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-grow-1 p-3 overflow-auto">
                        <div className="d-grid gap-2">
                            {user && navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`mobile-nav-link ${pathname === item.path ? 'active' : ''}`}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <i className={`bi ${item.icon}`}></i>
                                    {item.name}
                                </Link>
                            ))}
                            {!user && (
                                <div className="text-center py-5">
                                    <p className="text-white opacity-50 mb-3">Join us to access the dashboard.</p>
                                    <Link href="/register" className="btn btn-primary w-100">Get Started</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {user && (
                        <div className="p-3 border-top border-light border-opacity-10">
                            <button className="mobile-nav-link text-danger w-100 justify-content-center" onClick={handleLogout}>
                                <i className="bi bi-box-arrow-right"></i> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Spacer to stop content overlap */}
            <div className="topbar-spacer"></div>

            <style jsx global>{`
                :root {
                    --topbar-height: 70px;
                    --glass-bg: rgba(15, 23, 42, 0.80);
                    --glass-border: rgba(255, 255, 255, 0.08);
                    --primary-glow: rgba(99, 102, 241, 0.5);
                }

                .topbar-spacer {
                    height: var(--topbar-height);
                    width: 100%;
                }

                .topbar {
                    position: fixed;
                    top: 0; left: 0; right: 0;
                    height: var(--topbar-height);
                    background: transparent;
                    z-index: 1050;
                    transition: all 0.3s ease;
                    border-bottom: 1px solid transparent;
                }

                .topbar.scrolled {
                    background: rgba(11, 15, 25, 0.95);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid var(--glass-border);
                    box-shadow: 0 4px 30px rgba(0,0,0,0.1);
                }

                /* Logo */
                .logo-icon {
                    width: 38px; height: 38px;
                    background: linear-gradient(135deg, #6366f1, #a855f7);
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.2rem;
                }
                .logo-text { font-size: 1.25rem; font-family: 'Inter', sans-serif; }
                .text-primary-light { color: #818cf8; }

                /* Desktop Nav Items */
                .nav-link-item {
                    display: flex; align-items: center;
                    padding: 0.6rem 1.2rem;
                    color: rgba(255,255,255,0.7);
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 0.9rem;
                    border-radius: 50px;
                    transition: all 0.2s ease;
                }
                .nav-link-item:hover {
                    color: white;
                    background: rgba(255,255,255,0.05);
                }
                .nav-link-item.active {
                    color: white;
                    background: rgba(255,255,255,0.1);
                    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
                }

                /* User Button & Dropdown */
                .user-btn {
                    background: transparent; border: none; padding: 0.25rem;
                    display: flex; align-items: center;
                    border-radius: 50px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .user-btn:hover, .user-btn.active { background: rgba(255,255,255,0.05); }

                .user-avatar {
                    width: 36px; height: 36px;
                    background: linear-gradient(to bottom right, #3b82f6, #06b6d4);
                    color: white;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 700; font-size: 0.85rem;
                    position: relative;
                    border: 2px solid rgba(255,255,255,0.1);
                }
                .user-avatar.large { width: 64px; height: 64px; font-size: 1.5rem; }
                
                .online-indicator {
                    position: absolute; bottom: 0; right: 0;
                    width: 10px; height: 10px;
                    background: #22c55e;
                    border: 2px solid #0f172a;
                    border-radius: 50%;
                }

                .dropdown-menu-custom {
                    position: absolute;
                    top: 120%; right: 0;
                    width: 240px;
                    background: #1e293b;
                    border: 1px solid var(--glass-border);
                    border-radius: 16px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    opacity: 0; visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    overflow: hidden;
                }
                .dropdown-menu-custom.show {
                    opacity: 1; visibility: visible;
                    transform: translateY(0);
                }

                .dropdown-item-custom {
                    display: flex; align-items: center;
                    width: 100%; padding: 0.75rem 1.25rem;
                    background: transparent; border: none;
                    color: rgba(255,255,255,0.8);
                    font-size: 0.9rem; font-weight: 500;
                    text-align: left; cursor: pointer;
                    transition: all 0.2s;
                }
                .dropdown-item-custom:hover {
                    background: rgba(255,255,255,0.05);
                    color: white;
                    padding-left: 1.5rem; /* Slide effect */
                }

                /* Mobile Menu */
                .mobile-menu-overlay {
                    position: fixed; inset: 0;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(4px);
                    z-index: 1060;
                    opacity: 0; visibility: hidden;
                    transition: all 0.3s;
                }
                .mobile-menu-overlay.show { opacity: 1; visibility: visible; }

                .mobile-menu {
                    position: fixed;
                    top: 0; bottom: 0; right: -300px; /* Slide from right */
                    width: 280px;
                    background: #0f172a;
                    z-index: 1070;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: -10px 0 30px rgba(0,0,0,0.5);
                    border-left: 1px solid var(--glass-border);
                }
                .mobile-menu.show { right: 0; }

                .mobile-nav-link {
                    display: flex; align-items: center; gap: 1rem;
                    padding: 1rem;
                    color: rgba(255,255,255,0.7);
                    text-decoration: none;
                    font-weight: 600;
                    border-radius: 12px;
                    transition: all 0.2s;
                    border: none; background: transparent;
                }
                .mobile-nav-link:hover, .mobile-nav-link.active {
                    background: rgba(255,255,255,0.05);
                    color: white;
                }
                .mobile-nav-link.active {
                    background: rgba(99, 102, 241, 0.15);
                    color: #818cf8;
                }

                .mobile-toggle {
                    width: 40px; height: 40px;
                    display: flex; align-items: center; justify-content: center;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    background: rgba(255,255,255,0.05);
                    transition: all 0.2s;
                }
                .mobile-toggle:active { transform: scale(0.95); }

                .transition-transform { transition: transform 0.2s; }
                .rotate-180 { transform: rotate(180deg); }
            `}</style>
        </>
    );
}