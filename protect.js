/* Strongest feasible client-side protections against copy/inspect, performance-friendly */
(function() {
  'use strict';

  // Utility: passive-safe addEventListener
  const on = (target, type, handler, opts) => {
    try { target.addEventListener(type, handler, opts || { passive: true, capture: true }); }
    catch (e) { target.addEventListener(type, handler, false); }
  };

  // 1) Block context menu globally (Right Click) — hardened and comprehensive
  function __blockCtxHandler(e){
    try { e.preventDefault(); } catch(_){ }
    try { e.stopPropagation(); } catch(_){ }
    try { e.stopImmediatePropagation(); } catch(_){ }
    return false;
  }
  function __bindCtx(target){
    if (!target) return;
    try { target.addEventListener('contextmenu', __blockCtxHandler, { capture: true }); }
    catch (e) { target.addEventListener('contextmenu', __blockCtxHandler, false); }
  }
  [window, document, document.documentElement, document.body].forEach(__bindCtx);
  // Fallback binding as well
  try { document.addEventListener('contextmenu', __blockCtxHandler, { capture: true }); } catch(_) { document.addEventListener('contextmenu', __blockCtxHandler, false); }
  document.oncontextmenu = () => false;
  if (document.body) document.body.oncontextmenu = () => false;

  // Block right-button at the source to avoid native menu triggers
  const __blockRightButton = (e) => {
    if (e && (e.button === 2 || e.which === 3 || (e.ctrlKey && e.button === 0))) {
      e.preventDefault();
      e.stopPropagation();
      try { e.stopImmediatePropagation(); } catch(_){}
      return false;
    }
  };
  // Use non-passive listeners to allow preventDefault
  try {
    document.addEventListener('mousedown', __blockRightButton, { capture: true });
    document.addEventListener('mouseup', __blockRightButton, { capture: true });
    document.addEventListener('pointerdown', __blockRightButton, { capture: true });
    document.addEventListener('pointerup', __blockRightButton, { capture: true });
    document.addEventListener('auxclick', (e)=>{ if(e.button===2){ __blockRightButton(e); } }, { capture: true });
  } catch(_) {
    document.addEventListener('mousedown', __blockRightButton, false);
    document.addEventListener('mouseup', __blockRightButton, false);
    document.addEventListener('pointerdown', __blockRightButton, false);
    document.addEventListener('pointerup', __blockRightButton, false);
    document.addEventListener('auxclick', (e)=>{ if(e.button===2){ __blockRightButton(e); } }, false);
  }

  // Ensure dynamic special elements are also protected (model-viewer, video, canvas)
  function __hardenSpecial(){
    try {
      document.querySelectorAll('model-viewer, video, canvas').forEach((el) => {
        try { el.addEventListener('contextmenu', __blockCtxHandler, { capture: true }); } catch(_) { el.addEventListener('contextmenu', __blockCtxHandler, false); }
        try { el.addEventListener('mousedown', __blockRightButton, { capture: true }); } catch(_) { el.addEventListener('mousedown', __blockRightButton, false); }
        try { el.addEventListener('mouseup', __blockRightButton, { capture: true }); } catch(_) { el.addEventListener('mouseup', __blockRightButton, false); }
        try { el.addEventListener('pointerdown', __blockRightButton, { capture: true }); } catch(_) { el.addEventListener('pointerdown', __blockRightButton, false); }
        try { el.addEventListener('pointerup', __blockRightButton, { capture: true }); } catch(_) { el.addEventListener('pointerup', __blockRightButton, false); }
        try { el.addEventListener('auxclick', (e)=>{ if(e.button===2){ __blockRightButton(e); } }, { capture: true }); } catch(_) { el.addEventListener('auxclick', (e)=>{ if(e.button===2){ __blockRightButton(e); } }, false); }
      });
    } catch(e) {}
  }
  const __moCtx = new MutationObserver(__hardenSpecial);
  __moCtx.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', __hardenSpecial, { once: true });
  } else {
    __hardenSpecial();
  }

  // 2) Block common key combos (Copy, Cut, View Source, DevTools)
  const blockedCombos = [
    // Copy/Cut/Select All
    { ctrl: true, key: 'c' },
    { ctrl: true, key: 'x' },
    { ctrl: true, key: 'a' },
    // View Source, DevTools
    { ctrl: true, key: 'u' },
    { ctrl: true, shift: true, key: 'i' },
    { ctrl: true, shift: true, key: 'j' },
    { ctrl: true, shift: true, key: 'c' },
    { ctrl: true, key: 's' },
  ];

  on(document, 'keydown', (e) => {
    const k = (e.key || '').toLowerCase();
    // Block OS context keys: Shift+F10 and ContextMenu key
    if ((e.shiftKey && (e.key === 'F10' || e.keyCode === 121)) || e.key === 'ContextMenu' || e.keyCode === 93) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    if (
      e.keyCode === 123 || // F12
      blockedCombos.some(c => (
        (!!c.ctrl === (e.ctrlKey || e.metaKey)) &&
        (!!c.shift === !!e.shiftKey) &&
        (!!c.alt === !!e.altKey) &&
        (c.key === k)
      ))
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    // Block Ctrl/Cmd + P (print)
    if ((e.ctrlKey || e.metaKey) && k === 'p') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });

  // 3) Disable selection, copy, cut events at DOM level
  ['copy', 'cut', 'selectstart', 'dragstart'].forEach(type => {
    on(document, type, (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  });

  // 4) Reinforce images/videos: prevent dragging and pointer events leak
  function hardenMedia() {
    const imgs = document.querySelectorAll('img');
    imgs.forEach(img => {
      img.setAttribute('draggable', 'false');
      img.addEventListener('dragstart', (e) => { e.preventDefault(); }, { passive: false });
    });

    const vids = document.querySelectorAll('video');
    vids.forEach(v => {
      v.setAttribute('controlsList', 'nodownload noremoteplayback');
      v.setAttribute('disablePictureInPicture', '');
      v.setAttribute('draggable', 'false');
      v.addEventListener('dragstart', (e) => { e.preventDefault(); }, { passive: false });
    });
  }

  // 5) Transparent overlay layer over images to make saving/scraping harder
  function coverImages() {
    const imgs = document.querySelectorAll('img');
    imgs.forEach(img => {
      // Skip if already wrapped
      if (img.closest('.img-protect-wrap')) return;
      const wrap = document.createElement('span');
      wrap.className = 'img-protect-wrap';
      wrap.style.position = 'relative';
      wrap.style.display = 'inline-block';
      wrap.style.lineHeight = '0';
      wrap.style.verticalAlign = 'middle';

      const overlay = document.createElement('span');
      overlay.className = 'img-protect-overlay';
      overlay.style.position = 'absolute';
      overlay.style.inset = '0';
      overlay.style.background = 'rgba(0,0,0,0)';
      overlay.style.pointerEvents = 'auto';

      // Insert wrapper
      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);
      wrap.appendChild(overlay);

      // Block interactions (desktop only). On touch devices, don't intercept to keep scrolling smooth.
      var isTouch = window.matchMedia && (window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches);
      if (isTouch) {
        overlay.style.pointerEvents = 'none';
      } else {
        overlay.addEventListener('contextmenu', (e)=>{ e.preventDefault(); e.stopPropagation(); }, { passive:true });
        overlay.addEventListener('mousedown', (e)=>{ e.preventDefault(); e.stopPropagation(); }, { passive:true });
        overlay.addEventListener('dragstart', (e)=>{ e.preventDefault(); e.stopPropagation(); }, { passive:true });
      }
    });
  }

  // 6) Try to detect DevTools opening and react
  let devtoolsOpen = false;
  function setDevtoolsState(open) {
    devtoolsOpen = open;
    document.documentElement.classList.toggle('devtools-open', open);
    const overlay = document.getElementById('anti-devtools-overlay');
    if (overlay) overlay.style.display = open ? 'flex' : 'none';
  }

  function detectDevtools() {
    // Lightweight heuristic without forcing debugger pause
    try {
      const threshold = 80;
      const start = performance.now();
      // minimal work
      for (let i = 0; i < 1000; i++); // noop loop
      const diff = performance.now() - start;
      setDevtoolsState(diff > threshold);
    } catch (e) {}
  }

  // Polling for devtools state at low frequency to reduce overhead
  (function scheduleDevtoolsCheck(){
    const idle = window.requestIdleCallback || function(cb){ return setTimeout(cb, 1500); };
    idle(function(){ detectDevtools(); scheduleDevtoolsCheck(); });
  })();

  // 7) MutationObserver: when images are added dynamically, protect them
  const mo = new MutationObserver(() => {
    const idle = window.requestIdleCallback || function(cb){ return setTimeout(cb, 0); };
    idle(() => { hardenMedia(); coverImages(); });
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // Initial run after DOM ready
  const boot = () => { hardenMedia(); coverImages(); injectOverlay(); };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  // 8) Anti-drag on all elements (safety net)
  on(document, 'dragstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

  // 9) Inject anti-devtools overlay container
  function injectOverlay() {
    if (!document.getElementById('anti-devtools-overlay')) {
      const d = document.createElement('div');
      d.id = 'anti-devtools-overlay';
      d.innerHTML = '<div class="msg">Developer Tools are disabled on this site.</div>';
      document.body.appendChild(d);
    }
  }

})();
