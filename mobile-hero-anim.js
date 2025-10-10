(function(){
  'use strict';
  var EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
  function isMobile(){
    return !!(window.matchMedia && window.matchMedia('(max-width: 900px)').matches);
  }
  function setImp(el, prop, value){
    try { el.style.setProperty(prop, value, 'important'); } catch(e) { el.style[prop] = value; }
  }
  function prep(el){
    if(!el) return;
    setImp(el, 'animation', 'none');
    setImp(el, 'transition', 'none');
    setImp(el, 'will-change', 'transform, opacity');
    setImp(el, 'opacity', '0');
    setImp(el, 'transform', 'translateZ(0)');
    setImp(el, 'filter', 'none');
    el.style.visibility = 'visible';
  }
  function run(el, from, to, delay, duration){
    if(!el) return;
    try {
      setImp(el, 'transition', 'none');
      if(from.opacity != null) setImp(el, 'opacity', String(from.opacity));
      if(from.transform != null) setImp(el, 'transform', String(from.transform));
      if(from.filter != null) setImp(el, 'filter', String(from.filter));
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          setImp(el, 'transition', 'transform ' + duration + 'ms ' + EASE + ', opacity ' + duration + 'ms ' + EASE + ', filter ' + duration + 'ms ' + EASE);
          setTimeout(function(){
            if(to.opacity != null) setImp(el, 'opacity', String(to.opacity));
            if(to.transform != null) setImp(el, 'transform', String(to.transform));
            if(to.filter != null) setImp(el, 'filter', String(to.filter));
          }, delay);
        });
      });
    } catch(e) { /* no-op */ }
  }
  function start(){
    try {
      if(!isMobile()) return;
      var l1s = Array.prototype.slice.call(document.querySelectorAll('.hero-title .line1, #hero-name'));
      var l2s = Array.prototype.slice.call(document.querySelectorAll('.hero-title .line2, #hero-title'));
      var subs = Array.prototype.slice.call(document.querySelectorAll('.hero-subtitle'));
      var ctas = Array.prototype.slice.call(document.querySelectorAll('.hero-cta'));
      var metrics = Array.prototype.slice.call(document.querySelectorAll('#metrics-row-mobile .floating-element'));

      var all = l1s.concat(l2s, subs, ctas, metrics);
      all.forEach(prep);

      var baseD = 650, baseDelay = 80;
      l1s.forEach(function(el, i){ run(el, { opacity: 0, transform: 'translateX(-40px)' }, { opacity: 1, transform: 'none' }, baseDelay + i*60, baseD); });
      l2s.forEach(function(el, i){ run(el, { opacity: 0, transform: 'scale(0.9) translateY(14px)' }, { opacity: 1, transform: 'none' }, baseDelay + 160 + i*60, baseD + 100); });
      subs.forEach(function(el, i){ run(el, { opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'none' }, baseDelay + 320 + i*80, baseD); });
      ctas.forEach(function(el, i){ run(el, { opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'none' }, baseDelay + 500 + i*60, baseD); });
      // Animate 4 metrics boxes with stagger
      metrics.forEach(function(el, i){ run(el, { opacity: 0, transform: 'scale(0.85) translateY(30px)', filter: 'blur(4px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }, baseDelay + 700 + i*140, baseD + 100); });
    } catch(e) { /* no-op */ }
  }

  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
  window.addEventListener('pageshow', function(e){ if(e.persisted) start(); }, { passive: true });
})();
