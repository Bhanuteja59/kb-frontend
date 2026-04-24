"use client";

import { useState } from "react";
import Link from "next/link";
import Topbar from "../components/layout/Topbar";
import { useAuth } from "../hooks/useAuth";
import "./pricing.css";

const testimonials = [
    {
        quote: "We cut client onboarding from 3 days to 4 hours. The AI actually understands our legal documents — not just keyword-matches them.",
        name: "Priya Sharma",
        role: "Head of Operations",
        company: "LexBridge Legal",
        initials: "PS",
        accentColor: "#FF6B6B",
        stars: 5,
    },
    {
        quote: "Our support team was burning 40% of their time answering the same questions. Now the chatbot handles it cold.",
        name: "Marcus Webb",
        role: "VP of Engineering",
        company: "StackMind Inc.",
        initials: "MW",
        accentColor: "#10b981",
        stars: 5,
    },
    {
        quote: "We'd tried 3 other platforms. This one actually reads between the lines — it connects dots across 200+ documents.",
        name: "Aisha Okonkwo",
        role: "Chief Knowledge Officer",
        company: "Meridian Consulting",
        initials: "AO",
        accentColor: "#3b82f6",
        stars: 5,
    },
];

const faqs = [
    {
        q: "Can I change or cancel my plan at any time?",
        a: "Yes. Upgrade instantly — you'll be charged the prorated difference. Downgrade takes effect at the end of your billing cycle.",
    },
    {
        q: "What happens to my data if I cancel?",
        a: "We give you a full 30 days to export everything before deletion. Your documents are yours — we don't hold data hostage.",
    },
    {
        q: "Is my data private?",
        a: "All documents are encrypted at rest (AES-256) and in transit (TLS 1.3). We physically cannot read your content.",
    },
];

const plans = [
    {
        id: "free",
        name: "Starter",
        emoji: "🌱",
        tagline: "Start exploring. Zero risk.",
        price: 0,
        features: ["5 documents stored", "10 MB per file", "AI-powered chat", "Basic search"],
        cta: "Start Free",
        href: "/login"
    },
    {
        id: "pro",
        name: "Pro",
        emoji: "⚡",
        tagline: "Your team's second brain.",
        price: 29,
        featured: true,
        features: ["30 documents stored", "30 MB per file", "Semantic search", "Embeddable widget", "Analytics"],
        cta: "Get Started",
        href: "/contact"
    },
    {
        id: "enterprise",
        name: "Enterprise",
        emoji: "🏛️",
        tagline: "intelligence at any scale.",
        price: 99,
        features: ["Unlimited documents", "50 MB per file", "API Access", "Dedicated Manager", "SLA Uptime"],
        cta: "Contact Sales",
        href: "/contact"
    }
];

export default function PricingPage() {
    const { user } = useAuth();
    const [billing, setBilling] = useState("monthly");

    return (
        <div className="pricing-page min-vh-100">
            <Topbar />

            {/* Hero */}
            <section className="container py-5 text-center" style={{ marginTop: '4rem' }}>
                <div className="pricing-badge mb-4">
                    <span>✦</span> ENTERPRISE READY
                </div>
                <h1 className="display-3 fw-bold text-dark mb-4">Pricing built for <span className="text-primary">high-trust</span> teams</h1>
                <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: 600 }}>
                    Focus on your knowledge, not your invoice. Start free and scale as your data grows.
                </p>

                {/* Billing Toggle */}
                <div className="d-inline-flex bg-light border rounded-pill p-1 mb-5">
                    <button 
                        onClick={() => setBilling("monthly")}
                        className={`btn rounded-pill px-4 fw-bold ${billing === "monthly" ? "btn-white shadow-sm" : "btn-link text-muted text-decoration-none"}`}
                    >
                        Monthly
                    </button>
                    <button 
                        onClick={() => setBilling("annual")}
                        className={`btn rounded-pill px-4 fw-bold ${billing === "annual" ? "btn-white shadow-sm" : "btn-link text-muted text-decoration-none"}`}
                    >
                        Annual <span className="badge bg-primary ms-1">-20%</span>
                    </button>
                </div>
            </section>

            {/* Plans */}
            <section className="container py-5">
                <div className="row g-4 justify-content-center">
                    {plans.map((plan) => (
                        <div key={plan.id} className="col-lg-4 col-md-6">
                            <div className={`pricing-card h-100 ${plan.featured ? "featured" : ""}`}>
                                {plan.featured && <div className="featured-label">Recommended</div>}
                                <div className="mb-4">
                                    <div className="display-4 mb-2">{plan.emoji}</div>
                                    <h3 className="h4 fw-bold text-dark">{plan.name}</h3>
                                    <p className="text-muted small fw-medium">{plan.tagline}</p>
                                </div>
                                <div className="mb-4">
                                    <span className="display-5 fw-bold text-dark">${billing === "annual" ? Math.floor(plan.price * 0.8) : plan.price}</span>
                                    <span className="text-muted fw-bold">/mo</span>
                                </div>
                                <ul className="list-unstyled flex-grow-1 mb-5">
                                    {plan.features.map(f => (
                                        <li key={f} className="mb-3 d-flex align-items-center gap-2 fw-medium text-dark">
                                            <i className="bi bi-check-circle-fill text-primary"></i> {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link href={plan.href} className={`btn btn-lg w-100 rounded-pill fw-bold ${plan.featured ? "btn-primary shadow-lg" : "btn-outline-dark"}`}>
                                    {plan.cta}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="bg-light py-5 mt-5">
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h2 className="h1 fw-bold text-dark">Trusted by industry leaders</h2>
                    </div>
                    <div className="row g-4">
                        {testimonials.map((t, i) => (
                            <div key={i} className="col-lg-4">
                                <div className="bg-white p-4 rounded-4 border h-100 shadow-sm">
                                    <div className="mb-3">
                                        {[...Array(5)].map((_, i) => <i key={i} className="bi bi-star-fill text-warning me-1"></i>)}
                                    </div>
                                    <p className="text-dark fw-medium italic mb-4">"{t.quote}"</p>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 40, height: 40 }}>{t.initials}</div>
                                        <div>
                                            <div className="fw-bold text-dark">{t.name}</div>
                                            <div className="text-muted small fw-bold">{t.role} @ {t.company}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="container py-5 my-5">
                <div className="max-auto" style={{ maxWidth: 800, margin: '0 auto' }}>
                    <h2 className="h2 fw-bold text-dark text-center mb-5">Frequently Asked Questions</h2>
                    <div className="accordion accordion-flush" id="pricingFaq">
                        {faqs.map((f, i) => (
                            <div key={i} className="accordion-item bg-transparent border-bottom">
                                <h2 className="accordion-header">
                                    <button className="accordion-button collapsed bg-transparent text-dark fw-bold py-4 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target={`#faq${i}`}>
                                        {f.q}
                                    </button>
                                </h2>
                                <div id={`#faq${i}`} className="accordion-collapse collapse" data-bs-parent="#pricingFaq">
                                    <div className="accordion-body text-muted fw-medium pb-4">
                                        {f.a}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="py-5 text-center bg-white border-top">
                <Link href="/" className="text-muted text-decoration-none fw-bold small">
                    ← Back to Dashboard
                </Link>
            </footer>
        </div>
    );
}
