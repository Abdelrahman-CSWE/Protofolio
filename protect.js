/* Strongest feasible client-side protections against copy/inspect, performance-friendly */
(function() {
  'use strict';

  // Utility: passive-safe addEventListener
  const on = (target, type, handler, opts) => {
    try { target.addEventListener(type, handler, opts || { passive: false, capture: true }); }
    catch (e) { target.addEventListener(type, handler, false); }
  };

  // 1) Block context menu globally (Right Click)
  on(document, 'contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

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
    const k = e.key.toLowerCase();
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

      // Block interactions
      overlay.addEventListener('contextmenu', (e)=>{ e.preventDefault(); e.stopPropagation(); }, { passive:false });
      overlay.addEventListener('mousedown', (e)=>{ e.preventDefault(); e.stopPropagation(); }, { passive:false });
      overlay.addEventListener('touchstart', (e)=>{ e.preventDefault(); e.stopPropagation(); }, { passive:false });
      overlay.addEventListener('dragstart', (e)=>{ e.preventDefault(); e.stopPropagation(); }, { passive:false });
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
    // Heuristic: measure console time + dimension changes (dock undock)
    const threshold = 160;
    const start = performance.now();
    // eslint-disable-next-line no-debugger
    debugger; // Triggers a pause when devtools is open
    const diff = performance.now() - start;
    if (diff > threshold) {
      setDevtoolsState(true);
    } else {
      setDevtoolsState(false);
    }
  }

  // Polling for devtools state at low frequency to reduce overhead
  setInterval(detectDevtools, 1200);

  // 7) MutationObserver: when images are added dynamically, protect them
  const mo = new MutationObserver(() => {
    hardenMedia();
    coverImages();
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // Initial run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      hardenMedia();
      coverImages();
      injectOverlay();
    });
  } else {
    hardenMedia();
    coverImages();
    injectOverlay();
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
