"use client";
import React, { useState } from "react";
import Topbar from "../components/layout/Topbar";
import Footer from "../components/layout/Footer";
import { apiFetch } from "../lib/api/client";

export default function ContactPage() {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "General Support",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        // Construct Mailto Link
        // "go to the user mail with the user given info"
        const mailtoLink = `mailto:bhanu21reddy@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;

        // "then from the user send the mail from it"
        // This opens their default email client with the message pre-filled
        window.location.href = mailtoLink;

        // Reset UI
        setSubmitting(false);
        setSubmitted(true);
    };

    return (
        <div className="min-vh-100 bg-light text-dark d-flex flex-column">
            {/* Dark Backdrop for Fixed Topbar */}
            <div className="position-fixed top-0 start-0 w-100 bg-dark" style={{ height: '70px', zIndex: 1049 }}></div>

            <Topbar />

            <div className="flex-grow-1 position-relative overflow-hidden py-5 mt-5">
                {/* Background Decor */}
                <div className="position-absolute top-0 start-0 translate-middle w-100 h-100 rounded-circle"
                    style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 60%)', filter: 'blur(100px)', zIndex: 0 }}></div>

                <div className="container position-relative z-1 pt-4">
                    <div className="text-center mb-5">
                        <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 mb-3">
                            <i className="bi bi-life-preserver me-2"></i> Support Center
                        </span>
                        <h1 className="display-4 fw-bold mb-3 text-dark">How can we help?</h1>
                        <p className="lead text-muted">
                            We're here to help you get the most out of your Knowledge Base.
                        </p>
                    </div>

                    <div className="row g-5">
                        {/* Contact Form */}
                        <div className="col-lg-7">
                            <div className="card bg-white border-0 shadow-sm rounded-4 h-100">
                                <div className="card-body p-4 p-md-5">
                                    <h3 className="fw-bold mb-4 text-dark">Send us a Message</h3>

                                    {submitted ? (
                                        <div className="text-center py-5">
                                            <div className="mb-4 text-success display-1">
                                                <i className="bi bi-check-circle-fill"></i>
                                            </div>
                                            <h4 className="fw-bold text-dark">Message Sent!</h4>
                                            <p className="text-muted">Thank you for reaching out. We'll get back to you shortly at <strong>bhanu21reddy@gmail.com</strong>.</p>
                                            <button onClick={() => { setSubmitted(false); setFormData({ ...formData, message: "" }); }} className="btn btn-outline-dark mt-3">Send Another</button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit}>
                                            {error && <div className="alert alert-danger mb-3">{error}</div>}
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted">Full Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className="form-control bg-light border-light-subtle text-dark py-2"
                                                        required
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted">Email Address</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="form-control bg-light border-light-subtle text-dark py-2"
                                                        required
                                                        placeholder="name@company.com"
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label text-muted">Subject</label>
                                                    <select
                                                        name="subject"
                                                        value={formData.subject}
                                                        onChange={handleChange}
                                                        className="form-select bg-light border-light-subtle text-dark py-2"
                                                    >
                                                        <option>General Support</option>
                                                        <option>Billing Question</option>
                                                        <option>Feature Request</option>
                                                        <option>Report a Bug</option>
                                                    </select>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label text-muted">Message</label>
                                                    <textarea
                                                        name="message"
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        className="form-control bg-light border-light-subtle text-dark"
                                                        rows="5"
                                                        required
                                                        placeholder="Tell us about your issue..."
                                                    ></textarea>
                                                </div>
                                                <div className="col-12 mt-4">
                                                    <button type="submit" className="btn btn-dark w-100 py-3 fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2" disabled={submitting}>
                                                        {submitting ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                Sending...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="bi bi-send-fill"></i> Send Message
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact Info & Help */}
                        <div className="col-lg-5">
                            <div className="d-flex flex-column gap-4 h-100">
                                {/* Direct Contact Card */}
                                <div className="card bg-primary text-white border-0 shadow-lg rounded-4 p-4">
                                    <h5 className="fw-bold mb-3">Direct Contact</h5>
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="bg-white bg-opacity-25 rounded-circle p-3 d-flex align-items-center justify-content-center text-white">
                                            <i className="bi bi-envelope-fill fs-5"></i>
                                        </div>
                                        <div>
                                            <p className="mb-0 small opacity-75">Email Us</p>
                                            <a href="mailto:bhanu21reddy@gmail.com" className="text-white fw-bold text-decoration-none stretched-link">bhanu21reddy@gmail.com</a>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-success rounded-circle p-3 d-flex align-items-center justify-content-center text-white">
                                            <i className="bi bi-whatsapp fs-5"></i>
                                        </div>
                                        <div>
                                            <p className="mb-0 small opacity-75">Chat Support</p>
                                            <span className="text-white fw-bold">Active 24/7</span>
                                        </div>
                                    </div>
                                </div>

                                {/* FAQ Section (User Help) */}
                                <div className="card bg-white border-0 shadow-sm rounded-4 flex-grow-1">
                                    <div className="card-body p-4">
                                        <h5 className="fw-bold mb-4 text-dark">Frequently Asked Questions</h5>

                                        <div className="accordion accordion-flush" id="faqAccordion">
                                            <div className="accordion-item bg-transparent">
                                                <h2 className="accordion-header">
                                                    <button className="accordion-button collapsed bg-transparent text-dark shadow-none fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                                                        How do I reset my API key?
                                                    </button>
                                                </h2>
                                                <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                                    <div className="accordion-body text-muted small">
                                                        Go to Settings &gt; API Keys and generate a new key. The old one will be invalidated immediately.
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="accordion-item bg-transparent border-top">
                                                <h2 className="accordion-header">
                                                    <button className="accordion-button collapsed bg-transparent text-dark shadow-none fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                                                        What file types are supported?
                                                    </button>
                                                </h2>
                                                <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                                    <div className="accordion-body text-muted small">
                                                        We support PDF, DOCX, TXT, CSV, and Markdown files up to 50MB each.
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="accordion-item bg-transparent border-top">
                                                <h2 className="accordion-header">
                                                    <button className="accordion-button collapsed bg-transparent text-dark shadow-none fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                                                        How is my data secured?
                                                    </button>
                                                </h2>
                                                <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                                    <div className="accordion-body text-muted small">
                                                        We use AES-256 encryption at rest and TLS 1.3 in transit. Your documents are isolated within your organization.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-dark text-white">
                <Footer />
            </div>
        </div>
    );
}
