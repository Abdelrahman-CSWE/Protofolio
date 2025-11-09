/* Ultra-safe performance boosts without visual/animation changes */
(function(){
  'use strict';

  // Helpers
  const inViewport = (el) => {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0 && r.left < window.innerWidth && r.right > 0;
  };
  const idle = (cb) => (window.requestIdleCallback ? requestIdleCallback(cb, {timeout: 1500}) : setTimeout(cb, 0));

  function optimizeImages() {
    const imgs = document.querySelectorAll('img');
    if (!imgs.length) return;

    let firstInViewSet = false;
    imgs.forEach(img => {
      // decoding hint
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');

      // Keep first visible image as high priority, others lazy
      if (inViewport(img)) {
        if (!firstInViewSet) {
          // Boost only the first visible image
          try { img.setAttribute('fetchpriority', 'high'); } catch(e){}
          firstInViewSet = true;
        }
      } else {
        // Safe lazy loading for offscreen images
        if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
        try { img.setAttribute('fetchpriority', 'low'); } catch(e){}
      }
    });

    // Fade-in when lazy images finish (use decode when available)
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    lazyImgs.forEach(im => {
      const apply = () => im.classList.add('loaded');
      if (typeof im.decode === 'function') {
        im.decode().then(apply).catch(apply);
      } else if (!im.complete) {
        im.addEventListener('load', apply, { once: true, passive: true });
      } else {
        apply();
      }
    });
  }

  function optimizeIframes() {
    const iframes = document.querySelectorAll('iframe');
    if (!iframes.length) return;
    iframes.forEach(f => {
      if (!inViewport(f)) {
        if (!f.hasAttribute('loading')) f.setAttribute('loading', 'lazy');
      }
    });
  }

  function optimizeVideos() {
    const vids = document.querySelectorAll('video');
    if (!('IntersectionObserver' in window)) {
      vids.forEach(v => { if (!inViewport(v)) v.preload = 'metadata'; });
      return;
    }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(({isIntersecting, target}) => {
        const v = target;
        if (!isIntersecting) {
          // Reduce resource usage offscreen
          try { v.preload = 'metadata'; } catch(e){}
          if (!v.paused && !v.disableAutoPause) {
            // Pause only if playing (do not auto-play)
            try { v.pause(); } catch(e){}
          }
        }
      });
    }, { rootMargin: '120px 0px', threshold: 0.01 });
    vids.forEach(v => io.observe(v));
  }

  function prefetchOnHover(){
    const seen = new WeakSet();
    const cards = document.querySelectorAll('.portfolio-project');
    if(!cards.length) return;
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        if(seen.has(card)) return;
        seen.add(card);
        const imgs = card.querySelectorAll('img');
        for(let i=0; i<Math.min(3, imgs.length); i++){
          const src = imgs[i].currentSrc || imgs[i].src;
          if(!src) continue;
          try {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = src;
            document.head.appendChild(link);
          } catch(e){}
        }
      }, { once: true, passive: true });
    });
  }

  function injectHiddenTabCSS() {
    // Pause animations when the tab is hidden only (no visual impact)
    const style = document.createElement('style');
    style.setAttribute('data-performance-style', '');
    style.textContent = `html.tab-hidden *, html.tab-hidden *::before, html.tab-hidden *::after { animation-play-state: paused !important; }`;
    document.head.appendChild(style);
  }

  function handleVisibility() {
    const toggle = () => {
      if (document.hidden) document.documentElement.classList.add('tab-hidden');
      else document.documentElement.classList.remove('tab-hidden');
    };
    document.addEventListener('visibilitychange', toggle, { passive: true });
    toggle();
  }

  function optimizeEventListenersLight(){
    try{
      // Avoid double-patching if already handled by another optimizer
      if (EventTarget.prototype.__passivePatched) return;
      const origAdd = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, listener, options){
        try{
          if(type === 'scroll' || type === 'wheel'){
            if(options === undefined){
              options = { passive: true };
            } else if(typeof options === 'boolean'){
              options = { capture: !!options, passive: true };
            } else if(typeof options === 'object' && options.passive === undefined){
              options = Object.assign({}, options, { passive: true });
            }
          }
        }catch(e){}
        return origAdd.call(this, type, listener, options);
      };
      Object.defineProperty(EventTarget.prototype, '__passivePatched', { value: true, configurable: true });
    }catch(e){}
  }

  function registerSW() {
    try {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('sw.js').catch(function(){});
        }, { once: true });
      }
    } catch (e) {}
  }

  function init() {
    // Run critical hints quickly
    optimizeEventListenersLight();
    optimizeImages();
    optimizeIframes();

    // Defer heavier steps
    idle(()=> optimizeVideos());
    idle(()=> { injectHiddenTabCSS(); handleVisibility(); });
    idle(()=> prefetchOnHover());
    idle(()=> registerSW());

    // Re-run on resize (debounced)
    let t;
    window.addEventListener('resize', ()=>{
      clearTimeout(t);
      t = setTimeout(()=> { optimizeImages(); optimizeIframes(); }, 200);
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
