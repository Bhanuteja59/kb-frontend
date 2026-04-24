"use client";

import React from 'react';

/**
 * Loading — Premium Full-page loading state for Next.js 15
 * Fixes build error: ./app/loading/page.jsx missing
 */
export default function Loading() {
    return (
        <div 
            className="d-flex flex-column align-items-center justify-content-center"
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(248, 250, 252, 0.98)',
                backdropFilter: 'blur(12px)',
                zIndex: 9999,
                transition: 'all 0.4s ease-in-out'
            }}
        >
            <div className="text-center">
                <div 
                    className="spinner-border text-primary mb-4" 
                    role="status"
                    style={{
                        width: '3.5rem',
                        height: '3.5rem',
                        borderWidth: '0.3rem',
                        boxShadow: '0 0 25px rgba(79, 70, 229, 0.2)',
                        borderColor: '#4f46e5',
                        borderRightColor: 'transparent'
                    }}
                >
                    <span className="visually-hidden">Loading...</span>
                </div>
                
                <div className="loading-pulse">
                    <h4 
                        className="fw-bold mb-2"
                        style={{
                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.02em',
                            fontSize: '1.5rem'
                        }}
                    >
                        KB Platform
                    </h4>
                    <p className="text-muted small mb-0" style={{ letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.8 }}>
                        Initializing your workspace
                    </p>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.7; transform: translateY(0); }
                    50% { opacity: 1; transform: translateY(-2px); }
                }
                .loading-pulse {
                    animation: pulse-glow 2s ease-in-out infinite;
                }
            ` }} />
        </div>
    );
}

