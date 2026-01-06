/**
 * Organization-Specific Embed Page
 * 
 * This page renders a chatbot widget for a specific organization.
 * It's designed to be embedded in an iframe on external websites.
 * 
 * URL: /embed/[org]
 * Example: /embed/acme-corporation
 */

import ChatWidget from "../../components/chat/ChatWidget";

import { use } from 'react';

export default function EmbedPage({ params }) {
    // Extract organization slug from URL parameters
    const { org } = use(params);

    return (
        <div style={{
            width: '100vw',
            height: '90vh',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            backgroundColor: '#f8fafc' // Light background for visibility
        }}>
            {/* 
                Render ChatWidget in embedded mode
                - embedded={true}: Shows full-screen chat interface
                - org={org}: Filters queries to this organization's documents
            */}
            <ChatWidget
                embedded={true}
                org={org}
            />
        </div>
    );
}
