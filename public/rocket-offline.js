!function(){
  "use strict";

  // Dummy functions — tidak melakukan apa-apa
  function a(){} // log-error
  function r(){} // logs
  function s(){} // tracking

  // Override console agar tidak mengirim data ke server
  const noop = ()=>{};
  console.error = console.log = console.warn = console.info = console.debug = noop;

  // Blokir semua postMessage ke parent window
  const originalPostMessage = Window.prototype.postMessage;
  Window.prototype.postMessage = function() {
    if (this === window.parent) return; // blokir semua ke parent
    return originalPostMessage.apply(this, arguments);
  };

  // Inject font lokal — fallback ke sistem
  function injectLocalFont() {
    try {
      const style = document.createElement("style");
      style.textContent = `
        @font-face {
          font-family: 'Inter';
          src: local('Inter'), local('Inter Variable'), local('Arial'), local('Helvetica'), local('sans-serif');
          font-weight: 100 900;
          font-style: normal;
        }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      `;
      document.head.appendChild(style);
    } catch(e) {
      console.warn("Gagal inject font lokal:", e);
    }
  }

  // Watermark offline — SVG inline, tanpa koneksi eksternal
  function addOfflineWatermark() {
    try {
      const div = document.createElement("div");
      div.style.cssText = `
        position: fixed;
        right: 10px;
        bottom: 10px;
        z-index: 100000;
        transform: scale(0.7);
        transform-origin: bottom right;
        display: block;
        cursor: pointer;
      `;
      div.onclick = () => alert("Built with Rocket.new (Offline Mode)");
      div.innerHTML = `
        <div style="
          border-radius: 6px;
          background: #fff;
          box-shadow: 0px 0px 20px 2px rgba(0, 0, 0, 0.20);
          display: flex;
          padding: 4px;
          justify-content: center;
          align-items: center;
          gap: 8px;
          flex-direction: column;
        ">
          <div style="
            border: 2px solid #000;
            border-radius: 6px;
            display: flex;
            flex-direction: column;
            padding: 10px;
          ">
            <!-- SVG Inline Rocket Logo -->
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: auto auto 8px auto;">
              <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 22V12" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M4 7L12 12L20 7" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h3 style="
              text-align: center;
              font-family: Inter, sans-serif;
              font-size: 12px;
              font-weight: 500;
              line-height: 20px;
              color: #777;
              margin: 0;
            ">Built with</h3>
            <h3 style="
              font-family: Inter, sans-serif;
              font-size: 14px;
              font-weight: 500;
              line-height: 20px;
              color: #000;
              margin-top: -4px;
              margin-bottom: 0;
            ">Rocket.new</h3>
          </div>
        </div>
      `;
      document.body.appendChild(div);
    } catch(e) {
      console.warn("Gagal inject watermark offline:", e);
    }
  }

  // Inisialisasi
  function init() {
    injectLocalFont();
    // addOfflineWatermark();

    // Kosongkan global error handlers
    window.__COMPONENT_ERROR__ = null;
    window.onerror = null;
    window.onunhandledrejection = null;

    // Biarkan navigasi SPA berfungsi, tapi tanpa side effect
    if (window.history && window.history.pushState) {
      const originalPush = window.history.pushState;
      const originalReplace = window.history.replaceState;

      window.history.pushState = function() {
        originalPush.apply(this, arguments);
      };

      window.history.replaceState = function() {
        originalReplace.apply(this, arguments);
      };

      window.addEventListener("popstate", function() {
        // Biarkan, tanpa kirim data
      });
    }

    window.addEventListener("hashchange", function() {
      // Biarkan, tanpa kirim data
    });

    // Nonaktifkan toggleEditMode asli (jika ada)
    window.toggleEditMode = function(enabled) {
      console.log("[OFFLINE] Edit mode dijalankan:", enabled);
    };
  }

  // Jalankan saat DOM siap
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

}();