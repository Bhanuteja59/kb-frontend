'use client';

import React from 'react';
import { useAuth } from '../hooks/useAuth'; // Adjust import if needed
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const { user } = useAuth(); // Assuming useAuth provides current user and refresh capability
    const router = useRouter();

    // Plans configuration mirroring backend
    const plans = [
        {
            id: 'free',
            name: 'Normal (Free)',
            limit: 5,
            price: '$0/mo',
            features: ['Up to 5 Documents', 'Max 10MB per file', 'Basic Support'],
            btnText: 'Current Plan',
            btnClass: 'btn-outline-primary',
            disabled: true
        },
        {
            id: 'pro',
            name: 'Pro',
            limit: 30,
            price: '$29/mo',
            features: ['Up to 30 Documents', 'Max 30MB per file', 'Priority Support'],
            btnText: 'Upgrade to Pro',
            btnClass: 'btn-primary',
            disabled: false
        },
        {
            id: 'entrepreneur',
            name: 'Entrepreneur',
            limit: 100,
            price: '$99/mo',
            features: ['Up to 100 Documents', 'Max 50MB per file', 'Dedicated Support'],
            btnText: 'Contact Sales',
            btnClass: 'btn-dark',
            disabled: false
        }
    ];

    const currentPlanId = user?.plan || 'free';

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold">Simple, Transparent Pricing</h1>
                <p className="lead text-muted">Choose the plan that fits your organization&apos;s needs.</p>
            </div>

            <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
                {plans.map((plan) => {
                    const isCurrent = currentPlanId === plan.id;
                    return (
                        <div className="col" key={plan.id}>
                            <div className={`card mb-4 rounded-3 shadow-sm ${isCurrent ? 'border-primary' : ''}`}>
                                <div className={`card-header py-3 ${isCurrent ? 'bg-primary text-white' : ''}`}>
                                    <h4 className="my-0 fw-normal">{plan.name}</h4>
                                </div>
                                <div className="card-body">
                                    <h1 className="card-title pricing-card-title">
                                        {plan.price}
                                    </h1>
                                    <ul className="list-unstyled mt-3 mb-4">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="mb-2">{feature}</li>
                                        ))}
                                    </ul>
                                    <button
                                        type="button"
                                        className={`w-100 btn btn-lg ${isCurrent ? 'btn-primary' : 'btn-outline-primary'}`}
                                        disabled={isCurrent || plan.disabled}
                                        onClick={() => {
                                            if (!isCurrent) {
                                                alert("Please contact sales to upgrade.");
                                            }
                                        }}
                                    >
                                        {isCurrent ? 'Current Plan' : plan.btnText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="text-center mt-4">
                <p className="text-muted">
                    Need more? <a href="mailto:sales@example.com">Contact our sales team</a> for custom quotes.
                </p>
                <button className="btn btn-link" onClick={() => router.back()}>
                    &larr; Back to Dashboard
                </button>
            </div>
        </div>
    );
}
