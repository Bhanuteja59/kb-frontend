"use client";

import React, { useState } from "react";
import Topbar from "../components/layout/Topbar";
import Link from "next/link";
import "./contact.css";

export default function ContactPage() {
    const [status, setStatus] = useState(null);
    const [busy, setBusy] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "Sales Inquiry",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function onSubmit(e) {
        e.preventDefault();
        setBusy(true);
        // Mocking an API call / Mailto redirect
        setTimeout(() => {
            setBusy(false);
            setStatus("success");
            // In a real app, we might do: window.location.href = `mailto:support@kb-rag.ai?subject=${formData.subject}&body=${formData.message}`;
        }, 1500);
    }

    return (
        <div className="contact-page min-vh-100 d-flex flex-column">
            <Topbar />

            <div className="container py-5 fade-in flex-grow-1">
                <div className="text-center mb-5" style={{ marginTop: '2rem' }}>
                    <h1 className="display-4 fw-bold text-dark mb-3">Get in touch</h1>
                    <p className="lead text-muted fw-medium mx-auto" style={{ maxWidth: 600 }}>
                        Have questions about our Enterprise RAG solutions? Our team of experts is ready to help you unlock your data's potential.
                    </p>
                </div>

                <div className="row g-5">
                    {/* Contact Form */}
                    <div className="col-lg-7">
                        <div className="contact-card">
                            <h2 className="h3 fw-bold text-dark mb-4">Send us a message</h2>
                            <form onSubmit={onSubmit}>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label className="contact-form-label">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="form-control contact-input"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="contact-form-label">Work Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="form-control contact-input"
                                            placeholder="john@company.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="contact-form-label">Subject</label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="form-select contact-input"
                                        required
                                    >
                                        <option value="sales">Sales Inquiry</option>
                                        <option value="demo">Request a Demo</option>
                                        <option value="support">Technical Support</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="contact-form-label">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="form-control contact-input"
                                        rows="5"
                                        placeholder="How can we help you?"
                                        required
                                    ></textarea>
                                </div>

                                {status === "success" && (
                                    <div className="alert alert-success border-0 rounded-4 p-3 mb-4 fw-bold small">
                                        <i className="bi bi-check-circle-fill me-2"></i>
                                        Message sent successfully! We'll get back to you soon.
                                    </div>
                                )}

                                <button type="submit" disabled={busy} className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow-lg">
                                    {busy ? <span className="spinner-border spinner-border-sm me-2"></span> : "Send Message"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="col-lg-5">
                        <div className="row g-4">
                            <div className="col-12">
                                <div className="contact-info-card">
                                    <div className="contact-icon-wrapper">
                                        <i className="bi bi-envelope-fill"></i>
                                    </div>
                                    <h4 className="fw-bold text-dark mb-2">Email us</h4>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="contact-info-card">
                                    <div className="contact-icon-wrapper">
                                        <i className="bi bi-geo-alt-fill"></i>
                                    </div>
                                    <h4 className="fw-bold text-dark mb-2">Visit us</h4>
                                    <p className="text-muted fw-medium mb-0">
                                        123 Intelligence Way, <br />
                                        Silicon Valley, CA 94025
                                    </p>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="contact-info-card" style={{ background: 'var(--dark)' }}>
                                    <h4 className="fw-bold mb-3">Join our community</h4>
                                    <p className="opacity-75 fw-medium mb-4">Stay updated with the latest in RAG and AI technology.</p>
                                    <div className="d-flex gap-3">
                                        <a href="#" className="btn btn-outline-light rounded-circle p-2" style={{ width: 42, height: 42 }}>
                                            <i className="bi bi-twitter"></i>
                                        </a>
                                        <a href="#" className="btn btn-outline-light rounded-circle p-2" style={{ width: 42, height: 42 }}>
                                            <i className="bi bi-linkedin"></i>
                                        </a>
                                        <a href="#" className="btn btn-outline-light rounded-circle p-2" style={{ width: 42, height: 42 }}>
                                            <i className="bi bi-github"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="py-5 text-center bg-white border-top mt-auto">
                <Link href="/" className="text-muted text-decoration-none fw-bold small">
                    ← Back to Dashboard
                </Link>
            </footer>
        </div>
    );
}
