"use client";
import React from 'react';

export default function Footer() {
    return (
        <footer className="footer py-5 mt-auto border-top" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="container">
                <div className="row gy-4">
                    <div className="col-lg-4 col-md-6">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <div className="bg-primary rounded p-1 d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                                <i className="bi bi-robot text-white"></i>
                            </div>
                            <h5 className="text-white mb-0 fw-bold">KB RAG</h5>
                        </div>
                        <p className="text-white opacity-75 small">
                            Empowering your organization with intelligent knowledge retrieval.
                            Secure, scalable, and tailored tmako your documents.
                        </p>
                    </div>

                    <div className="col-lg-2 col-md-6">
                        <h6 className="text-white fw-bold mb-3">Platform</h6>
                        <ul className="list-unstyled text-small">
                            <li className="mb-2"><a href="/dashboard" className="text-white opacity-75 text-decoration-none hover-white">Dashboard</a></li>
                            <li className="mb-2"><a href="/admin/chat" className="text-white opacity-75 text-decoration-none hover-white">Chat</a></li>
                            <li className="mb-2"><a href="/documents" className="text-white opacity-75 text-decoration-none hover-white">Documents</a></li>
                        </ul>
                    </div>

                    <div className="col-lg-2 col-md-6">
                        <h6 className="text-white fw-bold mb-3">Resources</h6>
                        <ul className="list-unstyled text-small">
                            <li className="mb-2"><a href="#" className="text-white opacity-75 text-decoration-none hover-white">Documentation</a></li>
                            <li className="mb-2"><a href="#" className="text-white opacity-75 text-decoration-none hover-white">API Reference</a></li>
                            <li className="mb-2"><a href="/contact" className="text-white opacity-75 text-decoration-none hover-white">Support & Help Center</a></li>
                        </ul>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <h6 className="text-white fw-bold mb-3">Stay Updated</h6>
                        <p className="text-white opacity-75 small mb-3">Subscribe to our newsletter for the latest AI updates.</p>
                        <div className="input-group">
                            <input type="text" className="form-control bg-transparent text-white border-secondary" placeholder="Email address" />
                            <button className="btn btn-primary" type="button">Subscribe</button>
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top border-secondary border-opacity-25 align-items-center">
                    <p className="text-white opacity-75 small mb-0">&copy; {new Date().getFullYear()} KB RAG Platform. All rights reserved.</p>
                    <ul className="list-unstyled d-flex mb-0 gap-3">
                        <li><a className="text-white opacity-75 fs-5" href="#"><i className="bi bi-twitter-x"></i></a></li>
                        <li><a className="text-white opacity-75 fs-5" href="#"><i className="bi bi-github"></i></a></li>
                        <li><a className="text-white opacity-75 fs-5" href="#"><i className="bi bi-linkedin"></i></a></li>
                    </ul>
                </div>
            </div>

            <style jsx>{`
                .hover-white:hover {
                    color: #fff !important;
                }
            `}</style>
        </footer>
    );
}
