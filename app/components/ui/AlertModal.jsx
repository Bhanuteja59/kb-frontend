"use client";
import React from 'react';

export default function AlertModal({ isOpen, title, body, onClose, type = "danger" }) {
    if (!isOpen) return null;

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-white text-dark shadow-lg border-0">
                    <div className={`modal-header border-bottom border-secondary border-opacity-10 ${type === 'danger' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-primary bg-opacity-10 text-primary'}`}>
                        <h5 className="modal-title fw-bold">
                            <i className={`bi ${type === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill'} me-2`}></i>
                            {title}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        <p className="mb-0 fs-5 text-secondary">{body}</p>
                    </div>
                    <div className="modal-footer border-top border-secondary border-opacity-10 justify-content-center">
                        <button type="button" className="btn btn-dark px-5 fw-bold" onClick={onClose}>
                            Okay, I Understand
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
