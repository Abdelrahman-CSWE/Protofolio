/*
  Minimal, reliable metrics counter (numbers only, no style changes)
  Targets by title:
    - CSWE CERTIFIED -> 129
    - YEARS EXPERIENCE -> 1+
    - PROJECTS COMPLETED -> 30+
    - CERTIFIED EXPERT -> CSWE (static)
  Starts immediately after DOM is ready; includes light retry to handle late DOM changes.
*/
(function(){
  'use strict';

  function norm(s){ return (s||'').trim().toUpperCase(); }

  function targetFor(title, original){
    if (title.indexOf('CERTIFIED') !== -1 && title.indexOf('EXPERT') !== -1) return {type:'text', text:'CSWE'};
    if (title.indexOf('CSWE') !== -1 && title.indexOf('CERTIFIED') !== -1) return {type:'number', end:129, suffix:''};
    if (title.indexOf('YEARS') !== -1 || title.indexOf('EXPERIENCE') !== -1) return {type:'number', end:1, suffix:'+'};
    if (title.indexOf('PROJECTS') !== -1 || title.indexOf('COMPLETED') !== -1) return {type:'number', end:30, suffix:'+'};
    var mPlus = (original||'').trim().match(/^(\d{1,4})\+$/);
    if (mPlus) return {type:'number', end:parseInt(mPlus[1],10), suffix:'+'};
    var mNum = (original||'').trim().match(/^(\d{1,4})$/);
    if (mNum) return {type:'number', end:parseInt(mNum[1],10), suffix:''};
    return {type:'text', text:(original||'').trim()};
  }

  function collect(){
    var scope = document.querySelector('.hero-visual') || document;
    var values = scope.querySelectorAll('.floating-element .element-value');
    var items = [];
    for (var i=0; i<values.length; i++){
      var el = values[i];
      var box = el.closest('.floating-element');
      if (!box) continue;
      var titleEl = box.querySelector('.element-title');
      var title = norm(titleEl ? titleEl.textContent : '');
      var orig = (el.textContent || '').trim();
      items.push({ el: el, title: title, orig: orig, t: targetFor(title, orig), index: items.length });
    }
    return items;
  }

  function animateNumber(el, end, suffix){
    // Prevent double-run
    if (el.dataset.counted === '1') { el.textContent = String(end) + (suffix||''); return; }

    var startTime = performance.now();
    var duration = 1200; // ms

    function frame(){
      var now = performance.now();
      var progress = Math.min(1, (now - startTime) / duration);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current = Math.round(end * eased);
      el.textContent = String(current) + (suffix || '');
      if (progress < 1){
        requestAnimationFrame(frame);
      } else {
        el.textContent = String(end) + (suffix || '');
        el.dataset.counted = '1';
      }
    }

    requestAnimationFrame(frame);
  }

  function start(){
    var items = collect();
    if (!items.length) return false;

    // Set static text immediately and animate numbers with stagger
    for (var i=0; i<items.length; i++){
      var it = items[i];
      if (it.t.type === 'text'){
        it.el.textContent = it.t.text;
        it.el.dataset.counted = '1';
      } else if (it.t.type === 'number'){
        (function(it){
          setTimeout(function(){ animateNumber(it.el, it.t.end, it.t.suffix); }, it.index * 200);
        })(it);
      }
    }
    return true;
  }

  function boot(){
    var tries = 0, max = 15;
    (function again(){
      if (start()) return;
      if (++tries < max) setTimeout(again, 200);
    })();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
