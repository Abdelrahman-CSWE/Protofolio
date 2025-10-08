/* ui-ux-enhancements.js
 - Non-intrusive performance and UX helpers
 - No visual changes unless elements opt-in via data attributes
*/
(function(){
  'use strict';

  // Honor prefers-reduced-motion
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Lazy upgrade images: decoding, fetchPriority, loading
  function upgradeImages(){
    var imgs = document.querySelectorAll('img');
    imgs.forEach(function(img){
      try {
        if(!img.hasAttribute('decoding')) img.setAttribute('decoding','async');
        if(!img.hasAttribute('loading')) img.setAttribute('loading','lazy');
        // Prioritize only first viewport images (hero)
        var rect = img.getBoundingClientRect();
        if(rect.top < (window.innerHeight*1.2) && rect.bottom > 0){
          if(!img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority','high');
          if(img.hasAttribute('loading')) img.removeAttribute('loading');
        }
      } catch(e) {}
    });
  }

  // Intersection-based reveal (opt-in via data-uix-reveal)
  function initReveal(){
    var els = document.querySelectorAll('[data-uix-reveal]');
    if(!els.length) return;
    if(reduceMotion){ els.forEach(function(el){ el.classList.add('is-inview'); }); return; }
    if(!('IntersectionObserver' in window)) { els.forEach(function(el){ el.classList.add('is-inview'); }); return; }

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-inview');
          io.unobserve(entry.target);
        }
      });
    }, {threshold: 0.15, rootMargin: '0px 0px -10% 0px'});

    els.forEach(function(el){ io.observe(el); });
  }

  // Micro-interactions: transient will-change on hover/focus (opt-in)
  function initMicroInteractions(){
    var hoverables = document.querySelectorAll('[data-uix-micro]');
    if(!hoverables.length) return;

    function addWC(e){ e.currentTarget.classList.add('uix-will-change'); }
    function rmWC(e){ e.currentTarget.classList.remove('uix-will-change'); }

    hoverables.forEach(function(el){
      el.addEventListener('mouseenter', addWC);
      el.addEventListener('mouseleave', rmWC);
      el.addEventListener('touchstart', addWC, {passive:true});
      el.addEventListener('touchend', rmWC, {passive:true});
      el.addEventListener('blur', rmWC);
    });
  }

  // Accessibility: add ARIA to nav if missing (non-visual)
  function ensureA11y(){
    var nav = document.querySelector('nav, .nav');
    if(nav && !nav.getAttribute('role')) nav.setAttribute('role','navigation');
    var menus = document.querySelectorAll('nav ul, .nav ul');
    menus.forEach(function(ul){ if(!ul.getAttribute('role')) ul.setAttribute('role','menubar'); });
  }

  function onReady(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', fn, {once:true}); else fn(); }

  onReady(function(){
    upgradeImages();
    initReveal();
    initMicroInteractions();
    ensureA11y();
  });

  // Re-run upgrade when viewport changes (debounced)
  var t; window.addEventListener('resize', function(){ clearTimeout(t); t=setTimeout(upgradeImages, 200); });
})();
