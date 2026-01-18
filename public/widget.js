(function () {
  var currentScript = document.currentScript;
  var orgId = currentScript.getAttribute('data-org-id');

  if (!orgId) {
    console.error('KB RAG Widget: data-org-id attribute is missing on the script tag.');
    return;
  }

  var scriptSrc = currentScript.getAttribute('src');
  var baseUrl = scriptSrc.substring(0, scriptSrc.lastIndexOf('/'));

  var style = document.createElement('style');
  style.innerHTML = `
    .kb-rag-widget-container {
      position: fixed;
      bottom: 25px;
      right: 25px;
      z-index: 999999;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    
    .kb-rag-launcher-btn {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      border-radius: 50%;
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .kb-rag-launcher-btn:hover {
      transform: scale(1.1) translateY(-2px);
      box-shadow: 0 12px 32px rgba(99, 102, 241, 0.5);
    }

    .kb-rag-launcher-btn:active {
      transform: scale(0.95);
    }
    
    .kb-rag-icon {
      width: 32px;
      height: 32px;
      fill: white;
      transition: transform 0.3s ease;
    }
    
    .kb-rag-iframe-container {
      position: absolute;
      bottom: 90px;
      right: 0;
      width: 400px;
      height: 650px;
      max-height: calc(100vh - 120px);
      background: #0f172a; /* Fallback */
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transform: translateY(20px) scale(0.95);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      transform-origin: bottom right;
    }
    
    .kb-rag-iframe-container.open {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0) scale(1);
    }
    
    .kb-rag-iframe {
      width: 100%;
      height: 100%;
      border: none;
      background: transparent;
    }

    @media (max-width: 480px) {
      .kb-rag-iframe-container {
        width: 100vw;
        height: 100%;
        max-height: 100%;
        bottom: 0;
        right: 0;
        border-radius: 0;
        background: #0f172a;
      }
      .kb-rag-launcher-btn {
        display: none; /* Hide button when chat is full screen open? Or maybe keep it as a close button */
      }
      .kb-rag-iframe-container.open ~ .kb-rag-launcher-btn {
         display: flex; /* Keep it visible to close */
         bottom: 20px;
         right: 20px;
         z-index: 1000000;
         width: 50px;
         height: 50px;
      }
    }
  `;
  document.head.appendChild(style);

  var widgetContainer = document.createElement('div');
  widgetContainer.className = 'kb-rag-widget-container';
  widgetContainer.id = 'kb-rag-widget-root'; // ID for easier cleanup

  var iframeContainer = document.createElement('div');
  iframeContainer.className = 'kb-rag-iframe-container';

  var iframe = document.createElement('iframe');
  iframe.className = 'kb-rag-iframe';
  iframe.src = baseUrl + '/embed/' + orgId;
  iframe.title = 'Chat Widget';
  iframe.allow = "microphone";

  iframeContainer.appendChild(iframe);

  var launcherBtn = document.createElement('div');
  launcherBtn.className = 'kb-rag-launcher-btn';
  launcherBtn.innerHTML = `
    <svg class="kb-rag-icon open-icon" viewBox="0 0 24 24">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
    </svg>
    <svg class="kb-rag-icon close-icon" viewBox="0 0 24 24" style="display:none; transform: rotate(0deg);">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  `;

  widgetContainer.appendChild(iframeContainer);
  widgetContainer.appendChild(launcherBtn);
  document.body.appendChild(widgetContainer);

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
