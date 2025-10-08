/* 🤖 Add Spline Robot beside Contact Section */
(function() {
  'use strict';
  
  function loadSplineScript(callback) {
    // Check if script already loaded
    if (document.querySelector('script[src*="spline-viewer.js"]')) {
      callback();
      return;
    }
    
    // Load Spline viewer script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.10.76/build/spline-viewer.js';
    script.onload = callback;
    script.onerror = function() {
      console.error('Failed to load Spline viewer');
    };
    document.head.appendChild(script);
  }
  
  function addRobotToContact() {
    // Wait for contact section to be created
    const checkContact = setInterval(function() {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        clearInterval(checkContact);
        
        // Find the container
        const container = contactSection.querySelector('.container');
        if (!container) return;
        
        // Check if robot already added
        if (container.querySelector('.spline-robot-wrapper')) return;
        
        // Load Spline script first
        loadSplineScript(function() {
          // Create robot wrapper
          const robotWrapper = document.createElement('div');
          robotWrapper.className = 'spline-robot-wrapper';
          robotWrapper.innerHTML = `
            <div class="spline-robot-label">🤖 Interactive 3D</div>
            <spline-viewer url="https://prod.spline.design/YGIdaOwuCJGrCUnd/scene.splinecode"></spline-viewer>
          `;
          
          // Append to container (will be positioned by CSS Grid)
          container.appendChild(robotWrapper);
          
          console.log('✅ Spline Robot added beside Contact section');
        });
      }
    }, 100);
    
    // Stop checking after 10 seconds
    setTimeout(function() {
      clearInterval(checkContact);
    }, 10000);
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addRobotToContact);
  } else {
    addRobotToContact();
  }
})();
