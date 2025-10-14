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
          // Pre-decode in-viewport images to avoid jank without visual change
          if (typeof img.decode === 'function') { img.decode().catch(function(){}); }
        }
      } catch(e) {}
    });
  }

  // Lightweight media optimization (safe)
  function optimizeIframes(){
    var ifr = document.querySelectorAll('iframe');
    ifr.forEach(function(f){
      try {
        if(!f.hasAttribute('loading')) f.setAttribute('loading','lazy');
        if(!f.hasAttribute('referrerpolicy')) f.setAttribute('referrerpolicy','no-referrer-when-downgrade');
      } catch(e){}
    });
  }

  function optimizeVideos(){
    var vids = document.querySelectorAll('video');
    if(!vids.length) return;

    // Fallback: basic hints without IO
    if(!('IntersectionObserver' in window)){
      vids.forEach(function(v){
        try {
          if(!v.hasAttribute('preload')) v.setAttribute('preload','metadata');
          v.setAttribute('playsinline','');
          v.setAttribute('webkit-playsinline','');
        } catch(e){}
      });
      return;
    }

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var v = entry.target;
        if(!entry.isIntersecting){
          try { v.pause(); } catch(e){}
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

    vids.forEach(function(v){
      if(v.dataset.optimized) return;
      v.dataset.optimized = '1';
      try {
        if(!v.hasAttribute('preload')) v.setAttribute('preload','metadata');
        v.setAttribute('playsinline','');
        v.setAttribute('webkit-playsinline','');
      } catch(e){}
      io.observe(v);
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

  // Scroll-to-Top Button: lightweight and accessible
  function initScrollToTop(){
    try{ if(document.getElementById('scrollToTop')) return; }catch(e){}
    var style = document.getElementById('scroll-to-top-style');
    if(!style){
      style = document.createElement('style');
      style.id = 'scroll-to-top-style';
      style.textContent = '#scrollToTop{position:fixed;right:30px;bottom:30px;width:46px;height:46px;display:grid;place-items:center;border-radius:50%;background:rgba(15,23,42,0.65);border:1.5px solid rgba(14,165,233,0.35);color:#e2e8f0;box-shadow:0 10px 25px rgba(0,0,0,0.25),0 4px 12px rgba(14,165,233,0.12);backdrop-filter:blur(8px) saturate(140%);-webkit-backdrop-filter:blur(8px) saturate(140%);cursor:pointer;z-index:950;opacity:0;transform:translateY(12px) scale(0.9);pointer-events:none;transition:opacity 220ms var(--ease, cubic-bezier(0.4,0,0.2,1)),transform 220ms var(--ease, cubic-bezier(0.4,0,0.2,1)),background 220ms var(--ease, cubic-bezier(0.4,0,0.2,1)),box-shadow 220ms var(--ease, cubic-bezier(0.4,0,0.2,1));will-change:opacity,transform}#scrollToTop.visible{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}#scrollToTop:hover{background:linear-gradient(135deg, rgba(14,165,233,0.25), rgba(139,92,246,0.20));box-shadow:0 14px 30px rgba(0,0,0,0.3), 0 6px 18px rgba(14,165,233,0.18);transform:translateY(-2px) scale(1.03)}#scrollToTop:active{transform:translateY(0) scale(0.98)}#scrollToTop svg{width:20px;height:20px;display:block;stroke:currentColor;fill:none}@media (max-width:900px){#scrollToTop{right:16px;bottom:18px;width:42px;height:42px}#scrollToTop svg{width:18px;height:18px}}@media (prefers-reduced-motion:reduce){#scrollToTop{transition:none !important}}@media print{#scrollToTop{display:none !important}}';
      try{ document.head.appendChild(style); }catch(e){ document.documentElement.appendChild(style); }
    }
    var btn = document.createElement('button');
    btn.id = 'scrollToTop';
    btn.setAttribute('aria-label','Scroll to top');
    btn.setAttribute('title','Back to top');
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
    document.body.appendChild(btn);

    var threshold = 200;
    var lastY = window.scrollY || window.pageYOffset || 0;
    var ticking = false;
    function update(){ if(lastY > threshold){ btn.classList.add('visible'); } else { btn.classList.remove('visible'); } ticking = false; }
    function onScroll(){ lastY = window.scrollY || window.pageYOffset || 0; if(!ticking){ requestAnimationFrame(update); ticking = true; } }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pageshow', function(e){ if(e.persisted){ onScroll(); } }, { passive: true });

    btn.addEventListener('click', function(ev){
      ev.preventDefault();
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      try { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); } catch(e) { window.scrollTo(0,0); }
    });
  }

  function onReady(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', fn, {once:true}); else fn(); }

  onReady(function(){
    upgradeImages();
    optimizeIframes();
    optimizeVideos();
    initReveal();
    initMicroInteractions();
    ensureA11y();
    initScrollToTop();

    // Idle, non-blocking second pass
    var ric = window.requestIdleCallback || function(cb){ return setTimeout(cb, 300); };
    ric(function(){ try { upgradeImages(); optimizeIframes(); optimizeVideos(); } catch(e){} });

    // Pause videos when tab hidden (no visual change)
    document.addEventListener('visibilitychange', function(){
      if(document.hidden){
        try{ document.querySelectorAll('video').forEach(function(v){ v.pause(); }); }catch(e){}
      }
    }, {passive:true});
  });

  // Re-run upgrade when viewport changes (debounced)
  var t; window.addEventListener('resize', function(){ clearTimeout(t); t=setTimeout(function(){ upgradeImages(); optimizeIframes(); optimizeVideos(); }, 200); });
})();
