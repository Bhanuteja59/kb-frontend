(function () {
  // 1. Get configuration we need
  // The current script tag is the last one running (usually) or we find by data attribute if we want to be strict.
  // But a common pattern is document.currentScript (not consistent in modules but okay in standard script tags).
  var currentScript = document.currentScript;
  var orgId = currentScript.getAttribute('data-org-id');

  if (!orgId) {
    console.error('KB RAG Widget: data-org-id attribute is missing on the script tag.');
    return;
  }

  // Detect the base URL from the script source to know where to load the iframe from
  // e.g., src="https://example.com/widget.js" -> baseUrl="https://example.com"
  var scriptSrc = currentScript.getAttribute('src');
  var baseUrl = scriptSrc.substring(0, scriptSrc.lastIndexOf('/'));

  // 2. Inject Styles
  var style = document.createElement('style');
  style.innerHTML = `
    .kb-rag-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    
    .kb-rag-launcher-btn {
      width: 60px;
      height: 60px;
      background-color: #2563eb;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, background-color 0.2s;
    }
    
    .kb-rag-launcher-btn:hover {
      transform: scale(1.05);
      background-color: #1d4ed8;
    }
    
    .kb-rag-icon {
      width: 32px;
      height: 32px;
      fill: white;
    }
    
    .kb-rag-iframe-container {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 400px;
      height: 600px;
      max-height: calc(100vh - 100px);
      background: transparent;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transform: translateY(20px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
    }
    
    .kb-rag-iframe-container.open {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }
    
    .kb-rag-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    /* Mobile Responsive */
    @media (max-width: 480px) {
      .kb-rag-iframe-container {
        width: 100vw; /* Using vw to ensure it doesn't break out of viewport logic incorrectly */
        height: 100%;
        max-height: 100%;
        position: fixed;
        bottom: 0;
        right: 0;
        left: 0;
        top: 0;
        border-radius: 0;
      }
      
      .kb-rag-widget-container {
        /* When open on mobile, button might need to move or change functionality */
      }
      
      .kb-rag-iframe-container.open ~ .kb-rag-launcher-btn {
         display: none; /* Optional: hide button or move it "inside" if needed, but let's keep simpler toggle logic */
      }
      
      /* Let's add a close button for mobile specifically if we go full screen? 
         For now, user can click the launcher (if visible) or we rely on the iframe having a close UI?
         Actually, let's keep the launcher visible so they can toggle it closed. 
         We'll just make sure the z-index is higher.
      */
      .kb-rag-launcher-btn.open {
        /* Transform into a close X style if we wanted, but let's keep it simple first */
      }
    }
  `;
  document.head.appendChild(style);

  // 3. Inject DOM Elements
  var widgetContainer = document.createElement('div');
  widgetContainer.className = 'kb-rag-widget-container';

  var iframeContainer = document.createElement('div');
  iframeContainer.className = 'kb-rag-iframe-container';

  // Create iframe but don't load src immediately if we want lazier loading, 
  // currently we load it so it's ready.
  var iframe = document.createElement('iframe');
  iframe.className = 'kb-rag-iframe';
  iframe.src = baseUrl + '/embed/' + orgId;
  iframe.title = 'Chat Widget';

  iframeContainer.appendChild(iframe);

  var launcherBtn = document.createElement('div');
  launcherBtn.className = 'kb-rag-launcher-btn';
  launcherBtn.innerHTML = `
    <!-- Chat Icon -->
    <svg class="kb-rag-icon open-icon" viewBox="0 0 24 24">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
    </svg>
    <!-- Close Icon (hidden by default logic, or we swap via JS) -->
    <svg class="kb-rag-icon close-icon" viewBox="0 0 24 24" style="display:none;">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  `;

  widgetContainer.appendChild(iframeContainer);
  widgetContainer.appendChild(launcherBtn);
  document.body.appendChild(widgetContainer);

  // 4. Interaction Logic
  var isOpen = false;
  var openIcon = launcherBtn.querySelector('.open-icon');
  var closeIcon = launcherBtn.querySelector('.close-icon');

  launcherBtn.addEventListener('click', function () {
    isOpen = !isOpen;
    if (isOpen) {
      iframeContainer.classList.add('open');
      openIcon.style.display = 'none';
      closeIcon.style.display = 'block';
    } else {
      iframeContainer.classList.remove('open');
      openIcon.style.display = 'block';
      closeIcon.style.display = 'none';
    }
  });

})();
