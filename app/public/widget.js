/**
 * Embeddable Chat Widget Script
 * 
 * This script can be embedded on any website to add a chat widget.
 * It reads the organization slug from the script tag's data-org attribute
 * and creates an iframe pointing to the organization's embed page.
 * 
 * Usage:
 * <script data-org="your-org-slug" src="https://your-domain.com/widget.js"></script>
 * 
 * The script will:
 * 1. Read the data-org attribute
 * 2. Create an iframe pointing to /embed/[org]
 * 3. Position it as a fixed chat bubble in bottom-right corner
 * 4. Add toggle functionality to show/hide the chat
 */

(function () {
    'use strict';

    // ========================================
    // Get Configuration from Script Tag
    // ========================================
    // Find the script tag that loaded this file
    const scripts = document.getElementsByTagName('script');
    let currentScript = null;

    // Find our script tag (the one with data-org attribute)
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].hasAttribute('data-org')) {
            currentScript = scripts[i];
            break;
        }
    }

    if (!currentScript) {
        console.error('KB RAG Widget: Could not find script tag with data-org attribute');
        return;
    }

    // Read organization slug from data-org attribute
    const orgSlug = currentScript.getAttribute('data-org');

    if (!orgSlug) {
        console.error('KB RAG Widget: data-org attribute is required');
        return;
    }

    // Get the base URL from the script src
    const scriptSrc = currentScript.src;
    const baseUrl = scriptSrc.substring(0, scriptSrc.lastIndexOf('/'));

    // ========================================
    // Create Widget Container
    // ========================================
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'kb-rag-widget-container';
    widgetContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    `;

    // ========================================
    // Create Chat Iframe
    // ========================================
    const iframe = document.createElement('iframe');
    iframe.id = 'kb-rag-chat-iframe';
    iframe.src = `${baseUrl}/embed/${orgSlug}`;
    iframe.style.cssText = `
        display: none;
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 400px;
        height: 600px;
        max-height: calc(100vh - 120px);
        border: none;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 999998;
    `;

    // ========================================
    // Create Toggle Button
    // ========================================
    const toggleButton = document.createElement('button');
    toggleButton.id = 'kb-rag-toggle-btn';
    toggleButton.innerHTML = '💬';
    toggleButton.style.cssText = `
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-size: 28px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: transform 0.2s, box-shadow 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: none;
    `;

    // Add hover effect
    toggleButton.onmouseenter = function () {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
    };

    toggleButton.onmouseleave = function () {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    };

    // ========================================
    // Toggle Functionality
    // ========================================
    let isOpen = false;

    toggleButton.onclick = function () {
        isOpen = !isOpen;

        if (isOpen) {
            // Show chat
            iframe.style.display = 'block';
            toggleButton.innerHTML = '✕';
            toggleButton.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
        } else {
            // Hide chat
            iframe.style.display = 'none';
            toggleButton.innerHTML = '💬';
            toggleButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    };

    // ========================================
    // Add Elements to Page
    // ========================================
    // Wait for DOM to be ready
    function initWidget() {
        widgetContainer.appendChild(toggleButton);
        document.body.appendChild(widgetContainer);
        document.body.appendChild(iframe);

        console.log(`KB RAG Widget initialized for organization: ${orgSlug}`);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }

})();
