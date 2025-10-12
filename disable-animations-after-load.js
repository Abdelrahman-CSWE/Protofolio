/* Smart continuous-animations manager: preserves visuals in-view, saves CPU offscreen */
(function() {
  'use strict';

  // Configuration: selectors that may have continuous CSS animations
  var CONTINUOUS_ANIM_SELECTORS = [
    '.mechanical-gear-system',
    '.mechanical-framework',
    '.bolt',
    '.pcb-pattern',
    '.blueprint-bg',
    '.certification-badge',
    '.hero-name.hero-name-animate' // floating name effect
  ];

  function toArray(n) { return Array.prototype.slice.call(n || []); }

  function removeWillChangeHints() {
    // After initial load, drop will-change where possible to avoid memory/paint costs
    var hinted = document.querySelectorAll('[style*="will-change"], .floating-element');
    hinted.forEach(function(el) {
      try { el.style.willChange = 'auto'; } catch(e){}
    });
  }

  function manageOffscreenAnimations() {
    if (!('IntersectionObserver' in window)) return; // graceful degrade

    var nodes = [];
    CONTINUOUS_ANIM_SELECTORS.forEach(function(sel){
      nodes = nodes.concat(toArray(document.querySelectorAll(sel)));
    });
    if (!nodes.length) return;

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        var el = e.target;
        // Pause when not visible; run when visible
        try {
          el.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
        } catch(_){}
      });
    }, { root: null, rootMargin: '120px 0px', threshold: 0.01 });

    nodes.forEach(function(el){
      // Start running by default; IO will pause when offscreen
      el.style.animationPlayState = 'running';
      io.observe(el);
    });
  }

  function handleReducedPreferences() {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var prefersReducedData = window.matchMedia('(prefers-reduced-data: reduce)');

    function apply() {
      var reduce = (prefersReducedMotion && prefersReducedMotion.matches) || (prefersReducedData && prefersReducedData.matches);
      if (!reduce) return;
      // Pause heavy continuous pieces, keep reveal/AOS intact
      CONTINUOUS_ANIM_SELECTORS.forEach(function(sel){
        document.querySelectorAll(sel).forEach(function(el){
          try { el.style.animationPlayState = 'paused'; } catch(_){}
        });
      });
    }

    if (prefersReducedMotion && prefersReducedMotion.addEventListener) {
      prefersReducedMotion.addEventListener('change', apply, { passive: true });
    }
    if (prefersReducedData && prefersReducedData.addEventListener) {
      prefersReducedData.addEventListener('change', apply, { passive: true });
    }
    apply();
  }

  function onVisibilityChange() {
    // Pause everything when tab hidden (CSS rule from performance-boost.js also covers this)
    // This ensures inline animation-play-state is set as well for elements we manage.
    var paused = document.hidden;
    CONTINUOUS_ANIM_SELECTORS.forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(el){
        try { el.style.animationPlayState = paused ? 'paused' : 'running'; } catch(_){}
      });
    });
  }

  function init() {
    // Do minimal work immediately
    document.addEventListener('visibilitychange', onVisibilityChange, { passive: true });

    // Defer non-critical steps slightly
    setTimeout(function() {
      removeWillChangeHints();
      manageOffscreenAnimations();
      handleReducedPreferences();
    }, 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
