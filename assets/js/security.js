(function() {
  'use strict';

  // Image protection
  document.addEventListener('contextmenu', function (e) {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      return false;
    }
  });

  // Disable drag and drop for images
  document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      return false;
    }
  });

  // Disable F12, Ctrl+Shift+I, Ctrl+U (view source), and other dev tools shortcuts
  document.addEventListener('keydown', function (e) {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+I (Developer Tools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+C (Element Inspector)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      return false;
    }
  });

  // Clear console and add warning message
  setTimeout(function() {
    console.clear();
    console.log("%c⚠️ ATTENTION / WARNING ⚠️", "color: red; font-size: 2em; font-weight: bold;");
    console.log("%cImages and content are protected by copyright.", "color: red; font-size: 1.2em;");
    console.log("%cLes images et le contenu sont protégés par le droit d'auteur.", "color: red; font-size: 1.2em;");
    console.log("%cUnauthorized access or copying is prohibited.", "color: orange; font-size: 1em;");
    console.log("%cL'accès ou la copie non autorisés sont interdits.", "color: orange; font-size: 1em;");
  }, 1000);

  // Detect developer tools opening (basic detection)
  let devtools = {
    open: false,
    orientation: null
  };

  const threshold = 160;

  setInterval(function() {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      if (!devtools.open) {
        devtools.open = true;
        console.clear();
        console.log("%c🚫 Developer tools detected!", "color: red; font-size: 2em;");
        console.log("%c🚫 Outils de développement détectés!", "color: red; font-size: 2em;");
      }
    } else {
      devtools.open = false;
    }
  }, 500);

  // Prevent text selection on sensitive content
  document.addEventListener('selectstart', function(e) {
    if (e.target.tagName === 'IMG' || e.target.classList.contains('no-select')) {
      e.preventDefault();
      return false;
    }
  });

  // Add integrity verification for external resources
  function verifyResourceIntegrity() {
    const externalLinks = document.querySelectorAll('link[href*="cdnjs.cloudflare.com"]');
    const externalScripts = document.querySelectorAll('script[src*="cdnjs.cloudflare.com"]');
    
    [...externalLinks, ...externalScripts].forEach(element => {
      if (!element.hasAttribute('integrity')) {
        console.warn('External resource without integrity check:', element.src || element.href);
      }
    });
  }

  // Run integrity check when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', verifyResourceIntegrity);
  } else {
    verifyResourceIntegrity();
  }

})();
