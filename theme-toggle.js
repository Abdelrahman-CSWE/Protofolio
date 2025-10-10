(function(){
  'use strict';
  
  var STORAGE_KEY = 'portfolio-theme-mode';
  var body = document.body;
  var btn;
  var isMobileAnimating = false;
  var isPCAnimating = false;
  
  // Create theme toggle button
  function createButton(){
    btn = document.createElement('button');
    btn.className = 'theme-toggle-btn';
    btn.setAttribute('aria-label', 'Toggle theme');
    btn.setAttribute('data-tooltip', 'Switch to Light Mode');
    
    // Moon icon (default - night mode)
    var moonIcon = document.createElement('div');
    moonIcon.className = 'moon-icon';
    moonIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="rgba(14, 165, 233, 0.3)" stroke="rgba(14, 165, 233, 1)"/></svg>';
    
    // Sun icon (light mode)
    var sunIcon = document.createElement('div');
    sunIcon.className = 'sun-icon';
    sunIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5" fill="rgba(251, 191, 36, 0.3)" stroke="rgba(251, 191, 36, 1)"/><line x1="12" y1="1" x2="12" y2="3" stroke="rgba(251, 191, 36, 1)"/><line x1="12" y1="21" x2="12" y2="23" stroke="rgba(251, 191, 36, 1)"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="rgba(251, 191, 36, 1)"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="rgba(251, 191, 36, 1)"/><line x1="1" y1="12" x2="3" y2="12" stroke="rgba(251, 191, 36, 1)"/><line x1="21" y1="12" x2="23" y2="12" stroke="rgba(251, 191, 36, 1)"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="rgba(251, 191, 36, 1)"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="rgba(251, 191, 36, 1)"/></svg>';
    
    var iconContainer = document.createElement('div');
    iconContainer.className = 'theme-icon';
    iconContainer.appendChild(moonIcon);
    iconContainer.appendChild(sunIcon);
    
    btn.appendChild(iconContainer);
    
    // Add tooltip for PC only
    var tooltip = document.createElement('span');
    tooltip.className = 'theme-toggle-btn-tooltip';
    tooltip.textContent = 'Switch to Light Mode';
    btn.appendChild(tooltip);
    
    document.body.appendChild(btn);
    
    // Add click handler
    btn.addEventListener('click', toggleTheme);
  }
  
  // Toggle theme with animations
  function toggleTheme(){
    var isLight = body.classList.contains('light-mode');
    var isMobile = window.innerWidth <= 900;
    
    // Mobile slide animation
    if(isMobile){
      // Prevent spamming during animation
      if (isMobileAnimating) return;
      isMobileAnimating = true;

      // Slide in fully
      btn.classList.add('active');

      // Toggle theme after 200ms from start of slide
      setTimeout(function(){
        var nowLight = body.classList.contains('light-mode');
        if(nowLight){
          body.classList.remove('light-mode');
          updateTooltip('Switch to Light Mode');
          localStorage.setItem(STORAGE_KEY, 'dark');
        } else {
          body.classList.add('light-mode');
          updateTooltip('Switch to Dark Mode');
          localStorage.setItem(STORAGE_KEY, 'light');
        }
      }, 200);

      // Auto return to half-visible after ~1s
      setTimeout(function(){
        btn.classList.remove('active');
      }, 1000);

      // Unlock
      setTimeout(function(){
        isMobileAnimating = false;
      }, 1100);
    } else {
      // PC - Smooth slide animation
      if (isPCAnimating) return;
      isPCAnimating = true;

      // Slide in fully with pc-active class
      btn.classList.add('pc-active');

      // Toggle theme after 200ms (during slide)
      setTimeout(function(){
        if(isLight){
          body.classList.remove('light-mode');
          updateTooltip('Switch to Light Mode');
          localStorage.setItem(STORAGE_KEY, 'dark');
        } else {
          body.classList.add('light-mode');
          updateTooltip('Switch to Dark Mode');
          localStorage.setItem(STORAGE_KEY, 'light');
        }
      }, 200);

      // Auto return to half-visible after ~1s
      setTimeout(function(){
        btn.classList.remove('pc-active');
      }, 1000);

      // Unlock
      setTimeout(function(){
        isPCAnimating = false;
      }, 1100);
    }
  }
  
  // Update tooltip text
  function updateTooltip(text){
    var tooltip = btn.querySelector('.theme-toggle-btn-tooltip');
    if(tooltip){
      tooltip.textContent = text;
    }
    btn.setAttribute('data-tooltip', text);
  }
  
  // Load saved theme
  function loadTheme(){
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if(saved === 'light'){
        body.classList.add('light-mode');
        if(btn) updateTooltip('Switch to Dark Mode');
      } else {
        body.classList.remove('light-mode');
        if(btn) updateTooltip('Switch to Light Mode');
      }
    } catch(e){
      // localStorage not available
    }
  }
  
  // Initialize
  function init(){
    // Load theme before creating button to avoid flash
    loadTheme();
    createButton();
  }
  
  // Run on DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
  
  // Handle page show (back/forward cache)
  window.addEventListener('pageshow', function(e){
    if(e.persisted){
      loadTheme();
    }
  }, { passive: true });
})();
