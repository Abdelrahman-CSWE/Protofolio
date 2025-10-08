/* ui-ux-enhancements.js
 - Non-intrusive performance and UX helpers
 - Visual features are OFF by default (feature flag required)
 - Enable UI animations only when one of:
   * URL has ?uix=1
   * <html data-uix-enabled> OR <body class="uix-enabled">
*/
(function(){
  'use strict';

  var reduceMotion = false;
  try { reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e){}

  function isUIXEnabled(){
    try{
      var q = new URLSearchParams((location.search||''));
      if(q.get('uix') === '1') return true;
    }catch(e){}
    var docEl = document.documentElement;
    var body = document.body || document.getElementsByTagName('body')[0];
    return (docEl && docEl.hasAttribute('data-uix-enabled')) || (body && ((' '+body.className+' ').indexOf(' uix-enabled ') > -1));
  }

  // Inject minimal CSS only when features are enabled
  function injectStyles(){
    if(document.getElementById('uix-styles')) return;
    var css = ''+
      '/* Page Transition (hidden by default, enabled only via feature flag) */\n' +
      '.uix-page-transition{position:fixed;inset:0;background:#0b1220;opacity:0;pointer-events:none;transform:translateZ(0);will-change:opacity;z-index:9999;}' +
      '.uix-page-transition.is-active{opacity:1;}' +
      '/* Zoom overlay */\n' +
      '.uix-zoom-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);opacity:0;pointer-events:none;z-index:9998;transform:translateZ(0);will-change:opacity;}' +
      '.uix-zoom-overlay.is-active{opacity:1;pointer-events:auto;}' +
      '.uix-zoom-img{position:fixed;left:0;top:0;will-change:transform;transform-origin:center center;}' +
      '@media (prefers-reduced-motion: reduce){.uix-page-transition,.uix-zoom-overlay,.uix-zoom-img{transition:none!important;animation:none!important}}';
    var style = document.createElement('style');
    style.id = 'uix-styles';
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    (document.head||document.documentElement).appendChild(style);
  }

  // Performance: upgrade images (non-visual)
  function upgradeImages(){
    var imgs = document.getElementsByTagName('img');
    for(var i=0;i<imgs.length;i++){
      var img = imgs[i];
      try{
        if(!img.hasAttribute('decoding')) img.setAttribute('decoding','async');
        if(!img.hasAttribute('loading')) img.setAttribute('loading','lazy');
        var rect = img.getBoundingClientRect();
        if(rect.top < (window.innerHeight*1.2) && rect.bottom > 0){
          if(!img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority','high');
          if(img.hasAttribute('loading')) img.removeAttribute('loading');
        }
      }catch(e){}
    }
  }

  // Performance: videos (metadata only)
  function upgradeVideos(){
    var vids = document.getElementsByTagName('video');
    for(var i=0;i<vids.length;i++){
      var v = vids[i];
      try{
        if(!v.hasAttribute('preload')) v.setAttribute('preload','metadata');
        if(!v.hasAttribute('playsinline')) v.setAttribute('playsinline','');
      }catch(e){}
    }
  }

  // Accessibility: add ARIA to nav and forms (non-visual)
  function ensureA11y(){
    try{
      var nav = document.querySelector('nav, .nav');
      if(nav && !nav.getAttribute('role')) nav.setAttribute('role','navigation');
      if(nav && !nav.getAttribute('aria-label')) nav.setAttribute('aria-label','Primary');
      var menus = document.querySelectorAll('nav ul, .nav ul');
      for(var i=0;i<menus.length;i++){ if(!menus[i].getAttribute('role')) menus[i].setAttribute('role','menubar'); }
      // Forms: add aria-label for inputs without an associated label
      var forms = document.getElementsByTagName('form');
      for(var f=0; f<forms.length; f++){
        var inputs = forms[f].querySelectorAll('input, textarea, select, button');
        for(var j=0; j<inputs.length; j++){
          var el = inputs[j];
          if(!el.id && !el.getAttribute('aria-label')){
            var name = el.getAttribute('name')||el.placeholder||el.type||'field';
            el.setAttribute('aria-label', name);
          }
        }
      }
    }catch(e){}
  }

  // Intersection-based reveal (opt-in via [data-uix-reveal])
  function initReveal(){
    var els = document.querySelectorAll('[data-uix-reveal]');
    if(!els.length) return;
    if(reduceMotion){ for(var i=0;i<els.length;i++){ els[i].classList.add('is-inview'); } return; }
    if(!('IntersectionObserver' in window)) { for(var j=0;j<els.length;j++){ els[j].classList.add('is-inview'); } return; }
    var io = new IntersectionObserver(function(entries){
      for(var k=0;k<entries.length;k++){
        var entry = entries[k];
        if(entry.isIntersecting){ entry.target.classList.add('is-inview'); io.unobserve(entry.target); }
      }
    }, {threshold: 0.15, rootMargin: '0px 0px -10% 0px'});
    for(var i2=0;i2<els.length;i2++){ io.observe(els[i2]); }
  }

  // Micro interactions (opt-in via [data-uix-micro])
  function initMicroInteractions(){
    var hoverables = document.querySelectorAll('[data-uix-micro]');
    if(!hoverables.length) return;
    function addWC(e){ e.currentTarget.classList.add('uix-will-change'); }
    function rmWC(e){ e.currentTarget.classList.remove('uix-will-change'); }
    var opt = {passive:true};
    for(var i=0;i<hoverables.length;i++){
      var el = hoverables[i];
      el.addEventListener('mouseenter', addWC, opt);
      el.addEventListener('mouseleave', rmWC, opt);
      el.addEventListener('touchstart', addWC, opt);
      el.addEventListener('touchend', rmWC, opt);
      el.addEventListener('blur', rmWC, opt);
    }
  }

  // Page transitions (feature flag only)
  function initPageTransitions(){
    if(reduceMotion) return; // respect user setting
    injectStyles();
    var overlay = document.createElement('div');
    overlay.className = 'uix-page-transition';
    document.body.appendChild(overlay);

    // On load: fade in content (overlay fades out)
    requestAnimationFrame(function(){
      overlay.classList.remove('is-active');
    });

    function navigate(e){
      // Only for same-origin normal links without targets/hash-only
      var a = e.currentTarget;
      var href = a.getAttribute('href')||'';
      if(a.target && a.target !== '_self') return;
      if(href.indexOf('#') === 0) return;
      if(/^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0) return;
      e.preventDefault();
      overlay.classList.add('is-active');
      setTimeout(function(){ location.href = href; }, 180);
    }

    var links = document.querySelectorAll('a[href]');
    for(var i=0;i<links.length;i++){
      var l = links[i];
      l.addEventListener('click', navigate, {passive:false});
    }
  }

  // Gallery zoom for images (opt-in via [data-uix-zoom])
  function initGalleryZoom(){
    injectStyles();
    var overlay = document.createElement('div');
    overlay.className = 'uix-zoom-overlay';
    document.body.appendChild(overlay);

    function zoomIn(e){
      if(reduceMotion) return;
      var img = e.currentTarget;
      var rect = img.getBoundingClientRect();
      var clone = img.cloneNode(true);
      clone.className = (clone.className||'') + ' uix-zoom-img';
      clone.style.width = rect.width + 'px';
      clone.style.height = rect.height + 'px';
      clone.style.left = rect.left + 'px';
      clone.style.top = rect.top + 'px';
      clone.style.transform = 'translate(0,0) scale(1)';
      document.body.appendChild(clone);
      overlay.classList.add('is-active');

      var vw = window.innerWidth, vh = window.innerHeight;
      var scale = Math.min((vw*0.9)/rect.width, (vh*0.9)/rect.height);
      var tx = (vw/2) - (rect.left + rect.width/2);
      var ty = (vh/2) - (rect.top + rect.height/2);

      requestAnimationFrame(function(){
        clone.style.transition = 'transform 280ms cubic-bezier(.2,.65,.3,1)';
        overlay.style.transition = 'opacity 240ms ease';
        clone.style.transform = 'translate('+tx+'px,'+ty+'px) scale('+scale+')';
      });

      function close(){
        clone.style.transform = 'translate(0,0) scale(1)';
        overlay.classList.remove('is-active');
        setTimeout(function(){ if(clone && clone.parentNode) clone.parentNode.removeChild(clone); }, 220);
        overlay.removeEventListener('click', close);
        document.removeEventListener('keydown', onKey);
      }
      function onKey(ev){ if(ev.key === 'Escape'){ close(); } }
      overlay.addEventListener('click', close);
      document.addEventListener('keydown', onKey);
    }

    var zoomables = document.querySelectorAll('[data-uix-zoom]');
    for(var i=0;i<zoomables.length;i++){
      zoomables[i].addEventListener('click', zoomIn);
      zoomables[i].style.cursor = 'zoom-in';
    }
  }

  function onReady(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', fn, {once:true}); else fn(); }

  onReady(function(){
    // Always-on, non-visual improvements
    upgradeImages();
    upgradeVideos();
    ensureA11y();

    // Visual features are gated behind feature flag
    if(isUIXEnabled()){
      initReveal();
      initMicroInteractions();
      initPageTransitions();
      initGalleryZoom();
    }
  });

  var t; window.addEventListener('resize', function(){ clearTimeout(t); t=setTimeout(upgradeImages, 200); }, {passive:true});
})();
