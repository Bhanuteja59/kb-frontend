"use client";
import { useState } from "react";
import Topbar from "../components/layout/Topbar";
import AlertModal from "../components/ui/AlertModal";

export default function PricingPage() {
    const [showModal, setShowModal] = useState(false);

    const handleUpgradeClick = () => {
        setShowModal(true);
    };

    return (
        <div className="min-vh-100 bg-dark text-white">
            <Topbar />

            <div className="container py-5 mt-5">
                <div className="text-center mb-5 fade-in">
                    <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 mb-3">
                        <i className="bi bi-stars me-2"></i> Flexible Plans
                    </span>
                    <h1 className="display-4 fw-bold mb-3">Pricing Plans</h1>
                    <p className="lead text-white opacity-75">Choose the perfect plan for your knowledge base needs.</p>
                </div>

                <div className="row g-4 justify-content-center align-items-stretch">
                    {/* Free Plan */}
                    <div className="col-lg-4 col-md-6 fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="card h-100 border-0 rounded-4 shadow-lg position-relative overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
                            <div className="card-body p-4 p-lg-5 d-flex flex-column text-center position-relative z-1" style={{ color: '#000000' }}>
                                <h3 className="fw-bold mb-2" style={{ color: '#000000' }}>Free</h3>
                                <p className="mb-4" style={{ color: '#6c757d' }}>For individuals and hobbyists</p>
                                <div className="display-2 fw-bold mb-4" style={{ color: '#000000' }}>$0 <span className="fs-5 fw-normal" style={{ color: '#6c757d' }}>/mo</span></div>

                                <ul className="list-unstyled text-start mb-5 mx-auto w-100" style={{ maxWidth: '300px' }}>
                                    <li className="d-flex align-items-center mb-3">
                                        <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
                                        <span style={{ color: '#000000' }}>3 Documents</span>
                                    </li>
                                    <li className="d-flex align-items-center mb-3">
                                        <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
                                        <span style={{ color: '#000000' }}>30 MB Storage</span>
                                    </li>
                                    <li className="d-flex align-items-center mb-3">
                                        <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
                                        <span style={{ color: '#000000' }}>Basic RAG Chat</span>
                                    </li>
                                    <li className="d-flex align-items-center mb-3">
                                        <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
                                        <span style={{ color: '#000000' }}>Email Support</span>
                                    </li>
                                </ul>

                                <button className="btn btn-outline-dark rounded-pill py-3 fw-bold w-100 mt-auto disabled opacity-50">
                                    Current Plan
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div className="col-lg-4 col-md-6 fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="card h-100 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-4 shadow-lg glass-panel position-relative overflow-hidden transform-hover">
                            <div className="position-absolute top-0 end-0 bg-primary text-white text-uppercase fw-bold py-1 px-4 small" style={{ transform: 'rotate(45deg) translate(30px, -20px)', fontSize: '0.7rem', width: '150px', textAlign: 'center' }}>
                                Popular
                            </div>
                            <div className="card-body p-4 p-lg-5 d-flex flex-column text-center position-relative z-1">
                                <h3 className="fw-bold mb-2 text-primary">Pro</h3>
                                <p className="text-white opacity-50 mb-4">For power users & small teams</p>
                                <div className="display-2 fw-bold mb-4 text-white">$29 <span className="fs-5 fw-normal opacity-50">/mo</span></div>

                                <ul className="list-unstyled text-start mb-5 mx-auto w-100" style={{ maxWidth: '300px' }}>
                                    <li className="d-flex align-items-center mb-3">
                                        <i className="bi bi-check-circle-fill text-primary me-2 fs-5"></i>
                                        <span>10 Documents</span>
                                    </li>
                                    <li className="d-flex align-items-center mb-3">
                                        <i className="bi bi-check-circle-fill text-primary me-2 fs-5"></i>
                                        <span>200 MB Storage</span>
                                    </li>
                                    <li className="d-flex align-items-center mb-3">
                                        <i className="bi bi-check-circle-fill text-primary me-2 fs-5"></i>
                                        <span>Priority Support</span>
                                    </li>
                                    <li className="d-flex align-items-center mb-3">
                                        <i className="bi bi-check-circle-fill text-primary me-2 fs-5"></i>
                                        <span>Advanced Analytics</span>
                                    </li>
                                </ul>

                                <button
                                    className="btn btn-primary rounded-pill py-3 fw-bold w-100 mt-auto hover-lift shadow-lg"
                                    onClick={handleUpgradeClick}
                                >
                                    Upgrade to Pro
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="col-lg-4 col-md-6 fade-in" style={{ animationDelay: '0.3s' }}>
                        <div className="card h-100 border-0 rounded-4 shadow-lg position-relative overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
                            <div className="card-body p-4 p-lg-5 d-flex flex-column text-center position-relative z-1" style={{ color: '#000000' }}>
                                <h3 className="fw-bold mb-2" style={{ color: '#000000' }}>Enterprise</h3>
                                <p className="mb-4" style={{ color: '#6c757d' }}>For large organizations</p>
                                <div className="display-2 fw-bold mb-4" style={{ color: '#000000' }}>Custom</div>

                                <ul className="list-unstyled text-start mb-5 mx-auto w-100" style={{ maxWidth: '300px' }}>
                                    <li className="d-flex align-items-center mb-3">
                                        <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
                                        <span style={{ color: '#000000' }}>30+ Documents</span>
                                    </li>
                                    <li className="d-flex align-items-center mb-3">
                                        <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
                                        <span style={{ color: '#000000' }}>500 MB Storage</span>
                                    </li>
                                    <li className="d-flex align-items-center mb-3">
                                        <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
                                        <span style={{ color: '#000000' }}>Dedicated Support</span>
                                    </li>
                                    <li className="d-flex align-items-center mb-3">
                                        <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
                                        <span style={{ color: '#000000' }}>SLA & Security</span>
                                    </li>
                                </ul>

                                <button
                                    className="btn btn-outline-dark rounded-pill py-3 fw-bold w-100 mt-auto hover-bg-dark hover-text-white transition-all"
                                    onClick={handleUpgradeClick}
                                >
                                    Contact Sales
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AlertModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Coming Soon"
                type="info"
                body="Our team is still developing the pricing page. You may have better options to use the Free plan for now."
            />

            <style jsx>{`
                .glass-panel {
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                }
                .hover-lift {
                    transition: transform 0.2s;
                }
                .hover-lift:hover {
                    transform: translateY(-5px);
                }
                .transform-hover {
                    transition: all 0.3s ease;
                }
                .transform-hover:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 1rem 3rem rgba(0,0,0,0.3) !important;
                }
            `}</style>
        </div >
    );
}
